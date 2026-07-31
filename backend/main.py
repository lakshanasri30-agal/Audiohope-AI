from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, SessionLocal
from backend.models.models import User, Patient, Doctor
from backend.utils.auth import hash_password
from backend.routers import auth, assessment, therapy, games, monitoring, doctor, admin

# Automatically create all SQL database tables on server startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AudioHope AI API Backend",
    description="Production FastAPI REST Service for AI Tinnitus Assessment, Web Audio Sound Therapy, Gamified Rehabilitation & Audiologist Clinical Decision Support.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular API Routers
app.include_router(auth.router)
app.include_router(assessment.router)
app.include_router(therapy.router)
app.include_router(games.router)
app.include_router(monitoring.router)
app.include_router(doctor.router)
app.include_router(admin.router)

@app.on_event("startup")
def seed_demo_users():
    """Seed initial demo users on startup if database is empty"""
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            demo_patient = User(
                id="usr_patient_101",
                name="Alex Mercer",
                email="alex.mercer@audiohope.ai",
                password_hash=hash_password("password123"),
                role="patient"
            )
            demo_doctor = User(
                id="usr_doctor_101",
                name="Dr. Sarah Jenkins",
                email="s.jenkins@audiology.clinic",
                password_hash=hash_password("password123"),
                role="doctor"
            )
            demo_admin = User(
                id="usr_admin_101",
                name="Admin Console",
                email="admin@audiohope.ai",
                password_hash=hash_password("password123"),
                role="admin"
            )
            db.add_all([demo_patient, demo_doctor, demo_admin])
            db.commit()

            # Seed Patient Details
            patient_profile = Patient(
                id="usr_patient_101",
                age=38,
                gender="Male",
                occupation="Audio Engineer / Software Dev",
                tinnitus_pitch_hz=4200,
                tinnitus_loudness_db=45,
                primary_ear="Bilateral",
                status="Plan Approved",
                doctor_notes="Notched sound therapy adjusted to 4.2kHz target. Patient responds well to 20-min daily pink noise sessions."
            )
            doctor_profile = Doctor(
                id="usr_doctor_101",
                specialty="Audiology & Otolaryngology",
                license_number="LIC-89210-ENT",
                hospital_name="Central Otology Hospital"
            )
            db.add_all([patient_profile, doctor_profile])
            db.commit()
    except Exception as e:
        print(f"Startup seeding error: {e}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AudioHope AI Production FastAPI Engine",
        "version": "1.0.0",
        "documentation": "/docs",
        "openapi_spec": "/openapi.json"
    }
