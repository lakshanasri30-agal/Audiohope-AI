from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import Patient
from backend.schemas.schemas import DoctorApprovePlanSchema

router = APIRouter(prefix="/api/v1/doctor", tags=["Audiologist Clinical Portal"])

@router.get("/patients")
def get_patient_roster(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    if not patients:
        return [
            {
                "id": "PAT-8921",
                "name": "Alex Mercer",
                "age": 38,
                "gender": "Male",
                "occupation": "Audio Engineer",
                "tinnitus_pitch_hz": 4200,
                "tinnitus_loudness_db": 45,
                "severity": "Moderate",
                "risk_level": "Medium",
                "recovery_score": 85,
                "status": "Plan Approved"
            },
            {
                "id": "PAT-4309",
                "name": "Eleanor Vance",
                "age": 52,
                "gender": "Female",
                "occupation": "Principal",
                "tinnitus_pitch_hz": 6000,
                "tinnitus_loudness_db": 58,
                "severity": "Severe",
                "risk_level": "High",
                "recovery_score": 68,
                "status": "Needs Review"
            }
        ]
    return patients

@router.post("/approve-plan")
def approve_treatment_plan(data: DoctorApprovePlanSchema, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if patient:
        patient.status = "Plan Approved"
        patient.doctor_notes = data.doctor_notes
        patient.tinnitus_pitch_hz = data.notch_frequency_hz
        db.commit()
    return {
        "status": "success",
        "message": f"Approved rehabilitation plan for patient {data.patient_id}."
    }
