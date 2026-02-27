import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, LogOut, Mail, Phone, Calendar, Shield, Home, Edit, Trash2, Plus,
  Upload, X, Check, Clock, AlertCircle, UserCheck, UserX,
  Image as ImageIcon, Handshake, CheckCircle, XCircle,
  Briefcase, FileText, Star, Award, Lock, Eye, EyeOff, KeyRound
} from 'lucide-react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://localhost:7244/api';

/* ── Colour palette matching the dark teal-slate hero ── */
const C = {
  bg:         '#0b1a24',
  surface:    '#0f2233',
  surfaceAlt: '#122840',
  border:     'rgba(20,200,160,0.12)',
  borderHov:  'rgba(20,200,160,0.28)',
  teal:       '#14c8a0',
  tealDim:    'rgba(20,200,160,0.15)',
  tealGlow:   'rgba(20,200,160,0.07)',
  cyan:       '#22d3ee',
  grad:       'linear-gradient(135deg,#14c8a0,#22d3ee)',
  gradSoft:   'linear-gradient(135deg,rgba(20,200,160,0.15),rgba(34,211,238,0.08))',
  text:       '#d6f0ea',
  textMuted:  '#7faaa0',
  textDim:    '#3d6b60',
  error:      '#f87171',
  errorBg:    'rgba(248,113,113,0.10)',
  success:    '#34d399',
  successBg:  'rgba(52,211,153,0.10)',
};

/* ── Star Rating ── */
const StarRating = ({ value, onChange, readonly = false }) => {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" disabled={readonly}
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHov(s)}
          onMouseLeave={() => !readonly && setHov(0)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}>
          <Star className={`w-7 h-7 transition-colors ${(hov||value)>=s ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}/>
        </button>
      ))}
    </div>
  );
};

/* ── Modal wrapper ── */
const Modal = ({ children, onClose, maxWidth = 'max-w-3xl' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background:'rgba(4,12,18,0.88)', backdropFilter:'blur(14px)' }}
    onClick={e => e.target===e.currentTarget && onClose()}>
    <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border`}
      style={{ background:C.surface, borderColor:C.border,
        boxShadow:`0 30px 80px rgba(0,0,0,0.6),0 0 0 1px ${C.border}`,
        animation:'modalIn .25s cubic-bezier(.34,1.56,.64,1)' }}>
      {children}
    </div>
  </div>
);

/* ── Text field ── */
const Field = ({ label, type='text', value, onChange, disabled, placeholder, icon }) => (
  <div>
    <label className="block text-sm font-bold mb-2" style={{color:C.textMuted}}>{label}</label>
    <div className="relative">
      {icon && <span className="absolute right-4 top-1/2 -translate-y-1/2" style={{color:C.teal}}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
        style={{ background:disabled?C.tealGlow:C.surfaceAlt, border:`1.5px solid ${C.border}`, color:C.text }}
        className={`w-full ${icon?'pr-11':'px-4'} pl-4 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:border-teal-400 disabled:opacity-50 placeholder:text-slate-600`}/>
    </div>
  </div>
);

/* ── Password field with show/hide ── */
const PwField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-bold mb-2" style={{color:C.textMuted}}>{label}</label>
      <div className="relative">
        <Lock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2" style={{color:C.teal}}/>
        <input type={show?'text':'password'} value={value} onChange={onChange} placeholder={placeholder}
          style={{ background:C.surfaceAlt, border:`1.5px solid ${C.border}`, color:C.text }}
          className="w-full pr-11 pl-11 py-3 rounded-xl text-sm font-medium outline-none transition-all focus:border-teal-400 placeholder:text-slate-600"/>
        <button type="button" onClick={()=>setShow(s=>!s)}
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
          style={{color:show?C.teal:C.textDim}}>
          {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
        </button>
      </div>
    </div>
  );
};

/* ── Status badge ── */
const Badge = ({ status }) => {
  const map = {
    accepted:{ bg:'rgba(52,211,153,0.12)', border:'rgba(52,211,153,0.3)', color:'#34d399', icon:<CheckCircle className="w-3.5 h-3.5"/>, label:'مقبول' },
    rejected: { bg:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.3)', color:'#f87171', icon:<XCircle className="w-3.5 h-3.5"/>, label:'مرفوض' },
    pending:  { bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.3)', color:'#fbbf24', icon:<Clock className="w-3.5 h-3.5"/>, label:'قيد المراجعة' },
  };
  const c = map[status]||map.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
      style={{ background:c.bg, border:`1px solid ${c.border}`, color:c.color }}>
      {c.icon}{c.label}
    </span>
  );
};

