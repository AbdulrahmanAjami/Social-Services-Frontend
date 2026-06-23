import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Users,
  Heart,
  Clock,
  User,
  MapPin,
  Star,
  ArrowLeft,
  Sparkles,
  Handshake,
  Menu,
  X,
  Home,
  Briefcase,
  Info,
  Phone,
  Trophy,
  ChevronDown,
  LogOut,
  UserCircle,
  Bell,
  Zap,
  HeartHandshake,
  Eye,
  ShieldCheck,
  Quote,
  CalendarDays,
  Play,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// Animation helpers (same as original)
// ---------------------------------------------------------------------------
const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

// Lightweight Reveal wrapper (replaces @/components/reveal from the new design)
function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: delay / 1000, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Data (identical to original – all backend-connected data kept as-is)
// ---------------------------------------------------------------------------
const navItems = [
  { name: 'الرئيسية', path: '/', icon: Home },
  {
    name: 'من نحن',
    path: '/about',
    icon: Info,
    dropdown: [
      { name: 'رؤيتنا ورسالتنا', path: '/VisionMission' },
      { name: 'فريق العمل', path: '/about/team' },
      { name: 'شركاؤنا', path: '/about/partners' },
    ],
  },
  {
    name: 'الخدمات',
    path: '/posts',
    icon: Briefcase,
    dropdown: [
      { name: 'خدمات تطوعية', path: '/posts' },
      { name: 'أقرب الخدمات', path: '/map' },
    ],
  },
  { name: 'متطوعينا المميزين', path: '/VolunteerOfTheMonth', icon: Trophy },
  { name: 'اتصل بنا', path: '/contact', icon: Phone },
];

const services = [
  {
    id: 1,
    title: 'زيارة مستشفى الأطفال',
    description: 'مبادرة لرسم البسمة على وجوه الأطفال المرضى وتقديم الهدايا لهم',
    location: 'مستشفى الأمير حمزة، عمّان',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
    type: 'تطوعي',
    volunteers: 45,
    date: '17 مارس 2026',
  },
  {
    id: 2,
    title: 'تنظيف الحي',
    description: 'نبحث عن متطوعين للمساعدة في تنظيف الحي وزراعة الأشجار لتجميله',
    location: 'حي النصر، الرمثا',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80',
    type: 'تطوعي',
    volunteers: 32,
    date: '6 مارس 2026',
  },
  {
    id: 3,
    title: 'مساعدة كبار السن',
    description: 'برنامج تطوعي لمساعدة كبار السن في التسوق أو زيارة الطبيب أو الجلوس للحديث',
    location: 'ماركا، عمان',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80',
    type: 'تطوعي',
    volunteers: 28,
    date: '20 مارس 2026',
  },
  {
    id: 4,
    title: 'تعليم الأطفال',
    description: 'مبادرة لتعليم الأطفال القراءة والكتابة والرياضيات بشكل تطوعي',
    location: 'مركز الأمل المجتمعي',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    type: 'تطوعي',
    volunteers: 56,
    date: '2 مارس 2026',
  },
  {
    id: 5,
    title: 'توزيع الطعام',
    description: 'توزيع وجبات ساخنة على الأسر المحتاجة والمشردين',
    location: 'مختلف المناطق',
    image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80',
    type: 'تطوعي',
    volunteers: 67,
    date: '25 مارس 2026',
  },
];


