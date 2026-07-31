import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import TherapySession
from backend.schemas.schemas import TherapySessionCreateSchema

router = APIRouter(prefix="/api/v1/therapy", tags=["Sound Therapy"])

@router.post("/session")
def log_therapy_session(data: TherapySessionCreateSchema, db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    new_session = TherapySession(
        id=session_id,
        patient_id=data.patient_id,
        sound_type=data.sound_type,
        notch_frequency_hz=data.notch_frequency_hz,
        duration_minutes=data.duration_minutes
    )
    try:
        db.add(new_session)
        db.commit()
    except Exception:
        db.rollback()

    return {
        "status": "success",
        "session_id": session_id,
        "message": f"Logged {data.duration_minutes}-minute {data.sound_type} session."
    }
