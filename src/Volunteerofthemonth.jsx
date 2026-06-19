import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake, Sparkles, Home, Award, Trophy, Star,
  TrendingUp, Heart, Users, Calendar, ChevronLeft, ChevronRight,
  Medal, Target, Zap, ArrowLeft,
} from 'lucide-react';

// ─── Reveal animation wrapper ─────────────────────────────────────────────────
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
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const VolunteerOfTheMonth = () => {
  const navigate = useNavigate();
  const [currentActivitySlide, setCurrentActivitySlide] = useState(0);
  const [activeTab, setActiveTab] = useState('month');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── All data identical to original ───────────────────────────────────────
  const volunteerOfMonth = {
    name: 'سارة أحمد محمد',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    points: 850,
    activitiesCount: 12,
    hoursVolunteered: 45,
    month: 'فبراير 2024',
    description: 'متطوعة مميزة بجهودها الرائعة في خدمة المجتمع وتفانيها في مساعدة الآخرين',
  };

  const volunteerActivities = [
    { id: 1, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',  title: 'زيارة مستشفى الأطفال', date: '2024-02-15' },
    { id: 2, image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80', title: 'حملة تنظيف الحي',       date: '2024-02-20' },
    { id: 3, image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', title: 'توزيع الطعام',           date: '2024-02-25' },
    { id: 4, image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80', title: 'تعليم الأطفال',          date: '2024-02-28' },
  ];

  const monthActivities = [
    { id: 1, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80',  title: 'زيارة مستشفى الأطفال', description: 'مبادرة لرسم البسمة على وجوه الأطفال المرضى',    volunteers: 45 },
    { id: 2, image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80', title: 'تنظيف الشواطئ',         description: 'حملة نظافة شاملة للحفاظ على البيئة',            volunteers: 60 },
    { id: 3, image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80', title: 'توزيع وجبات ساخنة',     description: 'توزيع الطعام على الأسر المحتاجة',               volunteers: 35 },
  ];

  const topVolunteersMonth = [
    { name: 'سارة أحمد',  points: 850, rank: 1 },
    { name: 'محمد علي',   points: 720, rank: 2 },
    { name: 'فاطمة حسن',  points: 680, rank: 3 },
    { name: 'أحمد خالد',  points: 650, rank: 4 },
    { name: 'نور الدين',  points: 620, rank: 5 },
    { name: 'ليلى محمود', points: 590, rank: 6 },
    { name: 'عمر يوسف',   points: 560, rank: 7 },
    { name: 'هدى سامي',   points: 530, rank: 8 },
    { name: 'زيد عبدالله',points: 500, rank: 9 },
    { name: 'مريم سعيد',  points: 470, rank: 10 },
  ];

  const topVolunteersAllTime = [
    { name: 'محمد علي',    points: 5240, rank: 1 },
    { name: 'فاطمة حسن',   points: 4890, rank: 2 },
    { name: 'سارة أحمد',   points: 4560, rank: 3 },
    { name: 'أحمد خالد',   points: 3920, rank: 4 },
    { name: 'عمر يوسف',    points: 3650, rank: 5 },
    { name: 'ليلى محمود',  points: 3420, rank: 6 },
    { name: 'نور الدين',   points: 3180, rank: 7 },
    { name: 'زيد عبدالله', points: 2940, rank: 8 },
    { name: 'هدى سامي',    points: 2710, rank: 9 },
    { name: 'مريم سعيد',   points: 2480, rank: 10 },
  ];

  const maxPointsMonth   = Math.max(...topVolunteersMonth.map(v => v.points));
  const maxPointsAllTime = Math.max(...topVolunteersAllTime.map(v => v.points));

  // ── Slider logic (identical to original) ─────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActivitySlide(prev => (prev + 1) % monthActivities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextActivitySlide = () => setCurrentActivitySlide(p => (p + 1) % monthActivities.length);
  const prevActivitySlide = () => setCurrentActivitySlide(p => (p - 1 + monthActivities.length) % monthActivities.length);

  const getRankBadge = (rank) => {
    const badges = {
      1: { color: 'from-yellow-400 to-amber-500', icon: Trophy, glow: 'shadow-yellow-500/50' },
      2: { color: 'from-slate-300 to-slate-400',  icon: Medal,  glow: 'shadow-slate-400/50'  },
      3: { color: 'from-orange-400 to-orange-500',icon: Medal,  glow: 'shadow-orange-400/50' },
    };
    return badges[rank] || { color: 'from-emerald-400 to-teal-500', icon: Star, glow: 'shadow-emerald-500/50' };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`sticky top-0 z-50 border-b border-slate-200/60 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">

          {/* RIGHT: Logo + Home btn */}
          <div className="flex items-center gap-3">
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
          </div>

          {/* CENTER: page label */}
          <div className="hidden items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-1.5 lg:flex">
            <Trophy className="size-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">متطوع الشهر</span>
          </div>

          {/* LEFT: Back home */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:shadow-md"
          >
            <Home className="size-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
        </div>
      </header>

      {/* ━━━━ HERO BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-700">
              <Trophy className="size-4" /> تكريم الأفضل
            </span>
            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl md:text-6xl">
              متطوع{' '}
              <span className="bg-gradient-to-l from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                الشهر
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
              نحتفل بمتطوعنا المميز لهذا الشهر تقديراً لجهوده المتميزة وإخلاصه في خدمة المجتمع
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-5 py-14 md:px-8">

        {/* ━━━━ VOLUNTEER OF THE MONTH CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -right-20 -top-20 size-72 rounded-full bg-yellow-400 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-emerald-500 blur-3xl" />
            </div>

            {/* Floating confetti dots */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="absolute size-2.5 animate-pulse rounded-full opacity-60"
                  style={{
                    left: `${(i * 6.25) % 100}%`,
                    top: `${(i * 13) % 100}%`,
                    backgroundColor: ['#10b981','#14b8a6','#fbbf24','#f59e0b'][i % 4],
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col items-center gap-10 md:flex-row">

                {/* Avatar */}
                <div className="relative shrink-0">
                  {/* Trophy badge */}
                  <div className="absolute -right-4 -top-4 z-20 flex size-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/40">
                    <Trophy className="size-8 text-white" />
                  </div>
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-40 blur-2xl" />
                  {/* Image */}
                  <div className="relative size-44 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1.5 shadow-2xl md:size-52">
                    <img src={volunteerOfMonth.image} alt={volunteerOfMonth.name}
                      className="h-full w-full rounded-full object-cover ring-4 ring-white" />
                  </div>
                  {/* Stars */}
                  <Star className="absolute -bottom-2 -left-2 size-8 animate-bounce fill-yellow-400 text-yellow-400" />
                  <Sparkles className="absolute -left-4 -top-1 size-6 animate-pulse text-amber-400" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-right">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-sm font-bold text-yellow-300 backdrop-blur-sm">
                    <Award className="size-4" /> {volunteerOfMonth.month}
                  </span>
                  <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
                    {volunteerOfMonth.name}
                  </h2>
                  <p className="mb-8 text-lg leading-relaxed text-slate-300">
                    {volunteerOfMonth.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Zap,      value: volunteerOfMonth.points,           label: 'نقطة',  color: 'text-yellow-400' },
                      { icon: Target,   value: volunteerOfMonth.activitiesCount,  label: 'نشاط',  color: 'text-emerald-400' },
                      { icon: Calendar, value: volunteerOfMonth.hoursVolunteered, label: 'ساعة',  color: 'text-teal-400' },
                    ].map(({ icon: Icon, value, label, color }) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm">
                        <Icon className={`mx-auto mb-2 size-6 ${color}`} />
                        <p className="text-3xl font-black text-white">{value}</p>
                        <p className="text-sm font-semibold text-slate-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ━━━━ VOLUNTEER ACTIVITIES GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div>
          <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
              <Heart className="size-4" /> نشاطاته
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">نشاطات المتطوع</h2>
            <p className="max-w-xl text-slate-500">بعض من الأنشطة التي شارك بها هذا الشهر</p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {volunteerActivities.map((activity, i) => (
              <Reveal key={activity.id} delay={i * 100}
                className="group overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden">
                  <img src={activity.image} alt={activity.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="mb-1.5 font-extrabold text-white">{activity.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Calendar className="size-3.5" />
                      {new Date(activity.date).toLocaleDateString('ar-JO')}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ━━━━ MONTH ACTIVITIES SLIDER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div>
          <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-bold text-teal-700">
              <Users className="size-4" /> هذا الشهر
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">أنشطة الشهر</h2>
            <p className="max-w-xl text-slate-500">أبرز الأنشطة التطوعية التي نفذت هذا الشهر</p>
          </Reveal>

          <Reveal>
            <div className="relative h-[480px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
              {monthActivities.map((activity, index) => (
                <div key={activity.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentActivitySlide ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
                  <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="mx-auto max-w-7xl px-8">
                      <div className="max-w-xl">
                        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white">
                          <Users className="size-4" /> {activity.volunteers} متطوع
                        </span>
                        <h3 className="mb-3 text-4xl font-black text-white md:text-5xl">{activity.title}</h3>
                        <p className="text-xl leading-relaxed text-slate-200">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Arrows */}
              <button onClick={prevActivitySlide}
                className="absolute left-5 top-1/2 z-30 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/20 p-3.5 backdrop-blur-sm transition hover:bg-white/30 hover:scale-110">
                <ChevronLeft className="size-6 text-white" />
              </button>
              <button onClick={nextActivitySlide}
                className="absolute right-5 top-1/2 z-30 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/20 p-3.5 backdrop-blur-sm transition hover:bg-white/30 hover:scale-110">
                <ChevronRight className="size-6 text-white" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2.5">
                {monthActivities.map((_, i) => (
                  <button key={i} onClick={() => setCurrentActivitySlide(i)}
                    className={`h-2.5 rounded-full transition-all ${i === currentActivitySlide ? 'w-10 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/60'}`} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ━━━━ TOP 10 LEADERBOARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 px-6 py-6 text-center md:px-8">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
                <TrendingUp className="size-4" /> المتصدرون
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">أعلى 10 متطوعين</h2>
              <p className="mt-2 text-slate-500">المتطوعون الأكثر نشاطاً</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-3 border-b border-slate-100 px-6 py-4">
              <button onClick={() => setActiveTab('month')}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  activeTab === 'month'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}>
                هذا الشهر
              </button>
              <button onClick={() => setActiveTab('allTime')}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  activeTab === 'allTime'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-700'
                }`}>
                الأعلى على الإطلاق
              </button>
            </div>

            {/* List */}
            <div className="p-6 md:p-8">
              <div className="grid gap-3 md:grid-cols-2">
                {(activeTab === 'month' ? topVolunteersMonth : topVolunteersAllTime).map((volunteer) => {
                  const badge      = getRankBadge(volunteer.rank);
                  const BadgeIcon  = badge.icon;
                  const maxPts     = activeTab === 'month' ? maxPointsMonth : maxPointsAllTime;
                  const percentage = (volunteer.points / maxPts) * 100;

                  return (
                    <div key={volunteer.rank} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                      {/* Rank badge */}
                      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${badge.color} shadow-md ${badge.glow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        {volunteer.rank <= 3
                          ? <BadgeIcon className="size-5 text-white" />
                          : <span className="text-sm font-black text-white">{volunteer.rank}</span>
                        }
                      </div>

                      {/* Name + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1.5 flex items-center justify-between">
                          <h3 className="truncate text-sm font-extrabold text-slate-800">{volunteer.name}</h3>
                          <span className="ml-2 flex shrink-0 items-center gap-1 text-sm font-black text-slate-700">
                            <Zap className="size-3.5 text-amber-500" />
                            {volunteer.points.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${badge.color} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ━━━━ CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-emerald-600 px-6 py-12 text-center md:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 size-72 rounded-full bg-amber-400/20" />
            <div className="relative flex flex-col items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
                <Trophy className="size-4" /> انضم إلى المتطوعين المميزين
              </span>
              <h2 className="text-3xl font-black text-white sm:text-4xl">
                كن متطوع الشهر القادم!
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-white/85">
                شارك بأكبر عدد من الأنشطة التطوعية واحصد النقاط لتكون في المقدمة.
              </p>
              <button
                onClick={() => navigate('/posts')}
                className="group mt-2 inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 font-bold text-white transition hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30"
              >
                تصفّح الفرص التطوعية
                <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default VolunteerOfTheMonth;