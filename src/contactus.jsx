import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake, Home, Mail, Phone, MapPin, Send,
  Facebook, Instagram, Linkedin, MessageCircle,
  CheckCircle, AlertCircle, ArrowLeft,
} from 'lucide-react';
import { ButtonSkeleton } from './components/Skeleton';

// ─── Shared input class ───────────────────────────────────────────────────────
const INPUT = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

const Contact = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // ── All state identical to original ──────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── handleSubmit identical to original ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  // ── Data identical to original ────────────────────────────────────────────
  const contactInfo = [
    { icon: Phone,  title: 'الهاتف',              value: '0787077828',         link: 'tel:+96261234567',          color: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { icon: Mail,   title: 'البريد الإلكتروني',  value: 'info@participate.org', link: 'mailto:info@participate.org', color: 'from-teal-500 to-cyan-600',    bg: 'bg-teal-50',    text: 'text-teal-600'    },
    { icon: MapPin, title: 'العنوان',             value: 'عمّان، الأردن',       link: 'https://maps.google.com',    color: 'from-cyan-500 to-blue-600',    bg: 'bg-cyan-50',    text: 'text-cyan-600'    },
  ];

  const socialMedia = [
    { name: 'Facebook',  icon: Facebook,  link: 'https://facebook.com',  color: 'from-blue-500 to-blue-600',   username: '@participate' },
    { name: 'Instagram', icon: Instagram, link: 'https://instagram.com', color: 'from-pink-500 to-purple-600', username: '@participate' },
    { name: 'LinkedIn',  icon: Linkedin,  link: 'https://linkedin.com',  color: 'from-blue-600 to-blue-700',   username: '@participate' },
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

          {/* CENTER: page label */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 lg:flex">
            <MessageCircle className="size-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">تواصل معنا</span>
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
      <section className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
            <MessageCircle className="size-4" /> تواصل معنا
          </span>
          <h1 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl md:text-6xl">
            نحن هنا{' '}
            <span className="bg-gradient-to-l from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              لمساعدتك
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
            لديك سؤال أو استفسار؟ لا تتردد في التواصل معنا وسنكون سعداء بمساعدتك
          </p>
        </div>
      </section>

      {/* ━━━━ MAIN CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* ── Contact Form ─────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-emerald-600 px-6 py-5">
              <h2 className="text-xl font-black text-white">أرسل لنا رسالة</h2>
              <p className="mt-1 text-sm text-emerald-100">سنرد عليك في أقرب وقت ممكن</p>
            </div>

            <div className="p-6 md:p-8">
              {/* Success alert */}
              {success && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <CheckCircle className="size-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-700">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                </div>
              )}

              {/* Error alert */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                  <AlertCircle className="size-5 shrink-0 text-red-500" />
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.name} placeholder="أدخل اسمك الكامل"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={INPUT} />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={formData.email} placeholder="example@email.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={INPUT} />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    رقم الهاتف <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <input type="tel" value={formData.phone} placeholder="+962 7X XXX XXXX"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={INPUT} />
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    الموضوع <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <input type="text" value={formData.subject} placeholder="موضوع الرسالة"
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={INPUT} />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea value={formData.message} rows={5} placeholder="اكتب رسالتك هنا..."
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${INPUT} resize-none`} />
                </div>

                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? (
                    <><ButtonSkeleton /> جاري الإرسال...</>
                  ) : (
                    <><Send className="size-5" /> إرسال الرسالة</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right column ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Contact info cards */}
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <a key={i} href={info.link} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-5 overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${info.color} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="size-7 text-white" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-400">{info.title}</p>
                    <p className="text-lg font-extrabold text-slate-800">{info.value}</p>
                  </div>
                </a>
              );
            })}

            {/* Social media card */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-xl">
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-15">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-emerald-500 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-teal-500 blur-3xl" />
              </div>

              <div className="relative z-10">
                <h3 className="mb-5 text-lg font-black text-white">تابعنا على</h3>
                <div className="flex flex-col gap-3">
                  {socialMedia.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <a key={i} href={social.link} target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/20">
                        <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${social.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="size-6 text-white" strokeWidth={2} />
                        </span>
                        <div>
                          <p className="font-extrabold text-white">{social.name}</p>
                          <p className="text-xs font-semibold text-slate-400">{social.username}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick response note */}
            <div className="flex items-start gap-4 rounded-3xl border border-amber-100 bg-amber-50 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 shadow-md">
                <MessageCircle className="size-5 text-white" />
              </span>
              <div>
                <p className="font-extrabold text-slate-800">وقت الاستجابة</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                  نرد على جميع الرسائل خلال 24 ساعة في أيام العمل. للأمور العاجلة تواصل عبر الهاتف.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;