#!/usr/bin/env python3
import json, logging, os, sys, time
import oci
from oci.core import ComputeClient, VirtualNetworkClient
from oci.identity import IdentityClient
from oci.core.models import (
    LaunchInstanceDetails, LaunchInstanceShapeConfigDetails,
    InstanceSourceViaImageDetails,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [Sniper] %(message)s", datefmt="%H:%M:%S", stream=sys.stdout)
log = logging.getLogger("sniper")
SHAPE = "VM.Standard.A1.Flex"
POLL_SEC = 60

def resolve_boot_image(compute, compartment_id):
    images = compute.list_images(compartment_id, shape=SHAPE).data
    for ver in ("9", "8"):
        for img in images:
            if img.operating_system == "Oracle Linux" and (img.operating_system_version or "").startswith(ver):
                log.info("Boot image: %s", img.display_name)
                return img.id
    for img in images:
        if img.operating_system == "Oracle Linux":
            log.info("Boot image: %s", img.display_name)
            return img.id
    raise RuntimeError("No Oracle Linux image found")

def main():
    compartment_id = os.environ.get("OCI_COMPARTMENT_OCID")
    subnet_id = os.environ.get("OCI_SUBNET_OCID")
    ssh_key = os.environ.get("SSH_PUBLIC_KEY")
    for v, n in [(compartment_id, "OCI_COMPARTMENT_OCID"), (subnet_id, "OCI_SUBNET_OCID"), (ssh_key, "SSH_PUBLIC_KEY")]:
        if not v:
            log.critical("Missing required env var: %s", n); sys.exit(1)
    ocpus = int(os.environ.get("OCPUS", "2"))
    memory_gb = int(os.environ.get("MEMORY_GB", "12"))
    boot_volume_gb = int(os.environ.get("BOOT_VOLUME_GB", "150"))
    webhook_url = os.environ.get("SUCCESS_WEBHOOK_URL")
    try:
        config = oci.config.from_file()
        config["connection_timeout"] = 30
        config["read_timeout"] = 30
    except Exception as exc:
        log.critical("Failed to read OCI config: %s", exc); sys.exit(1)
    compute = ComputeClient(config)
    identity = IdentityClient(config)
    vcn = VirtualNetworkClient(config)
    log.info("OCI clients ready — region: %s", config["region"])
    ads = identity.list_availability_domains(compartment_id).data
    if not ads:
        log.critical("No availability domains found"); sys.exit(1)
    ad_names = [a.name for a in ads]
    log.info("ADs: %s", ", ".join(ad_names))
    try:
        image_id = resolve_boot_image(compute, compartment_id)
    except RuntimeError as exc:
        log.critical("%s", exc); sys.exit(1)
    base_args = dict(
        compartment_id=compartment_id, shape=SHAPE,
        shape_config=LaunchInstanceShapeConfigDetails(ocpus=ocpus, memory_in_gbs=memory_gb),
        source_details=InstanceSourceViaImageDetails(image_id=image_id, boot_volume_size_in_gbs=boot_volume_gb),
        subnet_id=subnet_id, display_name="arm-sniper",
        metadata={"ssh_authorized_keys": ssh_key},
    )
    attempt = 0; ad_idx = 0
    log.info("="*55)
    log.info("  ARM Sniper started — %s CPU:%s RAM:%sG Boot:%sG", SHAPE, ocpus, memory_gb, boot_volume_gb)
    log.info("  Poll: %ss  AD rotation: %s", POLL_SEC, len(ad_names))
    log.info("="*55)
    while True:
        attempt += 1
        ad = ad_names[ad_idx % len(ad_names)]; ad_idx += 1
        try:
            inst = compute.launch_instance(
                LaunchInstanceDetails(availability_domain=ad, **base_args)
            ).data
            log.info(""); log.info("  SUCCESS — ARM instance launched! AD: %s  OCID: %s", ad, inst.id); log.info("")
            if webhook_url:
                try:
                    req = __import__("urllib.request").request.Request(
                        webhook_url,
                        data=json.dumps({"text": "OCI ARM provisioned", "ocid": inst.id, "ad": ad}).encode(),
                        headers={"Content-Type": "application/json"},
                    )
                    __import__("urllib.request").request.urlopen(req, timeout=10)
                except Exception:
                    pass
            sys.exit(0)
        except oci.exceptions.ServiceError as exc:
            msg = (exc.message or "").lower(); code = (exc.code or "").lower()
            if "out of capacity" in msg or "outofcapacity" in code or "limitexceeded" in code or "internalerror" in code or "notauthorized" in code or exc.status in (429, 500, 404):
                log.info("Attempt #%s: Out of Capacity in %s — retry in %ss", attempt, ad, POLL_SEC)
                time.sleep(POLL_SEC)
            else:
                log.critical("Fatal: %s %s — %s", exc.status, exc.code, exc.message); sys.exit(1)
        except Exception as exc:
            log.warning("Error: %s — retry", exc); time.sleep(POLL_SEC)

if __name__ == "__main__":
    main()
