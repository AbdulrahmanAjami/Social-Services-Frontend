import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ShieldX } from 'lucide-react';

const BlockedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        
        {/* Subtle Rings in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-rose-200/20 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-0 w-96 h-96 border border-orange-200/15 rounded-full animate-ping-slow animation-delay-2000"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-slate-200 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-orange-400 to-red-400 rounded-full blur-xl opacity-40"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-rose-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center transform hover:scale-110 transition-all duration-500 shadow-2xl">
                <ShieldX className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            حسابك محظور حالياً
          </h1>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4 bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
              <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <p className="text-rose-700 font-semibold text-right">
                تم تعطيل حسابك من قبل الإدارة
              </p>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              تواصل مع الإدارة لمزيد من المعلومات حول حالة حسابك وكيفية إعادة تفعيله.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white"
            >
              <Home className="w-6 h-6" />
              العودة للرئيسية
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 border-2 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 text-slate-700"
            >
              تواصل مع الإدارة
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            إذا كنت تعتقد أن هذا خطأ، يرجى التواصل معنا عبر صفحة التواصل
          </p>
        </div>
      </div>

      <style jsx>{`
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

export default BlockedPage;
