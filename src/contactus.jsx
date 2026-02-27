import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, 
  Sparkles, 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    
    // محاكاة إرسال النموذج
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'الهاتف',
      value: '0787077828',
      link: 'tel:+96261234567',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@participate.org',
      link: 'mailto:info@participate.org',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'عمّان، الأردن',
      link: 'https://maps.google.com',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  const socialMedia = [
    {
      name: 'Facebook',
      icon: Facebook,
      link: 'https://facebook.com',
      color: 'from-blue-500 to-blue-600',
      username: '@participate'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      link: 'https://instagram.com',
      color: 'from-pink-500 to-purple-600',
      username: '@participate'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      link: 'https://linkedin.com',
      color: 'from-blue-600 to-blue-700',
      username: '@participate'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  <div className="relative">
                    <Handshake className="w-7 h-7 text-white" strokeWidth={2.5} />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    Participate
                  </span>
                  {' & '}
                  <span className="text-slate-200">Make</span>
                </h1>
                <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                  A CHANGE
                </p>
              </div>
            </div>

            {/* Home Button */}
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Page Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
            <MessageCircle className="w-5 h-5" />
            تواصل معنا
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">نحن هنا لمساعدتك</h1>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            لديك سؤال أو استفسار؟ لا تتردد في التواصل معنا وسنكون سعداء بمساعدتك
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black text-slate-800 mb-6">أرسل لنا رسالة</h2>
              
              {success && (
                <div className="mb-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <p className="text-emerald-700 font-bold">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    <p className="text-rose-700 font-bold">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="+962 7X XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    الموضوع (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    الرسالة <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none h-32 resize-none transition-all"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-500 text-sm font-bold mb-1">{info.title}</p>
                        <p className="text-slate-800 text-xl font-black">{info.value}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-6">تابعنا على</h3>
                <div className="space-y-4">
                  {socialMedia.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-2xl p-4 transition-all group"
                      >
                        <div className={`w-14 h-14 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all`}>
                          <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-black text-lg">{social.name}</p>
                          <p className="text-slate-400 text-sm font-semibold">{social.username}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>


          </div>
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

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;