import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, User, Mail, Lock, Phone, Calendar, Image as ImageIcon, Check, AlertCircle, Handshake, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    username: '',
    password: '',
    confirmPassword: '',
    imagePath: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'يرجى اختيار صورة فقط!' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'حجم الصورة يجب أن يكون أقل من 5MB' });
        return;
      }
      
      setImageFile(file);
      setErrors({ ...errors, image: '' });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUser({ ...user, imagePath: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!user.username.trim()) newErrors.username = 'اسم المستخدم مطلوب';
    if (!user.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!user.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (user.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (user.password !== user.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let imagePath = "default.png";
      
      if (imageFile) {
        const timestamp = Date.now();
        const extension = imageFile.name.split('.').pop();
        const safeName = user.username.replace(/[^a-zA-Z0-9]/g, '_');
        imagePath = `${safeName}_${timestamp}.${extension}`;
        
        console.log('🖼️ Generated Image Path:', imagePath);
      } else if (user.imagePath.trim()) {
        imagePath = user.imagePath.trim();
      }
      
      const payload = {
        Email: user.email,
        FirstName: user.firstName,
        Imagepath: imagePath,
        PasswordHash: user.password,
        UserName: user.username,
        LastName: user.lastName || "",
        secondName: user.secondName || user.username,
        Phone: user.phone || "",
        Age: user.age ? parseInt(user.age) : 0,
        IsActive: true,
        CreationDate: new Date().toISOString()
      };
      
      console.log('📤 Sending payload:', payload);
      console.log('📸 Image Path:', payload.Imagepath);
      
      const response = await axios.post(
        'https://localhost:7244/api/Authentication/Register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Success:', response.data);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error:', error.response?.data);
      
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const formattedErrors = {};
        
        Object.keys(serverErrors).forEach(field => {
          if (Array.isArray(serverErrors[field])) {
            formattedErrors[field.toLowerCase()] = serverErrors[field][0];
          }
        });
        
        setErrors(formattedErrors);
      } else {
        setErrors({ 
          general: error.response?.data?.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        
        {/* Subtle Rings in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border border-emerald-200/20 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-0 w-96 h-96 border border-teal-200/15 rounded-full animate-ping-slow animation-delay-2000"></div>
          <div className="absolute inset-0 w-96 h-96 border border-cyan-200/10 rounded-full animate-ping-slow animation-delay-4000"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
                           linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-15 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/2 w-2.5 h-2.5 bg-emerald-300 rounded-full opacity-10 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-emerald-500 rounded-full opacity-25 animate-float animation-delay-3000"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-teal-500 rounded-full opacity-20 animate-float animation-delay-1500"></div>
        
        {/* Subtle Gradient Spots */}
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-emerald-200/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/5 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        
        {/* Subtle Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-5">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className="animate-wave" fill="url(#gradient1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(16 185 129)" />
                <stop offset="50%" stopColor="rgb(20 184 166)" />
                <stop offset="100%" stopColor="rgb(6 182 212)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Gradient Orbs in Corners */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-200/10 to-emerald-200/10 rounded-full blur-2xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center gap-4 cursor-pointer group mb-4"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                <div className="relative">
                  <Handshake className="w-8 h-8 text-white" strokeWidth={2.5} />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
                </div>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Participate
                </span>
                {' & '}
                <span className="text-slate-700">Make</span>
              </h1>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600">
                A CHANGE
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">إنشاء حساب جديد</h2>
          <p className="text-slate-600">انضم إلينا وكن جزءاً من التغيير الإيجابي</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-4 animate-fadeIn">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-800">🎉 تم التسجيل بنجاح!</h3>
                <p className="text-sm text-emerald-700">جاري التوجيه...</p>
              </div>
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 animate-fadeIn">
            <div className="flex items-center gap-3 justify-center">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <p className="text-rose-700 font-semibold text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-200">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-4">الصورة الشخصية</h3>
              
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-emerald-400 shadow-xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 w-8 h-8 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300">
                    <User className="w-14 h-14 text-slate-400" />
                  </div>
                )}
              </div>

              <label className="cursor-pointer mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all transform hover:scale-105 shadow-lg">
                  <Upload className="w-4 h-4" />
                  <span>اختر صورة</span>
                </div>
              </label>

              <span className="text-slate-500 text-xs mb-2">أو</span>

              <input
                type="text"
                name="imagePath"
                value={user.imagePath}
                onChange={handleChange}
                placeholder="رابط الصورة"
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                disabled={loading || imageFile}
              />

              {errors.image && (
                <p className="text-rose-500 text-xs mt-2 font-semibold">{errors.image}</p>
              )}
            </div>

            {/* Right Columns - Form Fields */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
              {/* الاسم الأول */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">الاسم الأول *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    placeholder="محمد"
                    className={`w-full pr-10 pl-3 py-2.5 border-2 rounded-lg text-sm transition-all outline-none ${
                      errors.firstName
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-rose-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* الاسم الأخير */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">الاسم الأخير</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                    placeholder="أحمد"
                    className="w-full pr-10 pl-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* اسم المستخدم */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">اسم المستخدم *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="mohammed123"
                    className={`w-full pr-10 pl-3 py-2.5 border-2 rounded-lg text-sm transition-all outline-none ${
                      errors.username
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.username && (
                  <p className="text-rose-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={`w-full pr-10 pl-3 py-2.5 border-2 rounded-lg text-sm transition-all outline-none ${
                      errors.email
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="0512345678"
                    className="w-full pr-10 pl-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* العمر */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">العمر</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="1"
                    max="120"
                    className="w-full pr-10 pl-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="6 أحرف على الأقل"
                    className={`w-full pr-10 pl-3 py-2.5 border-2 rounded-lg text-sm transition-all outline-none ${
                      errors.password
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder="أعد كتابة كلمة المرور"
                    className={`w-full pr-10 pl-3 py-2.5 border-2 rounded-lg text-sm transition-all outline-none ${
                      errors.confirmPassword
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    }`}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full md:w-auto min-w-[300px] py-3 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                loading || success
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التسجيل...
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  تم التسجيل ✓
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </button>

            <p className="text-slate-600 text-sm">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </form>
      </div>

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
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) translateX(5px);
            opacity: 0.5;
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animate-float {
          animation: float 15s infinite ease-in-out;
        }

        .animate-wave {
          animation: wave 25s infinite linear;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 6s infinite ease-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;