# Radiologix AI Hub — MVP Roadmap

This document outlines a practical, milestone-driven MVP roadmap for the Radiologix AI Hub educational demo. The goal is an instructor-facing demo (not for clinical use) showing DICOM ingestion, basic PACS browsing (Orthanc), a FastAPI backend, a React TypeScript frontend, a PostgreSQL/FHIR-backed metadata store, Redis for small-scale caching/queues, and an AI module that begins as a mock and becomes MONAI-ready.

Each milestone includes: objective, files to create/update, expected result, and a short demo proof for the professor.

---

## Milestone 1 — Current frontend/backend connection

- Objective: Verify and document the existing connection between the React frontend and the FastAPI backend; standardize the studies fetch flow.
- Files to create/update:
  - `PROJECT_ROADMAP.md` (this file)
  - `backend/README.md` (new): short description of available endpoints (e.g. `/studies`).
  - `src/pages/radiologist/ViewerPage.tsx` (already updated in current work) — confirm it reads `studyId` and fetches studies.
  - `src/components/radiologist/WorklistTable.tsx` (existing) — verify comment/docstring describing `http://localhost:8000/studies` use.
- Expected result: Frontend fetches `/studies` and navigation to `/radiologist/viewer/:studyId` displays a study entry; developer docs list endpoints.
- Demo proof: Open browser to app, show worklist populated from `http://localhost:8000/studies`, click eye icon → show Viewer page with patient/name/id/date. Show `backend/README.md` listing `/studies`.

---

## Milestone 2 — Orthanc integration

- Objective: Add Orthanc as a local PACS for DICOM storage and retrieval; enable forwarding of DICOMs into Orthanc and expose WADO/URI for viewer components.
- Files to create/update:
  - `ops/orthanc/docker-compose.yml` (new): Orthanc container with minimal config and storage volume.
  - `backend/orthanc_client.py` (new): helper to query Orthanc REST API and proxy studies to FastAPI endpoints.
  - `backend/main.py` (update): add routes (or a router module) to fetch studies from Orthanc or merged store.
  - `README.md` or `backend/README.md` (update): instructions to run Orthanc and configure CORS/WADO.
- Expected result: Orthanc running locally; DICOMs can be uploaded and listed; Orthanc provides WADO endpoints that the viewer can consume.
- Demo proof: Run `docker-compose up` for Orthanc, upload a sample DICOM (curl or Orthanc UI), show the Orthanc UI listing studies, then show frontend or a simple HTTP call returning a WADO URL for a sample instance.

---

## Milestone 3 — PostgreSQL + FHIR data model

- Objective: Introduce PostgreSQL to persist study/patient metadata and implement a lightweight FHIR R4 mapping for demo queries (Patient, ImagingStudy/Observation metadata).
- Files to create/update:
  - `ops/postgres/docker-compose.yml` (new): Postgres service configuration with a named volume.
  - `backend/db/` (new): migration scripts / SQL to create tables: `patients`, `studies`, `instances`, plus a small ORM layer (e.g. SQLModel or SQLAlchemy models).
  - `backend/fhir/mapper.py` (new): small utilities mapping DB rows to FHIR R4 JSON (Patient, ImagingStudy stubs).
  - `backend/main.py` (update): add endpoints `/fhir/Patient/:id` and `/fhir/ImagingStudy/:id` returning mapped resources.
  - `backend/requirements.txt` (update): list `sqlmodel` or `sqlalchemy`, `asyncpg` if async, and `fhir.resources` (optional) for shaping resources.
- Expected result: Metadata persisted in Postgres; professor can query a FHIR endpoint returning a valid-looking FHIR resource for a study.
- Demo proof: Show running Postgres, run a script that inserts a sample patient & study, curl `/fhir/ImagingStudy/:id` and show returned JSON matching FHIR R4 shape.

---

## Milestone 4 — Redis usage

- Objective: Add Redis for short-lived caching (study lists, WADO URLs) and a simple job queue to simulate AI task submission.
- Files to create/update:
  - `ops/redis/docker-compose.yml` (new): Redis service.
  - `backend/cache.py` (new): small wrapper to cache `/studies` responses and WADO URLs.
  - `backend/queue.py` (new): small job-queue adapter to push AI tasks into Redis lists (for demo; optional RQ or simple pop/push).
  - `backend/main.py` (update): use caching for `/studies` endpoint and add `/ai/submit` to enqueue a job.
- Expected result: Cached responses reduce load; visible Redis queue for submitted AI jobs.
- Demo proof: Start Redis, fetch `/studies` twice and show the second request served from cache (via a logged header or timestamp), submit an AI job and show it enqueued in Redis (`redis-cli LRANGE ...`).

---

## Milestone 5 — Viewer integration

