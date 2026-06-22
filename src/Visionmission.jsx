import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake, Home, Target, Shield, Award, Users, Heart,
  CheckCircle, Lightbulb, Star, TrendingUp, Gift, FileCheck,
  UserCheck, AlertCircle, Sparkles, ArrowLeft,
} from 'lucide-react';

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const VisionMission = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Data (identical to original) ──────────────────────────────────────────
  const features = [
    {
      icon: Users,
      title: 'ربط المتطوعين',
      description: 'نربط المتطوعين مع المجموعات التطوعية لخلق تجارب فريدة ومؤثرة في المجتمع',
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    {
      icon: FileCheck,
      title: 'شهادات رسمية',
      description: 'نوثق مشاركتك التطوعية بشهادات معتمدة من موقعنا والمجموعات التطوعية',
      color: 'from-blue-500 to-cyan-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    {
      icon: Star,
      title: 'نظام تقييم شامل',
      description: 'راجع تقييمات وتاريخ مزودي الخدمات قبل الاختيار، مع إمكانية تقديم الشكاوى',
      color: 'from-purple-500 to-pink-600',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
  ];

  const values = [
    { icon: Shield,     title: 'الموثوقية',         description: 'نضمن لك تجربة آمنة وموثوقة مع جميع الخدمات المقدمة على منصتنا' },
    { icon: Heart,      title: 'العطاء',             description: 'نؤمن بقوة العطاء والتطوع في بناء مجتمع أفضل وأكثر ترابطاً' },
    { icon: TrendingUp, title: 'التطوير المستمر',   description: 'نسعى دائماً لتحسين خدماتنا بناءً على ملاحظاتكم واقتراحاتكم' },
    { icon: Gift,       title: 'الجودة',             description: 'نقدم أفضل تجربة ممكنة لجميع المستخدمين سواء متطوعين أو طالبي خدمات' },
  ];

  const checkItems = [
    { icon: UserCheck,   color: 'text-emerald-600', text: 'زيارة صفحته الشخصية والاطلاع على ملفه الكامل' },
    { icon: Star,        color: 'text-amber-500',   text: 'مراجعة تقييمه من العملاء السابقين' },
    { icon: Award,       color: 'text-blue-600',    text: 'الاطلاع على الخدمات والمشاريع التي أنجزها سابقاً' },
    { icon: AlertCircle, color: 'text-rose-600',    text: 'إمكانية تقديم شكوى أو تقييم بعد إتمام الخدمة' },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`sticky top-0 z-50 border-b border-slate-200/60 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">

          {/* RIGHT: Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <HeartHandshake className="size-6 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-base font-black tracking-tight text-slate-900">
                <span className="text-emerald-600">شارك</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">وأحدث فرقاً</span>
            </span>
          </button>

          {/* CENTER: label */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 lg:flex">
            <Target className="size-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">رؤيتنا ورسالتنا</span>
          </div>

          {/* LEFT: Home */}
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:shadow-md">
            <Home className="size-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
        </div>
      </header>

      {/* ━━━━ HERO BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
              <Target className="size-4" /> رؤيتنا ورسالتنا
            </span>
            <h1 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl md:text-6xl">
              نحو مجتمع{' '}
              <span className="bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                أكثر عطاءً وتكافلاً
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-500">
              منصة تربط القلوب بالأفعال، وتحول الرغبة في العطاء إلى واقع ملموس
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 md:px-8">

        {/* ━━━━ VISION CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-4 border-b border-slate-100 bg-emerald-600 px-8 py-6">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
                <Lightbulb className="size-6 text-white" />
              </span>
              <h2 className="text-2xl font-black text-white">رؤيتنا</h2>
            </div>

            <div className="space-y-6 p-8 text-right md:p-10">
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                موقع يسعى لربط المتطوع مع المجموعات التطوعية لخلق تجربة تطوعية فريدة ومؤثرة
              </p>

              <p className="leading-relaxed text-slate-600">
                نحن نؤمن بأن{' '}
                <span className="font-bold text-emerald-600">التطوع</span>{' '}
                ليس مجرد عمل خيري، بل هو رحلة تحول شخصي وتأثير مجتمعي عميق.
                لذلك، نوفر لك{' '}
                <span className="font-bold text-teal-600">شهادات رسمية معتمدة</span>{' '}
                من موقعنا ومن المجموعات التطوعية، توثق مشاركتك وتضيف قيمة لسيرتك الذاتية.
              </p>

              {/* Highlight box */}
              <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <CheckCircle className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <h3 className="mb-1 font-extrabold text-slate-800">خدمات تطوعية مجانية</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    انضم إلى مئات المبادرات التطوعية المتنوعة، وساهم في صنع فرق حقيقي في مجتمعك
                  </p>
                </div>
              </div>

              <p className="leading-relaxed text-slate-600">
                يمكنك التأكد من <span className="font-bold text-purple-600">المزود</span> قبل الموافقة عليه من خلال:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {checkItems.map(({ icon: Icon, color, text }, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <Icon className={`size-5 shrink-0 mt-0.5 ${color}`} />
                    <p className="text-sm text-slate-700">{text}</p>
                  </div>
                ))}
              </div>

              <p className="text-xl font-bold text-slate-800 leading-relaxed pt-2">
                نسعى لتقديم{' '}
                <span className="bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  أفضل تجربة ممكنة
                </span>{' '}
                لجميع المستخدمين، سواء كنت طالب خدمة أو راغباً في التطوع والعطاء
              </p>
            </div>
          </div>
        </Reveal>

        {/* ━━━━ FEATURES GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div>
          <Reveal className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-700">
              <Sparkles className="size-4" /> مميزاتنا
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">مميزات منصتنا</h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color, bg, text, border }, i) => (
              <Reveal key={title} delay={i * 120}
                className={`group flex flex-col gap-4 rounded-3xl border ${border} ${bg} p-6 transition-all hover:-translate-y-1 hover:shadow-lg`}>
                <span className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className="size-7 text-white" />
                </span>
                <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{description}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ━━━━ VALUES SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-teal-500 blur-3xl" />
            </div>

            <div className="relative z-10 p-8 md:p-10">
              <div className="mb-10 text-center">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-emerald-300">
                  <Heart className="size-4" /> ما نؤمن به
                </span>
                <h2 className="text-3xl font-black text-white sm:text-4xl">قيمنا</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {values.map(({ icon: Icon, title, description }, i) => (
                  <div key={title}
                    className="group rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-1">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-500/20">
                      <Icon className="size-6 text-emerald-400" />
                    </span>
                    <h3 className="mb-2 font-extrabold text-white">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50 px-8 py-10 text-center">
            <h3 className="mb-3 text-2xl font-black text-slate-900">
              جاهز لتبدأ رحلة التطوع؟
            </h3>
            <p className="mb-6 text-slate-500">
              انضم إلى مئات المتطوعين وابدأ في إحداث فرق إيجابي حقيقي في مجتمعك
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20">
                ابدأ التطوع الآن
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </button>
              <button onClick={() => navigate('/posts')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 font-bold text-slate-700 transition hover:bg-slate-50">
                تصفّح الفرص
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default VisionMission;