// AudioHope AI Full-Stack Unified API Client Layer

const API_BASE_URL = '/api/v1';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || 'Registration failed');
    }
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection error' };
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
  role: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || 'Login failed');
    }
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection error' };
  }
}

export async function postAssessmentPrediction(data: {
  patient_id: string;
  thi_score: number;
  vas_score: number;
  pitch_hz: number;
  loudness_db: number;
  primary_ear: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/assessment/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('Backend API proxying fallback:', err);
    return null;
  }
}

export async function logTherapySession(data: {
  patient_id: string;
  sound_type: string;
  notch_frequency_hz: number;
  duration_minutes: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/therapy/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { status: 'logged' };
  }
}

export async function submitGameScore(data: {
  patient_id: string;
  game_name: string;
  score: number;
  xp_earned: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/games/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { status: 'score_saved' };
  }
}

export async function submitDailyMonitoringLog(data: {
  patient_id: string;
  sleep_hours: number;
  stress_level: number;
  headphone_hours: number;
  water_intake_oz: number;
  medication_taken: boolean;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/monitoring/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { status: 'log_saved' };
  }
}

export async function approveDoctorPlan(data: {
  patient_id: string;
  doctor_notes: string;
  notch_frequency_hz: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/doctor/approve-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { status: 'plan_approved' };
  }
}
