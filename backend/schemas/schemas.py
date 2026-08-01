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
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str
    role: str

class RefreshTokenRequestSchema(BaseModel):
    refresh_token: str

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
    predicted_pitch_hz: int = 4200
    predicted_loudness_db: int = 52
    predicted_intensity: str = "Moderate"
    recovery_timeline_weeks: str = "4-6 Weeks"
    clinical_summary: Optional[str] = None
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

# AI Chatbot Schemas
class ChatMessageSchema(BaseModel):
    message: str
    patient_id: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None

class ChatResponseSchema(BaseModel):
    response: str
    suggested_questions: List[str]
    timestamp: str

