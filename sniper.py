#!/usr/bin/env python3
import logging, os, sys, time
import oci
from oci.core import ComputeClient
from oci.core.models import (
    LaunchInstanceDetails,
    LaunchInstanceShapeConfigDetails,
    InstanceSourceViaImageDetails,
    CreateVnicDetails,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [Sniper] %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout,
)
log = logging.getLogger("sniper")

SHAPE          = "VM.Standard.A1.Flex"
OCPUS          = 4
MEMORY_GB      = 24
BOOT_GB        = 150
POLL_SEC       = 30

COMPARTMENT_ID = "ocid1.tenancy.oc1..aaaaaaaafrnizf6albjspf5375mjjxndcqewxs3olbkuy3gxcf63lweiivaq"
SUBNET_ID      = "ocid1.subnet.oc1.uk-london-1.aaaaaaaaqnqxz6ben7xqcfyzkccfie75euv5p3vka7jsfx4dre6kxi4ue22q"
IMAGE_ID       = "ocid1.image.oc1.uk-london-1.aaaaaaaajrz3jystpmnr3olyl354fhrotkiuvzempttpcp2yr2quizabm5wa"
ADS            = [
    "gugN:UK-LONDON-1-AD-1",
    "gugN:UK-LONDON-1-AD-2",
    "gugN:UK-LONDON-1-AD-3",
]

SSH_KEY = os.environ.get("SSH_PUBLIC_KEY", "")

RETRYABLE_HTTP  = {429, 500, 503, 404}
RETRYABLE_CODES = {
    "outofhostcapacity",
    "internalerror",
    "internalerrortryagainlater",
    "limitexceeded",
    "notauthorizedornotfound",
    "requestlimitexceeded",
}

def is_retryable(exc):
    if isinstance(exc, oci.exceptions.ServiceError):
        code = (exc.code or "").lower().replace("-", "").replace("_", "")
        msg  = (exc.message or "").lower()
        return (
            exc.status in RETRYABLE_HTTP
            or any(k in code for k in RETRYABLE_CODES)
            or "capacity" in msg
        )
    return True

def error_label(exc):
    if isinstance(exc, oci.exceptions.ServiceError):
        return f"{exc.status} {exc.code}"
    return type(exc).__name__

def main():
    if not SSH_KEY:
        log.critical("SSH_PUBLIC_KEY missing")
        sys.exit(1)

    config = oci.config.from_file()
    config["timeout"] = (10, 15)
    compute = ComputeClient(config)

    log.info("OCI ready — region: %s", config.get("region", "?"))
    log.info("ADs: %s", ", ".join(ADS))
    log.info("=" * 55)
    log.info("  ARM Sniper — %s  CPU:%d  RAM:%dG  Boot:%dG", SHAPE, OCPUS, MEMORY_GB, BOOT_GB)
    log.info("  Poll: %ds", POLL_SEC)
    log.info("=" * 55)

    attempt = 0
    ad_idx  = 0

    while True:
        attempt += 1
        ad = ADS[ad_idx % len(ADS)]
        ad_idx += 1

        details = LaunchInstanceDetails(
            availability_domain = ad,
            compartment_id      = COMPARTMENT_ID,
            display_name        = "arm-sniper",
            image_id            = IMAGE_ID,
            shape               = SHAPE,
            shape_config        = LaunchInstanceShapeConfigDetails(
                ocpus         = OCPUS,
                memory_in_gbs = MEMORY_GB,
            ),
            source_details      = InstanceSourceViaImageDetails(
                image_id                = IMAGE_ID,
                boot_volume_size_in_gbs = BOOT_GB,
            ),
            create_vnic_details = CreateVnicDetails(
                subnet_id        = SUBNET_ID,
                assign_public_ip = True,
            ),
            metadata = {"ssh_authorized_keys": SSH_KEY},
        )

        try:
            resp = compute.launch_instance(details)
            inst = resp.data
            log.info("=" * 55)
            log.info("  SUCCESS!")
            log.info("  Name  : %s", inst.display_name)
            log.info("  OCID  : %s", inst.id)
            log.info("  AD    : %s", ad)
            log.info("  State : %s", inst.lifecycle_state)
            log.info("=" * 55)
            sys.exit(0)
        except Exception as exc:
            label = error_label(exc)
            if is_retryable(exc):
                log.info("Attempt #%d: %s in %s — retry in %ds", attempt, label, ad, POLL_SEC)
                time.sleep(POLL_SEC)
            else:
                log.error("Fatal: %s", exc)
                sys.exit(1)

if __name__ == "__main__":
    main()
