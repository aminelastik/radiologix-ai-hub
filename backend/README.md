# Backend (FastAPI) — Radiologix AI Hub

This folder contains a small FastAPI backend used by the frontend for the educational Radiologix AI Hub demo.

Important: this project is an educational/demo only and is not intended for clinical use. Do not run this with real patient data or in production.

## Quickstart (macOS / Linux)

1. Open a terminal and change into the backend folder:

```bash
cd backend
```

2. Create and activate a Python virtual environment (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies (if `requirements.txt` exists):

```bash
pip install -r requirements.txt
```

4. Run the FastAPI app with `uvicorn`:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at http://localhost:8000 by default.

Note: the frontend for this project runs on http://localhost:8080 and communicates with this backend at http://localhost:8000.

## Available endpoint (current demo)

- GET /studies

  - Description: Returns a JSON array of study metadata used by the frontend worklist and viewer.
  - URL: `http://localhost:8000/studies`

### Example response shape

The endpoint returns an array of study objects. Example:

```json
[
  {
    "id": "STD-00001",
    "patientId": "PT-0001",
    "patientName": "Test Patient",
    "study": "Chest AP",
    "modality": "XR",
    "bodyPart": "Chest",
    "date": "2025-04-17T10:31:00Z",
    "dateLabel": "Apr 17, 2025",
    "aiResult": "Normal"
  }
]
```

Fields may be optional in the demo backend; the frontend (`src/components/radiologist/WorklistTable.tsx` and viewer pages) is written defensively to handle missing fields.

## Notes

- This backend is intentionally minimal for demonstration purposes. Do not expose it to production networks.
- Future roadmap items (Orthanc, PostgreSQL, Redis, AI, FHIR/HL7 integrations) are documented in the project roadmap `PROJECT_ROADMAP.md` at the repository root.

If you need help running the backend or want me to scaffold the next milestone (Orthanc/Postgres/Redis), tell me which piece to start.
