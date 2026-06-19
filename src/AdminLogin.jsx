import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { ButtonSkeleton } from './components/Skeleton';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('adminToken');
        return;
      }
      navigate('/admin/dashboard');
    } catch {
      localStorage.removeItem('adminToken');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/Admin/Login', {
        username: formData.username,
        password: formData.password,
      });

      console.log('Full response data:', response?.data);
      console.log('Token:', response?.data?.Token);

      const responseText = response?.data;
      const token = typeof responseText === 'string'
        ? responseText.replace('Token = ', '').trim()
        : responseText?.Token;

      if (!token) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="text-right mb-4">
          <h1 className="text-2xl font-extrabold text-slate-800">لوحة تحكم المسؤول</h1>
          <p className="text-sm text-slate-500">تسجيل دخول آمن للمسؤولين</p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span className="text-rose-700 font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full pr-4 pl-10 py-2 border rounded-lg border-slate-200 focus:border-emerald-500 outline-none"
                  placeholder="اسم المستخدم"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full pr-4 pl-10 py-2 border rounded-lg border-slate-200 focus:border-emerald-500 outline-none"
                  placeholder="كلمة المرور"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <>
                  <ButtonSkeleton />
                  جاري المتابعة...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
