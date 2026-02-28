import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, 
  Sparkles, 
  Home, 
  Award,
  Trophy,
  Star,
  TrendingUp,
  Heart,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Medal,
  Target,
  Zap
} from 'lucide-react';

const VolunteerOfTheMonth = () => {
  const navigate = useNavigate();
  const [currentActivitySlide, setCurrentActivitySlide] = useState(0);
  const [activeTab, setActiveTab] = useState('month'); // للتبديل بين الشهر والأعلى على الإطلاق

  // بيانات متطوع الشهر
  const volunteerOfMonth = {
    name: 'سارة أحمد محمد',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    points: 850,
    activitiesCount: 12,
    hoursVolunteered: 45,
    month: 'فبراير 2024',
    description: 'متطوعة مميزة بجهودها الرائعة في خدمة المجتمع وتفانيها في مساعدة الآخرين'
  };

  // صور نشاطات المتطوع
  const volunteerActivities = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
      title: 'زيارة مستشفى الأطفال',
      date: '2024-02-15'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80',
      title: 'حملة تنظيف الحي',
      date: '2024-02-20'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
      title: 'توزيع الطعام',
      date: '2024-02-25'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
      title: 'تعليم الأطفال',
      date: '2024-02-28'
    }
  ];

  // أنشطة الشهر (Slider)
  const monthActivities = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80',
      title: 'زيارة مستشفى الأطفال',
      description: 'مبادرة لرسم البسمة على وجوه الأطفال المرضى',
      volunteers: 45
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80',
      title: 'تنظيف الشواطئ',
      description: 'حملة نظافة شاملة للحفاظ على البيئة',
      volunteers: 60
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80',
      title: 'توزيع وجبات ساخنة',
      description: 'توزيع الطعام على الأسر المحتاجة',
      volunteers: 35
    }
  ];

  // أعلى 10 متطوعين هذا الشهر
  const topVolunteersMonth = [
    { name: 'سارة أحمد', points: 850, rank: 1 },
    { name: 'محمد علي', points: 720, rank: 2 },
    { name: 'فاطمة حسن', points: 680, rank: 3 },
    { name: 'أحمد خالد', points: 650, rank: 4 },
    { name: 'نور الدين', points: 620, rank: 5 },
    { name: 'ليلى محمود', points: 590, rank: 6 },
    { name: 'عمر يوسف', points: 560, rank: 7 },
    { name: 'هدى سامي', points: 530, rank: 8 },
    { name: 'زيد عبدالله', points: 500, rank: 9 },
    { name: 'مريم سعيد', points: 470, rank: 10 }
  ];

  // أعلى 10 متطوعين على الإطلاق
  const topVolunteersAllTime = [
    { name: 'محمد علي', points: 5240, rank: 1 },
    { name: 'فاطمة حسن', points: 4890, rank: 2 },
    { name: 'سارة أحمد', points: 4560, rank: 3 },
    { name: 'أحمد خالد', points: 3920, rank: 4 },
    { name: 'عمر يوسف', points: 3650, rank: 5 },
    { name: 'ليلى محمود', points: 3420, rank: 6 },
    { name: 'نور الدين', points: 3180, rank: 7 },
    { name: 'زيد عبدالله', points: 2940, rank: 8 },
    { name: 'هدى سامي', points: 2710, rank: 9 },
    { name: 'مريم سعيد', points: 2480, rank: 10 }
  ];

  const maxPointsMonth = Math.max(...topVolunteersMonth.map(v => v.points));
  const maxPointsAllTime = Math.max(...topVolunteersAllTime.map(v => v.points));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActivitySlide((prev) => (prev + 1) % monthActivities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextActivitySlide = () => {
    setCurrentActivitySlide((prev) => (prev + 1) % monthActivities.length);
  };

  const prevActivitySlide = () => {
    setCurrentActivitySlide((prev) => (prev - 1 + monthActivities.length) % monthActivities.length);
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: { color: 'from-yellow-400 to-amber-500', icon: Trophy, glow: 'shadow-yellow-500/50' },
      2: { color: 'from-slate-300 to-slate-400', icon: Medal, glow: 'shadow-slate-400/50' },
      3: { color: 'from-orange-400 to-orange-500', icon: Medal, glow: 'shadow-orange-400/50' }
    };
    return badges[rank] || { color: 'from-emerald-400 to-teal-500', icon: Star, glow: 'shadow-emerald-500/50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-500 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-5 py-2.5 rounded-full mb-6 font-bold shadow-lg">
            <Trophy className="w-5 h-5" />
            متطوع الشهر
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-4">
            <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              تكريم الأفضل
            </span>
          </h1>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
            نحتفل بمتطوعنا المميز لهذا الشهر تقديراً لجهوده المتميزة وإخلاصه في خدمة المجتمع
          </p>
        </div>

        {/* Volunteer of the Month Card */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Celebration Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            </div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: ['#10b981', '#14b8a6', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Image with Trophy */}
                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-pulse z-20">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full blur-2xl opacity-40 animate-pulse-slow"></div>
                  
                  <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-2 shadow-2xl">
                    <img
                      src={volunteerOfMonth.image}
                      alt={volunteerOfMonth.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                    />
                  </div>

                  {/* Decorative Stars */}
                  <Star className="absolute -bottom-2 -left-2 w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" />
                  <Sparkles className="absolute -top-2 -left-4 w-6 h-6 text-amber-400 animate-pulse" />
                </div>

                {/* Volunteer Info */}
                <div className="flex-1 text-center md:text-right">
                  <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300 font-bold">{volunteerOfMonth.month}</span>
                  </div>
                  
                  <h2 className="text-5xl font-black text-white mb-4">
                    {volunteerOfMonth.name}
                  </h2>
                  
                  <p className="text-slate-300 text-xl mb-8 leading-relaxed">
                    {volunteerOfMonth.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-3xl font-black text-white mb-1">{volunteerOfMonth.points}</p>
                      <p className="text-slate-400 text-sm font-semibold">نقطة</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Target className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-black text-white mb-1">{volunteerOfMonth.activitiesCount}</p>
                      <p className="text-slate-400 text-sm font-semibold">نشاط</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className="w-6 h-6 text-teal-400" />
                      </div>
                      <p className="text-3xl font-black text-white mb-1">{volunteerOfMonth.hoursVolunteered}</p>
                      <p className="text-slate-400 text-sm font-semibold">ساعة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Activities Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-4">نشاطات المتطوع</h2>
            <p className="text-slate-600 text-lg">بعض من الأنشطة التي شارك بها هذا الشهر</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-lg mb-2">{activity.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(activity.date).toLocaleDateString('ar-JO')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Month Activities Slider */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-4">أنشطة الشهر</h2>
            <p className="text-slate-600 text-lg">أبرز الأنشطة التطوعية التي نفذت هذا الشهر</p>
          </div>

          <div className="relative h-[500px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            {monthActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentActivitySlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 z-10" />
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container mx-auto px-8">
                    <div className="max-w-2xl">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl mb-6">
                        <Users className="w-4 h-4" />
                        {activity.volunteers} متطوع
                      </span>
                      <h3 className="text-5xl font-black text-white mb-4">{activity.title}</h3>
                      <p className="text-2xl text-slate-200 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevActivitySlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-4 rounded-2xl transition-all hover:scale-110 shadow-2xl border border-white/30"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextActivitySlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-4 rounded-2xl transition-all hover:scale-110 shadow-2xl border border-white/30"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {monthActivities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentActivitySlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentActivitySlide 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 w-16 shadow-lg shadow-emerald-500/50' 
                      : 'bg-white/40 w-2.5 hover:bg-white/60 hover:w-8'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Volunteers Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center p-8 pb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-5 py-2.5 rounded-full mb-4 font-bold shadow-lg">
                <TrendingUp className="w-5 h-5" />
                المتصدرون
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-2">أعلى 10 متطوعين</h2>
              <p className="text-slate-600 text-lg">المتطوعون الأكثر نشاطاً</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-4 px-8 pb-6">
              <button
                onClick={() => setActiveTab('month')}
                className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === 'month'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                هذا الشهر
              </button>
              <button
                onClick={() => setActiveTab('allTime')}
                className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  activeTab === 'allTime'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                الأعلى على الإطلاق
              </button>
            </div>

            {/* Volunteers List */}
            <div className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-4">
                {(activeTab === 'month' ? topVolunteersMonth : topVolunteersAllTime).map((volunteer) => {
                  const badge = getRankBadge(volunteer.rank);
                  const BadgeIcon = badge.icon;
                  const percentage = (volunteer.points / (activeTab === 'month' ? maxPointsMonth : maxPointsAllTime)) * 100;

                  return (
                    <div
                      key={volunteer.rank}
                      className="group relative"
                    >
                      <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:border-emerald-300">
                        {/* Rank Badge */}
                        <div className={`w-11 h-11 bg-gradient-to-br ${badge.color} rounded-lg flex items-center justify-center shadow-lg ${badge.glow} transform group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0`}>
                          {volunteer.rank <= 3 ? (
                            <BadgeIcon className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white font-black text-sm">{volunteer.rank}</span>
                          )}
                        </div>

                        {/* Name and Progress */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-slate-800 truncate">{volunteer.name}</h3>
                            <div className="flex items-center gap-1 flex-shrink-0 mr-2">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              <span className="text-lg font-black text-slate-800">{volunteer.points}</span>
                            </div>
                          </div>
                          
                          {/* Compact Progress Bar */}
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${badge.color} rounded-full transition-all duration-1000 shadow-sm`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
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

        .animate-float {
          animation: float linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VolunteerOfTheMonth;