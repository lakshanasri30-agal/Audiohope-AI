import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.schemas import ChatMessageSchema, ChatResponseSchema
from backend.models.models import Patient, Assessment, User

router = APIRouter(prefix="/api/v1", tags=["AI Chatbot"])

AI_API_KEY = os.getenv("AI_API_KEY", "")

DEFAULT_SUGGESTIONS = [
    "What is tinnitus?",
    "Explain my AI assessment.",
    "How does cochlea damage affect hearing?",
    "Explain hair cells & auditory nerve role.",
    "How does sound therapy help?",
    "What are rehabilitation games?",
    "When should I consult an ENT specialist?",
]

SYSTEM_PROMPT_EMPHASIS = """
You are the AudioHope AI Health Assistant for tinnitus management.
Guidelines:
- Be empathetic, encouraging, and evidence-based.
- Explain medical terms simply (THI = Tinnitus Handicap Index, VAS = Visual Analog Scale, Cochlea, Auditory Nerve, Stereocilia Hair Cells).
- Always include a disclaimer that you are an assistive educational tool, not a doctor.
- NEVER diagnose medical conditions, prescribe medications, or guarantee recovery.
- If asked 'Can you diagnose me?', explicitly answer:
  'I can provide general educational information and help you understand your assessment results, but I cannot diagnose medical conditions. Please consult a qualified Audiologist or ENT specialist for diagnosis.'
"""

