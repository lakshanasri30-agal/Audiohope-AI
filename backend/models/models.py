import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="patient") # 'patient', 'doctor', 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    age = Column(Integer, nullable=False, default=35)
    gender = Column(String(50), default="Male")
    height_cm = Column(Float, default=175.0)
    weight_kg = Column(Float, default=70.0)
    occupation = Column(String(255), default="Software Engineer")
    tinnitus_pitch_hz = Column(Integer, default=4200)
    tinnitus_loudness_db = Column(Integer, default=45)
    primary_ear = Column(String(20), default="Bilateral")
    status = Column(String(50), default="Plan Approved")
    doctor_notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="patient_profile")
    assessments = relationship("Assessment", back_populates="patient")
    therapy_sessions = relationship("TherapySession", back_populates="patient")
    game_scores = relationship("GameScore", back_populates="patient")
    monitoring_logs = relationship("MonitoringLog", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    specialty = Column(String(255), default="Audiology & Otolaryngology")
    license_number = Column(String(100), default="LIC-89210-ENT")
    hospital_name = Column(String(255), default="Central Otology Hospital")

    user = relationship("User", back_populates="doctor_profile")

class HearingTest(Base):
    __tablename__ = "hearing_tests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"))
    speech_discrimination_pct = Column(Float, default=96.0)
    tympanometry_type = Column(String(20), default="Type A")
    created_at = Column(DateTime, default=datetime.utcnow)

    audiograms = relationship("Audiogram", back_populates="hearing_test")

class Audiogram(Base):
    __tablename__ = "audiograms"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hearing_test_id = Column(String(36), ForeignKey("hearing_tests.id", ondelete="CASCADE"))
    frequency_hz = Column(Integer, nullable=False)
    left_ear_db = Column(Integer, nullable=False)
    right_ear_db = Column(Integer, nullable=False)

    hearing_test = relationship("HearingTest", back_populates="audiograms")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"))
    thi_score = Column(Integer, nullable=False)
    vas_score = Column(Float, nullable=False)
    severity = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    recovery_score = Column(Integer, default=85)
    shap_factors = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="assessments")

class TherapySession(Base):
    __tablename__ = "therapy_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"))
    sound_type = Column(String(100), nullable=False)
    notch_frequency_hz = Column(Integer, default=4200)
    duration_minutes = Column(Integer, nullable=False, default=20)
    completed_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="therapy_sessions")

class GameScore(Base):
    __tablename__ = "game_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"))
    game_name = Column(String(100), nullable=False)
    score = Column(Integer, nullable=False)
    xp_earned = Column(Integer, default=100)
    played_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="game_scores")

class MonitoringLog(Base):
    __tablename__ = "monitoring_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"))
    log_date = Column(DateTime, default=datetime.utcnow)
    sleep_hours = Column(Float, default=7.5)
    stress_level = Column(Integer, default=4)
    headphone_hours = Column(Float, default=2.0)
    water_intake_oz = Column(Integer, default=64)
    medication_taken = Column(Boolean, default=True)

    patient = relationship("Patient", back_populates="monitoring_logs")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(255), nullable=False)
    ip_address = Column(String(45), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow)
