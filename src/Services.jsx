import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Handshake, Sparkles, Home } from "lucide-react";
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://localhost:7244/api';

// قائمة المدن الأردنية
const JORDAN_CITIES = [
  "عمّان",
  "إربد",
  "الزرقاء",
  "العقبة",
  "السلط",
  "المفرق",
  "الرصيفة",
  "الكرك",
  "مأدبا",
  "جرش",
  "عجلون",
  "الطفيلة",
  "معان",
  "الرمثا",
  "سحاب"
];

// ✅ قائمة أنواع الخدمات (المهن)
const SERVICE_TYPES = [
  "تعليم وتدريس",
  "برمجة وتطوير",
  "تصميم وجرافيك",
  "تصوير ومونتاج",
  "استشارات قانونية",
  "استشارات طبية",
  "صيانة وإصلاح",
  "نقل وتوصيل",
  "تنظيف",
  "طبخ وطعام",
  "رعاية أطفال",
  "رعاية مسنين",
  "تطوع عام",
  "أخرى"
];

function Services() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const isLoggedIn = !!user;
  
  // State لتخزين الخدمات من الـ Database
  const [postsFromDB, setPostsFromDB] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ خدمات افتراضية للعرض
  const [dummyServices] = useState([
    {
      postID: 1001,
      postTitle: "زيارة مستشفى الأطفال",
      description: "مبادرة لرسم البسمة على وجوه الأطفال المرضى وتقديم الهدايا والألعاب لهم. نحتاج متطوعين لقضاء وقت ممتع مع الأطفال",
      imagePath: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
      countyName: "عمّان",
      postTypeName: "تطوعي",
      authorName: "أحمد محمود",
      professionName: "منسق مبادرات",
      publishDateTime: "2024-03-01",
      isComplete: false,
      serviceType: "تطوع عام"
    },
    {
      postID: 1002,
      postTitle: "تصميم موقع إلكتروني",
      description: "مطلوب مبرمج محترف لتصميم وتطوير موقع إلكتروني متكامل لشركة ناشئة. المشروع يتضمن تصميم واجهة المستخدم والبرمجة الخلفية",
      imagePath: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      countyName: "إربد",
      postTypeName: "مدفوع",
      authorName: "سارة العلي",
      professionName: "مديرة مشاريع",
      publishDateTime: "2024-03-02",
      isComplete: false,
      price: 250,
      contactPhone: "0791234567",
      contactEmail: "sara.ali@example.com",
      serviceType: "برمجة وتطوير"
    },
    {
      postID: 1003,
      postTitle: "حملة تنظيف الحي",
      description: "نبحث عن متطوعين للمساعدة في تنظيف الحي وزراعة الأشجار والورود لتجميل المنطقة وخلق بيئة أفضل",
      imagePath: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
      countyName: "الزرقاء",
      postTypeName: "تطوعي",
      authorName: "محمد خالد",
      professionName: "ناشط بيئي",
      publishDateTime: "2024-03-03",
      isComplete: false,
      serviceType: "تطوع عام"
    },
    {
      postID: 1004,
      postTitle: "دروس خصوصية في الرياضيات",
      description: "معلم رياضيات خبرة 10 سنوات يقدم دروس خصوصية لطلاب التوجيهي. شرح مبسط ومتابعة مستمرة مع حل واجبات",
      imagePath: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
      countyName: "عمّان",
      postTypeName: "مدفوع",
      authorName: "عمر يوسف",
      professionName: "معلم رياضيات",
      publishDateTime: "2024-03-04",
      isComplete: false,
      price: 80,
      contactPhone: "0797654321",
      contactEmail: "omar.math@example.com",
      serviceType: "تعليم وتدريس"
    },
    {
      postID: 1005,
      postTitle: "توزيع وجبات على المحتاجين",
      description: "مبادرة إنسانية لتوزيع وجبات ساخنة على الأسر المحتاجة والمشردين في مختلف مناطق المدينة",
      imagePath: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      countyName: "السلط",
      postTypeName: "تطوعي",
      authorName: "فاطمة حسن",
      professionName: "مسؤولة خيرية",
      publishDateTime: "2024-03-05",
      isComplete: false,
      serviceType: "طبخ وطعام"
    },
    {
      postID: 1006,
      postTitle: "تصوير حفل زفاف",
      description: "مصور محترف لتصوير حفلات الزفاف والمناسبات. خدمة شاملة تتضمن التصوير الفوتوغرافي والفيديو مع مونتاج احترافي",
      imagePath: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
      countyName: "العقبة",
      postTypeName: "مدفوع",
      authorName: "زيد عبدالله",
      professionName: "مصور فوتوغرافي",
      publishDateTime: "2024-03-06",
      isComplete: false,
      price: 350,
      contactPhone: "0799876543",
      contactEmail: "zaid.photo@example.com",
      serviceType: "تصوير ومونتاج"
    },
    {
      postID: 1007,
      postTitle: "تعليم الأطفال القراءة",
      description: "برنامج تطوعي لتعليم الأطفال القراءة والكتابة بطرق مبتكرة وممتعة. نحتاج معلمين متطوعين",
      imagePath: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
      countyName: "إربد",
      postTypeName: "تطوعي",
      authorName: "ليلى محمود",
      professionName: "معلمة",
      publishDateTime: "2024-03-07",
      isComplete: false,
      serviceType: "تعليم وتدريس"
    },
    {
      postID: 1008,
      postTitle: "استشارة قانونية",
      description: "محامي معتمد يقدم استشارات قانونية في مختلف المجالات: عقود، قضايا عمل، أحوال شخصية",
      imagePath: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      countyName: "عمّان",
      postTypeName: "مدفوع",
      authorName: "نور الدين",
      professionName: "محامي",
      publishDateTime: "2024-03-08",
      isComplete: false,
      price: 50,
      contactPhone: "0795555555",
      contactEmail: "nour.lawyer@example.com",
      serviceType: "استشارات قانونية"
    }
  ]);
  
  // States الأخرى
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProfession, setSelectedProfession] = useState("الكل"); // فلتر المهنة

  // ✅ States للتقديم على خدمة
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyingToPost, setApplyingToPost] = useState(null);

  // ✅ States للدفع (للخدمات المدفوعة)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('full'); // 'full' or 'partial'
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [newPost, setNewPost] = useState({
    PostTitle: '',
    Description: '',
    TypeID: 1,
    CountyID: 1,
    imagePath: '',
    PublishDate: new Date().toISOString().split('T')[0],
    Status: 1,
    isComplete: false,
    // ✅ حقول إضافية للخدمات المدفوعة
    price: '',
    contactPhone: '',
    contactEmail: '',
    // ✅ نوع الخدمة (المهنة)
    serviceType: ''
  });

  // جلب الخدمات عند تحميل الصفحة
  useEffect(() => {
    fetchServicesFromDB();
  }, []);

  // ✅ دالة جلب الخدمات من الـ Database
  const fetchServicesFromDB = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/Posts/GetFilteredPosts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Posts from DB:", data);
        // ✅ دمج الخدمات من DB مع الخدمات الافتراضية
        const dbPosts = Array.isArray(data) ? data : [];
        setPostsFromDB([...dummyServices, ...dbPosts]);
      } else {
        console.error("Failed to fetch posts, status:", response.status);
        // ✅ في حالة الفشل، اعرض الخدمات الافتراضية فقط
        setPostsFromDB(dummyServices);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // ✅ في حالة الخطأ، اعرض الخدمات الافتراضية فقط
      setPostsFromDB(dummyServices);
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة إضافة خدمة جديدة
  const handleAddPost = async () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    if (!newPost.PostTitle || !newPost.Description || !newPost.serviceType) {
      alert("⚠️ الرجاء ملء جميع الحقول المطلوبة (العنوان، الوصف، نوع الخدمة)");
      return;
    }

    // ✅ التحقق من الحقول الإضافية للخدمات المدفوعة
    if (newPost.TypeID === 2) {
      if (!newPost.price || !newPost.contactPhone || !newPost.contactEmail) {
        alert("⚠️ الرجاء ملء جميع حقول الخدمة المدفوعة (السعر، الهاتف، البريد الإلكتروني)");
        return;
      }
      
      // التحقق من صحة رقم الهاتف الأردني
      const phoneRegex = /^07[789]\d{7}$/;
      if (!phoneRegex.test(newPost.contactPhone)) {
        alert("⚠️ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 077 أو 078 أو 079 ويتكون من 10 أرقام");
        return;
      }

      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newPost.contactEmail)) {
        alert("⚠️ البريد الإلكتروني غير صحيح");
        return;
      }

      // التحقق من أن السعر أكبر من صفر
      if (parseFloat(newPost.price) <= 0) {
        alert("⚠️ السعر يجب أن يكون أكبر من صفر");
        return;
      }
    }

    setLoading(true);

    try {
      const postData = {
        PostTitle: newPost.PostTitle.trim(),
        Description: newPost.Description.trim(),
        TypeID: parseInt(newPost.TypeID),
        CountyID: parseInt(newPost.CountyID),
        imagePath: newPost.imagePath.trim() || null,
        PublishDate: new Date().toISOString().split('T')[0],
        Status: 1,
        isComplete: false,
        serviceType: newPost.serviceType, // ✅ نوع الخدمة
        // ✅ إضافة الحقول الإضافية للخدمات المدفوعة
        ...(newPost.TypeID === 2 && {
          price: parseFloat(newPost.price),
          contactPhone: newPost.contactPhone.trim(),
          contactEmail: newPost.contactEmail.trim()
        })
      };

      const response = await fetch(`${API_BASE_URL}/Posts/CreatePost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        setShowAddPostModal(false);
        
        setNewPost({
          PostTitle: '',
          Description: '',
          TypeID: 1,
          CountyID: 1,
          imagePath: '',
          PublishDate: new Date().toISOString().split('T')[0],
          Status: 1,
          isComplete: false,
          price: '',
          contactPhone: '',
          contactEmail: ''
        });
        
        setShowSuccessMessage(true);
        await fetchServicesFromDB();
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        const errorText = await response.text();
        let errorMessage = 'فشل في إضافة الخدمة';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.Message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        alert('❌ حدث خطأ: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error adding post:', error);
      alert('❌ حدث خطأ في الاتصال بالسيرفر: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة التقديم على خدمة
  const handleApplyToService = async () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      return;
    }

    if (!applyingToPost) return;

    // ✅ إذا كانت خدمة مدفوعة، اعرض modal الدفع
    if (applyingToPost.postTypeName === "مدفوع" || applyingToPost.price) {
      setShowApplyModal(false);
      setShowPaymentModal(true);
      return;
    }

    // للخدمات التطوعية، تابع كالمعتاد
    setLoading(true);

    try {
      const applicationData = {
        PostID: applyingToPost.postID,
        Description: applyMessage.trim() || null
      };

      console.log('Applying to service:', applicationData);

      const response = await fetch(`${API_BASE_URL}/Services/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();

      if (response.ok) {
        setShowApplyModal(false);
        setApplyMessage('');
        setApplyingToPost(null);
        alert('✅ ' + (result.message || 'تم التقديم على الخدمة بنجاح!'));
      } else {
        alert('❌ ' + (result.message || 'فشل التقديم على الخدمة'));
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('❌ حدث خطأ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ دالة معالجة الدفع
  const handlePayment = async () => {
    // التحقق من صحة البيانات
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert('⚠️ الرجاء ملء جميع بيانات البطاقة');
      return;
    }

    // التحقق من رقم البطاقة (16 رقم)
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      alert('⚠️ رقم البطاقة يجب أن يكون 16 رقم');
      return;
    }

    // التحقق من CVV (3 أرقام)
    if (cardDetails.cvv.length !== 3) {
      alert('⚠️ رمز الأمان يجب أن يكون 3 أرقام');
      return;
    }

    setLoading(true);

    try {
      // محاكاة عملية الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));

      const amount = paymentMethod === 'full' ? applyingToPost.price : 5;
      
      // بعد نجاح الدفع، قدم على الخدمة
      const applicationData = {
        PostID: applyingToPost.postID,
        Description: applyMessage.trim() || null,
        PaymentAmount: amount,
        PaymentMethod: paymentMethod
      };

      const response = await fetch(`${API_BASE_URL}/Services/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        setShowPaymentModal(false);
        setApplyMessage('');
        setApplyingToPost(null);
        setCardDetails({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
        setPaymentMethod('full');
        alert(`✅ تم الدفع بنجاح (${amount} دينار) وتم التقديم على الخدمة!`);
      } else {
        alert('❌ فشل التقديم على الخدمة');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('❌ حدث خطأ في عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // ✅ تصفية الخدمات حسب الفلاتر المحددة
  const filteredPosts = postsFromDB.filter(post => {
    // فلتر حسب النوع (تطوعي/مدفوع)
    if (activeTab === "voluntary" && post.postTypeName !== "تطوعي") {
      return false;
    }
    if (activeTab === "paid" && post.postTypeName !== "مدفوع") {
      return false;
    }
    
    // فلتر حسب المدينة
    if (selectedCity !== "الكل" && post.countyName !== selectedCity) {
      return false;
    }
    
    // ✅ فلتر حسب نوع الخدمة (المهنة)
    if (selectedProfession !== "الكل" && post.serviceType !== selectedProfession) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
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

            {/* Action Buttons */}
            <div className="flex gap-3 items-center">
              <button 
                onClick={() => navigate('/')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">الرئيسية</span>
              </button>
              
              {isLoggedIn && (
                <button
                  onClick={() => setShowAddPostModal(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg transform hover:scale-105"
                >
                  <span className="text-xl">+</span>
                  إضافة خدمة
                </button>
              )}
              
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                  title="الملف الشخصي"
                >
                  <User className="w-6 h-6 text-white" />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FILTERS */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Type Filters */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "bg-white text-slate-900 border-2 border-slate-200 hover:border-emerald-500"
              }`}
            >
              جميع الخدمات ({postsFromDB.length})
            </button>
            <button
              onClick={() => setActiveTab("voluntary")}
              className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                activeTab === "voluntary"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "bg-white text-slate-900 border-2 border-slate-200 hover:border-emerald-500"
              }`}
            >
              خدمات تطوعية ({postsFromDB.filter(p => p.postTypeName === "تطوعي").length})
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                activeTab === "paid"
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                  : "bg-white text-slate-900 border-2 border-slate-200 hover:border-yellow-500"
              }`}
            >
              خدمات مدفوعة ({postsFromDB.filter(p => p.postTypeName === "مدفوع").length})
            </button>
          </div>

          {/* City Filter */}
          <div className="flex gap-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-8 py-3 rounded-xl border-2 border-slate-300 font-bold cursor-pointer outline-none focus:border-emerald-500 transition-all shadow-lg bg-white hover:border-emerald-400 min-w-[200px]"
            >
              <option value="الكل">🌍 جميع المدن</option>
              {JORDAN_CITIES.map(city => (
                <option key={city} value={city}>📍 {city}</option>
              ))}
            </select>

            {/* ✅ Service Type Filter */}
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="px-8 py-3 rounded-xl border-2 border-slate-300 font-bold cursor-pointer outline-none focus:border-emerald-500 transition-all shadow-lg bg-white hover:border-emerald-400 min-w-[200px]"
            >
              <option value="الكل">💼 جميع أنواع الخدمات</option>
              {SERVICE_TYPES.map(type => (
                <option key={type} value={type}>🔹 {type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* CARDS GRID */}
      <section className="container mx-auto px-6 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-semibold">جاري تحميل الخدمات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <ServiceCard
                  key={post.postID}
                  service={{
                    id: post.postID,
                    title: post.postTitle,
                    desc: post.description || "لا يوجد وصف",
                    img: post.imagePath || "https://images.unsplash.com/photo-1559027615-cd99713b8bb7?w=800&q=80",
                    location: post.countyName || "غير محدد",
                    type: post.postTypeName || "تطوعي",
                    author: post.authorName,
                    profession: post.professionName,
                    publishDate: new Date(post.publishDateTime).toLocaleDateString('ar-JO'),
                    isComplete: post.isComplete,
                    price: post.price || 0
                  }}
                  onClick={() => handleCardClick(post)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-slate-300 text-7xl mb-6">📋</div>
                <p className="text-slate-600 text-xl font-bold mb-4">لا توجد خدمات متاحة حالياً</p>
                <p className="text-slate-500 mb-8">جرّب تغيير الفلاتر أو</p>
                {isLoggedIn && (
                  <button
                    onClick={() => setShowAddPostModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg transform hover:scale-105"
                  >
                    كن أول من يضيف خدمة
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODAL: إضافة خدمة */}
      {showAddPostModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 flex justify-between items-center rounded-t-3xl z-10">
              <h2 className="text-2xl font-bold text-white">إضافة خدمة جديدة</h2>
              <button
                onClick={() => {
                  setShowAddPostModal(false);
                  setNewPost({
                    PostTitle: '',
                    Description: '',
                    TypeID: 1,
                    CountyID: 1,
                    imagePath: '',
                    PublishDate: new Date().toISOString().split('T')[0],
                    Status: 1,
                    isComplete: false,
                    price: '',
                    contactPhone: '',
                    contactEmail: '',
                    serviceType: ''
                  });
                }}
                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  عنوان الخدمة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPost.PostTitle}
                  onChange={(e) => setNewPost({...newPost, PostTitle: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="مثال: مساعدة كبار السن"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  وصف الخدمة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={newPost.Description}
                  onChange={(e) => setNewPost({...newPost, Description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none h-32 resize-none transition-all"
                  placeholder="اكتب وصفاً تفصيلياً..."
                />
              </div>

              {/* ✅ نوع الخدمة (المهنة) */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  نوع الخدمة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newPost.serviceType}
                  onChange={(e) => setNewPost({...newPost, serviceType: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                >
                  <option value="">اختر نوع الخدمة</option>
                  {SERVICE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  نوع الخدمة
                </label>
                <select
                  value={newPost.TypeID}
                  onChange={(e) => setNewPost({...newPost, TypeID: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                >
                  <option value="1">تطوعي</option>
                  <option value="2">مدفوع</option>
                </select>
              </div>

              {/* ✅ حقول إضافية للخدمات المدفوعة فقط */}
              {newPost.TypeID === 2 && (
                <>
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">📋 معلومات الخدمة المدفوعة</h3>
                    
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        السعر التقديري (بالدينار) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newPost.price}
                        onChange={(e) => setNewPost({...newPost, price: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                        placeholder="مثال: 100"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        رقم الهاتف للتواصل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newPost.contactPhone}
                        onChange={(e) => setNewPost({...newPost, contactPhone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                        placeholder="07XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-2">
                        البريد الإلكتروني للتواصل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newPost.contactEmail}
                        onChange={(e) => setNewPost({...newPost, contactEmail: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  المدينة
                </label>
                <select
                  value={newPost.CountyID}
                  onChange={(e) => setNewPost({...newPost, CountyID: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                >
                  <option value="1">عمّان</option>
                  <option value="2">إربد</option>
                  <option value="3">الزرقاء</option>
                  <option value="4">العقبة</option>
                  <option value="5">السلط</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  رابط الصورة (اختياري)
                </label>
                <input
                  type="text"
                  value={newPost.imagePath}
                  onChange={(e) => setNewPost({...newPost, imagePath: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {newPost.imagePath && (
                  <div className="mt-3">
                    <img 
                      src={newPost.imagePath} 
                      alt="معاينة" 
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 px-8 py-6 flex gap-3">
              <button
                onClick={handleAddPost}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري النشر...
                  </span>
                ) : (
                  'نشر الخدمة'
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddPostModal(false);
                  setNewPost({
                    PostTitle: '',
                    Description: '',
                    TypeID: 1,
                    CountyID: 1,
                    imagePath: '',
                    PublishDate: new Date().toISOString().split('T')[0],
                    Status: 1,
                    isComplete: false,
                    price: '',
                    contactPhone: '',
                    contactEmail: '',
                    serviceType: ''
                  });
                }}
                disabled={loading}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL: التقديم على خدمة */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">التقديم على الخدمة</h2>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {applyingToPost?.postTitle}
              </h3>
              
              <div className="mb-6">
                <label className="block text-slate-700 font-bold mb-2">
                  رسالة إلى صاحب الخدمة (اختياري)
                </label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none h-32 resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyToService}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'جاري التقديم...' : 'تقديم الطلب'}
                </button>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setApplyMessage('');
                    setApplyingToPost(null);
                  }}
                  disabled={loading}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-4 rounded-xl font-bold transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ MODAL: الدفع (للخدمات المدفوعة) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">💳 الدفع الآمن</h2>
              <p className="text-yellow-50 text-sm mt-1">معلوماتك محمية بالكامل</p>
            </div>

            <div className="p-8 space-y-6">
              {/* معلومات الخدمة */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {applyingToPost?.postTitle}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">السعر الإجمالي:</span>
                  <span className="text-2xl font-black text-amber-600">{applyingToPost?.price} دينار</span>
                </div>
              </div>

              {/* خيارات الدفع */}
              <div>
                <label className="block text-slate-700 font-bold mb-4">اختر طريقة الدفع:</label>
                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'full' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="full"
                      checked={paymentMethod === 'full'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">💰 دفع المبلغ كاملاً</p>
                      <p className="text-sm text-slate-600">ادفع {applyingToPost?.price} دينار الآن</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'partial' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="partial"
                      checked={paymentMethod === 'partial'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">📊 دفع جزئي</p>
                      <p className="text-sm text-slate-600">ادفع 5 دنانير الآن والباقي ({applyingToPost?.price - 5} دينار) بعد إنهاء الخدمة</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* بيانات البطاقة */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700">بيانات البطاقة:</h4>
                
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    رقم البطاقة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      if (value.length <= 16) {
                        setCardDetails({...cardDetails, cardNumber: formatted});
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all font-mono"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    اسم حامل البطاقة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all"
                    placeholder="الاسم كما هو على البطاقة"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      تاريخ الانتهاء <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        if (value.length <= 5) {
                          setCardDetails({...cardDetails, expiryDate: value});
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all font-mono"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      CVV <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setCardDetails({...cardDetails, cvv: value});
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all font-mono"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>

              {/* ملخص الدفع */}
              <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-700 font-semibold">المبلغ المطلوب الآن:</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {paymentMethod === 'full' ? applyingToPost?.price : 5} دينار
                  </span>
                </div>
                {paymentMethod === 'partial' && (
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>المبلغ المتبقي:</span>
                    <span className="font-bold">{applyingToPost?.price - 5} دينار</span>
                  </div>
                )}
              </div>

              {/* أزرار */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      تأكيد الدفع
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setShowApplyModal(true);
                    setCardDetails({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
                    setPaymentMethod('full');
                  }}
                  disabled={loading}
                  className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
                >
                  رجوع
                </button>
              </div>

              {/* رسالة أمان */}
              <div className="flex items-start gap-3 text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="leading-relaxed">
                  <strong className="text-blue-800">🔒 دفع آمن:</strong> جميع معلوماتك مشفرة بتقنية SSL ولن يتم مشاركتها مع أي طرف ثالث
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: تسجيل دخول مطلوب */}
      {showLoginRequired && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              الرجاء تسجيل الدخول
            </h2>
            <p className="text-slate-600 mb-8">
              يجب عليك تسجيل الدخول للمتابعة
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLoginRequired(false);
                  navigate('/login');
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setShowLoginRequired(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-4 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: نجاح */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">تم بنجاح!</h2>
            <p className="text-slate-600 mb-8">تم نشر الخدمة بنجاح وستظهر للجميع</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessMessage(false);
                  navigate('/profile');
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                الملف الشخصي
              </button>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: تفاصيل الخدمة */}
      {showServiceModal && selectedService && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-5"
          onClick={() => setShowServiceModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowServiceModal(false)}
              className="absolute left-4 top-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-rose-500 hover:text-white transition-all z-10 shadow-lg"
            >
              ✕
            </button>

            <img
              src={selectedService.imagePath || selectedService.img || "https://images.unsplash.com/photo-1559027615-cd99713b8bb7?w=800&q=80"}
              alt={selectedService.postTitle || selectedService.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-8 text-right">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold flex-1 text-slate-800">
                  {selectedService.postTitle || selectedService.title}
                </h2>
                {selectedService.isComplete && (
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    مكتملة ✓
                  </span>
                )}
              </div>
              
              {selectedService.authorName && (
                <p className="text-slate-600 mb-2 font-semibold">
                  <strong>👤 الناشر:</strong> {selectedService.authorName}
                </p>
              )}
              
              {selectedService.professionName && (
                <p className="text-slate-600 mb-2 font-semibold">
                  <strong>💼 المجال:</strong> {selectedService.professionName}
                </p>
              )}
              
              {selectedService.countyName && (
                <p className="text-slate-600 mb-2 font-semibold">
                  <strong>📍 الموقع:</strong> {selectedService.countyName}
                </p>
              )}
              
              {selectedService.postTypeName && (
                <p className="text-slate-600 mb-2 font-semibold">
                  <strong>🏷️ النوع:</strong> {selectedService.postTypeName}
                </p>
              )}
              
              {selectedService.publishDate && (
                <p className="text-slate-500 text-sm mb-6">
                  📅 نُشر في: {selectedService.publishDate}
                </p>
              )}
              
              <p className="text-slate-700 mb-8 leading-relaxed">
                {selectedService.description || selectedService.desc}
              </p>

              {/* ✅ معلومات التواصل للخدمات المدفوعة */}
              {selectedService.postTypeName === "مدفوع" && (selectedService.contactPhone || selectedService.contactEmail) && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📞</span>
                    للتواصل مع مقدم الخدمة:
                  </h3>
                  <div className="space-y-3">
                    {selectedService.contactPhone && (
                      <a 
                        href={`tel:${selectedService.contactPhone}`}
                        className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl hover:bg-yellow-50 transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-semibold">رقم الهاتف</p>
                          <p className="text-slate-800 font-bold text-lg direction-ltr text-right">{selectedService.contactPhone}</p>
                        </div>
                      </a>
                    )}
                    
                    {selectedService.contactEmail && (
                      <a 
                        href={`mailto:${selectedService.contactEmail}`}
                        className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl hover:bg-yellow-50 transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 font-semibold">البريد الإلكتروني</p>
                          <p className="text-slate-800 font-bold">{selectedService.contactEmail}</p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* ✅ زر التقديم على الخدمة */}
              {!selectedService.isComplete && isLoggedIn && (
                <button
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg transform hover:scale-105"
                  onClick={() => {
                    setShowServiceModal(false);
                    setApplyingToPost({
                      postID: selectedService.postID,
                      postTitle: selectedService.postTitle,
                      postTypeName: selectedService.postTypeName,
                      price: selectedService.price || 0
                    });
                    setShowApplyModal(true);
                  }}
                >
                  {selectedService.postTypeName === "مدفوع" ? '💳 التقديم والدفع' : 'التقديم للخدمة'}
                </button>
              )}
              
              {!selectedService.isComplete && !isLoggedIn && (
                <button
                  className="w-full py-4 bg-slate-400 text-white rounded-xl font-bold text-lg cursor-not-allowed"
                  onClick={() => setShowLoginRequired(true)}
                >
                  سجّل دخول للتقديم
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// مكون البطاقة
function ServiceCard({ service, onClick }) {
  const [isHover, setIsHover] = useState(false);
  const isPaid = service.type === "مدفوع";

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      className={`bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 border-2 ${
        isHover ? "transform scale-105 shadow-2xl border-emerald-300" : "border-slate-100"
      } ${service.isComplete ? "opacity-75" : ""}`}
    >
      <div className="relative">
        <img
          src={service.img}
          alt={service.title}
          className={`w-full h-52 object-cover transition-transform duration-300 ${
            isHover ? "scale-110" : "scale-100"
          }`}
        />
        <span className={`absolute top-3 right-3 px-4 py-2 rounded-xl text-sm font-bold shadow-xl ${
          isPaid 
            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white" 
            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
        }`}>
          {service.type || "تطوعي"}
        </span>
        {service.isComplete && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
            مكتملة ✓
          </span>
        )}
        {/* ✅ عرض السعر للخدمات المدفوعة */}
        {isPaid && service.price && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl">
            <span className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {service.price} د.أ
            </span>
          </div>
        )}
      </div>

      <div className="p-6 text-right">
        <h3 className="text-xl font-bold mb-3 text-slate-800">
          {service.title}
        </h3>
        <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{service.desc}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
            <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">📍</span>
            {service.location}
          </div>
          {service.author && (
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">👤</span>
              {service.author}
            </div>
          )}
          {service.profession && (
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <span className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">💼</span>
              {service.profession}
            </div>
          )}
          {service.publishDate && (
            <div className="text-slate-400 text-xs mt-3 font-semibold">
              📅 {service.publishDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;