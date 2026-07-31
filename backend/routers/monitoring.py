import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import MonitoringLog
from backend.schemas.schemas import MonitoringLogCreateSchema

router = APIRouter(prefix="/api/v1/monitoring", tags=["Continuous Monitoring"])

@router.post("/log")
def create_monitoring_log(data: MonitoringLogCreateSchema, db: Session = Depends(get_db)):
    log_id = str(uuid.uuid4())
    new_log = MonitoringLog(
        id=log_id,
        patient_id=data.patient_id,
        sleep_hours=data.sleep_hours,
        stress_level=data.stress_level,
        headphone_hours=data.headphone_hours,
        water_intake_oz=data.water_intake_oz,
        medication_taken=data.medication_taken
    )
    try:
        db.add(new_log)
        db.commit()
    except Exception:
        db.rollback()

    # Calculate overall health score
    health_score = int(min(100, max(50, (data.sleep_hours * 8) + (data.water_intake_oz * 0.3) - (data.stress_level * 3))))

    return {
        "status": "success",
        "log_id": log_id,
        "calculated_health_score": health_score,
        "message": "Daily health & lifestyle metrics updated."
    }
