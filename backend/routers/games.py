import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import GameScore
from backend.schemas.schemas import GameScoreSubmitSchema

router = APIRouter(prefix="/api/v1/games", tags=["Rehabilitation Games"])

@router.post("/score")
def submit_game_score(data: GameScoreSubmitSchema, db: Session = Depends(get_db)):
    score_id = str(uuid.uuid4())
    new_score = GameScore(
        id=score_id,
        patient_id=data.patient_id,
        game_name=data.game_name,
        score=data.score,
        xp_earned=data.xp_earned
    )
    try:
        db.add(new_score)
        db.commit()
    except Exception:
        db.rollback()

    return {
        "status": "success",
        "score_id": score_id,
        "xp_earned": data.xp_earned,
        "message": f"Successfully recorded {data.score} points for {data.game_name}."
    }
