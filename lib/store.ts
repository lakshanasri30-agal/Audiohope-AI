import { create } from 'zustand';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  age?: number;
  gender?: string;
  tinnitusPitchHz?: number;
  tinnitusLoudnessDb?: number;
  tinnitusSeverity?: 'Mild' | 'Moderate' | 'Severe' | 'Extreme';
  confidenceScore?: number;
  healthScore?: number;
  hearingScore?: number;
  recoveryScore?: number;
}

export interface SoundTherapyState {
  isPlaying: boolean;
  activeSound: string; // 'white', 'pink', 'brown', 'ocean', 'rain', 'forest', 'wind', 'notch_masking'
  volume: number; // 0 to 100
  notchFrequency: number; // Hz (e.g. 4000)
  timerMinutes: number; // remaining minutes
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'morning' | 'afternoon' | 'evening' | 'night' | 'alert';
  read: boolean;
  category: 'water' | 'noise' | 'sleep' | 'therapy' | 'medication' | 'game' | 'general';
}

interface AppStore {
  // Auth & Profile State
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setUser: (user: Partial<UserProfile>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Sound Therapy State
  soundState: SoundTherapyState;
  setSoundState: (state: Partial<SoundTherapyState>) => void;
  togglePlaySound: () => void;

  // Gamification & Progress State
  userPoints: number;
  userLevel: number;
  unlockedAchievements: string[];
  addGamePoints: (pts: number) => void;

  // Notifications
  notifications: SmartNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<SmartNotification, 'id' | 'read'>) => void;

  // Patient Log state
  dailyLogs: {
    waterIntakeOz: number;
    sleepHours: number;
    stressLevel: number; // 1-10
    headphoneHours: number;
    medicationTaken: boolean;
  };
  updateDailyLogs: (logs: Partial<AppStore['dailyLogs']>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: {
    id: 'usr_pat_101',
    name: 'Alex Mercer',
    email: 'alex.mercer@AudioHope.ai',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    age: 38,
    gender: 'Male',
    tinnitusPitchHz: 4200,
    tinnitusLoudnessDb: 45,
    tinnitusSeverity: 'Moderate',
    confidenceScore: 94,
    healthScore: 82,
    hearingScore: 78,
    recoveryScore: 85,
  },
  role: 'patient',
  setRole: (role) => set((state) => ({ role, user: { ...state.user, role } })),
  setUser: (updatedUser) => set((state) => ({ user: { ...state.user, ...updatedUser } })),
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  soundState: {
    isPlaying: false,
    activeSound: 'notch_masking',
    volume: 65,
    notchFrequency: 4200,
    timerMinutes: 20,
  },
  setSoundState: (partial) => set((state) => ({ soundState: { ...state.soundState, ...partial } })),
  togglePlaySound: () => set((state) => ({ soundState: { ...state.soundState, isPlaying: !state.soundState.isPlaying } })),

  userPoints: 1450,
  userLevel: 4,
  unlockedAchievements: ['First Assessment', 'Sound Explorer', '7-Day Streak', 'Frequency Master'],
  addGamePoints: (pts) => set((state) => ({ userPoints: state.userPoints + pts, userLevel: Math.floor((state.userPoints + pts) / 400) + 1 })),

  notifications: [
    {
      id: 'n1',
      title: 'Morning Assessment',
      message: 'Good Morning Alex! Complete today\'s 2-minute tinnitus log.',
      time: '08:00 AM',
      type: 'morning',
      read: false,
      category: 'therapy',
    },
    {
      id: 'n2',
      title: 'High Noise Exposure Warning',
      message: 'Environmental noise reached 84 dB for over 30 minutes in city commute.',
      time: '01:15 PM',
      type: 'alert',
      read: false,
      category: 'noise',
    },
    {
      id: 'n3',
      title: 'Adaptive Sound Session Ready',
      message: 'Your 4200 Hz notched pink noise session is recommended before sleep.',
      time: '07:30 PM',
      type: 'evening',
      read: true,
      category: 'therapy',
    },
    {
      id: 'n4',
      title: 'Hydration & Break Reminder',
      message: 'Drink 250ml of water and rest headphones for 15 mins.',
      time: '03:40 PM',
      type: 'afternoon',
      read: true,
      category: 'water',
    },
  ],
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        { ...notif, id: `n_${Date.now()}`, read: false },
        ...state.notifications,
      ],
    })),

  dailyLogs: {
    waterIntakeOz: 64,
    sleepHours: 7.2,
    stressLevel: 4,
    headphoneHours: 2.5,
    medicationTaken: true,
  },
  updateDailyLogs: (logs) => set((state) => ({ dailyLogs: { ...state.dailyLogs, ...logs } })),
}));