@router.post("/chat", response_model=ChatResponseSchema)
def chat_endpoint(data: ChatMessageSchema, db: Session = Depends(get_db)):
    user_msg = data.message.strip()
    msg_lower = user_msg.lower()
    
    # 1. Safety check for direct diagnosis questions
    if "can you diagnose me" in msg_lower or "diagnose my" in msg_lower or "cure my tinnitus" in msg_lower:
        response_text = (
            "I can provide general educational information and help you understand your assessment results, "
            "but I cannot diagnose medical conditions. Please consult a qualified Audiologist or ENT specialist for diagnosis."
        )
        return {
            "response": response_text,
            "suggested_questions": DEFAULT_SUGGESTIONS[:4],
            "timestamp": datetime.now().strftime("%I:%M %p"),
        }

    # Extract user details for personalization if provided
    context = data.user_context or {}
    patient_name = context.get("name", "there")
    recovery_score = context.get("recoveryScore", 85)
    health_score = context.get("healthScore", 82)
    severity = context.get("tinnitusSeverity", "Moderate")
    pitch_hz = context.get("tinnitusPitchHz", 4200)

    # 2. Intelligent Personalized Response Generation
    if "cochlea" in msg_lower or "hair cell" in msg_lower or "nerve" in msg_lower or "anatomy" in msg_lower:
        response_text = (
            f"Hi {patient_name}! Here is how ear anatomy and neural pathways contribute to tinnitus:\n\n"
            "• **Cochlea**: Spiral fluid organ. Damage to microscopic hair cells deprives the brain of normal sound input, triggering hyperactive neural signaling.\n"
            "• **Hair Cells (Stereocilia)**: Convert sound vibrations into electrical impulses. Prolonged loud noise (>85dB) damages these delicate sensors.\n"
            "• **Auditory Nerve**: Transmits signals to the brainstem. Abnormal nerve firing leads the central brainstem to increase internal volume gain, perceiving phantom ringing."
        )
    elif "what is tinnitus" in msg_lower or "causes" in msg_lower:
        response_text = (
            f"Hi {patient_name}! Tinnitus is the perception of sound—such as ringing, buzzing, or hissing—when no external acoustic source is present. "
            "It is commonly triggered by sound overexposure, stress, or age-related hair cell changes. "
            "With adaptive notch sound therapy and auditory retraining games, many individuals achieve significant habituation."
        )
    elif "explain my ai assessment" in msg_lower or "thi" in msg_lower or "vas" in msg_lower or "severity" in msg_lower:
        response_text = (
            f"Hello {patient_name}, your current AI Assessment indicates a **{severity}** severity profile with a target pitch near **{pitch_hz} Hz**.\n\n"
            "• **THI (Tinnitus Handicap Index)**: Measures emotional & functional impact (0-100 scale).\n"
            "• **VAS (Visual Analog Scale)**: Quantifies daily loudness and stress perception (1-10 scale).\n"
            f"Your current **Recovery Score is {recovery_score}%**. Maintaining consistent daily therapy and healthy sleep supports ongoing habituation."
        )
    elif "sound therapy" in msg_lower or "notch" in msg_lower:
        response_text = (
            f"Hi {patient_name}, Notched Sound Therapy works by removing (notching out) frequencies around your specific tinnitus pitch (**{pitch_hz} Hz**).\n\n"
            "Listening to customized pink or white noise for 20 minutes daily helps inhibit hyperactive auditory neurons in your brain, lowering perception over time."
        )
    elif "games" in msg_lower or "rehab" in msg_lower:
        response_text = (
            "Auditory Rehabilitation Games engage your brain's neuroplasticity! "
            "By practicing Pitch Matching, Sound Localization, and Notch Filtering, you retrain your auditory cortex to filter out tinnitus signals while building XP points."
        )
    elif "sleep" in msg_lower or "stress" in msg_lower:
        response_text = (
            f"Hi {patient_name}, sleep and stress directly influence tinnitus perception:\n\n"
            "1. **Sleep Hygiene**: Use ocean ambient masking sounds at bedtime and aim for 7.5+ hours.\n"
            "2. **Stress Reduction**: High cortisol levels heighten auditory sensitivity. Practice 5-minute deep breathing exercises daily.\n"
            f"Your current Health Score is **{health_score}**."
        )
    elif "ent" in msg_lower or "consult" in msg_lower or "doctor" in msg_lower:
        response_text = (
            "You should consult an ENT specialist or Audiologist if you experience:\n"
            "• Sudden onset or one-sided (unilateral) tinnitus\n"
            "• Dizziness or vertigo\n"
            "• Pulsatile tinnitus (hearing your heartbeat)\n\n"
            "AudioHope AI supports your clinical care plan, but an in-person audiometric evaluation is always recommended."
        )
    elif "audiohope" in msg_lower or "how does" in msg_lower:
        response_text = (
            "AudioHope AI is a digital therapeutic platform combining:\n"
            "1. **9-Step Clinical Assessment**: Multi-parametric diagnostic analysis.\n"
            "2. **Web Audio Synthesizer**: Customized notched noise masking.\n"
            "3. **HTML5 Rehab Games**: Gamified neuroplasticity retraining.\n"
            "4. **Interactive 3D Ear Model**: Educational anatomy viewer.\n"
            "5. **Explainable AI (XAI)**: Transparent SHAP feature importance breakdown."
        )
    elif "food" in msg_lower or "diet" in msg_lower or "nutrition" in msg_lower:
        response_text = (
            "Dietary choices can support auditory vascular health:\n"
            "• **Magnesium & Zinc**: Found in dark leafy greens, pumpkin seeds, and nuts; supports nerve function.\n"
            "• **Hydration**: Aim for 64+ oz of water daily to maintain inner ear fluid balance.\n"
            "• Limit excessive caffeine, sodium, and high-volume headphone exposure."
        )
    else:
        response_text = (
            f"Hello {patient_name}! 👋 I am here to assist with your AudioHope AI journey.\n\n"
            f"Your active Recovery Score is **{recovery_score}%** (Severity: **{severity}**). "
            "You can ask me about your assessment results, 3D ear anatomy, notched sound therapy settings, rehabilitation games, or healthy lifestyle habits!"
        )

    return {
        "response": response_text,
        "suggested_questions": DEFAULT_SUGGESTIONS,
        "timestamp": datetime.now().strftime("%I:%M %p"),
    }
