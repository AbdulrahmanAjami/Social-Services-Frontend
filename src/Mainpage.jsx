import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Heart, 
  Award, 
  Clock, 
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Target,
  Handshake,
  Shield,
  Menu,
  X,
  Home,
  Briefcase,
  Info,
  Phone,
  FileText,
  Trophy,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  Bell,
  Search,
  Play,
  Zap,
  Gift,
  TrendingDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Mainpage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { 
      name: 'الرئيسية', 
      path: '/', 
      icon: Home 
    },
    { 
      name: 'من نحن', 
      path: '/about', 
      icon: Info,
      dropdown: [
        { name: 'رؤيتنا ورسالتنا', path: '/about/vision' },
        { name: 'فريق العمل', path: '/about/team' },
        { name: 'شركاؤنا', path: '/about/partners' }
      ]
    },
    { 
      name: 'الخدمات', 
      path: '/services', 
      icon: Briefcase,
      dropdown: [
        { name: 'خدمات تطوعية', path: '/Services' },
        { name: 'خدمات مدفوعة', path: '/Services' }
      ]
    },
    { 
      name: 'متطوعينا المميزين', 
      path: '/VolunteerOfTheMonth', 
      icon: Trophy 
    },
    { 
      name: 'المدونة', 
      path: '/blog', 
      icon: FileText 
    },
    { 
      name: 'اتصل بنا', 
      path: '/contact', 
      icon: Phone 
    }
  ];

  const services = [
    {
      id: 1,
      title: "زيارة مستشفى الأطفال",
      description: "مبادرة لرسم البسمة على وجوه الأطفال المرضى وتقديم الهدايا لهم",
      location: "مستشفى الأمير حمزة، عمّان",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
      type: "تطوعي",
      volunteers: 45,
      date: "17 مارس 2026"
    },
    {
      id: 2,
      title: "تنظيف الحي",
      description: "نبحث عن متطوعين للمساعدة في تنظيف الحي وزراعة الأشجار لتجميله",
      location: "حي النصر، الرمثا",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80",
      type: "تطوعي",
      volunteers: 32,
      date: "6 مارس 2026"
    },
    {
      id: 3,
      title: "مساعدة كبار السن",
      description: "برنامج تطوعي لمساعدة كبار السن في التسوق أو زيارة الطبيب أو الجلوس للحديث",
      location: "ماركا، عمان",
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80",
      type: "تطوعي",
      volunteers: 28,
      date: "20 مارس 2026"
    },
    {
      id: 4,
      title: "تعليم الأطفال",
      description: "مبادرة لتعليم الأطفال القراءة والكتابة والرياضيات بشكل تطوعي",
      location: "مركز الأمل المجتمعي",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      type: "تطوعي",
      volunteers: 56,
      date: "2 مارس 2026"
    },
    {
      id: 5,
      title: "توزيع الطعام",
      description: "توزيع وجبات ساخنة على الأسر المحتاجة والمشردين",
      location: "مختلف المناطق",
      image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80",
      type: "تطوعي",
      volunteers: 67,
      date: "25 مارس 2026"
    }
  ];

  const featuredServices = [
    {
      id: 1,
      title: "دورة تدريبية في البرمجة",
      description: "تعلم أساسيات البرمجة مع مدربين محترفين",
      price: "50 دينار",
      duration: "4 أسابيع",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      type: "مدفوع",
      rating: 4.8,
      students: 120
    },
    {
      id: 2,
      title: "استشارة قانونية",
      description: "احصل على استشارة قانونية من محامين معتمدين",
      price: "30 دينار",
      duration: "ساعة واحدة",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      type: "مدفوع",
      rating: 4.9,
      students: 85
    },
    {
      id: 3,
      title: "ورشة تصميم جرافيك",
      description: "تعلم أساسيات التصميم الجرافيكي بشكل احترافي",
      price: "40 دينار",
      duration: "3 أسابيع",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
      type: "مدفوع",
      rating: 4.7,
      students: 95
    }
  ];

  // إحصائيات منطقية لموقع حديث
  const stats = [
    { icon: Users, number: "50+", label: "متطوع نشط", color: "emerald", trend: "+15%" },
    { icon: Heart, number: "200+", label: "شخص تم مساعدته", color: "rose", trend: "+25%" },
    { icon: Award, number: "15+", label: "مشروع مكتمل", color: "amber", trend: "+8%" },
    { icon: Clock, number: "500+", label: "ساعة تطوع", color: "blue", trend: "+20%" }
  ];

  const features = [
    {
      icon: Target,
      title: "رؤية واضحة",
      description: "نعمل على تحقيق أهداف واضحة ومحددة لخدمة المجتمع",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: Handshake,
      title: "شراكات موثوقة",
      description: "نتعاون مع منظمات محلية ودولية لتوسيع نطاق الخدمات",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "موثوقية عالية",
      description: "جميع خدماتنا معتمدة ومضمونة بأعلى معايير الجودة",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Zap,
      title: "تأثير سريع",
      description: "كل مساهمة تحدث فرقاً ملموساً وسريعاً في حياة الآخرين",
      color: "from-amber-400 to-amber-600"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمود",
      role: "متطوع منذ سنتين",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      quote: "التطوع غير حياتي تماماً، أشعر بالسعادة عندما أساعد الآخرين"
    },
    {
      name: "سارة عبدالله",
      role: "منسقة فريق",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      quote: "منصة رائعة تجمع المتطوعين وتسهل عملية المشاركة في الأعمال الخيرية"
    },
    {
      name: "محمد الأحمد",
      role: "مستفيد من الخدمات",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
      quote: "الدعم الذي تلقيته ساعدني كثيراً، شكراً لكل المتطوعين"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

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

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-600',
      rose: 'bg-rose-100 text-rose-600',
      amber: 'bg-amber-100 text-amber-600',
      blue: 'bg-blue-100 text-blue-600'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header with Advanced Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-slate-200/50' 
          : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => handleNavigation('/')}
            >
              <div className="relative">
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500 animate-pulse"></div>
                {/* Icon Container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  <div className="relative">
                    <Handshake className="w-7 h-7 text-white" strokeWidth={2.5} />
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-xl md:text-2xl font-black tracking-tight transition-all duration-300 ${
                  scrolled ? 'text-slate-800' : 'text-white'
                }`}>
                  <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                    Participate
                  </span>
                  {' & '}
                  <span className={`${scrolled ? 'text-slate-700' : 'text-slate-200'}`}>
                    Make
                  </span>
                </h1>
                <p className={`text-xs font-bold tracking-[0.2em] ${
                  scrolled ? 'text-emerald-600' : 'text-emerald-400'
                }`}>
                  A CHANGE
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div 
                  key={item.name} 
                  className="relative group/nav"
                >
                  <button
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                    onClick={() => {
                      if (!item.dropdown) {
                        handleNavigation(item.path);
                      } else {
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all relative overflow-hidden group ${
                      scrolled 
                        ? 'text-slate-700 hover:text-emerald-600' 
                        : 'text-white hover:text-emerald-300'
                    }`}
                  >
                    {/* Hover Background Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-600/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></span>
                    <span className="absolute inset-0 bg-emerald-500/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                    
                    <item.icon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                    
                    {/* Animated Underline */}
                    <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
                  </button>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeInDown z-50"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((subItem, index) => (
                        <button
                          key={subItem.name}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Navigating to:', subItem.path);
                            handleNavigation(subItem.path);
                            setActiveDropdown(null);
                          }}
                          className={`w-full text-right px-6 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all flex items-center gap-3 group/item cursor-pointer ${
                            index !== 0 ? 'border-t border-slate-100' : ''
                          }`}
                        >
                          <ChevronLeft className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transform translate-x-2 group-hover/item:translate-x-0 transition-all" />
                          <span className="font-semibold">{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <button className={`hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-all hover:scale-110 ${
                scrolled 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}>
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {isLoggedIn && (
                <button className={`hidden md:flex w-10 h-10 rounded-xl items-center justify-center transition-all hover:scale-110 relative ${
                  scrolled 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </button>
              )}

              {/* User Menu */}
              {isLoggedIn ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative">
                      {/* Glowing Ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-50 blur-md transition-opacity"></div>
                      {/* Profile Image */}
                      <img
                        src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"}
                        alt="Profile"
                        className="w-11 h-11 rounded-full object-cover border-3 border-white shadow-lg transform group-hover:scale-110 transition-all relative z-10 ring-2 ring-emerald-400/50"
                      />
                      {/* Online Status */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-20"></span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform hidden md:block ${
                      userMenuOpen ? 'rotate-180' : ''
                    } ${scrolled ? 'text-slate-700' : 'text-white'}`} />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute top-full left-0 mt-3 w-64 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden animate-fadeInDown">
                      {/* User Info */}
                      <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200/50">
                        <p className="font-bold text-slate-800 text-lg">{user?.displayName || 'مستخدم'}</p>
                        <p className="text-sm text-slate-600">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation('/Profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-right px-6 py-3 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all flex items-center gap-3 group"
                        >
                          <UserCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">الملف الشخصي</span>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-right px-6 py-3 text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-3 group border-t border-slate-200/50"
                        >
                          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold">تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="hidden md:flex bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  تسجيل الدخول
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all hover:scale-110 ${
                  scrolled ? 'text-slate-700 bg-slate-100' : 'text-white bg-white/10'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200/20 animate-slideDown">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => {
                        if (!item.dropdown) {
                          handleNavigation(item.path);
                        } else {
                          setActiveDropdown(activeDropdown === item.name ? null : item.name);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all ${
                        scrolled 
                          ? 'text-slate-700 hover:bg-emerald-50' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </div>
                      {item.dropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                    {item.dropdown && activeDropdown === item.name && (
                      <div className="pr-8 pt-2 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem.path)}
                            className={`w-full text-right px-4 py-2 rounded-lg transition-all ${
                              scrolled 
                                ? 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700' 
                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!isLoggedIn && (
                  <button 
                    onClick={() => handleNavigation('/login')}
                    className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    تسجيل الدخول
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Hero Slider */}
      <section className="relative h-[650px] bg-slate-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {services.map((service, index) => (
          <div
            key={service.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 z-10" />
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover scale-105 animate-ken-burns"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl animate-fadeInUp">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl animate-pulse-slow">
                      <Sparkles className="w-4 h-4" />
                      {service.type}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold border border-white/30">
                      <Users className="w-4 h-4" />
                      {service.volunteers} متطوع
                    </span>
                  </div>
                  <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                    {service.title}
                  </h2>
                  <p className="text-2xl text-slate-200 mb-8 leading-relaxed font-medium">
                    {service.description}
                  </p>
                  <div className="flex flex-col gap-4 mb-10">
                    <p className="text-slate-200 flex items-center gap-3 text-lg">
                      <span className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-300" />
                      </span>
                      {service.location}
                    </p>
                    <p className="text-slate-200 flex items-center gap-3 text-lg">
                      <span className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-emerald-300" />
                      </span>
                      {service.date}
                    </p>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <button 
                      onClick={() => handleNavigation('/services')}
                      className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3 group"
                    >
                      تطوع الآن
                      <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => handleNavigation('/services')}
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all border-2 border-white/40 hover:border-white/60 flex items-center gap-3 group"
                    >
                      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      شاهد الفيديو
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-5 rounded-2xl transition-all hover:scale-110 shadow-2xl border border-white/30 group"
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-5 rounded-2xl transition-all hover:scale-110 shadow-2xl border border-white/30 group"
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 w-16 shadow-lg shadow-emerald-500/50' 
                  : 'bg-white/40 w-2.5 hover:bg-white/60 hover:w-8'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
              <TrendingUp className="w-5 h-5" />
              نمو مستمر
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">إنجازاتنا المتميزة</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              نفخر بما حققناه معاً في رحلتنا الجديدة نحو خدمة المجتمع
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Card */}
                  <div className="relative text-center p-10 rounded-3xl bg-gradient-to-br from-white to-slate-50/50 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-4 border border-slate-200/50 backdrop-blur-sm">
                    <div className={`inline-flex items-center justify-center w-24 h-24 ${getColorClasses(stat.color)} rounded-3xl mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-12 h-12" />
                    </div>
                    <h3 className="text-5xl font-black text-slate-800 mb-3">
                      {stat.number}
                    </h3>
                    <p className="text-slate-600 font-bold text-lg mb-3">{stat.label}</p>
                    
                    {/* Trend Indicator */}
                    <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Divider 1 */}
      <div className="relative h-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-500"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl rotate-45">
              <Sparkles className="w-6 h-6 text-white -rotate-45" />
            </div>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-teal-300 to-teal-500"></div>
          </div>
        </div>
        {/* Subtle floating circles */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-emerald-400 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-teal-400 rounded-full opacity-40 animate-float animation-delay-2000"></div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">لماذا تختارنا؟</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              نقدم تجربة فريدة تجمع بين الجودة والموثوقية والتأثير الحقيقي
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-all duration-500 blur-xl`}></div>
                  
                  {/* Card */}
                  <div className="relative text-center p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-4 border border-slate-100">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Divider 2 */}
      <div className="relative h-32 bg-gradient-to-b from-white to-white overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
            <div className="w-24 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            <Heart className="w-8 h-8 text-emerald-500 animate-pulse" />
            <div className="w-24 h-0.5 bg-gradient-to-l from-teal-400 to-cyan-400"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Services Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
              <Heart className="w-5 h-5" />
              فرص التطوع
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">الخدمات التطوعية</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              اختر الخدمة التي تناسبك وابدأ في إحداث فرق إيجابي في المجتمع
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.slice(0, 3).map((service, index) => (
              <div
                key={service.id}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-4 border border-slate-100">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    
                    <div className="absolute top-5 right-5 flex flex-col gap-2">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl">
                        <Sparkles className="w-4 h-4" />
                        {service.type}
                      </span>
                      <span className="bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {service.volunteers}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-800 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <p className="text-sm text-slate-500 flex items-center gap-3 font-semibold">
                        <span className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                        </span>
                        {service.location}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-3 font-semibold">
                        <span className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </span>
                        {service.date}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleNavigation('/services')}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group/btn"
                    >
                      تطوع الآن
                      <CheckCircle className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => handleNavigation('/services')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3 group"
            >
              عرض جميع الخدمات التطوعية
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Decorative Divider 3 */}
      <div className="relative h-40 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path
            d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 T1500,50 T1800,50 V100 H0 Z"
            fill="url(#wave-gradient)"
            className="animate-wave"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce animation-delay-1000"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Paid Services Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
              <Award className="w-5 h-5" />
              خدمات مميزة
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">الخدمات المدفوعة</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              خدمات احترافية بأسعار مناسبة من خبراء في مجالاتهم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-amber-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-4 border border-slate-100">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                    
                    <div className="absolute top-5 right-5">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl">
                        <Gift className="w-4 h-4" />
                        {service.type}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-2xl">
                      <span className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{service.price}</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-black text-slate-800">
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-xl">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-black text-slate-800">{service.rating}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-8 text-sm text-slate-600 font-semibold">
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-yellow-500" />
                        {service.students} طالب
                      </span>
                    </div>

                    <button 
                      onClick={() => handleNavigation('/services')}
                      className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => handleNavigation('/services')}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3 group"
            >
              عرض جميع الخدمات المدفوعة
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">آراء عملائنا</h2>
            <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed">
              تجارب حقيقية من أشخاص حقيقيين غيروا حياتهم من خلال المنصة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl border-2 border-white/30 hover:bg-white/25 transition-all transform hover:-translate-y-4 hover:border-white/50 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white/40 shadow-xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xl">{testimonial.name}</h4>
                      <p className="text-white/80 text-sm font-semibold">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white leading-relaxed text-lg font-medium mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-6 py-3 rounded-full mb-8 font-bold border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
            ابدأ رحلتك اليوم
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
            كن جزءاً من
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              التغيير الإيجابي
            </span>
          </h2>
          <p className="text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
            انضم إلى مئات المتطوعين الذين يساهمون في بناء مجتمع أفضل وأكثر تكافلاً
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <button 
              onClick={() => handleNavigation('/register')}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-14 py-6 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-4 group"
            >
              ابدأ التطوع الآن
              <ArrowLeft className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => handleNavigation('/services')}
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-14 py-6 rounded-2xl font-bold text-2xl hover:bg-white/20 transition-all inline-flex items-center gap-4 group"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              تعرف علينا أكثر
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Participate</h3>
                  <p className="text-xs text-emerald-400 font-bold">& Make A Change</p>
                </div>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                نربط بين المتطوعين والفرص التطوعية لبناء مجتمع أفضل وأكثر تكافلاً
              </p>
              <div className="flex gap-3">
                {['📘', '📷', '🐦', '💼'].map((emoji, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-12 h-12 bg-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 hover:rotate-6"
                  >
                    <span className="text-xl">{emoji}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 text-white">روابط سريعة</h4>
              <ul className="space-y-3 text-slate-400">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => handleNavigation(item.path)}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-2 font-semibold group"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 text-white">الدعم</h4>
              <ul className="space-y-3 text-slate-400">
                {['الأسئلة الشائعة', 'اتصل بنا', 'سياسة الخصوصية', 'الشروط والأحكام', 'مركز المساعدة'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2 font-semibold group">
                      <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 text-white">تواصل معنا</h4>
              <ul className="space-y-5 text-slate-400">
                {[
                  { icon: '📧', label: 'البريد', value: 'info@participate.org' },
                  { icon: '📞', label: 'الهاتف', value: '+962 6 123 4567' },
                  { icon: '📍', label: 'العنوان', value: 'عمّان، الأردن' }
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3 group">
                    <div className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-all">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-white font-bold mb-1">{item.label}</p>
                      <span className="text-sm">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-center md:text-right font-semibold">
                © 2024 Participate & Make A Change. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-8 text-slate-400 text-sm font-semibold">
                {['الخصوصية', 'الشروط', 'ملفات تعريف الارتباط'].map((item) => (
                  <a key={item} href="#" className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
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

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

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

        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes wave {
          0% {
            d: path("M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 T1500,50 T1800,50 V100 H0 Z");
          }
          50% {
            d: path("M0,50 Q150,80 300,50 T600,50 T900,50 T1200,50 T1500,50 T1800,50 V100 H0 Z");
          }
          100% {
            d: path("M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 T1500,50 T1800,50 V100 H0 Z");
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.4s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Mainpage;