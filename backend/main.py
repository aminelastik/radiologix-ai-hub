from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import datetime
import io
import logging
from typing import List, Optional

import orthanc_client

# Try to import DICOM and image processing libraries.
HAS_PYDICOM = False
HAS_IMAGE_SUPPORT = False

try:
    import pydicom
    from pydicom.dataset import FileMetaDataset
    from pydicom.errors import InvalidDicomError
    from pydicom.uid import ExplicitVRLittleEndian, SecondaryCaptureImageStorage, generate_uid

    HAS_PYDICOM = True

    try:
        import PIL.Image
        import numpy as np

        HAS_IMAGE_SUPPORT = True
    except ImportError:
        print("Warning: PIL or numpy not available. Image to DICOM conversion disabled.")
except ImportError:
    print("Warning: pydicom not available. DICOM processing disabled.")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Radiologix AI Hub Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def format_person_name(value: str) -> str:
    """Convert a free-form name into a DICOM-friendly person name."""
    cleaned = " ".join(value.split()).strip()
    if not cleaned:
        return ""
    if "^" in cleaned:
        return cleaned
    return "^".join(cleaned.split())


def normalize_birth_date(value: str) -> str:
    """Convert common date input formats to YYYYMMDD."""
    cleaned = value.strip().replace("-", "").replace("/", "")
    if len(cleaned) == 8:
        return cleaned
    return cleaned


def infer_body_part(study_description: str, view_position: str) -> str:
    """Infer a simple body part tag from the study description."""
    text = f"{study_description} {view_position}".upper()
    if "CHEST" in text:
        return "CHEST"
    if "KNEE" in text:
        return "KNEE"
    if "HEAD" in text or "BRAIN" in text:
        return "HEAD"
    if "SPINE" in text:
        return "SPINE"
    if "ABDOMEN" in text or "ABD" in text:
        return "ABDOMEN"
    return ""


def build_series_description(study_description: str, view_position: str) -> str:
    """Build a readable series description for the uploaded batch."""
    parts = [part.strip() for part in [study_description, view_position] if part and part.strip()]
    if parts:
        return " - ".join(parts)
    return "Radiologix Study Series"


def dataset_to_bytes(dataset) -> bytes:
    """Serialize a DICOM dataset to raw bytes."""
    output = io.BytesIO()
    dataset.save_as(output, write_like_original=False)
    return output.getvalue()


