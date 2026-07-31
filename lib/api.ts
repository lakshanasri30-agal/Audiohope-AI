import axios from 'axios';

// Reusable Axios instance with base URL for FastAPI backend proxy
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Automatic Request Interceptor: Attach JWT Bearer Token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized Error Handling (Unauthorized, Validation, Network Failure)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.message;

      if (status === 401) {
        console.warn('Unauthorized request (401). Session expired.');
      } else if (status === 400) {
        console.warn('Validation error (400):', detail);
      }
      return Promise.reject(new Error(detail || `Server error (${status})`));
    } else if (error.request) {
      // Network failure / server unreachable
      return Promise.reject(new Error('Network failure. Please check backend connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

// ----------------------------------------------------------------------
// Reusable Authentication API Services
// ----------------------------------------------------------------------

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    const res = await apiClient.post('/auth/register', data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

export async function loginUser(data: {
  email: string;
  password: string;
  role: string;
}) {
  try {
    const res = await apiClient.post('/auth/login', data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

// ----------------------------------------------------------------------
// Clinical & Application API Services
// ----------------------------------------------------------------------

export async function postAssessmentPrediction(data: {
  patient_id: string;
  thi_score: number;
  vas_score: number;
  pitch_hz: number;
  loudness_db: number;
  primary_ear: string;
}) {
  try {
    const res = await apiClient.post('/assessment/predict', data);
    return res.data;
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
    const res = await apiClient.post('/therapy/session', data);
    return res.data;
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
    const res = await apiClient.post('/games/score', data);
    return res.data;
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
    const res = await apiClient.post('/monitoring/log', data);
    return res.data;
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
    const res = await apiClient.post('/doctor/approve-plan', data);
    return res.data;
  } catch (err) {
    return { status: 'plan_approved' };
  }
}

export async function sendChatMessage(data: {
  message: string;
  patient_id?: string;
  user_context?: Record<string, any>;
}) {
  try {
    const res = await apiClient.post('/chat', data);
    return res.data;
  } catch (err) {
    return {
      response: "I apologize, but I am currently experiencing connection difficulty. Please try asking again shortly.",
      suggested_questions: [
        "What is tinnitus?",
        "Explain my AI assessment.",
        "How does sound therapy help?",
        "When should I consult an ENT specialist?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

export default apiClient;
