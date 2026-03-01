import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, 
  Sparkles, 
  Home,
  Target,
  Shield,
  Award,
  Users,
  Heart,
  CheckCircle,
  Send,
  MessageSquare,
  Lightbulb,
  Star,
  TrendingUp,
  Gift,
  Lock,
  FileCheck,
  DollarSign,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const VisionMission = () => {
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!suggestion.name || !suggestion.email || !suggestion.message) {
      setError('الرجاء ملء جميع الحقول');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    
    // محاكاة إرسال الاقتراح
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setSuggestion({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const features = [
    {
      icon: Users,
      title: 'ربط المتطوعين',
      description: 'نربط المتطوعين مع المجموعات التطوعية لخلق تجارب فريدة ومؤثرة في المجتمع',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: FileCheck,
      title: 'شهادات رسمية',
      description: 'نوثق مشاركتك التطوعية بشهادات معتمدة من موقعنا والمجموعات التطوعية',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: DollarSign,
      title: 'خدمات مدفوعة آمنة',
      description: 'نظام دفع آمن يضمن حقوق جميع الأطراف مع إمكانية التحقق من مزودي الخدمات',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: Star,
      title: 'نظام تقييم شامل',
      description: 'راجع تقييمات وتاريخ مزودي الخدمات قبل الاختيار، مع إمكانية تقديم الشكاوى',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'الموثوقية',
      description: 'نضمن لك تجربة آمنة وموثوقة مع جميع الخدمات المقدمة على منصتنا'
    },
    {
      icon: Heart,
      title: 'العطاء',
      description: 'نؤمن بقوة العطاء والتطوع في بناء مجتمع أفضل وأكثر ترابطاً'
    },
    {
      icon: TrendingUp,
      title: 'التطوير المستمر',
      description: 'نسعى دائماً لتحسين خدماتنا بناءً على ملاحظاتكم واقتراحاتكم'
    },
    {
      icon: Gift,
      title: 'الجودة',
      description: 'نقدم أفضل تجربة ممكنة لجميع المستخدمين سواء متطوعين أو طالبي خدمات'
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
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
            <Target className="w-5 h-5" />
            رؤيتنا ورسالتنا
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
            نحو مجتمع
            <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              أكثر عطاءً وتكافلاً
            </span>
          </h1>
          <p className="text-slate-600 text-xl max-w-4xl mx-auto leading-relaxed">
            منصة تربط القلوب بالأفعال، وتحول الرغبة في العطاء إلى واقع ملموس
          </p>
        </div>

        {/* Main Vision Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">رؤيتنا</h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-slate-700">
              <p className="font-semibold text-xl text-slate-800">
                موقع يسعى لربط المتطوع مع المجموعات التطوعية لخلق تجربة تطوعية فريدة ومؤثرة
              </p>
              
              <p>
                نحن نؤمن بأن <span className="font-bold text-emerald-600">التطوع</span> ليس مجرد عمل خيري، بل هو رحلة تحول شخصي وتأثير مجتمعي عميق. 
                لذلك، نوفر لك <span className="font-bold text-teal-600">شهادات رسمية معتمدة</span> من موقعنا ومن المجموعات التطوعية، توثق مشاركتك وتضيف قيمة لسيرتك الذاتية.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200 my-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">خدمات تطوعية مجانية</h3>
                    <p className="text-slate-700">
                      انضم إلى مئات المبادرات التطوعية المتنوعة، وساهم في صنع فرق حقيقي في مجتمعك
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 my-8">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">خدمات مدفوعة آمنة</h3>
                    <p className="text-slate-700">
                      نوفر ميزة <span className="font-bold">الخدمات المدفوعة</span> التي تربط صاحب الخدمة مع مزود الخدمة بشكل احترافي، 
                      مع نظام <span className="font-bold text-amber-600">دفع آمن ومضمون</span> يحفظ حقوق جميع الأطراف
                    </p>
                  </div>
                </div>
              </div>

              <p>
                يمكنك التأكد من <span className="font-bold text-purple-600">مزود الخدمة</span> قبل الموافقة عليه من خلال:
              </p>

              <ul className="space-y-3 mr-6">
                <li className="flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span>زيارة صفحته الشخصية والاطلاع على ملفه الكامل</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <span>مراجعة تقييمه من العملاء السابقين</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span>الاطلاع على الخدمات والمشاريع التي أنجزها سابقاً</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                  <span>إمكانية تقديم شكوى أو تقييم بعد إتمام الخدمة</span>
                </li>
              </ul>

              <p className="font-semibold text-xl text-slate-800 pt-6">
                نسعى لتقديم <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">أفضل تجربة ممكنة</span> لجميع المستخدمين، 
                سواء كنت طالب خدمة أو راغباً في التطوع والعطاء
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-black text-slate-800 text-center mb-12">مميزات منصتنا</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.bgColor} rounded-3xl p-6 border-2 ${feature.borderColor} shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-20 blur-2xl" style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-xl mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white text-center mb-12">قيمنا</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <Icon className="w-12 h-12 text-emerald-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Suggestions Box */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">صندوق الاقتراحات</h2>
                <p className="text-emerald-100 font-semibold">رأيك يهمنا جداً! شاركنا أفكارك واقتراحاتك</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <p className="text-emerald-700 font-bold">شكراً لك! تم إرسال اقتراحك بنجاح. سنراجعه قريباً.</p>
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    الاسم <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={suggestion.name}
                    onChange={(e) => setSuggestion({...suggestion, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="أدخل اسمك"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={suggestion.email}
                    onChange={(e) => setSuggestion({...suggestion, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  اقتراحك أو ملاحظتك <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={suggestion.message}
                  onChange={(e) => setSuggestion({...suggestion, message: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none h-40 resize-none transition-all"
                  placeholder="شاركنا أفكارك واقتراحاتك لتحسين خدماتنا..."
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
                    إرسال الاقتراح
                  </>
                )}
              </button>
            </form>
          </div>
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

export default VisionMission;