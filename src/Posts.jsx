import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Check, Lock, Unlock, AlertCircle, User, Handshake, Sparkles, Home } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { postsAPI, apiBase } from './api';
import api from './api';
import { CardSkeleton } from './components/Skeleton';
import {
  POST_COMPLETED_EVENT,
  dispatchPostCompleted,
  isPostComplete,
  isPostLocked,
  getPostImage,
  getRawImagePath,
  getImagePreviewUrl,
  fileToCompressedDataUrl,
  DEFAULT_POST_IMAGE,
  normalizePost,
} from './postUtils';

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

// professionID يتوافق مع ترتيب الأنواع في الـ backend (1 = أول عنصر)
const PROFESSION_OPTIONS = SERVICE_TYPES.map((name, index) => ({
  id: index + 1,
  name,
}));

const VOLUNTARY_POST_TYPE_ID = 1;

function Posts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // ============================================
  // 📊 STATE MANAGEMENT
  // ============================================
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCountyID, setSelectedCountyID] = useState('');
  const [selectedProfessionID, setSelectedProfessionID] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  // Apply modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyingToPost, setApplyingToPost] = useState(null);
  const [appliedPosts, setAppliedPosts] = useState(new Set()); // ✅ تتبع المنشورات المتقدم عليها

  // Form states
  const [formData, setFormData] = useState({
    PostTitle: '',
    Description: '',
    TypeID: 1,
    CountyID: 3,
    ProfessionID: 1,
    imagePath: '',
    Status: 1,
  });

  // 🌍 Counties state
  const [counties, setCounties] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(false);

  // 🌍 Cities state
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // 🏙️ Selected city for form (for cascading dropdowns)
  const [selectedCityForForm, setSelectedCityForForm] = useState(null);

  // 🌍 Filtered counties based on selected city
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageUploading(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      setFormData((prev) => ({ ...prev, imagePath: dataUrl }));
    } catch (err) {
      alert(err.message || 'تعذّر تحميل الصورة');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  // ============================================
  // 🎣 FETCH CITIES & COUNTIES ON MOUNT
  // ============================================
  useEffect(() => {
    fetchCities();
    fetchCounties();
  }, []);

  // تأخير بسيط للبحث لتقليل طلبات الـ API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // جلب المنشورات عند تغيّر أي فلتر
  useEffect(() => {
    fetchFilteredPosts();
  }, [debouncedSearch, selectedCountyID, selectedProfessionID, activeTab]);

  // إزالة منشور مكتمل من القائمة العامة عند الإكمال من Profile أو من هذه الصفحة
  useEffect(() => {
    const onPostCompleted = ({ detail }) => {
      const postID = detail?.postID;
      if (postID == null) return;
      setPosts((prev) => prev.filter((p) => p.postID !== postID));
    };
    window.addEventListener(POST_COMPLETED_EVENT, onPostCompleted);
    return () => window.removeEventListener(POST_COMPLETED_EVENT, onPostCompleted);
  }, []);

  // ============================================
  // 🌍 FETCH COUNTIES FROM API
  // ============================================
  const fetchCounties = async () => {
    try {
      console.log('🌍 جاري جلب المناطق من الـ API...');
      setLoadingCounties(true);
      const response = await apiBase.get('/CitiesCounties/Get All Counties');
      console.log('✅ تم جلب المناطق بنجاح:', response.data);
      setCounties(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ خطأ في جلب المناطق:', err);
      setCounties([]);
    } finally {
      setLoadingCounties(false);
    }
  };

  // ============================================
  // 🏙️ FETCH CITIES FROM API
  // ============================================
  const fetchCities = async () => {
    try {
      console.log('🏙️ جاري جلب المدن من الـ API...');
      setLoadingCities(true);
      const response = await apiBase.get('/CitiesCounties/Get All Cities');
      console.log('✅ تم جلب المدن بنجاح:', response.data);
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ خطأ في جلب المدن:', err);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // ============================================
  // 🌍 UPDATE FILTERED COUNTIES WHEN CITY CHANGES
  // ============================================
  useEffect(() => {
    if (selectedCityForForm && counties.length > 0) {
      // فلترة المناطق بناءً على المدينة المختارة
      const filtered = counties.filter(county => county.cityID === selectedCityForForm);
      console.log('🔍 تم فلترة المناطق:', {
        selectedCityID: selectedCityForForm,
        countyCount: counties.length,
        filteredCount: filtered.length,
        filtered: filtered
      });
      setFilteredCounties(filtered);
      
      // تعيين أول منطقة كـ default
      if (filtered.length > 0) {
        setFormData(prev => ({ ...prev, CountyID: filtered[0].countyID }));
      }
    } else {
      setFilteredCounties([]);
    }
  }, [selectedCityForForm, counties]);

  // ============================================
  // 📡 API CALLS
  // ============================================

  const buildFilterParams = () => {
    const params = {};
    if (debouncedSearch.trim()) {
      params.searchQuery = debouncedSearch.trim();
    }
    if (selectedCountyID) {
      params.countyID = Number(selectedCountyID);
    }
    if (selectedProfessionID) {
      params.professionID = Number(selectedProfessionID);
    }
    if (activeTab === 'voluntary') {
      params.postTypeID = VOLUNTARY_POST_TYPE_ID;
    }
    return params;
  };

  const fetchFilteredPosts = async () => {
    try {
      const params = buildFilterParams();
      console.log('📡 جاري جلب المنشورات المفلترة:', params);
      setLoading(true);
      setError(null);
      const response = await postsAPI.getFilteredPosts(params);
      console.log('✅ تم جلب المنشورات بنجاح:', response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      setPosts(
        data
          .filter(
            (post) => post.postTypeName !== 'مدفوع' && !isPostComplete(post)
          )
          .map(normalizePost)
      );
    } catch (err) {
      console.error('❌ خطأ في جلب المنشورات:', err);
      setError(
        err.response?.data?.message ||
        'حدث خطأ في تحميل المنشورات. يرجى المحاولة لاحقاً.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      console.log('📝 جاري إنشاء منشور جديد...');
      console.log('� ========== formData BEFORE REQUEST ==========');
      console.log('PostTitle:', formData.PostTitle);
      console.log('Description:', formData.Description);
      console.log('TypeID:', formData.TypeID, '(Type:', typeof formData.TypeID, ')');
      console.log('CountyID:', formData.CountyID, '(Type:', typeof formData.CountyID, ')');
      console.log('ProfessionID:', formData.ProfessionID, '(Type:', typeof formData.ProfessionID, ')');
      console.log('imagePath:', formData.imagePath);
      console.log('Status:', formData.Status);
      console.log('Full formData Object:', formData);
      console.log('📋 =============================================');
      
      // ✅ تحويل البيانات من PascalCase إلى camelCase
      const requestPayload = {
        postTitle: formData.PostTitle,
        description: formData.Description,
        typeID: formData.TypeID,
        countyID: formData.CountyID,
        professionID: formData.ProfessionID,
        imagePath: formData.imagePath?.trim() || '',
        ImagePath: formData.imagePath?.trim() || '',
        status: formData.Status,
        publishDate: new Date().toISOString(),
      };
      
      console.log('🚀 ========== REQUEST PAYLOAD ==========');
      console.log('postTitle:', requestPayload.postTitle);
      console.log('description:', requestPayload.description);
      console.log('typeID:', requestPayload.typeID);
      console.log('countyID:', requestPayload.countyID, '⭐ هذه القيمة المُرسلة');
      console.log('professionID:', requestPayload.professionID);
      console.log('imagePath:', requestPayload.imagePath);
      console.log('status:', requestPayload.status);
      console.log('publishDate:', requestPayload.publishDate, '📅 التاريخ الحالي');
      console.log('Full Request:', JSON.stringify(requestPayload, null, 2));
      console.log('🚀 ====================================');
      
      setLoading(true);
      const response = await postsAPI.createPost(requestPayload);
      console.log('✅ تم إنشاء المنشور بنجاح:', response.data);
      
      // ✅ جلب جميع المنشورات من الـ API بعد الإنشاء
      console.log('🔄 جاري جلب قائمة المنشورات المحدثة...');
      setSearchTerm('');
      setSelectedCountyID('');
      setSelectedProfessionID('');
      setActiveTab('all');
      await fetchFilteredPosts();
      
      alert('✅ تم إنشاء المنشور بنجاح');
      setFormData({
        PostTitle: '',
        Description: '',
        TypeID: 1,
        CountyID: 3,
        ProfessionID: 1,
        imagePath: '',
        Status: 1,
      });
      setSelectedCityForForm(null);
      setShowCreateModal(false);
    } catch (err) {
      console.error('❌ خطأ في إنشاء المنشور:', err);
      console.error('📋 Error Response:', err.response?.data);
      alert('❌ فشل في إنشاء المنشور: ' + (err.response?.data?.message || err.message));
    } finally {
      console.log('✅ انتهت عملية الإنشاء');
      setLoading(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      setLoading(true);
      await postsAPI.updatePost(editingPost.postID, formData);
      alert('✅ تم تحديث المنشور بنجاح');
      setShowEditModal(false);
      setEditingPost(null);
      setFormData({
        PostTitle: '',
        Description: '',
        TypeID: 1,
        CountyID: 3,
        ProfessionID: 1,
        imagePath: '',
        Status: 1,
      });
      setSelectedCityForForm(null);
      await fetchFilteredPosts();
    } catch (err) {
      console.error('Error updating post:', err);
      alert('❌ فشل في تحديث المنشور: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;

    try {
      setLoading(true);
      await postsAPI.deletePost(deletingPostId);
      
      // حذف فوري من الـ state بدون إعادة تحميل
      setPosts(posts.filter(post => post.postID !== deletingPostId));
      
      setShowConfirmDelete(false);
      setDeletingPostId(null);
      
      alert('✅ تم حذف المنشور بنجاح');
    } catch (err) {
      console.error('Error deleting post:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          err.message || 
                          'فشل في حذف المنشور';
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.completePost(postID);
      setPosts((prev) => prev.filter((p) => p.postID !== postID));
      dispatchPostCompleted(postID);
      alert('✅ تم إكمال المنشور');
    } catch (err) {
      console.error('Error completing post:', err);
      alert('❌ ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLockPost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.lockPost(postID);
      alert('✅ تم قفل المنشور');
      await fetchFilteredPosts();
    } catch (err) {
      console.error('Error locking post:', err);
      alert('❌ ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockPost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.unlockPost(postID);
      alert('✅ تم فتح المنشور');
      await fetchFilteredPosts();
    } catch (err) {
      console.error('Error unlocking post:', err);
      alert('❌ ' + (err.response?.data?.message || err.message));
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
      console.log('📝 جاري إرسال طلب التقديم على الخدمة...');
      
      const applicationData = {
        postID: applyingToPost.postID,
        description: applyMessage.trim() || null
      };

      console.log('📤 بيانات الطلب:', applicationData);
      const response = await api.post('/Services/Create Service Application', applicationData);
      
      console.log('✅ تم التقديم بنجاح:', response.data);
      
      // ✅ إضافة المنشور للـ set الخاص بـ appliedPosts
      setAppliedPosts(prev => new Set([...prev, applyingToPost.postID]));
      
      setShowApplyModal(false);
      setApplyMessage('');
      setApplyingToPost(null);
      
      alert('✅ تم التقدم بنجاح!');
    } catch (error) {
      console.error('❌ خطأ في التقديم على الخدمة:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'فشل في التقديم على الخدمة';
      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  // ============================================
  // 🎯 HANDLERS
  // ============================================

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      PostTitle: post.postTitle || '',
      Description: post.description || '',
      TypeID: post.typeID || 1,
      CountyID: post.countyID || 1,
      ProfessionID: post.professionID || 1,
      imagePath: getRawImagePath(post) || '',
      Status: post.status || 1,
    });
    // تعيين المدينة المختارة بناءً على المنطقة
    const county = counties.find(c => c.countyID === post.countyID);
    if (county) {
      setSelectedCityForForm(county.cityID);
    }
    setShowEditModal(true);
  };

  // ============================================
  // 🎨 UI RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-40">
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
                  onClick={() => {
                    setFormData({
                      PostTitle: '',
                      Description: '',
                      TypeID: 1,
                      CountyID: 3,
                      ProfessionID: 1,
                      imagePath: '',
                      Status: 1,
                    });
                    setShowCreateModal(true);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg transform hover:scale-105"
                >
                  <span className="text-xl">+</span>
                  إضافة منشور
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
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-6">
            {/* Tab Filters */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    : "bg-white text-slate-900 border-2 border-slate-200 hover:border-emerald-500"
                }`}
              >
                جميع المنشورات ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('voluntary')}
                className={`px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
                  activeTab === 'voluntary'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-emerald-500'
                }`}
              >
                تطوعية
              </button>

            </div>

            {/* Search & Additional Filters */}
            <div className="w-full flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="🔍 ابحث عن منشور..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[250px] px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
              />
              
              <select
                value={selectedCountyID}
                onChange={(e) => setSelectedCountyID(e.target.value)}
                disabled={loadingCounties}
                className="px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 outline-none cursor-pointer transition-all disabled:opacity-60"
              >
                <option value="">🌍 جميع المناطق</option>
                {counties.map((county) => (
                  <option key={county.countyID} value={county.countyID}>
                    📍 {county.countyName}
                  </option>
                ))}
              </select>

              <select
                value={selectedProfessionID}
                onChange={(e) => setSelectedProfessionID(e.target.value)}
                className="px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 outline-none cursor-pointer transition-all"
              >
                <option value="">💼 جميع المهن</option>
                {PROFESSION_OPTIONS.map((prof) => (
                  <option key={prof.id} value={prof.id}>{prof.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="py-12">
            <CardSkeleton count={6} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-xl font-bold mb-4">حدث خطأ</p>
            <p className="text-red-500 mb-8">{error}</p>
            <button
              onClick={fetchFilteredPosts}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-300 text-7xl mb-6">📋</div>
            <p className="text-slate-600 text-xl font-bold mb-4">لا توجد منشورات</p>
            {isLoggedIn && (
              <button
                onClick={() => {
                  setFormData({
                    PostTitle: '',
                    Description: '',
                    TypeID: 1,
                    CountyID: 3,
                    ProfessionID: 1,
                    imagePath: '',
                    Status: 1,
                  });
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
              >
                إنشاء منشور جديد
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.postID}
                post={post}
                onEdit={openEditModal}
                onDelete={(id) => {
                  setDeletingPostId(id);
                  setShowConfirmDelete(true);
                }}
                onCardClick={handleCardClick}
                isOwner={isLoggedIn && post.authorName === user?.username}
                isLoggedIn={isLoggedIn}
                currentUser={user}
                onApplyClick={(post) => {
                  setApplyingToPost({
                    postID: post.postID,
                    postTitle: post.postTitle,
                    postTypeName: post.postTypeName
                  });
                  setShowApplyModal(true);
                }}
                appliedPosts={appliedPosts}
              />
            ))}
          </div>
        )}
      </section>

      {/* CREATE/EDIT MODAL */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {showEditModal ? '✏️ تعديل المنشور' : '➕ إضافة منشور جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingPost(null);
                  setSelectedCityForForm(null);
                }}
                className="text-2xl hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>
            {(loadingCities || loadingCounties) && (
              <div className="bg-blue-50 border-b-2 border-blue-200 px-6 py-3 text-blue-700 font-semibold text-center">
                {loadingCities && '⏳ جاري تحميل المدن...'}
                {loadingCounties && '⏳ جاري تحميل المناطق...'}
              </div>
            )}

            <form onSubmit={showEditModal ? handleUpdatePost : handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  عنوان المنشور <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.PostTitle}
                  onChange={(e) => setFormData({ ...formData, PostTitle: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="أدخل العنوان"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none h-32 resize-none"
                  placeholder="أدخل الوصف"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-2">نوع المنشور</label>
                  <select
                    value={formData.TypeID}
                    onChange={(e) => setFormData({ ...formData, TypeID: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="1">تطوعي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2">المدينة</label>
                  <select
                    value={selectedCityForForm || ''}
                    onChange={(e) => {
                      const cityID = e.target.value ? parseInt(e.target.value) : null;
                      console.log('🏙️ تم تغيير المدينة:', { cityID });
                      setSelectedCityForForm(cityID);
                    }}
                    disabled={cities.length === 0}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- اختر مدينة --</option>
                    {cities.length === 0 ? (
                      <option disabled>⏳ جاري تحميل المدن...</option>
                    ) : (
                      cities.map(city => (
                        <option key={city.cityID} value={city.cityID}>
                          {city.cityName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  المنطقة / المحافظة {selectedCityForForm && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={formData.CountyID}
                  onChange={(e) => {
                    const newCountyID = parseInt(e.target.value);
                    console.log('🏙️ تم تغيير المنطقة:', { oldValue: formData.CountyID, newValue: newCountyID });
                    setFormData({ ...formData, CountyID: newCountyID });
                  }}
                  disabled={!selectedCityForForm || filteredCounties.length === 0}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {!selectedCityForForm ? (
                    <option value="">-- اختر مدينة أولاً --</option>
                  ) : filteredCounties.length === 0 ? (
                    <option value="">⏳ لا توجد مناطق لهذه المدينة</option>
                  ) : (
                    <>
                      <option value="">-- اختر منطقة --</option>
                      {filteredCounties.map(county => (
                        <option key={county.countyID} value={county.countyID}>
                          {county.countyName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">صورة المنشور (اختياري)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={imageUploading}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 disabled:opacity-50"
                />
                {imageUploading && (
                  <p className="mt-2 text-sm text-slate-500">⏳ جاري تحضير الصورة...</p>
                )}
                <p className="mt-2 text-xs text-slate-500">اختر صورة من جهازك — لا حاجة لرابط https</p>
                <label className="block text-slate-600 text-sm mt-3 mb-1">أو رابط من الإنترنت</label>
                <input
                  type="url"
                  value={formData.imagePath.startsWith('data:') ? '' : formData.imagePath}
                  onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imagePath && (
                  <div className="mt-3">
                    <img
                      src={getImagePreviewUrl(formData.imagePath)}
                      alt="معاينة"
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imagePath: '' })}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ جاري...' : showEditModal ? 'تحديث' : 'إنشاء'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingPost(null);
                    setSelectedCityForForm(null);
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">تأكيد الحذف</h3>
            <p className="text-slate-600 mb-8">هل أنت متأكد من رغبتك في حذف هذا المنشور؟</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeletePost}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? '⏳ جاري...' : 'حذف'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setDeletingPostId(null);
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-xl font-bold transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE DETAILS MODAL */}
      {showServiceModal && selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          isLoggedIn={isLoggedIn}
          onClose={() => setShowServiceModal(false)}
          onApply={(post) => {
            setShowServiceModal(false);
            setApplyingToPost({
              postID: post.postID,
              postTitle: post.postTitle,
              postTypeName: post.postTypeName
            });
            setShowApplyModal(true);
          }}
          onLoginRequired={() => {
            setShowServiceModal(false);
            setShowLoginRequired(true);
          }}
        />
      )}

      {/* APPLY FOR SERVICE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 rounded-t-3xl">
              <h2 className="text-2xl font-bold text-white">🤝 تقديم الطلب</h2>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {applyingToPost?.postTitle}
              </h3>
              
              <div className="mb-6">
                <label className="block text-slate-700 font-bold mb-2">
                  وصف طلبك
                </label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none h-32 resize-none"
                  placeholder="اكتب وصف طلبك هنا... (اختياري)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyToService}
                  disabled={loading || appliedPosts.has(applyingToPost?.postID)}
                  className={`flex-1 py-4 rounded-xl font-bold transition-all shadow-lg ${
                    appliedPosts.has(applyingToPost?.postID)
                      ? 'bg-slate-400 text-white cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-50'
                  }`}
                >
                  {loading ? '⏳ جاري الإرسال...' : appliedPosts.has(applyingToPost?.postID) ? '✅ تم التقديم' : '📤 إرسال الطلب'}
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

      {/* PAYMENT MODAL */}

      {/* LOGIN REQUIRED MODAL */}
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
    </div>
  );
}

// ==================
// COMPONENT: PostCard
// ==================
function PostCard({ post, onEdit, onDelete, onCardClick, isOwner, isLoggedIn, currentUser, onApplyClick, appliedPosts }) {
  const [isHover, setIsHover] = useState(false);
  const hasApplied = appliedPosts && appliedPosts.has(post.postID);
  const isPostOwner = isLoggedIn && post.authorName === currentUser?.username;

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 border-2 ${
        isHover ? "transform scale-105 shadow-2xl border-emerald-300" : "border-slate-100"
      } ${post.isComplete ? "opacity-75" : ""}`}
    >
      <div className="relative">
        <img
          src={getPostImage(post)}
          alt={post.postTitle}
          className={`w-full h-52 object-cover transition-transform duration-300 ${
            isHover ? "scale-110" : "scale-100"
          } cursor-pointer`}
          onClick={() => onCardClick(post)}
          onError={(e) => {
            if (e.target.src !== DEFAULT_POST_IMAGE) {
              e.target.src = DEFAULT_POST_IMAGE;
            }
          }}
        />
        <span className="absolute top-3 right-3 px-4 py-2 rounded-xl text-sm font-bold shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          {post.postTypeName || "تطوعي"}
        </span>
        {post.isComplete && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl">
            مكتملة ✓
          </span>
        )}
        {!post.isComplete && isPostLocked(post) && (
          <span className="absolute top-3 left-3 bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm">
            🔒 مقفل
          </span>
        )}
      </div>

      <div className="p-6 text-right">
        <h3 
          className="text-xl font-bold mb-3 text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors"
          onClick={() => onCardClick(post)}
        >
          {post.postTitle}
        </h3>
        <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{post.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
            <span>📍</span>
            {post.countyName || "غير محدد"}
          </div>
          {post.authorName && (
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <span>👤</span>
              {post.authorName}
            </div>
          )}
          {post.professionName && (
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <span>💼</span>
              {post.professionName}
            </div>
          )}
          {post.publishDateTime && (
            <div className="text-slate-400 text-xs mt-3 font-semibold">
              📅 {new Date(post.publishDateTime).toLocaleDateString('ar-JO')}
            </div>
          )}
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => onEdit(post)}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-bold text-sm transition-all"
            >
              ✏️ تعديل
            </button>
            <button
              onClick={() => onDelete(post.postID)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg font-bold text-sm transition-all"
            >
              🗑️ حذف
            </button>
          </div>
        )}

        {/* Apply Button - Show only if user is logged in, not owner, and post is not complete */}
        {!isOwner && isLoggedIn && !post.isComplete && !isPostLocked(post) && (
          <div className="pt-4 border-t mt-4">
            <button
              onClick={() => onApplyClick(post)}
              disabled={hasApplied}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg text-sm font-semibold ${
                hasApplied
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transform hover:scale-105'
              }`}
            >
              {hasApplied ? '✅ تم التقدم' : '🤝 تقدم للخدمة'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================
// COMPONENT: ServiceDetailsModal
// ==================
function ServiceDetailsModal({ service, isLoggedIn, onClose, onApply, onLoginRequired }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-rose-500 hover:text-white transition-all z-10 shadow-lg"
        >
          ✕
        </button>

        <img
          src={getPostImage(service)}
          alt={service.postTitle}
          className="w-full h-64 object-cover"
          onError={(e) => {
            if (e.target.src !== DEFAULT_POST_IMAGE) {
              e.target.src = DEFAULT_POST_IMAGE;
            }
          }}
        />

        <div className="p-8 text-right">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold flex-1 text-slate-800">
              {service.postTitle}
            </h2>
            {service.isComplete && (
              <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                مكتملة ✓
              </span>
            )}
          </div>
          
          {service.authorName && (
            <p className="text-slate-600 mb-2 font-semibold">
              <strong>👤 الناشر:</strong> {service.authorName}
            </p>
          )}
          
          {service.professionName && (
            <p className="text-slate-600 mb-2 font-semibold">
              <strong>💼 المجال:</strong> {service.professionName}
            </p>
          )}
          
          {service.countyName && (
            <p className="text-slate-600 mb-2 font-semibold">
              <strong>📍 الموقع:</strong> {service.countyName}
            </p>
          )}
          
          {service.postTypeName && (
            <p className="text-slate-600 mb-2 font-semibold">
              <strong>🏷️ النوع:</strong> {service.postTypeName}
            </p>
          )}
          
          {service.publishDateTime && (
            <p className="text-slate-500 text-sm mb-6">
              📅 نُشر في: {new Date(service.publishDateTime).toLocaleDateString('ar-JO')}
            </p>
          )}
          
          <p className="text-slate-700 mb-8 leading-relaxed">
            {service.description}
          </p>

          {!service.isComplete && !isPostLocked(service) && isLoggedIn && (
            <button
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg transform hover:scale-105"
              onClick={() => onApply(service)}
            >
              التقديم للخدمة
            </button>
          )}
          
          {!service.isComplete && !isPostLocked(service) && !isLoggedIn && (
            <button
              className="w-full py-4 bg-slate-400 hover:bg-slate-500 text-white rounded-xl font-bold text-lg cursor-pointer transition-all"
              onClick={onLoginRequired}
            >
              سجّل دخول للتقديم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export default Posts;
