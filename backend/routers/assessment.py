import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import Assessment, Patient
from backend.schemas.schemas import AssessmentCreateSchema, AssessmentResponseSchema
from backend.ml.tinnitus_classifier import tinnitus_ml_pipeline

router = APIRouter(prefix="/api/v1/assessment", tags=["Assessment"])

@router.post("/predict", response_model=AssessmentResponseSchema)
def create_assessment_prediction(data: AssessmentCreateSchema, db: Session = Depends(get_db)):
    # Run Scikit-learn + XGBoost ML inference pipeline
    ml_result = tinnitus_ml_pipeline.predict_severity_and_shap(
        thi_score=data.thi_score,
        vas_score=data.vas_score,
        pitch_hz=data.pitch_hz,
        loudness_db=data.loudness_db
    )

    assessment_id = str(uuid.uuid4())
    
    # Save assessment record in DB
    new_assessment = Assessment(
        id=assessment_id,
        patient_id=data.patient_id,
        thi_score=data.thi_score,
        vas_score=data.vas_score,
        severity=ml_result["severity"],
        confidence_score=ml_result["confidence_score"],
        risk_level=ml_result["risk_level"],
        recovery_score=ml_result["recovery_score"],
        shap_factors=ml_result["shap_factors"]
    )
    
    try:
        db.add(new_assessment)
        # Update patient pitch & loudness
        patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
        if patient:
            patient.tinnitus_pitch_hz = data.pitch_hz
            patient.tinnitus_loudness_db = data.loudness_db
            patient.primary_ear = data.primary_ear
        db.commit()
    except Exception:
        db.rollback()

    return {
        "assessment_id": assessment_id,
        "severity": ml_result["severity"],
        "confidence_score": ml_result["confidence_score"],
        "risk_level": ml_result["risk_level"],
        "recovery_score": ml_result["recovery_score"],
        "shap_factors": ml_result["shap_factors"]
    }
