# Radiologix AI Hub — MVP Roadmap

## Milestone 1 — Stabilize current pipeline

**Goal:** Establish a stable connection between React frontend, FastAPI backend, and Orthanc PACS for basic DICOM operations.

**Architecture/Approach:** React frontend communicates with FastAPI backend, which interfaces with Orthanc PACS for DICOM storage and retrieval.

**Key Features:**
- DICOM upload functionality
- Worklist with patient grouping and filtering by patient/date
- Basic patient history dashboard
- Viewer loads correct metadata

**Demo Proof:** Demonstrate DICOM upload, view populated worklist with filtering, access patient history, and verify metadata in viewer.

## Milestone 2 — Embed OHIF viewer

**Goal:** Integrate OHIF viewer for DICOM visualization.

**Architecture/Approach:** Run OHIF separately and connect directly to Orthanc via DICOMweb, embed via iframe in ViewerPage without FastAPI proxy.

**Key Features:**
- OHIF runs as separate service
- Direct DICOMweb connection to Orthanc
- Iframe embedding in ViewerPage
- No custom rendering or proxy

**Demo Proof:** Show OHIF viewer embedded in the app, loading and displaying DICOM images from Orthanc.

## Milestone 3 — AI classification

**Goal:** Implement AI classification endpoint for studies.

**Architecture/Approach:** Create POST /ai/classify/{study_id} endpoint returning structured findings; use TorchXRayVision or mock deterministic output.

**Key Features:**
- Classification of pneumonia, effusion, etc.
- Confidence scores and probabilities
- Structured JSON response

**Demo Proof:** Submit a study for classification and display results with probabilities in the UI.

## Milestone 4 — AI segmentation & visual analysis

**Goal:** Add AI segmentation and overlay generation.

**Architecture/Approach:** Implement POST /ai/segment/{study_id} returning URLs for segmentation masks and heatmaps; start with generated overlays, prepare for MONAI/U-Net.

**Key Features:**
- Segmentation mask and heatmap URLs
- Simple/generated overlays
- Structure for advanced models

**Demo Proof:** Generate and display segmentation overlays and heatmaps in the viewer.

## Milestone 5 — Viewer AI visualization

**Goal:** Integrate AI results into the viewer UI.

**Architecture/Approach:** Add AI panel in React (separate from OHIF) to show findings, probability bars, and toggle overlays.

**Key Features:**
- AI panel with findings display
- Probability bars
- Toggle for heatmap and segmentation overlays
- Clean separation: AI panel + OHIF iframe

**Demo Proof:** Interact with AI panel to view findings, toggle overlays, and see integrated visualization.

## Milestone 6 — Lightweight FHIR export

**Goal:** Provide basic FHIR endpoints for studies and reports.

**Architecture/Approach:** Implement GET endpoints for ImagingStudy and DiagnosticReport returning simple FHIR-like JSON.

**Key Features:**
- GET /fhir/ImagingStudy/{study_id}
- GET /fhir/DiagnosticReport/{study_id}
- Simple JSON structure

**Demo Proof:** Query FHIR endpoints and display returned JSON structures.
