#!/usr/bin/env python3
import os
import sys
import time
import logging
import requests
import oci
from oci.core import ComputeClient
from oci.core.models import (
    LaunchInstanceDetails,
    LaunchInstanceShapeConfigDetails,
    InstanceSourceViaImageDetails,
    CreateVnicDetails,
)

# إعدادات التسجيل ومستويات التنبيه
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [Sniper] %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout
)
log = logging.getLogger("sniper")

SHAPE = "VM.Standard.A1.Flex"
POLL_SEC = 60

def resolve_boot_image(compute, compartment_id):
    """البحث عن صورة نظام التشغيل Oracle Linux المتوافقة مع بنية ARM"""
    try:
        images = compute.list_images(compartment_id, shape=SHAPE).data
        for ver in ("9", "8"):
            for img in images:
                if img.operating_system == "Oracle Linux" and (img.operating_system_version or "").startswith(ver):
                    log.info("Boot image found: %s", img.display_name)
                    return img.id
        for img in images:
            if img.operating_system == "Oracle Linux":
                log.info("Boot image found: %s", img.display_name)
                return img.id
    except Exception as e:
        log.error("Failed to query OCI images: %s", e)
    raise RuntimeError("No Oracle Linux image found for shape %s" % SHAPE)

def send_notification(url, message):
    """إرسال تنبيه نجاح إلى Webhook الخارجي"""
    if not url:
        return
    try:
        requests.post(url, json={"text": message}, timeout=10)
        log.info("Notification sent successfully.")
    except Exception as e:
        log.error("Failed to send notification webhook: %s", e)

def main():
    compartment_id = os.environ.get("OCI_COMPARTMENT_OCID")
    subnet_id = os.environ.get("OCI_SUBNET_OCID")
    ssh_key = os.environ.get("SSH_PUBLIC_KEY")

    # التحقق من وجود المتغيرات البيئية المطلوبة
    for val, name in [(compartment_id, "OCI_COMPARTMENT_OCID"), (subnet_id, "OCI_SUBNET_OCID"), (ssh_key, "SSH_PUBLIC_KEY")]:
        if not val:
            log.critical("Missing required environment variable: %s", name)
            sys.exit(1)

    ocpus = int(os.environ.get("OCPUS", "2"))
    memory_gb = int(os.environ.get("MEMORY_GB", "12"))
    boot_volume_gb = int(os.environ.get("BOOT_VOLUME_GB", "150"))
    webhook_url = os.environ.get("SUCCESS_WEBHOOK_URL")

    # تحميل ملف الإعدادات الخاص بالـ API
    try:
        config = oci.config.from_file()
        config["connection_timeout"] = 30
        config["read_timeout"] = 60
    except Exception as e:
        log.critical("Failed to load OCI config from default path (~/.oci/config): %s", e)
        sys.exit(1)

    # إنشاء كائنات الاتصال بالـ OCI
    compute_client = ComputeClient(config)
    identity_client = oci.identity.IdentityClient(config)

    # جلب نطاقات الإتاحة (Availability Domains)
    try:
        ads = [ad.name for ad in identity_client.list_availability_domains(compartment_id).data]
        log.info("Availability Domains: %s", ", ".join(ads))
    except Exception as e:
        log.critical("Failed to list Availability Domains. Verify your OCI Config and Tenancy: %s", e)
        sys.exit(1)

    # جلب صورة نظام التشغيل
    try:
        image_id = resolve_boot_image(compute_client, compartment_id)
    except Exception as e:
        log.critical(e)
        sys.exit(1)

    log.info("=======================================================")
    log.info("  ARM Sniper initialized successfully.")
    log.info("  Shape: %s | OCPUs: %d | Memory: %dGB | Boot Volume: %dGB", SHAPE, ocpus, memory_gb, boot_volume_gb)
    log.info("  Polling Interval: %ds | Target ADs: %d", POLL_SEC, len(ads))
    log.info("=======================================================")

    attempt = 0
    while True:
        for ad in ads:
            attempt += 1
            log.info("Attempt #%d: Requesting instance creation in %s...", attempt, ad)

            # تجهيز هياكل البيانات لطلب الإنشاء
            shape_config = LaunchInstanceShapeConfigDetails(
                ocpus=ocpus,
                memory_in_gbs=memory_gb
            )
            source_details = InstanceSourceViaImageDetails(
                source_type="image",
                image_id=image_id,
                boot_volume_size_in_gbs=boot_volume_gb
            )
            vnic_details = CreateVnicDetails(
                subnet_id=subnet_id,
                assign_public_ip=True
            )
            launch_details = LaunchInstanceDetails(
                compartment_id=compartment_id,
                availability_domain=ad,
                shape=SHAPE,
                shape_config=shape_config,
                source_details=source_details,
                create_vnic_details=vnic_details,
                display_name="AlwaysFree-ARM-Instance",
                metadata={"ssh_authorized_keys": ssh_key}
            )

            try:
                # إرسال طلب الإنشاء الفعلي للـ API
                response = compute_client.launch_instance(launch_details)
                success_msg = f"SUCCESS! Instance created successfully. Instance ID: {response.data.id}"
                log.info(success_msg)
                send_notification(webhook_url, success_msg)
                sys.exit(0)

            except oci.exceptions.ServiceError as exc:
                err_msg = (exc.message or "").lower()
                err_code = (exc.code or "").lower()

                # تحديد ما إذا كان الخطأ ناتج عن عدم وجود سعة كافية في الخوادم
                is_capacity_issue = (
                    "capacity" in err_msg or
                    "limit" in err_msg or
                    "outofcapacity" in err_code or
                    "limitexceeded" in err_code or
                    exc.status in (429, 500, 503)
                )

                if is_capacity_issue:
                    log.info("AD %s: Out of capacity (Status: %d). Retrying in %ds...", ad, exc.status, POLL_SEC)
                elif exc.status == 404:
                    log.error("Fatal 404 Error: Authorization failed or Subnet/Compartment OCID is incorrect.")
                    log.error("Please verify that OCI_COMPARTMENT_OCID and OCI_SUBNET_OCID in your environment match your OCI console exactly.")
                    log.error("Details: %s", exc.message)
                    sys.exit(1)
                else:
                    log.error("Unexpected OCI Service Error (Status: %d, Code: %s): %s", exc.status, exc.code, exc.message)
                    log.info("Retrying in %ds...", POLL_SEC)

            except Exception as e:
                log.error("Unexpected connection or system error: %s", e)
                log.info("Retrying in %ds...", POLL_SEC)

            time.sleep(POLL_SEC)

if __name__ == "__main__":
    main()
