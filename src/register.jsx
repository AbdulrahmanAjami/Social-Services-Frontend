import React, { useState } from 'react';
import axios from 'axios';
import {
  Upload, X, User, Mail, Lock, Phone, Calendar,
  Image as ImageIcon, Check, AlertCircle, HeartHandshake, ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ButtonSkeleton } from './components/Skeleton';

// ─── Shared input class ───────────────────────────────────────────────────────
const INPUT_BASE = 'w-full rounded-xl border-2 px-3 py-2.5 text-sm outline-none transition disabled:opacity-60';
const INPUT_OK   = `${INPUT_BASE} border-slate-200 bg-white text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100`;
const INPUT_ERR  = `${INPUT_BASE} border-red-400 bg-red-50 text-slate-800 focus:border-red-500 focus:ring-2 focus:ring-red-100`;

const Register = () => {
  const navigate = useNavigate();

  // ── All state identical to original ──────────────────────────────────────
  const [user, setUser] = useState({
    firstName: '', secondName: '', lastName: '', email: '',
    phone: '', age: '', username: '', password: '', confirmPassword: '', imagePath: '',
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [errors, setErrors]           = useState({});

  // ── Handlers identical to original ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors({ ...errors, image: 'يرجى اختيار صورة فقط!' }); return; }
    if (file.size > 5 * 1024 * 1024)    { setErrors({ ...errors, image: 'حجم الصورة يجب أن يكون أقل من 5MB' }); return; }
    setImageFile(file);
    setErrors({ ...errors, image: '' });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUser({ ...user, imagePath: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!user.username.trim())  newErrors.username  = 'اسم المستخدم مطلوب';
    if (!user.email.trim())     newErrors.email     = 'البريد الإلكتروني مطلوب';
    if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!user.password)                   newErrors.password = 'كلمة المرور مطلوبة';
    if (user.password.length < 6)         newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (user.password !== user.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('RegisterRequestDTO.FirstName', user.firstName);
    formData.append('RegisterRequestDTO.SecondName', user.secondName || user.username);
    formData.append('RegisterRequestDTO.LastName', user.lastName || '');
    formData.append('RegisterRequestDTO.Email', user.email);
    formData.append('RegisterRequestDTO.Phone', user.phone || '');
    formData.append('RegisterRequestDTO.Age', user.age ? parseInt(user.age) : 0);
    formData.append('RegisterRequestDTO.Username', user.username);
    formData.append('RegisterRequestDTO.PasswordHash', user.password);
    formData.append('RegisterRequestDTO.IsActive', true);
    formData.append('RegisterRequestDTO.CreationDate', new Date().toISOString());
    if (imageFile) formData.append('postImage', imageFile);

    const response = await axios.post(
      'https://localhost:7244/api/Authentication/Register User',
      formData
    );
    console.log('✅ Success:', response.data);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  } catch (error) {
    console.error('❌ Error:', error.response?.data);
    if (error.response?.data?.errors) {
      const serverErrors = error.response.data.errors;
      const formattedErrors = {};
      Object.keys(serverErrors).forEach(field => {
        if (Array.isArray(serverErrors[field])) formattedErrors[field.toLowerCase()] = serverErrors[field][0];
      });
      setErrors(formattedErrors);
    } else {
      setErrors({ general: error.response?.data?.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' });
    }
  } finally {
    setLoading(false);
  }
};



  

  // ── Field config ──────────────────────────────────────────────────────────
  const fields = [
    { label: 'الاسم الأول',         name: 'firstName',       type: 'text',     icon: User,     placeholder: 'محمد',             required: true },
    { label: 'الاسم الأخير',        name: 'lastName',        type: 'text',     icon: User,     placeholder: 'أحمد',             required: false },
    { label: 'اسم المستخدم',        name: 'username',        type: 'text',     icon: User,     placeholder: 'mohammed123',      required: true },
    { label: 'البريد الإلكتروني',  name: 'email',           type: 'email',    icon: Mail,     placeholder: 'example@email.com',required: true },
    { label: 'رقم الهاتف',          name: 'phone',           type: 'tel',      icon: Phone,    placeholder: '0512345678',       required: false },
    { label: 'العمر',               name: 'age',             type: 'number',   icon: Calendar, placeholder: '25',               required: false },
    { label: 'كلمة المرور',         name: 'password',        type: 'password', icon: Lock,     placeholder: '6 أحرف على الأقل', required: true },
    { label: 'تأكيد كلمة المرور',  name: 'confirmPassword', type: 'password', icon: Lock,     placeholder: 'أعد كتابة كلمة المرور', required: true },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4" dir="rtl">

      {/* ── Decorative background ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-[600px] rounded-full border border-emerald-200/20 animate-ping" style={{ animationDuration: '7s' }} />
          <div className="absolute inset-0 size-[600px] rounded-full border border-teal-200/15 animate-ping" style={{ animationDuration: '9s', animationDelay: '2s' }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <button onClick={() => navigate('/')} className="group flex items-center gap-3">
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <HeartHandshake className="size-7 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-amber-400 ring-2 ring-white" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xl font-black text-slate-900">
                <span className="text-emerald-600">شارك</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">وأحدث فرقاً</span>
            </span>
          </button>
          <div className="mt-2">
            <h2 className="text-2xl font-black text-slate-900">إنشاء حساب جديد ✨</h2>
            <p className="mt-1 text-sm text-slate-500">انضم إلينا وكن جزءاً من التغيير الإيجابي</p>
          </div>
        </div>

        {/* ── Global alerts ─────────────────────────────────────────────── */}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600">
              <Check className="size-5 text-white" />
            </span>
            <div>
              <p className="font-bold text-emerald-800">🎉 تم التسجيل بنجاح!</p>
              <p className="text-xs text-emerald-600">جاري التوجيه لصفحة تسجيل الدخول...</p>
            </div>
          </div>
        )}
        {errors.general && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle className="size-5 shrink-0 text-red-500" />
            <p className="text-sm font-semibold text-red-700">{errors.general}</p>
          </div>
        )}

        {/* ── Form card ────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          {/* Card header */}
          <div className="bg-emerald-600 px-6 py-4">
            <h3 className="font-black text-white">بيانات الحساب</h3>
            <p className="mt-0.5 text-xs text-emerald-100">الحقول المعلّمة بـ * مطلوبة</p>
          </div>

          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-3">

              {/* ── Image upload column ──────────────────────────────────── */}
              <div className="flex flex-col items-center justify-start gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 lg:col-span-1">
                <h4 className="text-sm font-extrabold text-slate-700">الصورة الشخصية</h4>

                {/* Avatar preview */}
                <div className="relative">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview"
                        className="size-28 rounded-full border-4 border-emerald-400 object-cover shadow-xl" />
                      <button type="button" onClick={handleRemoveImage}
                        className="absolute -right-1 -top-1 flex size-8 items-center justify-center rounded-full bg-red-500 shadow-md transition hover:bg-red-600">
                        <X className="size-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="flex size-28 items-center justify-center rounded-full border-4 border-dashed border-slate-300 bg-white">
                      <User className="size-12 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* File input */}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={loading} />
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
                    <Upload className="size-4" /> اختر صورة
                  </span>
                </label>

                <span className="text-xs text-slate-400">أو</span>

                <div className="w-full">
                  <label className="mb-1 block text-xs font-bold text-slate-500">رابط الصورة</label>
                  <input type="text" name="imagePath" value={user.imagePath}
                    onChange={handleChange} placeholder="https://..."
                    disabled={loading || !!imageFile}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-emerald-400 disabled:opacity-50" />
                </div>

                {errors.image && <p className="text-xs font-semibold text-red-500">{errors.image}</p>}

                <p className="text-center text-xs leading-relaxed text-slate-400">
                  PNG, JPG, GIF<br />حجم أقصى 5MB
                </p>
              </div>

              {/* ── Fields grid ──────────────────────────────────────────── */}
              <div className="grid gap-4 md:grid-cols-2 lg:col-span-2 lg:content-start">
                {fields.map(({ label, name, type, icon: Icon, placeholder, required }) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-sm font-bold text-slate-700">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <Icon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={type} name={name} value={user[name]}
                        onChange={handleChange} placeholder={placeholder}
                        disabled={loading}
                        min={name === 'age' ? 1 : undefined}
                        max={name === 'age' ? 120 : undefined}
                        className={`${errors[name] ? INPUT_ERR : INPUT_OK} pr-10`}
                      />
                    </div>
                    {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Submit ───────────────────────────────────────────────── */}
            <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6">
              <button type="submit" disabled={loading || success}
                className="inline-flex min-w-[280px] items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-8 py-3.5 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? (
                  <><ButtonSkeleton /> جاري التسجيل...</>
                ) : success ? (
                  <><Check className="size-5" /> تم التسجيل ✓</>
                ) : (
                  <><User className="size-5" /> إنشاء الحساب</>
                )}
              </button>

              <p className="text-sm text-slate-500">
                لديك حساب بالفعل؟{' '}
                <button type="button" onClick={() => navigate('/login')}
                  className="font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline">
                  تسجيل الدخول
                </button>
              </p>

              <button type="button" onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-slate-600">
                <ArrowLeft className="size-3.5 rotate-180" /> العودة للرئيسية
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;