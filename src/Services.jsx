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

function Services() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const isLoggedIn = !!user;
  
  // State لتخزين الخدمات من الـ Database
  const [postsFromDB, setPostsFromDB] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States الأخرى
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [activeTab, setActiveTab] = useState("all");

  // ✅ States للتقديم على خدمة
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyingToPost, setApplyingToPost] = useState(null);

  const [newPost, setNewPost] = useState({
    PostTitle: '',
    Description: '',
    TypeID: 1,
    CountyID: 1,
    imagePath: '',
    PublishDate: new Date().toISOString().split('T')[0],
    Status: 1,
    isComplete: false
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
        setPostsFromDB(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch posts, status:", response.status);
        setPostsFromDB([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPostsFromDB([]);
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

    if (!newPost.PostTitle || !newPost.Description) {
      alert("⚠️ الرجاء ملء جميع الحقول المطلوبة");
      return;
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
        isComplete: false
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
          isComplete: false
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

  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // ✅ تصفية الخدمات حسب الفلاتر المحددة
  const filteredPosts = postsFromDB.filter(post => {
    // فلتر حسب النوع
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
          <div>
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
                    isComplete: post.isComplete
                  }}
                  onClick={() => handleCardClick(post)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="text-slate-300 text-7xl mb-6">📋</div>
                <p className="text-slate-600 text-xl font-bold mb-4">لا توجد خدمات متاحة حالياً</p>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 flex justify-between items-center">
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
                    isComplete: false
                  });
                }}
                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
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
                    isComplete: false
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
              
              {/* ✅ زر التقديم على الخدمة */}
              {!selectedService.isComplete && isLoggedIn && (
                <button
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg transform hover:scale-105"
                  onClick={() => {
                    setShowServiceModal(false);
                    setApplyingToPost({
                      postID: selectedService.postID,
                      postTitle: selectedService.postTitle
                    });
                    setShowApplyModal(true);
                  }}
                >
                  التقديم للخدمة
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