- Objective: Connect the frontend viewer to Orthanc WADO/URI images (or a minimal image proxy) so the viewer can load real DICOM images or static test images.
- Files to create/update:
  - `src/components/viewer/OHIFViewerPlaceholder.tsx` (update): make it accept real WADO URLs (or load a provided JPEG/PNG conversion URL) when available.
  - `backend/orthanc_client.py` (from Milestone 2): add an endpoint `/studies/:id/wado` returning viewer-ready URLs.
  - `backend/main.py` (update): proxy WADO requests if needed (CORS-friendly).
- Expected result: Viewer can request and render at least one real image (or converted JPEG/PNG) for a study.
- Demo proof: Open Viewer for a study and show the image(s) load in the placeholder; if using a static conversion, show the conversion URL and the displayed image.

---

## Milestone 6 — AI mock then MONAI-ready module

- Objective: Provide an AI demo pipeline: start with a lightweight mock AI service that returns deterministic labels, then upgrade to a MONAI/PyTorch-ready scaffold that can run a sample model locally.
- Files to create/update:
  - `backend/ai/mock_ai.py` (new): deterministic responses for a study (e.g., returns `Normal`/`Abnormal` label and bounding boxes JSON).
  - `backend/ai/worker.py` (new): small runner that consumes Redis queue jobs, calls `mock_ai` and writes results to DB or cache.
  - `backend/ai/monai_scaffold/` (new): README + starter scripts to load a MONAI model checkpoint and run inference (no heavy training required for demo).
  - `backend/main.py` (update): endpoints `/ai/submit` and `/ai/status/:jobId` and `/ai/result/:studyId`.
  - `backend/requirements.txt` (update): optional dev deps for MONAI/PyTorch pinned and documented as optional (not required for core demo).
- Expected result: Professor can submit a study for AI analysis, see queued job, and receive a deterministic mock result; migration path to run MONAI locally is documented.
- Demo proof: Submit an AI job from the frontend or curl `/ai/submit?studyId=...`, show job status progression, then show `/ai/result/:studyId` returning a mock analysis that the UI displays.

---

## Milestone 7 — HL7 v2 to FHIR mapping demo

- Objective: Demonstrate ingestion of a simple HL7 v2 ADT/ORM message, parse it, and map key fields to a FHIR Patient / ImagingStudy resource in the DB.
- Files to create/update:
  - `backend/hl7/parser.py` (new): minimal HL7 v2 parser for demo (use `hl7` or `hl7apy` library if desired) that extracts patient id, name, DOB, sex, accession/study id.
  - `backend/fhir/mapper.py` (update): add mapping utilities to convert parsed HL7 segments to FHIR resources and persist to Postgres.
  - `backend/main.py` (update): add an endpoint `/hl7/ingest` to POST raw HL7 text for mapping.
  - `backend/requirements.txt` (update): add `hl7apy` or small parser lib.
- Expected result: A posted HL7 v2 message creates or updates a Patient/Study record and the equivalent FHIR endpoint returns the mapped resource.
- Demo proof: `curl -X POST http://localhost:8000/hl7/ingest --data-binary @sample.hl7`, then curl `/fhir/Patient/:id` and show the mapped FHIR JSON.

---

## Milestone 8 — Final professor demo flow

- Objective: Orchestrate a short live demo that exercises the whole pipeline from DICOM upload → Orthanc → metadata in Postgres/FHIR → viewer load → AI submission → result display; all with instructor-facing scripts and docs.
- Files to create/update:
  - `demo/run_demo.sh` (new): single script that starts required services (`docker-compose` for Orthanc/Postgres/Redis), seeds DB with test patient/study, uploads sample DICOM(s) to Orthanc, and starts backend/worker.
  - `demo/README.md` (new): step-by-step instructions for the professor to run locally, expected timelines, and troubleshooting tips.
  - `backend/demo_seed.py` (new): script to insert demo rows into Postgres and optionally seed Orthanc with references.
  - `src/pages/radiologist/ViewerPage.tsx` and `src/components/viewer/*` (documentation updates): small text notes and visible UI hints used in the demo (e.g., a banner showing demo mode and simple steps).
- Expected result: A one-click (or small-number-of-commands) demo that an instructor can run and show the end-to-end flows in ~10 minutes.
- Demo proof: Run `demo/run_demo.sh`, open the frontend, show: Worklist populated → open Viewer → load images → click “Run AI” → show queued job and final mock/monai result; show FHIR endpoints returning mapped resources.

---

## Non-functional notes & constraints

- This roadmap is for educational/demo purposes only — do not use patient data in production; keep dataset small and synthetic.
- Keep security minimal for local demos (CORS, auth can be stubbed). Add warnings in `README.md` and `backend/README.md` that this is non-clinical demo software.
- Pin heavy dependencies (PyTorch/MONAI) as optional and document hardware/OS requirements for running local inference.

---

If you want, I can now scaffold the `ops/` docker-compose files and small backend stubs for the next milestone (Orthanc + Postgres + Redis), or create the `backend/README.md` documenting the `/studies` endpoint. Which should I do next?
