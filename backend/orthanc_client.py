"""
Very small helper functions to talk to a local Orthanc instance.

This is intentionally minimal and beginner-friendly.
"""
try:
    import requests
except Exception:
    requests = None

ORTHANC_BASE = "http://localhost:8042"
AUTH = ("orthanc", "orthanc")


def get_studies():
    """Return a list of study IDs from Orthanc, or an empty list on error."""
    if not requests:
        return []
    try:
        resp = requests.get(f"{ORTHANC_BASE}/studies", auth=AUTH, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            return data
        return []
    except Exception:
        return []


def get_study(study_id: str):
    """Return the raw Orthanc study JSON for a study id, or None on error."""
    if not requests:
        return None
    try:
        resp = requests.get(f"{ORTHANC_BASE}/studies/{study_id}", auth=AUTH, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return None


def upload_dicom(file_bytes: bytes):
    """Upload raw DICOM bytes to Orthanc.

    Returns:
        {
            "success": True,
            "status_code": 200,
            "instance_id": "...",
            "study_id": "...",
            "message": "DICOM uploaded successfully to Orthanc"
        }

        or

        {
            "success": False,
            "status_code": 400,
            "error": "Orthanc returned 400: ..."
        }
    """
    if not requests:
        return {"success": False, "status_code": None, "error": "requests library not available"}

    try:
        headers = {"Content-Type": "application/dicom"}
        resp = requests.post(f"{ORTHANC_BASE}/instances", data=file_bytes, auth=AUTH, headers=headers, timeout=10)
        status_code = resp.status_code

        if status_code < 200 or status_code >= 300:
            return {
                "success": False,
                "status_code": status_code,
                "error": f"Orthanc returned {status_code}: {resp.text.strip()}",
            }

        try:
            response_json = resp.json()
        except Exception:
            response_json = {}

        instance_id = response_json.get("ID")
        if not instance_id:
            return {
                "success": False,
                "status_code": status_code,
                "error": "Orthanc did not return instance ID",
            }

        study_resp = requests.get(f"{ORTHANC_BASE}/instances/{instance_id}/study", auth=AUTH, timeout=5)
        study_status_code = study_resp.status_code
        if study_status_code < 200 or study_status_code >= 300:
            return {
                "success": False,
                "status_code": study_status_code,
                "instance_id": instance_id,
                "error": f"Orthanc returned {study_status_code} when fetching study for instance {instance_id}",
            }

        study_json = study_resp.json()
        study_id = study_json.get("ID")

        return {
            "success": True,
            "status_code": status_code,
            "instance_id": instance_id,
            "study_id": study_id,
            "message": "DICOM uploaded successfully to Orthanc",
        }

    except requests.exceptions.RequestException as exc:
        return {"success": False, "status_code": None, "error": f"Orthanc request failed: {str(exc)}"}
    except Exception as exc:
        return {"success": False, "status_code": None, "error": f"Upload failed: {str(exc)}"}
