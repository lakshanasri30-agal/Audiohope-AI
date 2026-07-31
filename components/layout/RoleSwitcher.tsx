'use client';

import React from 'react';
import { useAppStore, UserRole } from '@/lib/store';
import { User, Stethoscope, ShieldCheck, Sun, Moon } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, isDarkMode, toggleDarkMode, user } = useAppStore();

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'patient', label: 'Patient Portal', icon: <User className="w-4 h-4" />, color: 'from-cyan-500 to-blue-600' },
    { key: 'doctor', label: 'Audiologist / ENT', icon: <Stethoscope className="w-4 h-4" />, color: 'from-teal-500 to-emerald-600' },
    { key: 'admin', label: 'Admin Console', icon: <ShieldCheck className="w-4 h-4" />, color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
      <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-full border border-slate-800/80">
        {roles.map((r) => {
          const isActive = role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${r.color} text-white shadow-md shadow-cyan-500/20`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {r.icon}
              <span className="hidden md:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
        title="Toggle Theme Mode"
      >
        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
      </button>

      <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3 pr-2">
        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full ring-2 ring-cyan-500/40" />
        <div className="text-left leading-tight">
          <p className="text-xs font-semibold text-white">{user.name}</p>
          <p className="text-[10px] text-cyan-400 capitalize">{role}</p>
        </div>
      </div>
    </div>
  );
};
