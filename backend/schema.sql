-- AudioHope AI Production PostgreSQL Database Schema

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INT NOT NULL,
    gender VARCHAR(50),
    height_cm NUMERIC(5,2),
    weight_kg NUMERIC(5,2),
    occupation VARCHAR(255),
    tinnitus_pitch_hz INT DEFAULT 4200,
    tinnitus_loudness_db INT DEFAULT 45,
    primary_ear VARCHAR(20) DEFAULT 'Bilateral'
);

CREATE TABLE doctors (
    id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    hospital_name VARCHAR(255)
);

CREATE TABLE hearing_tests (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    speech_discrimination_pct NUMERIC(5,2),
    tympanometry_type VARCHAR(20)
);

CREATE TABLE audiograms (
    id VARCHAR(36) PRIMARY KEY,
    hearing_test_id VARCHAR(36) REFERENCES hearing_tests(id) ON DELETE CASCADE,
    frequency_hz INT NOT NULL,
    left_ear_db INT NOT NULL,
    right_ear_db INT NOT NULL
);

CREATE TABLE symptoms (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    thi_score INT NOT NULL,
    vas_score NUMERIC(3,1) NOT NULL,
    ringing_frequency_hz INT,
    loudness_db INT,
    affected_ear VARCHAR(20),
    stress_level INT,
    sleep_difficulty INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessments (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    recovery_score INT DEFAULT 85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_predictions (
    id VARCHAR(36) PRIMARY KEY,
    assessment_id VARCHAR(36) REFERENCES assessments(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    shap_feature_importance JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE therapy_sessions (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    sound_type VARCHAR(100) NOT NULL,
    notch_frequency_hz INT,
    duration_minutes INT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE game_scores (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    game_id VARCHAR(36) REFERENCES games(id) ON DELETE CASCADE,
    score INT NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monitoring_logs (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    sleep_hours NUMERIC(3,1),
    stress_level INT,
    headphone_hours NUMERIC(3,1),
    water_intake_oz INT,
    medication_taken BOOLEAN DEFAULT TRUE
);

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL,
    pdf_url VARCHAR(500),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(36) REFERENCES doctors(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled'
);

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
