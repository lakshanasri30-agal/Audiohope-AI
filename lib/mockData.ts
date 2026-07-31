export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  primaryEar: 'Left' | 'Right' | 'Bilateral';
  tinnitusPitchHz: number;
  tinnitusLoudnessDb: number;
  thiScore: number; // Tinnitus Handicap Inventory 0-100
  vasScore: number; // Visual Analog Scale 0-10
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Extreme';
  confidenceScore: number; // e.g. 94%
  riskLevel: 'Low' | 'Medium' | 'High';
  recoveryScore: number; // 0-100
  doctorNotes?: string;
  status: 'Needs Review' | 'Plan Approved' | 'Re-evaluating';
  lastAssessmentDate: string;
  shapFactors: { name: string; impact: number; description: string }[];
}

export const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: 'PAT-8921',
    name: 'Alex Mercer',
    age: 38,
    gender: 'Male',
    occupation: 'Audio Engineer / Software Dev',
    primaryEar: 'Bilateral',
    tinnitusPitchHz: 4200,
    tinnitusLoudnessDb: 45,
    thiScore: 48,
    vasScore: 6.5,
    severity: 'Moderate',
    confidenceScore: 94,
    riskLevel: 'Medium',
    recoveryScore: 85,
    status: 'Plan Approved',
    lastAssessmentDate: '2026-07-28',
    doctorNotes: 'Notched sound therapy adjusted to 4.2kHz target. Patient responds well to 20-min daily pink noise sessions.',
    shapFactors: [
      { name: 'High Frequency Hearing Loss', impact: 0.38, description: 'Notch at 4kHz - 8kHz threshold' },
      { name: 'Elevated Occupational Stress', impact: 0.24, description: 'Cortisol level spike & screen time' },
      { name: 'Sleep Fragmentation', impact: 0.18, description: 'Avg 5.8h deep sleep efficiency' },
      { name: 'Acoustic Overexposure', impact: 0.12, description: 'Headphone usage > 4.5h/day' },
      { name: 'Duration & Sensitization', impact: 0.08, description: 'Intermittent symptom history > 12 mos' },
    ],
  },
  {
    id: 'PAT-4309',
    name: 'Eleanor Vance',
    age: 52,
    gender: 'Female',
    occupation: 'High School Principal',
    primaryEar: 'Left',
    tinnitusPitchHz: 6000,
    tinnitusLoudnessDb: 58,
    thiScore: 64,
    vasScore: 7.8,
    severity: 'Severe',
    confidenceScore: 91,
    riskLevel: 'High',
    recoveryScore: 68,
    status: 'Needs Review',
    lastAssessmentDate: '2026-07-30',
    doctorNotes: 'Pending approval for CBT guidance integration and custom frequency matching therapy.',
    shapFactors: [
      { name: 'Left Ear Unilateral Hearing Loss', impact: 0.42, description: '25dB drop at 6kHz' },
      { name: 'High Anxiety Index', impact: 0.28, description: 'Elevated VAS stress score (8.2)' },
      { name: 'Chronic Sleep Deficit', impact: 0.20, description: '< 5 hours per night' },
      { name: 'Caffeine / Stimulant Intake', impact: 0.10, description: 'High coffee intake logged' },
    ],
  },
  {
    id: 'PAT-1102',
    name: 'Marcus Brody',
    age: 29,
    gender: 'Male',
    occupation: 'Musician / Concert Tech',
    primaryEar: 'Right',
    tinnitusPitchHz: 3200,
    tinnitusLoudnessDb: 35,
    thiScore: 28,
    vasScore: 4.0,
    severity: 'Mild',
    confidenceScore: 96,
    riskLevel: 'Low',
    recoveryScore: 92,
    status: 'Plan Approved',
    lastAssessmentDate: '2026-07-29',
    doctorNotes: 'Excellent adherence to noise masking games and acoustic ear protection.',
    shapFactors: [
      { name: 'Acute Concert Overexposure', impact: 0.45, description: 'Peak 98 dB exposure event' },
      { name: 'Low Sleep Stress Impact', impact: 0.20, description: 'Good sleep recovery' },
      { name: 'Transient Tinnitus', impact: 0.35, description: 'Early stage interventions working' },
    ],
  },
];

export const MOCK_AUDIOGRAM_DATA = [
  { freq: 250, left: 15, right: 10, normal: 20 },
  { freq: 500, left: 15, right: 15, normal: 20 },
  { freq: 1000, left: 20, right: 15, normal: 20 },
  { freq: 2000, left: 25, right: 20, normal: 20 },
  { freq: 4000, left: 45, right: 40, normal: 20 },
  { freq: 6000, left: 55, right: 50, normal: 20 },
  { freq: 8000, left: 60, right: 55, normal: 20 },
];

export const MOCK_WEEKLY_TRENDS = [
  { day: 'Mon', hearingScore: 72, sleepHours: 6.5, stress: 6, therapyMins: 20 },
  { day: 'Tue', hearingScore: 75, sleepHours: 7.0, stress: 5, therapyMins: 25 },
  { day: 'Wed', hearingScore: 74, sleepHours: 6.8, stress: 6, therapyMins: 15 },
  { day: 'Thu', hearingScore: 79, sleepHours: 7.5, stress: 4, therapyMins: 30 },
  { day: 'Fri', hearingScore: 82, sleepHours: 8.0, stress: 3, therapyMins: 30 },
  { day: 'Sat', hearingScore: 85, sleepHours: 8.2, stress: 2, therapyMins: 40 },
  { day: 'Sun', hearingScore: 84, sleepHours: 7.8, stress: 3, therapyMins: 35 },
];

export const MOCK_AI_MODELS = [
  { id: 'm1', name: 'Random Forest Severity Classifier', version: 'v2.4', accuracy: '94.2%', precision: '93.8%', status: 'Active (Primary)', target: 'THI Severity Level' },
  { id: 'm2', name: 'XGBoost Risk Prognostics Engine', version: 'v1.9', accuracy: '95.1%', precision: '94.7%', status: 'Active (Ensemble)', target: '30-Day Worsening Risk' },
  { id: 'm3', name: 'CNN Audiogram Pattern Extractor', version: 'v3.1', accuracy: '91.8%', precision: '92.0%', status: 'Active (Computer Vision)', target: 'Notch Feature Extractor' },
  { id: 'm4', name: 'LSTM Acoustic Symptom Predictor', version: 'v1.2', accuracy: '89.6%', precision: '88.9%', status: 'Testing (Beta)', target: 'Time-series Tinnitus Flare-ups' },
];

export const MOCK_SYSTEM_LOGS = [
  { id: 'l1', timestamp: '2026-07-31 17:42:01', user: 'Dr. Sarah Jenkins', action: 'Approved Rehabilitation Plan', ip: '192.168.1.104', status: 'Success' },
  { id: 'l2', timestamp: '2026-07-31 16:15:33', user: 'Alex Mercer', action: 'Completed THI Assessment & Audiogram', ip: '10.0.0.12', status: 'Success' },
  { id: 'l3', timestamp: '2026-07-31 14:02:11', user: 'System AI Engine', action: 'Generated High Noise Alert (84 dB)', ip: 'Internal', status: 'Triggered' },
  { id: 'l4', timestamp: '2026-07-31 11:20:45', user: 'Admin User', action: 'Updated XGBoost Model Weights', ip: '192.168.1.1', status: 'Success' },
];
