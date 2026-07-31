from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Auth Schemas
class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: str = "patient"

class UserLoginSchema(BaseModel):
    email: str
    password: str
    role: str = "patient"

class TokenResponseSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str
    role: str

class UserProfileSchema(BaseModel):
    id: str
    name: str
    email: str
    role: str
    age: Optional[int] = 35
    tinnitus_pitch_hz: Optional[int] = 4200
    tinnitus_loudness_db: Optional[int] = 45

# Assessment Schemas
class AssessmentCreateSchema(BaseModel):
    patient_id: str
    thi_score: int
    vas_score: float
    pitch_hz: int
    loudness_db: int
    primary_ear: str = "Bilateral"

class AssessmentResponseSchema(BaseModel):
    assessment_id: str
    severity: str
    confidence_score: float
    risk_level: str
    recovery_score: int
    shap_factors: List[Dict[str, Any]]

# Therapy Schemas
class TherapySessionCreateSchema(BaseModel):
    patient_id: str
    sound_type: str
    notch_frequency_hz: int = 4200
    duration_minutes: int = 20

# Game Score Schemas
class GameScoreSubmitSchema(BaseModel):
    patient_id: str
    game_name: str
    score: int
    xp_earned: int = 100

# Monitoring Schemas
class MonitoringLogCreateSchema(BaseModel):
    patient_id: str
    sleep_hours: float
    stress_level: int
    headphone_hours: float
    water_intake_oz: int
    medication_taken: bool = True

# Doctor Approval Schema
class DoctorApprovePlanSchema(BaseModel):
    patient_id: str
    doctor_notes: str
    notch_frequency_hz: int = 4200
