'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore, UserRole } from '@/lib/store';
import { loginUser } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { Activity, Mail, Lock, User, ArrowRight, UserPlus, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, setUser } = useAppStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Registration successful! Please sign in with your credentials.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call POST /api/v1/auth/login
      const response = await loginUser({
        email: email.trim(),
        password: password,
        role: selectedRole,
      });

      if (!response.success) {
        setErrorMsg(response.error || 'Invalid email, password, or account role.');
        setIsLoading(false);
        return;
      }

      const { access_token, refresh_token, name, role: userRole, email: userEmail } = response.data;

      // 2. Store JWT & User Info in localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: name,
          role: userRole,
          email: userEmail,
        })
      );

      // 3. Update Zustand Store
      setRole(userRole as UserRole);
      setUser({
        name: name,
        email: userEmail,
        role: userRole as UserRole,
      });

      // 4. Always redirect Patient to /dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-cyan-500 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AudioHope AI Portal</h1>
          <p className="text-xs text-slate-400">Sign in to access your therapeutic workspace</p>
        </div>

        <GlassCard className="border-cyan-500/30 space-y-6">
          {/* Success Banner */}
          {successMsg && (
            <div role="status" className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <input type="hidden" name="role" value="patient" />
            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-slate-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-medium text-slate-300">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-cyan-400 hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-cyan-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In as {selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Switcher */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/auth/register"
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-semibold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Register New Account
            </Link>
          </div>
        </GlassCard>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-sm border-cyan-500/30 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" /> Password Reset Request
            </h3>
            <p className="text-xs text-slate-300">
              Enter your email address to receive a secure password reset link.
            </p>
            <input
              type="email"
              placeholder="e.g. user@audiohope.ai"
              value={resetEmail || email}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Password reset instructions dispatched.');
                  setShowForgotModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
              >
                Send Reset Link
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