def apply_demo_metadata(
    dataset,
    patient_id: str = "",
    patient_name: str = "",
    dob: str = "",
    gender: str = "",
    study_description: str = "",
    view_position: str = "",
    referring_physician: str = "",
    study_instance_uid: Optional[str] = None,
    series_instance_uid: Optional[str] = None,
    instance_number: int = 1,
    total_instances: int = 1,
    modality: str = "OT",
    default_patient_name: str = "Converted^Study",
):
    """Apply stable demo metadata to a DICOM dataset."""
    now = datetime.datetime.now()

    if patient_id:
        dataset.PatientID = patient_id
    elif not getattr(dataset, "PatientID", None):
        dataset.PatientID = generate_uid()[:16]

    if patient_name:
        dataset.PatientName = format_person_name(patient_name)
    elif not getattr(dataset, "PatientName", None):
        dataset.PatientName = default_patient_name

    if dob:
        dataset.PatientBirthDate = normalize_birth_date(dob)

    if gender:
        dataset.PatientSex = gender[:1].upper()

    if study_description:
        dataset.StudyDescription = study_description

    if view_position:
        dataset.ViewPosition = view_position

    if referring_physician:
        dataset.ReferringPhysicianName = format_person_name(referring_physician)

    if not getattr(dataset, "StudyDate", None):
        dataset.StudyDate = now.strftime("%Y%m%d")
    if not getattr(dataset, "StudyTime", None):
        dataset.StudyTime = now.strftime("%H%M%S")
    if not getattr(dataset, "SeriesDate", None):
        dataset.SeriesDate = now.strftime("%Y%m%d")
    if not getattr(dataset, "SeriesTime", None):
        dataset.SeriesTime = now.strftime("%H%M%S")
    if not getattr(dataset, "ContentDate", None):
        dataset.ContentDate = now.strftime("%Y%m%d")
    if not getattr(dataset, "ContentTime", None):
        dataset.ContentTime = now.strftime("%H%M%S")

    dataset.AccessionNumber = getattr(dataset, "AccessionNumber", "") or ""
    dataset.StudyInstanceUID = study_instance_uid or getattr(dataset, "StudyInstanceUID", generate_uid())
    dataset.SeriesInstanceUID = series_instance_uid or getattr(dataset, "SeriesInstanceUID", generate_uid())
    dataset.SOPInstanceUID = generate_uid()
    dataset.InstanceNumber = instance_number
    dataset.SeriesNumber = getattr(dataset, "SeriesNumber", 1) or 1
    dataset.ImagesInAcquisition = total_instances

    series_description = build_series_description(study_description, view_position)
    if series_description:
        dataset.SeriesDescription = series_description
        dataset.ProtocolName = series_description

    body_part = infer_body_part(study_description, view_position)
    if body_part:
        dataset.BodyPartExamined = body_part

    if modality:
        dataset.Modality = modality
    elif not getattr(dataset, "Modality", None):
        dataset.Modality = "OT"

    if not getattr(dataset, "ImageType", None):
        dataset.ImageType = ["ORIGINAL", "PRIMARY", "OTHER"]

    dataset.Manufacturer = "Radiologix AI Hub"

    if not hasattr(dataset, "file_meta") or dataset.file_meta is None:
        dataset.file_meta = FileMetaDataset()

    dataset.SOPClassUID = getattr(
        dataset,
        "SOPClassUID",
        getattr(dataset.file_meta, "MediaStorageSOPClassUID", SecondaryCaptureImageStorage),
    )
    dataset.file_meta.MediaStorageSOPClassUID = dataset.SOPClassUID
    dataset.file_meta.MediaStorageSOPInstanceUID = dataset.SOPInstanceUID
    if not getattr(dataset.file_meta, "TransferSyntaxUID", None):
        dataset.file_meta.TransferSyntaxUID = ExplicitVRLittleEndian
    dataset.file_meta.ImplementationClassUID = generate_uid()

    dataset.is_little_endian = True
    dataset.is_implicit_VR = False
    return dataset


