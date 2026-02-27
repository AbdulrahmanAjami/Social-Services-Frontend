import React, { useState } from 'react';
import { 
  ArrowRight, 
  Mail, 
  Linkedin, 
  Github, 
  Twitter,
  MapPin,
  Briefcase,
  Award,
  Users,
  Heart,
  Star,
  Quote,
  Handshake,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeamPage = () => {
  const navigate = useNavigate();
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "محمود عباد",
      role: "Back-end developer",
      image: "/official_suit_photo_2.png",
      bio: "",
      location: "عمّان، الأردن",
      email: "ahmed@participate.org",
      linkedin: "#",
      twitter: "#",
      achievements: "",
      quote: "التغيير يبدأ بخطوة واحدة"
    },
    {
      id: 2,
      name: "يوسف الحمد",
      role: "Back-end developer",
      image: "/official_suit_photo_3_black_hair.png",
      bio: "",
      location: "عمّان، الأردن",
      email: "sara@participate.org",
      linkedin: "#",
      twitter: "#",
      achievements: "",
      quote: "معاً نصنع الفرق"
    },
    {
      id: 3,
      name: "فراس سامي",
      role: "Front-end developer",
      image: "/official_suit_photo_4.png",
      bio: "",
      location: "عمّان، الأردن",
      email: "khaled@participate.org",
      linkedin: "#",
      github: "#",
      achievements: "",
      quote: "التكنولوجيا في خدمة الإنسانية"
    },
    {
      id: 4,
      name: "عبدالرحمن عجمي",
      role: "Front-end developer",
      image: "/official_suit_photo_original_face.png",
      bio: "",
      location: "عمّان، الأردن",
      email: "laila@participate.org",
      linkedin: "#",
      twitter: "#",
      achievements: "",
      quote: "الشراكات تصنع النجاح"
    }
  ];

  const stats = [
    { icon: Users, number: "4", label: "أعضاء الفريق" },
    { icon: Award, number: "5+", label: "سنوات خبرة" },
    { icon: Heart, number: "100+", label: "حياة تم تغييرها" },
    { icon: Star, number: "100%", label: "التزام وشغف" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section - مطابق للصفحة الرئيسية */}
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => navigate('/')}
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
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-5 py-2.5 rounded-full mb-6 font-bold border border-emerald-500/30">
              <Users className="w-5 h-5" />
              تعرف على الفريق
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              فريق العمل
            </h1>
            <p className="text-2xl text-slate-300 mb-8 leading-relaxed">
              أشخاص متحمسون يعملون معاً لإحداث فرق حقيقي في المجتمع
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <Icon className="w-8 h-8 text-emerald-400 mb-3 mx-auto" />
                    <h3 className="text-3xl font-black text-white mb-1">{stat.number}</h3>
                    <p className="text-slate-300 text-sm font-semibold">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-24 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-40 left-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-40 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Card */}
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-4 border border-slate-100">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                    
                    {/* Quick Info Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl">
                      {member.achievements}
                    </div>

                    {/* Quote on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-emerald-500/95 to-teal-500/95 flex items-center justify-center p-6 transition-all duration-500 ${
                      hoveredMember === member.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="text-center">
                        <Quote className="w-12 h-12 text-white/50 mb-4 mx-auto" />
                        <p className="text-white text-lg font-bold leading-relaxed">
                          "{member.quote}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-6">
                    {/* Name & Role */}
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-black text-slate-800 mb-2">
                        {member.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm">
                        <Briefcase className="w-4 h-4" />
                        {member.role}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-slate-600 text-center mb-4 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{member.location}</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 group/social"
                      >
                        <Mail className="w-5 h-5 text-slate-600 group-hover/social:text-white transition-colors" />
                      </a>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          className="w-10 h-10 bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 group/social"
                        >
                          <Linkedin className="w-5 h-5 text-slate-600 group-hover/social:text-white transition-colors" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          className="w-10 h-10 bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 group/social"
                        >
                          <Twitter className="w-5 h-5 text-slate-600 group-hover/social:text-white transition-colors" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          className="w-10 h-10 bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 group/social"
                        >
                          <Github className="w-5 h-5 text-slate-600 group-hover/social:text-white transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            هل تريد الانضمام لفريقنا؟
          </h2>
          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            نبحث دائماً عن أشخاص متحمسين للانضمام إلينا في رحلة التغيير
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
            >
              تواصل معنا
              <Mail className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all inline-flex items-center gap-3"
            >
              استكشف الخدمات
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 Participate & Make A Change. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      <style jsx>{`
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

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default TeamPage;