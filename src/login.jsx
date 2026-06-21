import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, LogIn, HeartHandshake, AlertCircle, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import { ButtonSkeleton } from './components/Skeleton';

const API_BASE_URL = 'https://yousefalhamad-001-site1.ltempurl.com/api';

// ─── Shared input class ───────────────────────────────────────────────────────
const INPUT = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── All state identical to original ──────────────────────────────────────
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  // ── handleSubmit identical to original ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/Login User`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid username or password');
      }

      const data = await response.json();
      console.log('API Response:', data);

      const isActive = data.user?.isActive ?? data.isActive;
      if (isActive === 0) {
        setError('حسابك محظور حالياً. تواصل مع الإدارة لمزيد من المعلومات.');
        setLoading(false);
        setTimeout(() => navigate('/blocked'), 2000);
        return;
      }

    const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
const userID = parseInt(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

const userData = {
  name: data.user?.name || data.user?.username || data.name || data.username || formData.username,
  email: data.user?.email || data.email,
  username: data.user?.username || data.username || formData.username,
  profilePicture: data.user?.profilePicture || data.profilePicture || null,
  id: data.user?.id || data.id,
  userID: userID,
  isActive: data.user?.isActive ?? data.isActive,
  creationDate: data.user?.creationDate || data.creationDate,
};

      console.log('Saved User Data:', userData);
      login(userData, { accessToken: data.accessToken, refreshToken: data.refreshToken });

      setSuccess(true);
      setTimeout(() => {
        if (!window.location.pathname.startsWith('/admin')) navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'فشل تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4" dir="rtl">

      {/* ── Decorative background ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-[500px] rounded-full border border-emerald-200/20 animate-ping" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0 size-[500px] rounded-full border border-teal-200/15 animate-ping" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <button onClick={() => navigate('/')} className="group flex items-center gap-3">
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <HeartHandshake className="size-7 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-amber-400 ring-2 ring-white" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl font-black text-slate-900">
                <span className="text-emerald-600">شارك</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">وأحدث فرقاً</span>
            </span>
          </button>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900">مرحباً بعودتك 👋</h2>
            <p className="mt-1 text-sm text-slate-500">سجّل دخولك للمتابعة</p>
          </div>
        </div>

        {/* ── Alerts ───────────────────────────────────────────────────── */}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600">
              <Check className="size-5 text-white" />
            </span>
            <div>
              <p className="font-bold text-emerald-800">🎉 تم تسجيل الدخول بنجاح!</p>
              <p className="text-xs text-emerald-600">جاري التوجيه...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle className="size-5 shrink-0 text-red-500" />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* ── Form card ────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-emerald-600 px-6 py-4">
            <h3 className="font-black text-white">تسجيل الدخول</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Username */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input type="text" required disabled={loading}
                  value={formData.username} placeholder="أدخل اسم المستخدم"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`${INPUT} pr-10`} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} required disabled={loading}
                  value={formData.password} placeholder="أدخل كلمة المرور"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${INPUT} pr-10 pl-11`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600">
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-start">
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (
                <><ButtonSkeleton /> جاري تسجيل الدخول...</>
              ) : success ? (
                <><Check className="size-5" /> تم التسجيل ✓</>
              ) : (
                <><LogIn className="size-5" /> تسجيل الدخول</>
              )}
            </button>

            {/* Register link */}
            <div className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>

            {/* Back home */}
            <div className="text-center">
              <button type="button" onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-600">
                <ArrowLeft className="size-3.5 rotate-180" /> العودة للرئيسية
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;