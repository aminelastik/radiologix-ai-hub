# Milestone 1 Audit Report

## 1. DICOM upload from Technician Upload page

**Status:** Done  
**Evidence:** `src/pages/technician/UploadPage.tsx` - File input accepts .dcm files, onClick handler sends POST request to `http://localhost:8000/upload-dicom` with FormData. Updates UI status on success/failure.  
**How to test manually:** Open Technician Upload page, select a DICOM file, fill patient info, click "Upload to PACS", check if status shows "uploaded successfully".  
**Fix needed:** None.

## 2. Uploaded file is stored in Orthanc

**Status:** Done  
**Evidence:** `backend/main.py` - `/upload-dicom` endpoint reads file bytes and calls `orthanc_client.upload_dicom(contents)`. `backend/orthanc_client.py` - `upload_dicom` function posts bytes to Orthanc `/instances` endpoint with auth.  
**How to test manually:** Start Orthanc via `docker-compose up` in `ops/orthanc/`, upload a DICOM file from Upload page, access Orthanc UI at `http://localhost:8042` (login orthanc/orthanc), verify study appears in studies list.  
**Fix needed:** None.

## 3. /studies endpoint returns Orthanc studies

**Status:** Partial  
**Evidence:** `backend/main.py` - `get_studies()` tries `orthanc_client.get_studies()`, maps Orthanc study IDs to minimal objects (id, patientName, etc.), falls back to mock data if Orthanc unavailable. `backend/orthanc_client.py` - `get_studies()` fetches from Orthanc `/studies` endpoint.  
**How to test manually:** Start Orthanc, upload DICOM, call GET `http://localhost:8000/studies`, check if response includes Orthanc studies instead of mock. If Orthanc down, verify fallback to mock.  
**Fix needed:** Currently falls back to mock silently; consider logging or error response if Orthanc unavailable for demo clarity.

## 4. Radiologist worklist displays studies from backend

**Status:** Done  
**Evidence:** `src/components/radiologist/WorklistTable.tsx` - useEffect fetches from `http://localhost:8000/studies` on mount, sets studies state, renders table rows.  
**How to test manually:** Open Radiologist Worklist page, verify studies from backend are displayed in the table.  
**Fix needed:** None.

## 5. Worklist supports basic patient/date filtering or clearly identifies what is missing

**Status:** Missing  
**Evidence:** `src/components/radiologist/WorklistTable.tsx` - Filter button "All Chest X-Rays" is static HTML with ChevronDown icon, no onClick handler or state for filtering. No search/filter logic implemented.  
**How to test manually:** Click the filter button in WorklistTable, observe no change or functionality.  
**Fix needed:** Implement client-side filtering by patient name/date, or add backend filtering params to /studies.

## 6. Patient history dashboard exists or clearly identifies what is missing

**Status:** Partial  
**Evidence:** `src/pages/radiologist/PatientHistoryPage.tsx` - Page exists with patient info and timeline, but uses hardcoded mock data (timeline array), no backend fetch for patient studies.  
**How to test manually:** Navigate to Patient History page (e.g., from worklist), see static patient details and study timeline.  
**Fix needed:** Add backend endpoint to fetch studies by patient ID, update page to fetch and display real data.

## 7. Viewer page opens selected study and displays correct metadata

**Status:** Partial  
**Evidence:** `src/pages/radiologist/ViewerPage.tsx` - Fetches all studies from /studies, finds selected by studyId param, displays patientName, study label, date in Card. No specific endpoint for individual study metadata.  
**How to test manually:** From worklist, click eye icon on a study, navigate to Viewer page, check if metadata (patient name, study, date) is displayed correctly.  
**Fix needed:** Add backend endpoint GET /studies/{study_id} to fetch detailed metadata from Orthanc, update ViewerPage to use it.

## 8. No AI, OHIF, FHIR, PostgreSQL, Redis, or auth changes

**Status:** Done  
**Evidence:** Code inspection - No imports or usage of AI libraries (TorchXRayVision), OHIF components (only placeholder), FHIR schemas, PostgreSQL/SQLAlchemy, Redis, or auth middleware in inspected files.  
**How to test manually:** Code review - search for keywords like "ai", "ohif", "fhir", "postgres", "redis", "auth" in source files.  
**Fix needed:** None.