const features = [
  { icon: Zap,        title: 'تأثير سريع',      desc: 'كل مساعدة تُحدث فرقاً ملموساً وسريعاً في حياة الآخرين.',              color: 'text-amber-500',   bg: 'bg-amber-100' },
  { icon: ShieldCheck,title: 'موثوقية عالية',   desc: 'جميع فرصنا معتمدة ومفحوصة بأعلى معايير الجودة والأمان.',             color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { icon: Handshake,  title: 'شراكات موثوقة',  desc: 'نتعاون مع منظمات محلية ودولية لتوسيع نطاق الخدمات.',                 color: 'text-teal-600',    bg: 'bg-teal-100' },
  { icon: Eye,        title: 'رؤية واضحة',      desc: 'نعمل على تحقيق أهداف واضحة ومحددة لخدمة المجتمع.',                  color: 'text-yellow-700',  bg: 'bg-yellow-100' },
];

const testimonials = [
  { name: 'محمد الأحمد',  role: 'متطوّع منذ 2024',       text: 'الدعم الذي تلقّيته ساعدني كثيراً، شكراً لكل المتطوعين على روحهم الرائعة.',            color: '#7da57f' },
  { name: 'سارة عبدالله', role: 'قائدة فريق تطوّعي',     text: 'منصة رائعة تجمع المتطوعين وتسهّل عملية المشاركة في الأعمال الخيرية.',                color: '#e0a87a' },
  { name: 'أحمد محمود',   role: 'متطوّع في الخدمات',     text: 'التطوّع غيّر حياتي تماماً، لمست السعادة عندما ساعدت الآخرين بنفسي.',                 color: '#5b8a90' },
];

const footerColumns = [
  { title: 'المنصة',  links: ['الرئيسية', 'من نحن', 'الفرص التطوعية', 'متطوعونا'] },
  { title: 'الدعم',   links: ['اتصل بنا', 'الأسئلة الشائعة', 'سياسة الخصوصية', 'الشروط والأحكام'] },
  { title: 'تابعنا',  links: ['انستغرام', 'تويتر / X', 'فيسبوك', 'لينكدإن'] },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const Mainpage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const userRef = useRef(null);

  // ── same auth logic as original ──────────────────────────────────────────
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate   = useNavigate();

  // ── handlers (identical to original) ─────────────────────────────────────
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // ── effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (userMenuOpen && userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [userMenuOpen]);

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HEADER (new design) ━━ */}
      <header className={`sticky top-0 z-50 border-b border-slate-200/60 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">

          {/* ── Logo + CTA (RIGHT in RTL) ───────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 group">
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

            {/* CTA */}
            <button
              onClick={() => handleNavigation('/posts')}
              className="hidden rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600 sm:inline-flex"
            >
              تطوّع الآن
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-full text-slate-900 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* ── Desktop nav (CENTER) ────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item, i) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <button
                  onClick={() => { if (!item.dropdown) handleNavigation(item.path); else setActiveDropdown(activeDropdown === item.name ? null : item.name); }}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    i === 0
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className={`size-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute right-0 top-full w-56 pt-2 z-50">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={(e) => { e.stopPropagation(); handleNavigation(sub.path); setActiveDropdown(null); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
                        >
                          <ChevronLeft className="size-4 text-emerald-600" />
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── User / Auth (LEFT in RTL) ───────────────────────────────── */}
          <div className="relative flex items-center gap-2" ref={userRef}>
            {isLoggedIn ? (
              <>
                {/* Notification bell */}
                <button className="relative hidden size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:flex">
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-amber-500" />
                </button>

                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform hover:scale-105"
                >
                  <ChevronDown className={`size-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  <img
                    src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt="Profile"
                    className="size-10 rounded-full object-cover ring-2 ring-emerald-400/50"
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 top-14 w-56 origin-top-left overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                      <img
                        src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt="Profile"
                        className="size-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'مستخدم'}</span>
                        <span className="text-xs text-slate-500">{user?.email}</span>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-slate-200" />
                    <button
                      onClick={() => { handleNavigation('/Profile'); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100"
                    >
                      <UserCircle className="size-4 text-emerald-600" />
                      الملف الشخصي
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl border-t border-slate-200 px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="size-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleNavigation('/login')}
                className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform hover:scale-105"
              >
                <ChevronDown className="size-4 text-slate-500" />
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-white">
                  <User className="size-5" />
                </span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile menu ──────────────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <nav className="border-t border-slate-200/60 bg-white px-5 py-4 lg:hidden">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.dropdown ? (
                    <details className="group">
                      <summary className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100">
                        {item.name}
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="flex flex-col gap-1 pb-1 pr-3">
                        {item.dropdown.map((sub) => (
                          <li key={sub.name}>
                            <button
                              onClick={() => handleNavigation(sub.path)}
                              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            >
                              <ChevronLeft className="size-4 text-emerald-600" />
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="block w-full rounded-xl px-4 py-3 text-right text-sm font-medium text-slate-900 hover:bg-slate-100"
                    >
                      {item.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!isLoggedIn && (
              <button
                onClick={() => handleNavigation('/login')}
                className="mt-3 w-full rounded-full bg-amber-500 py-3 font-bold text-white hover:bg-amber-600"
              >
                تسجيل الدخول
              </button>
            )}
          </nav>
        )}
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO (new static layout) ━━ */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-40 size-72 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-2 lg:gap-12 lg:py-20">
          {/* Text side */}
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
                <Sparkles className="size-4 animate-pulse" />
                مبادرة جديدة كل أسبوع
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                نصنع التغيير،
                <br />
                <span className="bg-gradient-to-l from-emerald-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_3s_ease_infinite]">
                  تطوّعاً
                </span>{' '}
                تلو الآخر
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="max-w-md text-lg leading-relaxed text-slate-500">
                انضم إلى مجتمع من المتطوعين الشغوفين، واختر الفرصة التي تناسبك، واترك بصمة حقيقية في حياة من حولك.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleNavigation('/posts')}
                  className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-base font-bold text-white transition-all hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  ابدأ التطوّع الآن
                  <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                </button>
                <button
                  onClick={() => handleNavigation('/posts')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-transparent px-7 py-3 text-base font-bold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  تصفّح الفرص
                </button>
              </div>
            </Reveal>

            {/* Social proof */}
            <Reveal delay={400}>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {['#7da57f', '#e0a87a', '#9bbfc4', '#c9b78a'].map((c) => (
                    <span
                      key={c}
                      className="size-9 rounded-full border-2 border-white transition-transform hover:-translate-y-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-slate-500">
                  انضم إلى <span className="font-bold text-slate-800">+50 متطوّع</span> صنعوا الفرق
                </p>
              </div>
            </Reveal>
          </div>

          {/* Image side */}
          <Reveal delay={200} className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] rounded-tl-[5rem] shadow-2xl shadow-emerald-600/10">
               <img
                src={"Screenshot 2026-06-10 222618.png"}
                alt="متطوع يساعد في المجتمع"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Floating featured-opportunity card */}
            <div className="absolute -bottom-6 right-4 w-[min(20rem,80%)] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <Sparkles className="size-3.5" />
                  فرصة مميزة
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                  <Users className="size-3.5" />
                  {services[0].volunteers} متطوّع
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">{services[0].title}</h3>
              <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-amber-500" /> {services[0].location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-amber-500" /> {services[0].date}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HOW IT WORKS ━━ */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">

          {/* Header */}
          <Reveal className="mb-16 flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-bold text-emerald-700">
              <Sparkles className="size-4" />
              ابدأ في 3 خطوات
            </span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              كيف تعمل المنصة؟
            </h2>
            <p className="max-w-xl text-slate-500 leading-relaxed">
              لا تعقيد، لا انتظار — فقط ثلاث خطوات بسيطة تفصلك عن إحداث فرق حقيقي.
            </p>
          </Reveal>

          {/* Steps */}
          <div className="relative">
            {/* Connector line (desktop only) */}
            <div className="absolute top-16 right-[calc(16.66%+2rem)] left-[calc(16.66%+2rem)] hidden h-0.5 bg-gradient-to-l from-amber-300 via-emerald-300 to-emerald-500 lg:block" />

            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: '١',
                  title: 'سجّل حسابك',
                  desc: 'أنشئ حسابك مجاناً في دقيقة واحدة، وأضف معلوماتك الأساسية للبدء.',
                  icon: Users,
                  color: 'from-emerald-500 to-teal-600',
                  iconBg: 'bg-emerald-50',
                  iconColor: 'text-emerald-600',
                  cta: { label: 'إنشاء حساب', path: '/register' },
                },
                {
                  step: '٢',
                  title: 'ابحث عن فرصة',
                  desc: 'تصفّح الفرص التطوعية القريبة منك، وفلتر حسب المنطقة أو التخصص.',
                  icon: MapPin,
                  color: 'from-amber-500 to-orange-500',
                  iconBg: 'bg-amber-50',
                  iconColor: 'text-amber-600',
                  cta: { label: 'تصفّح الفرص', path: '/posts' },
                },
                {
                  step: '٣',
                  title: 'تطوّع وأحدث فرقاً',
                  desc: 'قدّم طلبك، تواصل مع صاحب الخدمة، وابدأ رحلتك في التغيير الإيجابي.',
                  icon: Heart,
                  color: 'from-rose-500 to-pink-500',
                  iconBg: 'bg-rose-50',
                  iconColor: 'text-rose-500',
                  cta: { label: 'ابدأ الآن', path: '/register' },
                },
              ].map(({ step, title, desc, icon: Icon, color, iconBg, iconColor, cta }, i) => (
                <Reveal key={title} delay={i * 150}>
                  <div className="group relative flex flex-col items-center text-center">
                    {/* Step bubble */}
                    <div className="relative mb-6">
                      {/* Glow */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30`} />
                      {/* Circle */}
                      <div className={`relative flex size-32 flex-col items-center justify-center rounded-full bg-gradient-to-br ${color} shadow-xl transition-transform duration-300 group-hover:-translate-y-2`}>
                        <Icon className="size-9 text-white mb-1" />
                        <span className="text-xs font-black text-white/80 tracking-widest">الخطوة</span>
                        <span className="text-lg font-black text-white leading-none">{step}</span>
                      </div>
                    </div>

                    {/* Text */}
                    <h3 className="mb-3 text-xl font-black text-slate-800">{title}</h3>
                    <p className="mb-6 max-w-xs leading-relaxed text-slate-500 text-sm">{desc}</p>

                    {/* CTA */}
                    <button
                      onClick={() => handleNavigation(cta.path)}
                      className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-all duration-300 group-hover:shadow-md ${iconBg} ${iconColor} border-current hover:opacity-80`}
                    >
                      {cta.label}
                      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Bottom CTA strip */}
          <Reveal delay={400} className="mt-16">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-8 text-center md:flex-row md:justify-between md:text-right">
              <div>
                <p className="text-lg font-black text-slate-800">مستعد تبدأ؟</p>
                <p className="text-sm text-slate-500">انضم الآن وكن جزءاً من مجتمع التغيير.</p>
              </div>
              <button
                onClick={() => handleNavigation('/register')}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
              >
                سجّل مجاناً الآن
                <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
              </button>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ WHY US ━━ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">لماذا نحن</span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">تجربة تطوّع تجمع الجودة والأثر</h2>
            <p className="max-w-xl text-slate-500">نقدّم تجربة فريدة تجمع بين الموثوقية والتأثير الحقيقي في كل خطوة.</p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <Reveal
                key={title}
                delay={i * 110}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              >
                <span className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${bg} ${color} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ OPPORTUNITIES ━━ */}
      <section className="bg-slate-50/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">فرص التطوّع</span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">اختر الفرصة التي تناسبك</h2>
            <p className="max-w-xl text-slate-500">ابدأ الآن في إحداث فرق إيجابي في مجتمعك من خلال إحدى فرصنا المميزة.</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((service, i) => (
              <Reveal
                key={service.id}
                delay={i * 130}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur">
                    <Users className="size-3.5 text-emerald-600" /> {service.volunteers}
                  </span>
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    تطوّعي
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold text-slate-800">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>

                  <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-amber-500" /> {service.location}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-amber-500" /> {service.date}</span>
                  </div>

                  <button
                    onClick={() => handleNavigation('/posts')}
                    className="mt-5 w-full rounded-full bg-emerald-600 py-3 font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-md"
                  >
                    تطوّع الآن
                  </button>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center">
            <button
              onClick={() => handleNavigation('/posts')}
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-transparent px-7 py-3 font-bold text-slate-900 transition-all hover:bg-white hover:shadow-md"
            >
              عرض جميع الفرص التطوعية
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ TESTIMONIALS ━━ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">قصص ملهمة</span>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">كلمات من متطوّعينا</h2>
            <p className="max-w-xl text-slate-500">تجارب حقيقية من أشخاص غيّروا حياتهم وحياة الآخرين من خلال المنصة.</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 130}
                className="group relative flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <Quote className="size-8 text-emerald-200 transition-transform duration-300 group-hover:scale-110" fill="currentColor" />
                <blockquote className="flex-1 text-base leading-relaxed text-slate-800">
                  "{t.text}"
                </blockquote>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-4" fill="currentColor" />
                  ))}
                </div>
                <figcaption className="flex items-center gap-3 border-t border-slate-200 pt-4">
                  <span
                    className="flex size-11 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{t.name}</span>
                    <span className="text-xs text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FINAL CTA ━━ */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-emerald-600 px-6 py-16 text-center md:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 animate-pulse" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 size-72 rounded-full bg-amber-400/20 animate-pulse" />

          <Reveal className="relative flex flex-col items-center gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white">
              <Heart className="size-4 animate-pulse" fill="currentColor" />
              ابدأ رحلتك اليوم
            </span>
            <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              كن جزءاً من التغيير الإيجابي
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-white/85">
              انضم إلى مئات المتطوعين الذين يساهمون في بناء مجتمع أفضل وأكثر تكافلاً، وابدأ أثرك الأول اليوم.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => handleNavigation('/register')}
                className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3 text-base font-bold text-white transition-all hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/30"
              >
                ابدأ التطوّع الآن
                <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <button
                onClick={() => handleNavigation('/posts')}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-7 py-3 text-base font-bold text-white transition-all hover:bg-white/10"
              >
                <ArrowLeft className="size-5 rotate-180" />
                تعرّف علينا أكثر
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER ━━ */}
      <footer className="border-t border-slate-200 bg-slate-100/40">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <button onClick={() => handleNavigation('/')} className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <Heart className="size-5" fill="currentColor" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-base font-extrabold text-slate-900">شارك</span>
                  <span className="text-[11px] font-medium tracking-wide text-emerald-600">وأحدث فرقاً</span>
                </span>
              </button>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                منصة تطوعية مجتمعية تجمع المتطوعين بالفرص التي تصنع أثراً حقيقياً في مجتمعنا.
              </p>
            </div>

            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 transition-colors hover:text-emerald-600">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            © 2026 شارك — وأحدث فرقاً. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Mainpage;