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
    # If requests is not installed, bail out early with empty list.
    if not requests:
        return []
    try:
        resp = requests.get(f"{ORTHANC_BASE}/studies", auth=AUTH, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        # Orthanc returns a JSON array of study IDs (strings)
        if isinstance(data, list):
            return data
        return []
    except Exception:
        # Keep it simple: return empty list on any error.
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
    """Upload raw DICOM bytes to Orthanc. Returns True on success, False otherwise.

    This keeps the function intentionally simple for demo purposes.
    """
    if not requests:
        return False
    try:
        headers = {"Content-Type": "application/dicom"}
        resp = requests.post(f"{ORTHANC_BASE}/instances", data=file_bytes, auth=AUTH, headers=headers, timeout=10)
        resp.raise_for_status()
        return True
    except Exception:
        return False
