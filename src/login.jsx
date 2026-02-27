import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, LogIn, Handshake, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://localhost:7244/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password');
      }

      // حفظ بيانات المستخدم 
      const userData = {
        name: data.user?.name || data.user?.username || data.name || data.username || formData.username,
        email: data.user?.email || data.email,
        username: data.user?.username || data.username || formData.username,
        profilePicture: data.user?.profilePicture || data.profilePicture || null,
        id: data.user?.id || data.id
      };

      console.log("Saved User Data:", userData);

      login(userData, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || 'فشل تسجيل الدخول. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        
        {/* Subtle Rings in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-emerald-200/20 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-0 w-96 h-96 border border-teal-200/15 rounded-full animate-ping-slow animation-delay-2000"></div>
          <div className="absolute inset-0 w-96 h-96 border border-cyan-200/10 rounded-full animate-ping-slow animation-delay-4000"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-15 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/2 w-2.5 h-2.5 bg-emerald-300 rounded-full opacity-10 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-emerald-500 rounded-full opacity-25 animate-float animation-delay-3000"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-teal-500 rounded-full opacity-20 animate-float animation-delay-1500"></div>
        
        {/* Subtle Gradient Spots */}
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-emerald-200/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/5 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        
        {/* Gradient Orbs in Corners */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-200/10 to-emerald-200/10 rounded-full blur-2xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center gap-4 cursor-pointer group mb-4"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                <div className="relative">
                  <Handshake className="w-8 h-8 text-white" strokeWidth={2.5} />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Participate
                </span>
                {' & '}
                <span className="text-slate-700">Make</span>
              </h1>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600">
                A CHANGE
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">مرحباً بعودتك</h2>
          <p className="text-slate-600">سجل دخولك للمتابعة</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-4 animate-fadeIn">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-800">🎉 تم تسجيل الدخول بنجاح!</h3>
                <p className="text-sm text-emerald-700">جاري التوجيه...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 animate-fadeIn">
            <div className="flex items-center gap-3 justify-center">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <p className="text-rose-700 font-semibold text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200">
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">
                اسم المستخدم *
              </label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                  placeholder="أدخل اسم المستخدم"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-12 pl-12 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                  placeholder="أدخل كلمة المرور"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                loading || success
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري تسجيل الدخول...
                </>
              ) : success ? (
                <>
                  <Check className="w-6 h-6" />
                  تم التسجيل ✓
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  تسجيل الدخول
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                ليس لديك حساب؟{' '}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>←</span>
                العودة للرئيسية
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.5;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animate-float {
          animation: float 15s infinite ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 6s infinite ease-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;