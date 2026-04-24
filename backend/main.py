from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import orthanc_client

app = FastAPI(title="Radiologix AI Hub Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.get("/studies")
def get_studies():
    """
    Try to fetch studies from a local Orthanc instance. If Orthanc is not
    available or returns nothing, fall back to the built-in mock data.
    """
    orthanc_studies = orthanc_client.get_studies()

    if orthanc_studies:
        # Map Orthanc study IDs to a very small demo-friendly object.
        mapped = []
        for sid in orthanc_studies:
            mapped.append(
                {
                    "id": sid,
                    "patientName": "Orthanc Patient",
                    "modality": "DICOM",
                    "bodyPart": "Unknown",
                    "date": "Today",
                }
            )
        return mapped

    # Fallback mock data (unchanged)
    return [
        {
            "id": "study-001",
            "patientName": "John Doe",
            "modality": "CT",
            "bodyPart": "Chest",
            "status": "Pending",
            "priority": "High",
            "date": "2026-04-24",
        },
        {
            "id": "study-002",
            "patientName": "Jane Smith",
            "modality": "MRI",
            "bodyPart": "Brain",
            "status": "Reviewed",
            "priority": "Normal",
            "date": "2026-04-23",
        },
    ]



@app.post("/upload-dicom")
async def upload_dicom(file: UploadFile = File(...)):
    """Accept a single DICOM upload and forward it to Orthanc for storage.

    Returns a simple success/error JSON for the frontend to consume.
    """
    try:
        contents = await file.read()
    except Exception as e:
        return {"success": False, "error": f"Could not read file: {str(e)}"}

    ok = orthanc_client.upload_dicom(contents)
    if ok:
        return {"success": True}
    return {"success": False, "error": "Orthanc upload failed"}