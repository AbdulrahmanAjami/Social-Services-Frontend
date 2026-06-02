import React from 'react';
import { 
  ArrowRight, 
  Handshake,
  Sparkles,
  Users,
  Award,
  Heart,
  Star,
  Target,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnershipPage = () => {
  const navigate = useNavigate();

  const partnerships = [
    {
      id: 1,
      title: 'المجموعات التطوعية المحلية',
      description: 'نسعى للتعاون مع المجموعات التطوعية المحلية لتعزيز ثقافة التطوع والمشاركة المجتمعية',
      icon: Users,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    {
      id: 2,
      title: 'منظمات المجتمع المدني',
      description: 'الشراكة مع المنظمات الحقوقية والخيرية لتوسيع نطاق تأثيرنا الاجتماعي',
      icon: Heart,
      color: 'from-rose-400 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50'
    },
    {
      id: 3,
      title: 'المؤسسات التعليمية',
      description: 'التعاون مع الجامعات والمدارس لتشجيع الطلاب على المشاركة التطوعية والمسؤولية المجتمعية',
      icon: Award,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      id: 4,
      title: 'الشركات والمؤسسات الخاصة',
      description: 'بناء شراكات استراتيجية مع القطاع الخاص لدعم المشاريع التطوعية والمبادرات المجتمعية',
      icon: Zap,
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50'
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'توسيع الشبكة',
      description: 'الوصول إلى شبكة واسعة من المتطوعين والمجموعات التطوعية'
    },
    {
      icon: TrendingUp,
      title: 'نمو مستدام',
      description: 'بناء نموذج تطوعي مستدام يخدم المجتمع على المدى الطويل'
    },
    {
      icon: CheckCircle,
      title: 'جودة عالية',
      description: 'ضمان جودة الخدمات والمشاريع التطوعية المقدمة'
    },
    {
      icon: Target,
      title: 'تأثير حقيقي',
      description: 'إحداث تغيير إيجابي حقيقي في حياة المجتمع'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  <div className="relative">
                    <Handshake className="w-7 h-7 text-white" strokeWidth={2.5} />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black tracking-tight transition-all duration-300 text-white">
                  <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                    Participate
                  </span>
                  {' & '}
                  <span className="text-slate-200">
                    Make
                  </span>
                </h1>
                <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
                  A CHANGE
                </p>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للرئيسية
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-cyan-400/10 pointer-events-none" />
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-5 py-2.5 rounded-full mb-6 font-bold border border-emerald-500/30">
              <Handshake className="w-5 h-5" />
              شراكاتنا
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              بناء الشراكات
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                لمستقبل أفضل
              </span>
            </h1>
            <p className="text-2xl text-slate-300 mb-8 leading-relaxed">
              نحن في مرحلة تطوير الموقع ونسعى لعمل شراكات فعّالة مع المجموعات التطوعية والمنظمات المجتمعية
            </p>
          </div>
        </div>
      </section>

      {/* Development Phase Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden p-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 font-bold">
                  <Zap className="w-5 h-5" />
                  في مرحلة التطوير
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-6">
                  رحلتنا نحو الكمال
                </h2>
                <p className="text-xl text-slate-700 leading-relaxed mb-8">
                  نحن نعمل بجهد على تطوير منصة Participate ليكون لها دور محوري في ربط المتطوعين بالمجموعات التطوعية. في هذه المرحلة الحالية، نركز على بناء أساس قوي ومستدام لخدمة المجتمع بشكل أفضل.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">
                      <span className="font-bold">تطوير المنصة:</span> تحسين الميزات والوظائف لتقديم أفضل تجربة
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">
                      <span className="font-bold">بناء الشراكات:</span> التواصل مع المجموعات التطوعية الموثوقة
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700">
                      <span className="font-bold">دعم المجتمع:</span> الالتزام برؤيتنا في خدمة المجتمع
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-2xl opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl p-12 flex items-center justify-center min-h-64">
                    <div className="text-center">
                      <Target className="w-24 h-24 text-white mx-auto mb-6" />
                      <p className="text-white text-2xl font-black">
                        معاً نبني
                        <br />
                        المستقبل
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-40 left-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-40 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-800 mb-6">مجالات الشراكة</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نبحث عن شراكات استراتيجية في مختلف المجالات لتحقيق رؤيتنا المشتركة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partnership, index) => {
              const Icon = partnership.icon;
              return (
                <div
                  key={partnership.id}
                  className={`bg-gradient-to-br ${partnership.bgColor} rounded-3xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-4 relative overflow-hidden group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl" style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${partnership.color} rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3">{partnership.title}</h3>
                    <p className="text-slate-700 leading-relaxed text-sm">{partnership.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16 leading-tight">فوائد الشراكة معنا</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:-translate-y-2"
                >
                  <Icon className="w-16 h-16 text-emerald-400 mb-6 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12 md:p-16 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                هل تريد الشراكة معنا؟
              </h2>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                نرحب بأي استفسارات أو اقتراحات للشراكة. تواصل معنا اليوم!
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-white hover:bg-slate-100 text-emerald-600 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                اتصل بنا الآن
              </button>
            </div>
          </div>
        </div>
      </section>

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

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default PartnershipPage;
