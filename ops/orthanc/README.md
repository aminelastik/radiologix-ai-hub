# Orthanc (PACS) — quickstart

This folder contains a minimal Docker Compose setup to run a local Orthanc PACS for demos.

Important: this is for educational/demo use only. Do not expose to production networks or use real patient data.

Requirements
- Docker & Docker Compose installed on your machine.

Run Orthanc

1. Open a terminal and change into this folder:

```bash
cd ops/orthanc
```

2. Start Orthanc:

```bash
docker-compose up -d
```

3. Open the Orthanc web UI in your browser:

http://localhost:8042

Log in with the demo credentials:

- Username: `orthanc`
- Password: `orthanc`

Notes
- The compose file also exposes the default DICOM port `4242` in case you want to push DICOM files with a DICOM client.
- Data is persisted in a Docker volume named `radiologix_orthanc_db` (created automatically).
- To stop and remove containers:

```bash
docker-compose down
```

If you want me to add a small helper script to upload a sample DICOM into Orthanc for the demo, I can scaffold that next.
