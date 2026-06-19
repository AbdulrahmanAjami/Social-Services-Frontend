import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from './api';
import { useAuth } from './AuthContext';

const VolunteerRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [proofImages, setProofImages] = useState([]);
  const [description, setDescription] = useState('');

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const handleRegister = async () => {
  if (!user) { navigate('/login'); return; }
  if (!idImage) { setError('يرجى رفع صورة الهوية'); return; }
  if (proofImages.length === 0) { setError('يرجى رفع صور إثبات التطوع'); return; }

  setLoading(true);
  setError('');
  setSuccess(false);
  try {
    
const formData = new FormData();
formData.append('Data.Description', description || 'test');formData.append('GovernmentID', idImage);
proofImages.forEach((file) => {
      formData.append('VolunteerImages', file);
    });

await api.post('/Volunteer/Issue Volunteer Request', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

    setSuccess(true);
    setTimeout(() => navigate('/posts'), 2000);
  } catch (err) {
    console.log('Validation errors:', err.response?.data?.errors);
    const errData = err.response?.data;
    const message = typeof errData === 'string' ? errData :
      errData?.message || errData?.title || err.message || 'فشل في التسجيل كمتطوع';
    setError(message);
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
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/posts')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          العودة للخدمات
        </button>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-slate-200">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-xl opacity-40"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-500 shadow-2xl">
                <HeartHandshake className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-slate-800 mb-4 text-center">
            سجل كمتطوع
          </h1>

          {/* Description */}
          <div className="mb-8 space-y-4">
            <p className="text-slate-600 text-lg leading-relaxed text-center">
              كمتطوع، يمكنك المساهمة في خدمة مجتمعك من خلال:
            </p>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>التطوع في الفرص المتاحة في منطقتك</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>مساعدة الآخرين وبناء علاقات إيجابية</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>اكتساب خبرات ومهارات جديدة</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>المساهمة في إحداث فرق حقيقي في المجتمع</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}



          {error && (
            <div className="mb-6 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <p className="text-rose-700 font-semibold text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-emerald-700 font-semibold text-sm">تم التسجيل بنجاح! جاري التوجيه...</p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5 mb-6">
            {/* ID Image */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                صورة الهوية <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIdImage(e.target.files[0])}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {idImage && (
                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                  ✓ تم اختيار: {idImage.name}
                </p>
              )}
            </div>

            {/* Proof Images */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                صور إثبات التطوع
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setProofImages([...e.target.files])}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {proofImages.length > 0 && (
                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                  ✓ تم اختيار {proofImages.length} {proofImages.length === 1 ? 'صورة' : 'صور'}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                نبذة عنك (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً مختصراً عن نفسك..."
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none"
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading || success}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري التسجيل...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-6 h-6" />
                تم التسجيل ✓
              </>
            ) : (
              <>
                <HeartHandshake className="w-6 h-6" />
                سجل كمتطوع
              </>
            )}
          </button>

          {/* Note */}
          <p className="mt-6 text-center text-slate-500 text-sm">
            بالتسجيل كمتطوع، يمكنك التقديم على جميع الفرص التطوعية المتاحة
          </p>
        </div>
      </div>

      <style>{`
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

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 6s infinite ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default VolunteerRegister;
