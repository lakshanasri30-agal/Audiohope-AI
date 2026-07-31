# AudioHope AI - Modern AI Tinnitus Assessment & Rehabilitation Platform

AudioHope AI is a modern, responsive, production-ready full-stack healthcare application designed to help patients assess, monitor, and manage tinnitus using Artificial Intelligence while assisting audiologists and ENT specialists with data-driven clinical decision support.

The platform combines design aesthetics inspired by **Apple Health**, **Fitbit**, and **Headspace**, featuring glassmorphism cards, animated progress rings, real-time Web Audio API sound synthesis, 5 interactive gamified auditory retraining modules, and Explainable AI (XAI) feature importance drivers.

---

## 🌟 Key Features & Clinical Workflows

### 1. Multi-Role Portal Experience
- **Patient Portal**: Daily health & hearing score rings, notched sound therapy player, 5 playable auditory games, continuous monitoring logs, and weekly AI progress reports.
- **Audiologist / ENT Specialist Portal**: Clinical patient roster sorted by risk, pure tone audiogram curve visualizer, AI prediction reviews, rehab plan approvals, and progress notes editor.
- **Administrator Console**: Real-time ML inference metrics (Random Forest v2.4, XGBoost v1.9, CNN Audiogram v3.1, LSTM Time-Series), user/doctor directories, and HIPAA security audit logs.
- **Instant Role Switcher**: Top navigation bar component allows instant switching between Patient, Doctor, and Admin views without re-authenticating.

### 2. Live Web Audio API Sound Therapy Engine
- Procedural sound synthesis directly inside the browser using HTML5 Web Audio API:
  - **White Noise**, **Pink Noise**, **Brown Noise**, **Ocean Waves (LFO)**, **Rainfall**, **Forest Harmonics**, and **Wind**.
  - **Personalized Frequency Masking**: Bandpass notched sound centered dynamically at the patient's tinnitus frequency (e.g. 4,200 Hz).
  - Volume, Notch Frequency, Timer (15m, 20m, 30m, 45m, 60m) controls with real-time waveform visualizers.

### 3. 5 Playable Hearing Rehabilitation Games
1. **Frequency Matching**: Match synthetic pure tones to target pitch.
2. **Stereo Sound Localization**: Directional audio origin (Left, Center, Right) response challenge.
3. **Mask The Ringing**: Notch filter frequency alignment puzzle.
4. **Auditory Memory Sequence**: Simon Says-style pitch sequence memory game.
5. **High-Frequency Reaction Test**: Rapid response auditory chime speed challenge.
- *Includes scoring, level progression, streak tracking, and achievement badges.*

### 4. AI Diagnostic & Explainable AI (XAI) Engine
- Pure Tone Audiogram plotter (250Hz - 8000Hz) with clinical dB HL inverted scale.
- Tinnitus Handicap Inventory (THI) & Visual Analog Scale (VAS 0-10) scoring.
- **Explainable AI (XAI)**: SHAP-style visual feature contribution weights (Audiometric notch impact, stress markers, sleep deficit, headphone exposure) with confidence percentages.

### 5. Clinical Reports & PDF Export
- Formatted medical report generator with patient demographics, AI severity ratings, therapy adherence, audiogram curves, and downloadable/printable PDF output.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Zustand, Lucide Icons.
- **Audio Synthesizer**: HTML5 Web Audio API (`AudioContext`, `BiquadFilterNode`, `AudioBufferSourceNode`, `GainNode`, `OscillatorNode`).
- **Backend API**: Python FastAPI, Pydantic, SQLAlchemy ORM.
- **Database**: PostgreSQL schema (`backend/schema.sql`).
- **Machine Learning**: Scikit-Learn (Random Forest), XGBoost, NumPy.
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start Guide

### 1. Install & Run Next.js Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 2. Run FastAPI Backend
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```
API Documentation (Swagger UI) will be available at `http://localhost:8000/docs`.

---

## ⚕️ Medical Disclaimer
*AudioHope AI provides clinical decision support and rehabilitation guidance designed to complement professional medical care. All AI outputs are intended to assist patients and clinicians and do not replace formal diagnosis or treatment by an ENT specialist or audiologist.*