/* ════════════════════════════════════════
   Profile Component
════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout, updateUser } = useAuth();

  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    firstName:'', secondName:'', lastName:'',
    email:'', phone:'', age:'', imagepath:''
  });
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* password */
  const [pw, setPw]           = useState({ current:'', next:'', confirm:'' });
  const [pwLoading,setPwLoad] = useState(false);
  const [pwError,  setPwErr]  = useState('');
  const [pwOk,     setPwOk]   = useState('');

  /* posts */
  const [userPosts,    setUserPosts]    = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [appliedSvcs,  setAppliedSvcs] = useState([]);

  /* modals */
  const [showApplicants,  setShowApplicants]  = useState(false);
  const [showEditPost,    setShowEditPost]     = useState(false);
  const [showDelete,      setShowDelete]       = useState(false);
  const [showMsgModal,    setShowMsgModal]     = useState(false);
  const [showRating,      setShowRating]       = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [applicants,   setApplicants]   = useState([]);
  const [ratingPost,   setRatingPost]   = useState(null);
  const [volRatings,   setVolRatings]   = useState({});
  const [volFeedback,  setVolFeedback]  = useState({});
  const [msgData,      setMsgData]      = useState({ applicantId:null, action:'', message:'' });
  const [postForm,     setPostForm]     = useState({ PostID:0, PostTitle:'', Description:'', TypeID:1, CountyID:1, imagePath:'' });

  /* ── fetch ── */
  const fetchUser = async () => {
    if (!user?.username) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/User/GetUser?username=${encodeURIComponent(user.username)}`,
        { headers:{ Authorization:`Bearer ${accessToken}`, 'Content-Type':'application/json' } });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setFormData({ firstName:d.firstName||'', secondName:d.secondName||'',
        lastName:d.lastName||'', email:d.email||'',
        phone:d.phone||'', age:d.age||'', imagepath:d.imagepath||'' });
      if (d.imagepath) setImagePreview(d.imagepath);
      updateUser(d);
    } catch { setError('فشل في جلب بيانات المستخدم'); }
    finally { setLoading(false); }
  };

  const fetchPosts = async () => {
    if (!accessToken) return;
    setPostsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Posts/GetMyPosts`,
        { headers:{ Authorization:`Bearer ${accessToken}`, 'Content-Type':'application/json' } });
      if (res.ok) { const d=await res.json(); setUserPosts(Array.isArray(d)?d:[]); }
      else setUserPosts([]);
    } catch { setUserPosts([]); }
    finally { setPostsLoading(false); }
  };

  const loadApplied = () => setAppliedSvcs([
    { id:1, serviceName:'زيارة مستشفى الأطفال', status:'pending',  appliedDate:'2024-02-15', description:'مبادرة لرسم البسمة', message:null },
    { id:2, serviceName:'تنظيف الحي',           status:'accepted', appliedDate:'2024-02-10', description:'تنظيف وتجميل الحي',  message:'تم قبولك! نتطلع للعمل معك.' },
    { id:3, serviceName:'مساعدة كبار السن',     status:'rejected', appliedDate:'2024-02-08', description:'برنامج مساعدة',       message:'نعتذر، تم إغلاق باب التسجيل.' },
  ]);

  const loadApplicants = () => setApplicants([
    { id:1, name:'أحمد محمود', email:'ahmad@ex.com', phone:'0791234567', appliedDate:'2024-02-18', status:'accepted' },
    { id:2, name:'سارة علي',   email:'sara@ex.com',  phone:'0797654321', appliedDate:'2024-02-17', status:'accepted' },
    { id:3, name:'محمد خالد',  email:'mo@ex.com',    phone:'0799001122', appliedDate:'2024-02-16', status:'pending'  },
  ]);

  useEffect(()=>{ if(accessToken&&user?.username){ fetchUser(); fetchPosts(); loadApplied(); } },[accessToken,user?.username]);

  /* ── handlers ── */
  const handleImageChange = e => {
    const f=e.target.files[0]; if(!f) return;
    if(!f.type.startsWith('image/')){ setError('يرجى اختيار صورة فقط'); return; }
    if(f.size>5*1024*1024){ setError('حجم الصورة يجب أن يكون أقل من 5MB'); return; }
    setImageFile(f);
    const r=new FileReader(); r.onloadend=()=>setImagePreview(r.result); r.readAsDataURL(f);
  };

  const handleUpdate = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      let imgPath=formData.imagepath;
      if(imageFile){ const ts=Date.now(); const ext=imageFile.name.split('.').pop(); imgPath=`${user.username.replace(/[^a-zA-Z0-9]/g,'_')}_${ts}.${ext}`; }
      const res=await fetch(`${API_BASE_URL}/User/UpdatePersonalDetails`,{
        method:'PATCH',
        headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
        body:JSON.stringify({ Username:user.username, FirstName:formData.firstName, SecondName:formData.secondName,
          LastName:formData.lastName, Email:formData.email, Phone:formData.phone, Age:parseInt(formData.age)||0, ImagePath:imgPath })
      });
      if(!res.ok) throw new Error();
      setSuccess('تم تحديث الملف الشخصي بنجاح!'); setIsEditing(false);
      updateUser({...user,...formData,imagepath:imgPath}); setTimeout(()=>setSuccess(''),3000);
    } catch { setError('فشل تحديث الملف الشخصي'); } finally { setLoading(false); }
  };

  const handleChangePw = async () => {
    setPwErr(''); setPwOk('');
    if(!pw.current||!pw.next||!pw.confirm){ setPwErr('يرجى ملء جميع الحقول'); return; }
    if(pw.next!==pw.confirm){ setPwErr('كلمتا المرور الجديدة غير متطابقتين'); return; }
    if(pw.next.length<6){ setPwErr('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setPwLoad(true);
    try {
      const res=await fetch(`${API_BASE_URL}/User/ChangePassword`,{
        method:'POST',
        headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
        body:JSON.stringify({ Username:user.username, OldPassword:pw.current, NewPassword:pw.next })
      });
      if(!res.ok) throw new Error();
      setPwOk('تم تغيير كلمة المرور بنجاح!'); setPw({current:'',next:'',confirm:''});
      setTimeout(()=>setPwOk(''),4000);
    } catch { setPwErr('فشل تغيير كلمة المرور — تأكد من كلمة المرور الحالية'); } finally { setPwLoad(false); }
  };

  const handleDeletePost = async () => {
    if(!selectedPost) return; setLoading(true);
    try {
      const res=await fetch(`${API_BASE_URL}/Posts/DeletePost?postID=${selectedPost.postID}`,
        { method:'DELETE', headers:{Authorization:`Bearer ${accessToken}`} });
      if(res.ok){
        setSuccess('تم حذف الخدمة بنجاح'); setShowDelete(false); setSelectedPost(null);
        setUserPosts(p=>p.filter(x=>x.postID!==selectedPost.postID)); setTimeout(()=>setSuccess(''),3000);
      } else throw new Error();
    } catch { setError('فشل حذف الخدمة'); } finally { setLoading(false); }
  };

  const handleUpdatePost = async () => {
    if(!postForm.PostTitle||!postForm.Description){ setError('يرجى ملء جميع الحقول'); return; }
    setLoading(true);
    try {
      const res=await fetch(`${API_BASE_URL}/Posts/UpdatePost`,{
        method:'PUT',
        headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
        body:JSON.stringify(postForm)
      });
      if(res.ok){
        setSuccess('تم تحديث الخدمة بنجاح'); setShowEditPost(false);
        setUserPosts(p=>p.map(x=>x.postID===postForm.PostID?{...x,postTitle:postForm.PostTitle,description:postForm.Description,imagePath:postForm.imagePath}:x));
        setTimeout(()=>setSuccess(''),3000);
      } else throw new Error();
    } catch { setError('فشل تحديث الخدمة'); } finally { setLoading(false); }
  };

  const submitMsg = () => {
    if(!msgData.message.trim()){ setError('الرجاء كتابة رسالة'); setTimeout(()=>setError(''),3000); return; }
    setApplicants(a=>a.map(x=>x.id===msgData.applicantId?{...x,status:msgData.action==='accept'?'accepted':'rejected'}:x));
    setSuccess(msgData.action==='accept'?'تم قبول المتقدم':'تم رفض المتقدم');
    setShowMsgModal(false); setMsgData({applicantId:null,action:'',message:''});
    setTimeout(()=>setSuccess(''),3000);
  };

  /* owner opens rating modal to rate accepted applicants */
  const openRatingModal = (post) => {
    setRatingPost(post); loadApplicants();
    setVolRatings({}); setVolFeedback({});
    setShowRating(true);
  };

  /* after applicants load, init rating maps */
  useEffect(()=>{
    if(showRating){
      const acc=applicants.filter(a=>a.status==='accepted');
      const r={}; const f={};
      acc.forEach(a=>{ r[a.id]=volRatings[a.id]||0; f[a.id]=volFeedback[a.id]||''; });
      setVolRatings(r); setVolFeedback(f);
    }
  },[applicants]);

  const submitCompletion = () => {
    const acc=applicants.filter(a=>a.status==='accepted');
    if(acc.some(a=>!volRatings[a.id])){ setError('يرجى تقييم جميع المتطوعين'); setTimeout(()=>setError(''),3000); return; }
    setUserPosts(p=>p.map(x=>x.postID===ratingPost.postID?{...x,isComplete:true}:x));
    setSuccess('تم إنهاء الخدمة وإرسال التقييمات بنجاح!');
    setShowRating(false); setTimeout(()=>setSuccess(''),3000);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  /* ── pw strength ── */
  const pwLen = pw.next.length;
  const strength = pwLen===0?0:pwLen<6?1:pwLen<10?2:3;
  const strengthLabel = ['','ضعيفة','متوسطة','قوية'][strength];
  const strengthColor = ['',C.error,'#fbbf24',C.success][strength];

  const tabs = [
    { key:'info',            icon:<User className="w-4 h-4"/>,      label:'المعلومات الشخصية',   cnt:null },
    { key:'password',        icon:<KeyRound className="w-4 h-4"/>,  label:'كلمة المرور',          cnt:null },
    { key:'myServices',      icon:<Briefcase className="w-4 h-4"/>, label:'خدماتي',               cnt:userPosts.length },
    { key:'appliedServices', icon:<FileText className="w-4 h-4"/>,  label:'الخدمات المقدم عليها', cnt:appliedSvcs.length },
  ];

  const accepted = applicants.filter(a=>a.status==='accepted');

  if(loading&&!formData.firstName) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:C.bg}}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full" style={{border:`3px solid ${C.tealGlow}`}}/>
          <div className="absolute inset-0 rounded-full animate-spin" style={{border:'3px solid transparent',borderTopColor:C.teal}}/>
        </div>
        <p style={{color:C.textMuted}}>جاري التحميل...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative" dir="rtl" style={{background:C.bg,fontFamily:"'Cairo',sans-serif"}}>

      {/* background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{background:'radial-gradient(circle,rgba(20,200,160,0.07) 0%,transparent 70%)'}}/>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{background:'radial-gradient(circle,rgba(34,211,238,0.05) 0%,transparent 70%)'}}/>
        <div className="absolute inset-0"
          style={{backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
            backgroundSize:'60px 60px',opacity:0.35}}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b"
        style={{background:'rgba(11,26,36,0.9)',backdropFilter:'blur(20px)',borderColor:C.border}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={()=>navigate('/')}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{background:C.grad}}>
              <Handshake className="w-5 h-5 text-white" strokeWidth={2.5}/>
            </div>
            <div>
              <div className="text-base font-black text-white">Participate <span style={{color:C.teal}}>&</span> Make</div>
              <div className="text-[10px] font-bold tracking-[0.25em]" style={{color:C.teal}}>A CHANGE</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{background:C.grad}}>
              <Home className="w-4 h-4"/> <span className="hidden md:inline">الرئيسية</span>
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all"
              style={{borderColor:C.border,color:C.textMuted}}>
              <LogOut className="w-4 h-4"/> <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* Profile hero */}
        <div className="rounded-3xl border mb-6 overflow-hidden" style={{background:C.surface,borderColor:C.border}}>
          <div className="h-[3px]" style={{background:C.grad}}/>
          <div className="px-8 py-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-2 rounded-3xl blur-xl opacity-35" style={{background:C.grad}}/>
              <div className="relative w-32 h-32 rounded-3xl border-2 overflow-hidden"
                style={{background:C.surfaceAlt,borderColor:C.border}}>
                {imagePreview||formData.imagepath
                  ? <img src={imagePreview||formData.imagepath} alt="avatar" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center">
                      <User className="w-14 h-14 opacity-30" style={{color:C.teal}}/>
                    </div>}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                  style={{background:C.grad}}>
                  <Upload className="w-4 h-4 text-white"/>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                </label>
              )}
            </div>

            {/* info */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1 flex-wrap">
                <h1 className="text-2xl font-black" style={{color:C.text}}>{formData.firstName} {formData.lastName}</h1>
                {user?.isActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{background:'rgba(52,211,153,0.12)',color:C.success,border:'1px solid rgba(52,211,153,0.25)'}}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> نشط
                  </span>
                )}
              </div>
              <p className="font-mono text-base mb-4" style={{color:C.teal}}>@{user?.username}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                {formData.email && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
                    style={{background:C.tealGlow,borderColor:C.border,color:C.textMuted}}>
                    <Mail className="w-4 h-4" style={{color:C.teal}}/>{formData.email}
                  </span>
                )}
                {formData.phone && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
                    style={{background:C.tealGlow,borderColor:C.border,color:C.textMuted}}>
                    <Phone className="w-4 h-4" style={{color:C.teal}}/>{formData.phone}
                  </span>
                )}
              </div>
              <div className="flex gap-3 justify-center md:justify-start">
                {[
                  {label:'خدماتي',   val:userPosts.length,                       color:C.teal},
                  {label:'مشاركاتي', val:appliedSvcs.length,                     color:C.cyan},
                  {label:'مكتملة',   val:userPosts.filter(p=>p.isComplete).length,color:'#a78bfa'},
                ].map((s,i)=>(
                  <div key={i} className="text-center px-4 py-2.5 rounded-2xl border"
                    style={{background:C.tealGlow,borderColor:C.border}}>
                    <div className="text-xl font-black" style={{color:s.color}}>{s.val}</div>
                    <div className="text-xs" style={{color:C.textDim}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {!isEditing && (
              <button onClick={()=>setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all"
                style={{borderColor:C.border,color:C.teal,background:C.tealGlow}}>
                <Edit className="w-4 h-4"/> تعديل
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-medium"
            style={{background:C.errorBg,borderColor:'rgba(248,113,113,0.3)',color:C.error}}>
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>{error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-medium"
            style={{background:C.successBg,borderColor:'rgba(52,211,153,0.3)',color:C.success}}>
            <CheckCircle className="w-4 h-4 flex-shrink-0"/>{success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 p-1.5 rounded-2xl border overflow-x-auto"
          style={{background:C.surface,borderColor:C.border}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setActiveTab(t.key)}
              className="flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap"
              style={activeTab===t.key?{background:C.grad,color:'#fff'}:{color:C.textMuted}}>
              {t.icon}{t.label}
              {t.cnt!==null&&(
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-black"
                  style={activeTab===t.key?{background:'rgba(255,255,255,0.25)',color:'#fff'}:{background:C.tealGlow,color:C.teal}}>
                  {t.cnt}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══ INFO ══ */}
        {activeTab==='info' && (
          <div className="rounded-3xl border overflow-hidden" style={{background:C.surface,borderColor:C.border}}>
            <div className="px-8 py-5 border-b flex items-center gap-3" style={{borderColor:C.border}}>
              <User className="w-5 h-5" style={{color:C.teal}}/>
              <h2 className="text-lg font-black" style={{color:C.text}}>المعلومات الشخصية</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="الاسم الأول"   value={formData.firstName}  onChange={e=>setFormData({...formData,firstName:e.target.value})}  disabled={!isEditing}/>
                <Field label="الاسم الثاني"  value={formData.secondName} onChange={e=>setFormData({...formData,secondName:e.target.value})} disabled={!isEditing}/>
                <Field label="اسم العائلة"   value={formData.lastName}   onChange={e=>setFormData({...formData,lastName:e.target.value})}   disabled={!isEditing}/>
                <Field label="العمر" type="number" value={formData.age}  onChange={e=>setFormData({...formData,age:e.target.value})}        disabled={!isEditing}/>
                <Field label="البريد الإلكتروني" type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} disabled={!isEditing} icon={<Mail className="w-4 h-4"/>}/>
                <Field label="رقم الهاتف" type="tel" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} disabled={!isEditing} icon={<Phone className="w-4 h-4"/>}/>
                {isEditing&&(
                  <div className="md:col-span-2">
                    <Field label="رابط الصورة (اختياري)" value={formData.imagepath} onChange={e=>setFormData({...formData,imagepath:e.target.value})} placeholder="https://..." icon={<ImageIcon className="w-4 h-4"/>}/>
                  </div>
                )}
              </div>
              {isEditing&&(
                <div className="flex gap-3 mt-6">
                  <button onClick={handleUpdate} disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                    style={{background:C.grad}}>
                    {loading?<><div className="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"/>جاري الحفظ...</>:<><Check className="w-4 h-4"/>حفظ التعديلات</>}
                  </button>
                  <button onClick={()=>{setIsEditing(false);fetchUser();setImageFile(null);setImagePreview(null);}}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border"
                    style={{borderColor:C.border,color:C.textMuted}}>
                    <X className="w-4 h-4"/>إلغاء
                  </button>
                </div>
              )}
              <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{borderColor:C.border}}>
                {[
                  {icon:<Calendar className="w-5 h-5" style={{color:C.teal}}/>, label:'عضو منذ', val:user?.creationDate?new Date(user.creationDate).toLocaleDateString('ar-JO'):'غير متوفر'},
                  {icon:<Shield className="w-5 h-5" style={{color:C.cyan}}/>,   label:'حالة الحساب', val:user?.isActive?'نشط ✓':'غير نشط'},
                ].map((m,i)=>(
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border"
                    style={{background:C.tealGlow,borderColor:C.border}}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:C.surfaceAlt}}>{m.icon}</div>
                    <div>
                      <div className="text-xs mb-0.5" style={{color:C.textDim}}>{m.label}</div>
                      <div className="text-sm font-bold" style={{color:C.text}}>{m.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ PASSWORD ══ */}
        {activeTab==='password' && (
          <div className="rounded-3xl border overflow-hidden" style={{background:C.surface,borderColor:C.border}}>
            <div className="px-8 py-5 border-b flex items-center gap-3" style={{borderColor:C.border}}>
              <KeyRound className="w-5 h-5" style={{color:C.teal}}/>
              <h2 className="text-lg font-black" style={{color:C.text}}>تغيير كلمة المرور</h2>
            </div>
            <div className="p-8 max-w-lg">
              {pwError&&(
                <div className="mb-5 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-medium"
                  style={{background:C.errorBg,borderColor:'rgba(248,113,113,0.3)',color:C.error}}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0"/>{pwError}
                </div>
              )}
              {pwOk&&(
                <div className="mb-5 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-medium"
                  style={{background:C.successBg,borderColor:'rgba(52,211,153,0.3)',color:C.success}}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0"/>{pwOk}
                </div>
              )}
              <div className="space-y-5">
                <PwField label="كلمة المرور الحالية"       value={pw.current}  onChange={e=>setPw({...pw,current:e.target.value})}  placeholder="أدخل كلمة مرورك الحالية"/>
                <PwField label="كلمة المرور الجديدة"       value={pw.next}     onChange={e=>setPw({...pw,next:e.target.value})}     placeholder="6 أحرف على الأقل"/>
                <PwField label="تأكيد كلمة المرور الجديدة" value={pw.confirm}  onChange={e=>setPw({...pw,confirm:e.target.value})}  placeholder="أعد كتابة كلمة المرور الجديدة"/>

                {/* strength bar */}
                {pw.next && (
                  <div>
                    <div className="flex gap-1.5 mb-1">
                      {[1,2,3].map(i=>(
                        <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{background:strength>=i?strengthColor:C.border}}/>
                      ))}
                    </div>
                    <p className="text-xs" style={{color:strengthColor}}>{strengthLabel}</p>
                  </div>
                )}

                {/* match indicator */}
                {pw.confirm && (
                  <p className="text-sm flex items-center gap-2 font-medium"
                    style={{color:pw.next===pw.confirm?C.success:C.error}}>
                    {pw.next===pw.confirm
                      ? <><CheckCircle className="w-4 h-4"/>كلمتا المرور متطابقتان</>
                      : <><XCircle className="w-4 h-4"/>كلمتا المرور غير متطابقتين</>}
                  </p>
                )}
              </div>

              <button onClick={handleChangePw} disabled={pwLoading}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-all"
                style={{background:C.grad}}>
                {pwLoading
                  ? <><div className="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"/>جاري الحفظ...</>
                  : <><KeyRound className="w-4 h-4"/>تغيير كلمة المرور</>}
              </button>
            </div>
          </div>
        )}

        {/* ══ MY SERVICES ══ */}
        {activeTab==='myServices' && (
          <div className="rounded-3xl border overflow-hidden" style={{background:C.surface,borderColor:C.border}}>
            <div className="px-8 py-5 border-b flex justify-between items-center"
              style={{borderColor:C.border,background:C.gradSoft}}>
              <h2 className="text-lg font-black" style={{color:C.text}}>خدماتي ({userPosts.length})</h2>
              <Link to="/services" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{background:C.grad}}>
                <Plus className="w-4 h-4"/>إضافة خدمة
              </Link>
            </div>
            <div className="p-8">
              {postsLoading ? (
                <div className="text-center py-20">
                  <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full" style={{border:`3px solid ${C.tealGlow}`}}/>
                    <div className="absolute inset-0 rounded-full animate-spin" style={{border:'3px solid transparent',borderTopColor:C.teal}}/>
                  </div>
                  <p style={{color:C.textMuted}}>جاري التحميل...</p>
                </div>
              ) : userPosts.length===0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center border"
                    style={{background:C.tealGlow,borderColor:C.border}}>
                    <Briefcase className="w-8 h-8" style={{color:C.textDim}}/>
                  </div>
                  <p className="text-lg font-bold mb-5" style={{color:C.textMuted}}>لم تقم بإضافة أي خدمات بعد</p>
                  <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white" style={{background:C.grad}}>
                    أضف خدمتك الأولى
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {userPosts.map(post=>(
                    <div key={post.postID}
                      className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                      style={{background:C.surfaceAlt,borderColor:C.border}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHov}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div className="relative h-44 overflow-hidden">
                        <img src={post.imagePath||'https://images.unsplash.com/photo-1559027615-cd99713b8bb7?w=800&q=80'}
                          alt={post.postTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(11,26,36,0.92) 0%,transparent 60%)'}}/>
                        {post.isComplete&&(
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{background:C.grad,color:'#fff'}}>
                            <CheckCircle className="w-3 h-3"/>مكتملة
                          </div>
                        )}
                        <h3 className="absolute bottom-3 right-3 left-3 text-white font-black text-base leading-tight">{post.postTitle}</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm mb-3 line-clamp-2" style={{color:C.textMuted}}>{post.description||'لا يوجد وصف'}</p>
                        <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b" style={{color:C.textDim,borderColor:C.border}}>
                          <span>📍 {post.countyName||'غير محدد'}</span>
                          <span>📅 {new Date(post.publishDateTime).toLocaleDateString('ar-JO')}</span>
                        </div>
                        <button onClick={()=>{setSelectedPost(post);loadApplicants();setShowApplicants(true);}}
                          className="w-full py-2.5 rounded-xl text-sm font-bold text-white mb-2 flex items-center justify-center gap-2"
                          style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)'}}>
                          <UserCheck className="w-4 h-4"/>عرض المتقدمين
                        </button>
                        {!post.isComplete&&(
                          <button onClick={()=>openRatingModal(post)}
                            className="w-full py-2.5 rounded-xl text-sm font-bold text-white mb-2 flex items-center justify-center gap-2"
                            style={{background:C.grad}}>
                            <Award className="w-4 h-4"/>اكتملت الخدمة
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button onClick={()=>{
                            setSelectedPost(post);
                            setPostForm({PostID:post.postID,PostTitle:post.postTitle,Description:post.description||'',TypeID:post.typeID||1,CountyID:post.countyID||1,imagePath:post.imagePath||''});
                            setShowEditPost(true);
                          }} className="flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 transition-all"
                            style={{borderColor:C.border,color:C.teal,background:C.tealGlow}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor=C.teal}
                            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                            <Edit className="w-4 h-4"/>تعديل
                          </button>
                          <button onClick={()=>{setSelectedPost(post);setShowDelete(true);}}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-1.5 transition-all"
                            style={{borderColor:'rgba(248,113,113,0.2)',color:C.error,background:'rgba(248,113,113,0.07)'}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor=C.error}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(248,113,113,0.2)'}>
                            <Trash2 className="w-4 h-4"/>حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ APPLIED SERVICES ══ */}
        {activeTab==='appliedServices' && (
          <div className="rounded-3xl border overflow-hidden" style={{background:C.surface,borderColor:C.border}}>
            <div className="px-8 py-5 border-b" style={{borderColor:C.border,background:C.gradSoft}}>
              <h2 className="text-lg font-black" style={{color:C.text}}>الخدمات المقدم عليها ({appliedSvcs.length})</h2>
            </div>
            <div className="p-8">
              {appliedSvcs.length===0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-bold mb-5" style={{color:C.textMuted}}>لم تتقدم لأي خدمات بعد</p>
                  <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white" style={{background:C.grad}}>
                    تصفح الخدمات المتاحة
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedSvcs.map(s=>(
                    <div key={s.id} className="rounded-2xl border p-6 transition-all"
                      style={{background:C.surfaceAlt,borderColor:C.border}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderHov}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-black mb-1" style={{color:C.text}}>{s.serviceName}</h3>
                          <p className="text-sm mb-2" style={{color:C.textMuted}}>{s.description}</p>
                          <div className="flex items-center gap-2 text-xs" style={{color:C.textDim}}>
                            <Calendar className="w-3.5 h-3.5"/>
                            <span>تقديم: {new Date(s.appliedDate).toLocaleDateString('ar-JO')}</span>
                          </div>
                        </div>
                        <Badge status={s.status}/>
                      </div>
                      {s.message&&(
                        <div className="mt-4 p-4 rounded-xl border flex items-start gap-3"
                          style={{
                            background:s.status==='accepted'?'rgba(52,211,153,0.07)':'rgba(248,113,113,0.07)',
                            borderColor:s.status==='accepted'?'rgba(52,211,153,0.2)':'rgba(248,113,113,0.2)'
                          }}>
                          <Mail className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{color:s.status==='accepted'?C.success:C.error}}/>
                          <div>
                            <p className="text-xs font-bold mb-1" style={{color:C.textMuted}}>رسالة من صاحب الخدمة:</p>
                            <p className="text-sm" style={{color:s.status==='accepted'?C.success:C.error}}>{s.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════ MODALS ════ */}

      {/* Applicants list */}
      {showApplicants&&(
        <Modal onClose={()=>setShowApplicants(false)}>
          <div className="sticky top-0 px-8 py-5 border-b rounded-t-3xl flex justify-between items-center"
            style={{background:'linear-gradient(135deg,rgba(124,58,237,0.22),rgba(168,85,247,0.12))',borderColor:C.border}}>
            <h2 className="text-lg font-black" style={{color:C.text}}>المتقدمون على: <span style={{color:'#a78bfa'}}>{selectedPost?.postTitle}</span></h2>
            <button onClick={()=>setShowApplicants(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{borderColor:C.border,color:C.textMuted}}><X className="w-4 h-4"/></button>
          </div>
          <div className="p-8 space-y-4">
            {applicants.map(ap=>(
              <div key={ap.id} className="rounded-2xl border p-5 flex items-start justify-between gap-4"
                style={{background:C.surfaceAlt,borderColor:C.border}}>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                    style={{background:C.tealGlow,borderColor:C.border}}>
                    <User className="w-5 h-5" style={{color:C.teal}}/>
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{color:C.text}}>{ap.name}</p>
                    <p className="text-xs" style={{color:C.textMuted}}>{ap.email} · {ap.phone}</p>
                    <p className="text-xs mt-0.5" style={{color:C.textDim}}>تقديم: {new Date(ap.appliedDate).toLocaleDateString('ar-JO')}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {ap.status==='pending' ? (
                    <>
                      <button onClick={()=>{setMsgData({applicantId:ap.id,action:'accept',message:''});setShowMsgModal(true);}}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                        style={{background:C.grad}}>
                        <UserCheck className="w-3.5 h-3.5"/>قبول
                      </button>
                      <button onClick={()=>{setMsgData({applicantId:ap.id,action:'reject',message:''});setShowMsgModal(true);}}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all">
                        <UserX className="w-3.5 h-3.5"/>رفض
                      </button>
                    </>
                  ) : <Badge status={ap.status}/>}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Accept/Reject message */}
      {showMsgModal&&(
        <Modal onClose={()=>setShowMsgModal(false)} maxWidth="max-w-lg">
          <div className="px-8 py-5 rounded-t-3xl border-b" style={{borderColor:C.border,
            background:msgData.action==='accept'?C.gradSoft:'linear-gradient(135deg,rgba(248,113,113,0.18),rgba(236,72,153,0.1))'}}>
            <h2 className="text-lg font-black" style={{color:C.text}}>
              {msgData.action==='accept'?'✓ قبول المتقدم':'✗ رفض المتقدم'}
            </h2>
          </div>
          <div className="p-8">
            <label className="block text-sm font-bold mb-2" style={{color:C.textMuted}}>
              رسالة للمتقدم <span style={{color:C.error}}>*</span>
            </label>
            <textarea value={msgData.message} onChange={e=>setMsgData({...msgData,message:e.target.value})}
              placeholder={msgData.action==='accept'?'تم قبولك في هذه المبادرة...':'نعتذر، تم إغلاق باب التسجيل...'}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none h-28 resize-none"
              style={{background:C.surfaceAlt,border:`1.5px solid ${C.border}`,color:C.text}}/>
          </div>
          <div className="px-8 pb-8 flex gap-3">
            <button onClick={submitMsg}
              className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm"
              style={{background:msgData.action==='accept'?C.grad:'linear-gradient(135deg,#ef4444,#ec4899)'}}>
              إرسال
            </button>
            <button onClick={()=>{setShowMsgModal(false);setMsgData({applicantId:null,action:'',message:''}); }}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm border"
              style={{borderColor:C.border,color:C.textMuted}}>إلغاء</button>
          </div>
        </Modal>
      )}

      {/* Edit post */}
      {showEditPost&&(
        <Modal onClose={()=>setShowEditPost(false)} maxWidth="max-w-xl">
          <div className="sticky top-0 px-8 py-5 border-b rounded-t-3xl flex justify-between items-center"
            style={{background:C.gradSoft,borderColor:C.border}}>
            <h2 className="text-lg font-black" style={{color:C.text}}>تعديل الخدمة</h2>
            <button onClick={()=>setShowEditPost(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{borderColor:C.border,color:C.textMuted}}><X className="w-4 h-4"/></button>
          </div>
          <div className="p-8 space-y-5">
            <Field label="عنوان الخدمة *" value={postForm.PostTitle} onChange={e=>setPostForm({...postForm,PostTitle:e.target.value})}/>
            <div>
              <label className="block text-sm font-bold mb-2" style={{color:C.textMuted}}>وصف الخدمة *</label>
              <textarea value={postForm.Description} onChange={e=>setPostForm({...postForm,Description:e.target.value})}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none h-28 resize-none"
                style={{background:C.surfaceAlt,border:`1.5px solid ${C.border}`,color:C.text}}/>
            </div>
            <Field label="رابط الصورة" value={postForm.imagePath} onChange={e=>setPostForm({...postForm,imagePath:e.target.value})}/>
          </div>
          <div className="sticky bottom-0 px-8 py-5 border-t flex gap-3 rounded-b-3xl"
            style={{background:C.surface,borderColor:C.border}}>
            <button onClick={handleUpdatePost} disabled={loading}
              className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50"
              style={{background:C.grad}}>
              {loading?'جاري الحفظ...':'حفظ التعديلات'}
            </button>
            <button onClick={()=>setShowEditPost(false)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm border"
              style={{borderColor:C.border,color:C.textMuted}}>إلغاء</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {showDelete&&(
        <Modal onClose={()=>setShowDelete(false)} maxWidth="max-w-sm">
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center border"
              style={{background:'rgba(248,113,113,0.1)',borderColor:'rgba(248,113,113,0.3)'}}>
              <Trash2 className="w-7 h-7" style={{color:C.error}}/>
            </div>
            <h2 className="text-lg font-black mb-3" style={{color:C.text}}>تأكيد الحذف</h2>
            <p className="text-sm mb-1" style={{color:C.textMuted}}>هل أنت متأكد من حذف هذه الخدمة؟</p>
            <p className="font-bold mb-2" style={{color:C.teal}}>"{selectedPost?.postTitle}"</p>
            <p className="text-xs mb-7" style={{color:C.error}}>لن تتمكن من التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button onClick={handleDeletePost} disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition-all">
                {loading?'جاري الحذف...':'نعم، احذف'}
              </button>
              <button onClick={()=>setShowDelete(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm border"
                style={{borderColor:C.border,color:C.textMuted}}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Service Completion: OWNER rates accepted applicants ── */}
      {showRating&&ratingPost&&(
        <Modal onClose={()=>setShowRating(false)}>
          <div className="sticky top-0 px-8 py-5 border-b rounded-t-3xl flex justify-between items-center"
            style={{background:C.gradSoft,borderColor:C.border}}>
            <div>
              <h2 className="text-lg font-black" style={{color:C.text}}>🎉 إنهاء الخدمة وتقييم المتطوعين</h2>
              <p className="text-sm mt-0.5" style={{color:C.textMuted}}>{ratingPost.postTitle}</p>
            </div>
            <button onClick={()=>setShowRating(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{borderColor:C.border,color:C.textMuted}}><X className="w-4 h-4"/></button>
          </div>
          <div className="p-8">
            {accepted.length===0 ? (
              <p className="text-center py-10" style={{color:C.textMuted}}>لا يوجد متطوعون مقبولون لتقييمهم</p>
            ) : (
              <div className="space-y-6">
                {accepted.map(ap=>(
                  <div key={ap.id} className="rounded-2xl border p-6"
                    style={{background:C.surfaceAlt,borderColor:C.border}}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                        style={{background:C.tealGlow,borderColor:C.border}}>
                        <User className="w-6 h-6" style={{color:C.teal}}/>
                      </div>
                      <div>
                        <p className="font-bold" style={{color:C.text}}>{ap.name}</p>
                        <p className="text-xs" style={{color:C.textMuted}}>{ap.email}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-bold mb-2" style={{color:C.textMuted}}>تقييمك لهذا المتطوع:</p>
                      <StarRating value={volRatings[ap.id]||0}
                        onChange={v=>setVolRatings(r=>({...r,[ap.id]:v}))}/>
                      {(volRatings[ap.id]||0)>0&&(
                        <p className="text-xs mt-1.5 font-bold" style={{color:C.teal}}>
                          {['','ضعيف','مقبول','جيد','جيد جداً','ممتاز'][volRatings[ap.id]]}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-2" style={{color:C.textMuted}}>تعليق على التجربة (اختياري):</p>
                      <textarea value={volFeedback[ap.id]||''}
                        onChange={e=>setVolFeedback(f=>({...f,[ap.id]:e.target.value}))}
                        placeholder="كيف كان أداء هذا المتطوع؟ هل كان متعاوناً ومنظماً؟"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none h-20 resize-none"
                        style={{background:C.surface,border:`1.5px solid ${C.border}`,color:C.text}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="sticky bottom-0 px-8 py-5 border-t flex gap-3 rounded-b-3xl"
            style={{background:C.surface,borderColor:C.border}}>
            <button onClick={submitCompletion}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm"
              style={{background:C.grad}}>
              <Award className="w-4 h-4"/>تأكيد الإنهاء وإرسال التقييمات
            </button>
            <button onClick={()=>setShowRating(false)}
              className="px-6 py-3.5 rounded-xl font-bold text-sm border"
              style={{borderColor:C.border,color:C.textMuted}}>إلغاء</button>
          </div>
        </Modal>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:rgba(20,200,160,0.04)}
        ::-webkit-scrollbar-thumb{background:rgba(20,200,160,0.22);border-radius:3px}
      `}</style>
    </div>
  );
};

export default Profile;