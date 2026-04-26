OHIF Viewer (minimal)

This folder contains a minimal docker-compose to run the OHIF Viewer and point it at the local Orthanc DICOMweb endpoint.

Prerequisites
- Docker / Docker Desktop (macOS)
- Orthanc running on the host at http://localhost:8042 (see ops/orthanc)

Start
```bash
cd ops/ohif
docker-compose up -d
```

Open the viewer
- Orthanc provides a built-in OHIF viewer at: http://localhost:8042/ohif/
- The separate OHIF Docker service (http://localhost:3000) is optional and not required for the MVP.

Notes
- The compose file attempts to set `DICOMWEB_BASE_URL` to `http://host.docker.internal:8042/dicom-web` so the container can reach Orthanc on the host. If your Docker environment does not support `host.docker.internal`, modify the URL accordingly.
- If the built-in Orthanc OHIF is unavailable, you can start the optional OHIF Docker service below and then visit http://localhost:3000. If OHIF does not auto-connect to Orthanc, add a DICOMweb server with URL `http://localhost:8042/dicom-web`.
- This README marks the Docker-based OHIF as optional — for the MVP we use Orthanc's built-in OHIF viewer at `/ohif/`.