def convert_image_to_dicom(
    image_bytes: bytes,
    filename: str,
    patient_id: str = "",
    patient_name: str = "",
    dob: str = "",
    gender: str = "",
    study_description: str = "",
    view_position: str = "",
    referring_physician: str = "",
    modality: str = "OT",
    study_instance_uid: Optional[str] = None,
    series_instance_uid: Optional[str] = None,
    instance_number: int = 1,
    total_instances: int = 1,
) -> bytes:
    """
    Convert PNG/JPG image bytes to DICOM format with proper metadata.
    """
    if not HAS_IMAGE_SUPPORT:
        raise Exception("Image processing libraries not available")
    if not HAS_PYDICOM:
        raise Exception("DICOM processing libraries not available")

    # Load image and force grayscale
    img = PIL.Image.open(io.BytesIO(image_bytes)).convert("L")
    pixel_array = np.array(img)

    # --- File Meta Information ---
    file_meta = FileMetaDataset()
    file_meta.MediaStorageSOPClassUID = SecondaryCaptureImageStorage
    file_meta.MediaStorageSOPInstanceUID = generate_uid()
    file_meta.TransferSyntaxUID = ExplicitVRLittleEndian
    file_meta.ImplementationClassUID = generate_uid()

    # --- Create DICOM dataset ---
    ds = pydicom.FileDataset(
        filename,
        {},
        file_meta=file_meta,
        preamble=b"\0" * 128,
    )

    ds.SamplesPerPixel = 1
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.Rows, ds.Columns = pixel_array.shape
    ds.BitsAllocated = 8
    ds.BitsStored = 8
    ds.HighBit = 7
    ds.PixelRepresentation = 0
    ds.SmallestImagePixelValue = int(pixel_array.min())
    ds.LargestImagePixelValue = int(pixel_array.max())
    ds.WindowCenter = max(1, (ds.SmallestImagePixelValue + ds.LargestImagePixelValue) // 2)
    ds.WindowWidth = max(1, ds.LargestImagePixelValue - ds.SmallestImagePixelValue)
    ds.PixelData = pixel_array.astype(np.uint8).tobytes()

    apply_demo_metadata(
        ds,
        patient_id=patient_id,
        patient_name=patient_name,
        dob=dob,
        gender=gender,
        study_description=study_description or f"Converted from {filename}",
        view_position=view_position,
        referring_physician=referring_physician,
        study_instance_uid=study_instance_uid,
        series_instance_uid=series_instance_uid,
        instance_number=instance_number,
        total_instances=total_instances,
        modality=modality or "OT",
        default_patient_name="Converted^Image",
    )

    return dataset_to_bytes(ds)


@app.get("/")
def home():
    return {"message": "Backend is running"}


@app.get("/studies")
def get_studies():
    """
    Fetch current studies from Orthanc. No fallback mock data.
    """
    logger.info("Fetching studies from Orthanc")
    orthanc_studies = orthanc_client.get_studies()
    logger.info(f"Found {len(orthanc_studies)} studies in Orthanc")

    if orthanc_studies:
        mapped = []
        for sid in orthanc_studies:
            logger.info(f"Fetching metadata for study {sid}")
            raw = orthanc_client.get_study(sid)
            if raw:
                # Extract from MainDicomTags and, when needed, from Series/Instances
                main_tags = raw.get("MainDicomTags", {})
                patient_tags = raw.get("PatientMainDicomTags", {})

                # Series and instance counts
                series_ids = raw.get("Series", []) or []
                series_count = len(series_ids)
                instance_count = 0
                # Try to compute instance count from series metadata if available
                for series_id in series_ids:
                    series_json = orthanc_client.get_series(series_id)
                    if series_json and isinstance(series_json.get("Instances"), list):
                        instance_count += len(series_json.get("Instances") or [])

                # Fallback to Orthanc-provided NumberOfInstances
                if instance_count == 0:
                    instance_count = raw.get("NumberOfInstances") or 0

                # Modality: prefer definitive modalities (CR/DX) from study, then series, then instances
                modality = None
                m = (main_tags.get("Modality") or "").upper()
                if m and m not in ("DICOM", ""):
                    modality = m

                if not modality:
                    for series_id in series_ids:
                        series_json = orthanc_client.get_series(series_id)
                        if not series_json:
                            continue
                        s_main = series_json.get("MainDicomTags", {})
                        sm = (s_main.get("Modality") or "").upper()
                        if sm and sm not in ("DICOM", ""):
                            modality = sm
                            break

                # If still not found, inspect instances for ViewPosition/Modality
                view_position = main_tags.get("ViewPosition")
                if not modality or not view_position:
                    for series_id in series_ids:
                        series_json = orthanc_client.get_series(series_id)
                        if not series_json:
                            continue
                        instances = series_json.get("Instances") or []
                        for inst_id in instances:
                            inst = orthanc_client.get_instance(inst_id)
                            if not inst:
                                continue
                            inst_main = inst.get("MainDicomTags", {})
                            if not modality:
                                im = (inst_main.get("Modality") or "").upper()
                                if im and im not in ("DICOM", ""):
                                    modality = im
                            if not view_position:
                                vp = inst_main.get("ViewPosition")
                                if vp:
                                    view_position = vp
                            if modality and view_position:
                                break
                        if modality and view_position:
                            break

                # Final fallbacks
                if not modality:
                    modality = main_tags.get("Modality") or "Unknown"

                study_description = main_tags.get("StudyDescription") or main_tags.get("SeriesDescription") or "Unknown"
                date_val = main_tags.get("StudyDate") or "Unknown"

                study = {
                    "id": sid,
                    "patientId": patient_tags.get("PatientID", main_tags.get("PatientID", sid)) or "Unknown",
                    "patientName": patient_tags.get("PatientName", main_tags.get("PatientName", "Unknown Patient")) or "Unknown",
                    "modality": modality,
                    "studyInstanceUID": main_tags.get("StudyInstanceUID") or None,
                    "bodyPart": main_tags.get("BodyPartExamined", "Unknown"),
                    "study": study_description,
                    "studyDescription": study_description,
                    "viewPosition": view_position or None,
                    "instanceCount": int(instance_count or 0),
                    "seriesCount": int(series_count or 0),
                    "date": date_val,
                    "status": "Pending",
                    "priority": "Normal",
                }
                mapped.append(study)
                logger.info(f"Mapped study {sid}: {study['patientName']} - {study['study']}")
            else:
                logger.warning(f"Could not fetch metadata for study {sid}")
        return mapped

    # No fallback mock data - return empty list if Orthanc unavailable
    logger.warning("No studies found in Orthanc, returning empty list")
    return []


@app.post("/upload-dicom")
async def upload_dicom(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    patient_id: str = Form(""),
    patient_name: str = Form(""),
    dob: str = Form(""),
    gender: str = Form(""),
    study_description: str = Form(""),
    view_position: str = Form(""),
    modality: str = Form(""),
    referring_physician: str = Form(""),
):
    """Accept one or more DICOM or image files, normalize metadata, and forward them to Orthanc."""
    try:
        incoming_files: List[UploadFile] = []
        if files:
            incoming_files.extend(files)
        if file:
            incoming_files.append(file)

        if not incoming_files:
            logger.warning("Upload request received with no files")
            return {
                "success": False,
                "error": "No files supplied",
                "uploaded_count": 0,
                "failed_count": 0,
                "results": [],
            }

        study_instance_uid = generate_uid()
        series_instance_uid = generate_uid()
        total_instances = len(incoming_files)
        uploaded_count = 0
        failed_count = 0
        results = []

        logger.info("Received upload request: file_count=%s", total_instances)
        logger.info("Generated StudyInstanceUID: %s", study_instance_uid)
        logger.info("Generated SeriesInstanceUID: %s", series_instance_uid)
        logger.info(
            "Upload metadata: patient_id=%s patient_name=%s dob=%s gender=%s study_description=%s view_position=%s modality=%s referring_physician=%s",
            patient_id,
            patient_name,
            dob,
            gender,
            study_description,
            view_position,
            modality,
            referring_physician,
        )

        for index, uploaded_file in enumerate(incoming_files, start=1):
            filename = uploaded_file.filename or f"upload-{index}"
            lower_filename = filename.lower()
            logger.info("Processing file %s/%s: %s", index, total_instances, filename)

            try:
                contents = await uploaded_file.read()
                logger.info("Read %s bytes from %s", len(contents), filename)

                if lower_filename.endswith((".png", ".jpg", ".jpeg")):
                    dicom_bytes = convert_image_to_dicom(
                        contents,
                        filename,
                        patient_id=patient_id,
                        patient_name=patient_name,
                        dob=dob,
                        gender=gender,
                        study_description=study_description,
                        view_position=view_position,
                        referring_physician=referring_physician,
                        modality=modality or "OT",
                        study_instance_uid=study_instance_uid,
                        series_instance_uid=series_instance_uid,
                        instance_number=index,
                        total_instances=total_instances,
                    )
                else:
                    if not HAS_PYDICOM:
                        raise Exception("DICOM processing libraries not available")

                    try:
                        dataset = pydicom.dcmread(io.BytesIO(contents), force=False)
                    except InvalidDicomError as exc:
                        raise Exception(f"File is not a valid DICOM image: {filename}") from exc

                    apply_demo_metadata(
                        dataset,
                        patient_id=patient_id,
                        patient_name=patient_name,
                        dob=dob,
                        gender=gender,
                        study_description=study_description,
                        view_position=view_position,
                        referring_physician=referring_physician,
                        study_instance_uid=study_instance_uid,
                        series_instance_uid=series_instance_uid,
                        instance_number=index,
                        total_instances=total_instances,
                        modality=modality or getattr(dataset, "Modality", "") or "OT",
                        default_patient_name="Converted^Study",
                    )
                    dicom_bytes = dataset_to_bytes(dataset)

                result = orthanc_client.upload_dicom(dicom_bytes)
                logger.info(
                    "Orthanc response for %s: success=%s status_code=%s instance_id=%s study_id=%s",
                    filename,
                    result.get("success"),
                    result.get("status_code"),
                    result.get("instance_id"),
                    result.get("study_id"),
                )

                if result.get("success"):
                    uploaded_count += 1
                    results.append(
                        {
                            "filename": filename,
                            "status": "done",
                            "error": None,
                        }
                    )
                    logger.info("Upload done for %s", filename)
                else:
                    failed_count += 1
                    error_message = result.get("error", "Unknown error")
                    results.append(
                        {
                            "filename": filename,
                            "status": "failed",
                            "error": error_message,
                        }
                    )
                    logger.error("Upload failed for %s: %s", filename, error_message)

            except Exception as exc:
                failed_count += 1
                error_message = str(exc)
                results.append(
                    {
                        "filename": filename,
                        "status": "failed",
                        "error": error_message,
                    }
                )
                logger.exception("Processing failed for %s", filename)

        success = failed_count == 0 and uploaded_count > 0

        response = {
            "success": success,
            "study_instance_uid": study_instance_uid,
            "uploaded_count": uploaded_count,
            "failed_count": failed_count,
            "results": results,
        }

        if success:
            logger.info(
                "Batch upload complete. uploaded_count=%s failed_count=%s",
                uploaded_count,
                failed_count,
            )
        else:
            logger.warning(
                "Batch upload completed with failures. uploaded_count=%s failed_count=%s",
                uploaded_count,
                failed_count,
            )
            response["error"] = "One or more files failed to upload"

        return response

    except Exception as exc:
        logger.exception("Upload failed")
        return {
            "success": False,
            "error": f"Upload failed: {str(exc)}",
            "uploaded_count": 0,
            "failed_count": 0,
            "results": [],
        }


@app.get("/studies/{study_id}")
def get_single_study(study_id: str):
    """
    Fetch a single study by ID from Orthanc.
    """
    logger.info(f"Fetching single study {study_id}")
    orthanc_study = orthanc_client.get_study(study_id)
    if orthanc_study:
        # Map Orthanc study to expected shape
        main_tags = orthanc_study.get("MainDicomTags", {})
        patient_tags = orthanc_study.get("PatientMainDicomTags", {})

        return {
            "id": study_id,
            "patientId": patient_tags.get("PatientID", main_tags.get("PatientID", study_id)),
            "patientName": patient_tags.get("PatientName", main_tags.get("PatientName", "Unknown Patient")),
            "modality": main_tags.get("Modality", "DICOM"),
            "studyInstanceUID": main_tags.get("StudyInstanceUID"),
            "bodyPart": main_tags.get("BodyPartExamined", "Unknown"),
            "study": main_tags.get("StudyDescription", "Study"),
            "studyDescription": main_tags.get("StudyDescription", "Study"),
            "viewPosition": main_tags.get("ViewPosition"),
            "instanceCount": orthanc_study.get("NumberOfInstances") or 0,
            "seriesCount": len(orthanc_study.get("Series", [])),
            "date": main_tags.get("StudyDate", "Unknown"),
            "status": "Pending",
            "priority": "Normal",
        }

    logger.warning(f"Study {study_id} not found in Orthanc")
    return {"error": "Study not found"}


@app.get("/patients/{patient_id}/studies")
def get_patient_studies(patient_id: str):
    """
    Return all studies for a given patient ID.
    """
    all_studies = get_studies()
    patient_studies = [
        s for s in all_studies
        if str(s.get("patientId", "")).strip() == str(patient_id).strip()
        or str(s.get("id", "")).strip() == str(patient_id).strip()
    ]
    return patient_studies
