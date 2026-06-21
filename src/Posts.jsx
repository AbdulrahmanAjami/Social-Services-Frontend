import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Edit, Check, Lock, Unlock, AlertCircle,
  User, Handshake, Sparkles, Home, Search, MapPin, Briefcase,
  HeartHandshake, X, ChevronDown, Bell, UserCircle, LogOut,
  CalendarDays, Users, Quote, Star, ArrowLeft,
} from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
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

// Fix Leaflet default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationSelector({ location, onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return location ? <Marker position={location} /> : null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const VOLUNTARY_POST_TYPE_ID = 1;

// ─── Reveal animation wrapper ────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function Posts() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  // ── State ──────────────────────────────────────────────────────────────────
  const [posts, setPosts]                         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState(null);
  const [searchTerm, setSearchTerm]               = useState('');
  const [debouncedSearch, setDebouncedSearch]     = useState('');
  const [selectedCountyID, setSelectedCountyID]   = useState('');
  const [selectedProfessionID, setSelectedProfessionID] = useState('');
  const [activeTab, setActiveTab]                 = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal]     = useState(false);
  const [showEditModal, setShowEditModal]         = useState(false);
  const [editingPost, setEditingPost]             = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingPostId, setDeletingPostId]       = useState(null);
  const [showServiceModal, setShowServiceModal]   = useState(false);
  const [selectedService, setSelectedService]     = useState(null);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation]   = useState(null);

  // Apply
  const [showApplyModal, setShowApplyModal]       = useState(false);
  const [applyMessage, setApplyMessage]           = useState('');
  const [applyingToPost, setApplyingToPost]       = useState(null);
  const [appliedPosts, setAppliedPosts]           = useState(new Set());

  // AI
  const [aiSearchInput, setAiSearchInput]         = useState('');
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading]                 = useState(false);
  const [aiError, setAiError]                     = useState(null);

  // Volunteer
  const [isVolunteer, setIsVolunteer]             = useState(false);
  const [volunteerLoading, setVolunteerLoading]   = useState(false);
  const [volunteerAppID, setVolunteerAppID] = useState(null);

  // Custom dropdowns
  const [professionDropdownOpen, setProfessionDropdownOpen] = useState(false);
  const professionDropdownRef = React.useRef(null);

  // Header user menu
  const [userMenuOpen, setUserMenuOpen]           = useState(false);
  const userRef = React.useRef(null);

  // Form
  const [formData, setFormData] = useState({
    PostTitle: '', Description: '', TypeID: 1, CountyID: 3,
    ProfessionID: 1, imagePath: '', Status: 1, Latitude: null, Longitude: null,
    ServicesRequiredCount: 1,
  });
  const defaultMapCenter = { lat: 31.9454, lng: 35.9284 };

  // Cities / Counties
  const [counties, setCounties]                   = useState([]);
  const [loadingCounties, setLoadingCounties]     = useState(false);
  const [cities, setCities]                       = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loadingCities, setLoadingCities]         = useState(false);
  const [selectedCityForForm, setSelectedCityForForm] = useState(null);
  const [filteredCounties, setFilteredCounties]   = useState([]);
  const [imageUploading, setImageUploading]       = useState(false);
  const [scrolled, setScrolled]                   = useState(false);

  // ── Effects ────────────────────────────────────────────────────────────────
// 🔄 عدل هذا السطر ليصبح هكذا:
useEffect(() => { fetchCities(); fetchCounties(); fetchProfessions(); }, []);  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);
  useEffect(() => { fetchFilteredPosts(); }, [debouncedSearch, selectedCountyID, selectedProfessionID, activeTab]);
  
  // Check volunteer status on page load
  useEffect(() => {
    const checkVolunteerStatus = async () => {
      if (!isLoggedIn || !user?.userID) return;

      setVolunteerLoading(true);
      try {
        const response = await api.get('/Volunteer/Get Volunteer by userID', {
          params: { userID: user?.userID }
        });
        setIsVolunteer(true);
        setVolunteerAppID(response.data?.volunteerApplicationID);

      } catch (error) {
        // If 404 or error, user is not a volunteer
        setIsVolunteer(false);
      } finally {
        setVolunteerLoading(false);
      }
    };
    checkVolunteerStatus();
  }, [isLoggedIn , user]);

  // Close profession dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (professionDropdownRef.current && !professionDropdownRef.current.contains(e.target)) {
        setProfessionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const onPostCompleted = ({ detail }) => {
      const postID = detail?.postID;
      if (postID == null) return;
      setPosts((prev) => prev.filter((p) => p.postID !== postID));
    };
    window.addEventListener(POST_COMPLETED_EVENT, onPostCompleted);
    return () => window.removeEventListener(POST_COMPLETED_EVENT, onPostCompleted);
  }, []);
  useEffect(() => {
    if (selectedCityForForm && counties.length > 0) {
      const filtered = counties.filter(c => c.cityID === selectedCityForForm);
      setFilteredCounties(filtered);
      if (filtered.length > 0) setFormData(p => ({ ...p, CountyID: filtered[0].countyID }));
    } else {
      setFilteredCounties([]);
    }
  }, [selectedCityForForm, counties]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuOpen && userRef.current && !userRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [userMenuOpen]);

  // ── Image ──────────────────────────────────────────────────────────────────

const handleImageFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    setImageUploading(true);
    setFormData((prev) => ({ ...prev, imageFile: file })); // احفظ الـ file مباشرة
  } catch (err) {
    alert(err.message || 'تعذّر تحميل الصورة');
  } finally {
    setImageUploading(false);
    e.target.value = '';
  }
};




  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFormData((prev) => ({ ...prev, Latitude: location.lat, Longitude: location.lng }));
  };

  const openLocationModal = () => {
    const cur = formData.Latitude && formData.Longitude
      ? { lat: formData.Latitude, lng: formData.Longitude } : null;
    setSelectedLocation(cur);
    setShowLocationModal(true);
  };

  // ── API calls (identical to original) ────────────────────────────────────
  const fetchCounties = async () => {
    try {
      setLoadingCounties(true);
      const response = await apiBase.get('/CitiesCounties/Get All Counties');
      setCounties(Array.isArray(response.data) ? response.data : []);
    } catch (err) { setCounties([]); }
    finally { setLoadingCounties(false); }
  };

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const response = await apiBase.get('/CitiesCounties/Get All Cities');
      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (err) { setCities([]); }
    finally { setLoadingCities(false); }
  };



  

const fetchProfessions = async () => {
  try {
    // 🌟 استخدمنا api (وليس apiBase) لأن الـ baseURL تبعه فيه /api تلقائياً
    const response = await api.get('/Profession/GetAllProfessions');
    console.log('Professions:', response.data);
    if (response.data && Array.isArray(response.data)) {
      setProfessions(response.data);
    } else {
      setProfessions([]);
    }
  } catch (err) {
    console.error("فشل في جلب المهن:", err);
    setProfessions([]);
  }
};

  const buildFilterParams = () => {
    const params = {};
    if (debouncedSearch.trim()) params.searchQuery = debouncedSearch.trim();
    if (selectedCountyID) params.countyID = Number(selectedCountyID);
    if (selectedProfessionID) params.professionID = Number(selectedProfessionID);
    if (activeTab === 'voluntary') params.postTypeID = VOLUNTARY_POST_TYPE_ID;
    return params;
  };

  const fetchFilteredPosts = async () => {
    try {
      const params = buildFilterParams();
      setLoading(true); setError(null);
      const response = await postsAPI.getFilteredPosts(params);
      const data = Array.isArray(response.data) ? response.data : [];
      setPosts(
        data.filter(p => p.postTypeName !== 'مدفوع' && !isPostComplete(p)).map(normalizePost)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل المنشورات. يرجى المحاولة لاحقاً.');
    } finally { setLoading(false); }
  };
  console.log('First post imagePath:', posts[0]?.imagePath);

const handleCreatePost = async (e) => {
  e.preventDefault();
  
  if (!isLoggedIn) { alert('يجب تسجيل الدخول أولاً'); navigate('/login'); return; }
  try {
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('Data.PostTitle', formData.PostTitle);
    formDataToSend.append('Data.Description', formData.Description);
    formDataToSend.append('Data.TypeID', formData.TypeID);
    formDataToSend.append('Data.CountyID', formData.CountyID);
    formDataToSend.append('Data.ProfessionID', formData.ProfessionID);
    formDataToSend.append('Data.Status', formData.Status);
    formDataToSend.append('Data.PublishDate', new Date().toISOString());
    if (formData.Latitude) formDataToSend.append('Data.Latitude', formData.Latitude);
    if (formData.Longitude) formDataToSend.append('Data.Longitude', formData.Longitude);
    formDataToSend.append('Data.ServicesRequiredCount', formData.ServicesRequiredCount);
    if (formData.imageFile) formDataToSend.append('Image', formData.imageFile);

const result = await postsAPI.createPost(formDataToSend, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
await fetchFilteredPosts();

    setSearchTerm(''); setSelectedCountyID(''); setSelectedProfessionID(''); setActiveTab('all');
    await fetchFilteredPosts();
    alert('✅ تم إنشاء المنشور بنجاح');
    setFormData({ PostTitle:'',Description:'',TypeID:1,CountyID:3,ProfessionID:1,imagePath:'',Status:1,Latitude:null,Longitude:null, ServicesRequiredCount: 1 });
    setSelectedCityForForm(null); setSelectedLocation(null); setShowCreateModal(false);
  } catch (err) {
    console.log('Validation errors:', err.response?.data?.errors);
    alert('❌ فشل في إنشاء المنشور: ' + (err.response?.data?.message || err.message));
  } finally { setLoading(false); }
};

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      setLoading(true);
      await postsAPI.updatePost(editingPost.postID, formData);
      alert('✅ تم تحديث المنشور بنجاح');
      setShowEditModal(false); setEditingPost(null);
      setFormData({ PostTitle:'',Description:'',TypeID:1,CountyID:3,ProfessionID:1,imagePath:'',Status:1,Latitude:null,Longitude:null });
      setSelectedCityForForm(null); setSelectedLocation(null);
      await fetchFilteredPosts();
    } catch (err) {
      alert('❌ فشل في تحديث المنشور: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const handleDeletePost = async () => {
    if (!deletingPostId) return;
    try {
      setLoading(true);
      await postsAPI.deletePost(deletingPostId);
      setPosts(posts.filter(p => p.postID !== deletingPostId));
      setShowConfirmDelete(false); setDeletingPostId(null);
      alert('✅ تم حذف المنشور بنجاح');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || err.response?.data || err.message || 'فشل في حذف المنشور'));
    } finally { setLoading(false); }
  };

  const handleCompletePost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.completePost(postID);
      setPosts((prev) => prev.filter((p) => p.postID !== postID));
      dispatchPostCompleted(postID);
      alert('✅ تم إكمال المنشور');
    } catch (err) { alert('❌ ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleLockPost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.lockPost(postID);
      alert('✅ تم قفل المنشور');
      await fetchFilteredPosts();
    } catch (err) { alert('❌ ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleUnlockPost = async (postID) => {
    try {
      setLoading(true);
      await postsAPI.unlockPost(postID);
      alert('✅ تم فتح المنشور');
      await fetchFilteredPosts();
    } catch (err) { alert('❌ ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleApplyToService = async () => {
    if (!isLoggedIn) { setShowLoginRequired(true); return; }
    if (!isVolunteer) { navigate('/volunteer-register'); return; }
    if (!applyingToPost) return;
    setLoading(true);
    try {
      const applicationData = { postID: applyingToPost.postID, description: applyMessage.trim() || null };
      await api.post('/Services/Create Service Application', applicationData);
      setAppliedPosts(prev => new Set([...prev, applyingToPost.postID]));
      setShowApplyModal(false); setApplyMessage(''); setApplyingToPost(null);
      alert('✅ تم التقدم بنجاح!');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || error.response?.data || error.message || 'فشل في التقديم على الخدمة'));
    } finally { setLoading(false); }
  };

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!aiSearchInput.trim()) return;
    setAiLoading(true); setAiError(null); setAiRecommendations([]);
    try {
      const response = await api.get('/AI/GetRecommendations', { params: { userMessage: aiSearchInput.trim() } });
      const rawData = response.data;
      const cleanJson = typeof rawData === 'string' 
        ? rawData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        : JSON.stringify(rawData);
      const parsed = JSON.parse(cleanJson);
const postIds = parsed?.postIds || [];
const recommended = posts.filter(post => postIds.includes(Number(post.postID)));

for (const id of postIds) {
  try {
    const res = await api.get('/Posts/GetPostByID', { params: { postID: id } });
    if (res.data) recommended.push(normalizePost(res.data));
  } catch (err) {
    console.error(`Failed to fetch post ${id}:`, err);
  }
}

setAiRecommendations(recommended);
    } catch (error) {
      setAiError(error.response?.data?.message || error.response?.data || error.message || 'فشل في جلب التوصيات');
    } finally { setAiLoading(false); }
  };

  const handleDeleteVolunteerApp = async () => {
  if (!window.confirm('هل أنت متأكد من حذف طلب التطوع؟')) return;
  try {
    await api.delete('/Volunteer/Delete Volunteer Application', {
      params: { appID: volunteerAppID }
    });
    setIsVolunteer(false);
    setVolunteerAppID(null);
    alert('✅ تم حذف الطلب بنجاح');

  } catch (error) {
  console.log('Volunteer error status:', error.response?.status);
  console.log('Volunteer error data:', error.response?.data);
  setIsVolunteer(false);
}
};

const handleCardClick = async (service) => {

  console.log('professions list:', professions);
  console.log('service professionName:', service.professionName);
const profession = professions.find(p => p.professionTitle === service.professionName);
  console.log('found profession:', profession);

  console.log('professions list:', professions);
  if (profession) {
    try {
      await api.post(`/Posts/Log View?professionId=${profession.professionID}`);
    } catch (err) {
      console.error('Failed to log view:', err);
    }
  }
  setSelectedService(service);
  setShowServiceModal(true);
};

const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  const openEditModal = (post) => {
    setEditingPost(post);
    const initialData = {
      PostTitle: post.postTitle || '', Description: post.description || '',
      TypeID: post.typeID || 1, CountyID: post.countyID || 1,
      ProfessionID: post.professionID || 1, imagePath: getRawImagePath(post) || '',
      Status: post.status || 1,
      Latitude: post.latitude ?? post.Latitude ?? null,
      Longitude: post.longitude ?? post.Longitude ?? null,
    };
    setFormData(initialData);
    setSelectedLocation(
      initialData.Latitude != null && initialData.Longitude != null
        ? { lat: initialData.Latitude, lng: initialData.Longitude } : null
    );
    const county = counties.find(c => c.countyID === post.countyID);
    if (county) setSelectedCityForForm(county.cityID);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setShowCreateModal(false); setShowEditModal(false);
    setEditingPost(null); setSelectedCityForForm(null); setSelectedLocation(null);
  };

  // ── shared card props ─────────────────────────────────────────────────────
  const cardProps = (post) => ({
    post,
    onEdit: openEditModal,
    onDelete: (id) => { setDeletingPostId(id); setShowConfirmDelete(true); },
    onCardClick: handleCardClick,
    isOwner: isLoggedIn && post.userID === user?.userID,
    isLoggedIn,
    currentUser: user,
    onApplyClick: (p) => {
      setApplyingToPost({ postID: p.postID, postTitle: p.postTitle, postTypeName: p.postTypeName });
      setShowApplyModal(true);
    },
    appliedPosts,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`sticky top-0 z-50 border-b border-slate-200/60 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">

          {/* RIGHT: Logo + CTA ───────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
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
            {isLoggedIn && (
              <button
                onClick={() => {
                  setFormData({ PostTitle:'',Description:'',TypeID:1,CountyID:3,ProfessionID:1,imagePath:'',Status:1,Latitude:null,Longitude:null });
                  setShowCreateModal(true);
                }}
                className="hidden items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600 sm:inline-flex"
              >
                <Plus className="size-4" /> إضافة منشور
              </button>
            )}
          </div>

          {/* CENTER: Nav links ───────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 lg:flex">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Home className="size-4" /> الرئيسية
            </button>
            <button
              className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900"
            >
              <Briefcase className="size-4" /> الخدمات التطوعية
            </button>
          </nav>

          {/* LEFT: User / Auth / Bell ────────────────────────────────────── */}
          <div className="relative flex items-center gap-2" ref={userRef}>
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform hover:scale-105"
                >
                  <img
                    src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt="Profile"
                    className="size-10 rounded-full object-cover ring-2 ring-emerald-400/50"
                  />
                  <ChevronDown className={`size-4 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <button className="relative hidden size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 sm:flex">
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-amber-500" />
                </button>
                {userMenuOpen && (
                  <div className="absolute left-0 top-14 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                      <img
                        src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt="Profile" className="size-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-bold text-slate-800">{user?.displayName || 'مستخدم'}</span>
                        <span className="text-xs text-slate-500">{user?.email}</span>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-slate-200" />
                    <button
                      onClick={() => { navigate('/Profile'); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-100"
                    >
                      <UserCircle className="size-4 text-emerald-600" /> الملف الشخصي
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl border-t border-slate-200 px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="size-4" /> تسجيل الخروج
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform hover:scale-105"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-white">
                  <User className="size-5" />
                </span>
                <ChevronDown className="size-4 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ━━━━ PAGE HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="border-b border-slate-100 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* Volunteer Registration Banner */}
          {isLoggedIn && !volunteerLoading && !isVolunteer && (
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-amber-500 text-white">
                    <HeartHandshake className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">سجل كمتطوع للتقديم على الخدمات</h3>
                    <p className="text-sm text-slate-600">يجب أن تكون متطوعاً للتقديم على أي خدمة تطوعية</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/volunteer-register')}
                  className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 shadow-md"
                >
                  <HeartHandshake className="size-4" />
                  سجل كمتطوع
                </button>
              </div>
            </div>
          )}

          {isLoggedIn && !volunteerLoading && !isVolunteer && volunteerAppID && (
  <div className="mb-8 rounded-2xl bg-red-50 border-2 border-red-200 p-6">
    <div className="flex items-center justify-between">
      <p className="font-bold text-slate-800">طلب التطوع قيد المراجعة</p>
      <button
        onClick={handleDeleteVolunteerApp}
        className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-600"
      >
        <Trash2 className="size-4" />
        حذف الطلب
      </button>
    </div>
  </div>
)}

          <Reveal className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700">
              <Sparkles className="size-4" /> فرص التطوّع
            </span>
            <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              اختر الفرصة التي{' '}
              <span className="bg-gradient-to-l from-emerald-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
                تناسبك
              </span>
            </h1>
            <p className="max-w-xl text-lg text-slate-500">
              تصفّح مئات الفرص التطوعية، وابدأ في إحداث فرق إيجابي حقيقي في مجتمعك اليوم.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ━━━━ FILTERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="sticky top-[65px] z-30 border-b border-slate-100 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: `جميع المنشورات (${posts.length})` },
                
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search + filters row */}
            <div className="flex flex-wrap gap-3">
            

              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedCountyID}
                  onChange={(e) => setSelectedCountyID(e.target.value)}
                  disabled={loadingCounties}
                  className="rounded-2xl border border-slate-200 bg-white py-2.5 pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400 disabled:opacity-60 cursor-pointer"
                >
                  <option value="">جميع المناطق</option>
                  {counties.map(c => (
                    <option key={c.countyID} value={c.countyID}>{c.countyName}</option>
                  ))}
                </select>
              </div>

<div className="relative" ref={professionDropdownRef}>
  <Briefcase className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 z-10" />
  <button
    onClick={() => setProfessionDropdownOpen(!professionDropdownOpen)}
    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-emerald-400 cursor-pointer flex items-center justify-between"
  >
    <span>
      {selectedProfessionID
        ? professions.find(p => p.professionID === selectedProfessionID)?.professionTitle || 'جميع المهن'
        : 'جميع المهن'}
    </span>
    <ChevronDown className={`size-4 text-slate-400 transition-transform ${professionDropdownOpen ? 'rotate-180' : ''}`} />
  </button>
  
  {professionDropdownOpen && (
    <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
<div
  onClick={() => {
    setSelectedProfessionID('');
    setProfessionDropdownOpen(false);
  }}
  className="px-4 py-2.5 text-sm text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors bg-white"
>
  جميع المهن
</div>
      {professions.map((p) => (
        <div
          key={p.professionID}
          onClick={() => {
            setSelectedProfessionID(p.professionID);
            setProfessionDropdownOpen(false);
          }}
          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
            selectedProfessionID === p.professionID
              ? 'bg-emerald-50 text-emerald-700 font-semibold'
              : 'text-slate-900 hover:bg-slate-50'
          }`}
        >
          {p.professionTitle}
        </div>
      ))}
    </div>
  )}
</div>
            </div>

            {/* AI search */}
            <form onSubmit={handleAiSearch} className="flex gap-3 border-t border-slate-100 pt-3">
              <div className="relative flex-1">
                <Sparkles className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="صف ما تبحث عنه بلغتك (مثال: أريد التطوع في تعليم الأطفال في عمان)..."
                  value={aiSearchInput}
                  onChange={(e) => setAiSearchInput(e.target.value)}
                  className="w-full rounded-2xl border border-purple-200 bg-white py-2.5 pr-10 pl-4 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <button
                type="submit"
                disabled={aiLoading || !aiSearchInput.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? '⏳' : <Sparkles className="size-4" />}
                {aiLoading ? 'جاري البحث...' : 'توصيات ذكية'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ━━━━ MAIN CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">

        {/* AI Recommendations */}
        {(aiRecommendations.length > 0 || aiLoading || aiError) && (
          <div className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-purple-100">
                <Sparkles className="size-5 text-purple-600" />
              </span>
              <h2 className="text-xl font-black text-slate-800">التوصيات الذكية</h2>
            </div>

            {aiLoading && (
              <div className="py-8"><CardSkeleton count={3} /></div>
            )}

            {aiError && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <AlertCircle className="size-10 text-red-500" />
                <p className="font-bold text-red-700">حدث خطأ في جلب التوصيات</p>
                <p className="text-sm text-red-600">{aiError}</p>
                <button onClick={() => setAiError(null)} className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600">
                  إغلاق
                </button>
              </div>
            )}

            {aiRecommendations.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {aiRecommendations.map(post => (
                  <PostCard key={post.postID} {...cardProps(post)} />
                ))}
              </div>
            )}

            <div className="my-10 border-t border-slate-100" />
          </div>
        )}

        {/* Posts grid */}
        {loading ? (
          <div className="py-8"><CardSkeleton count={6} /></div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertCircle className="size-14 text-red-400" />
            <p className="text-lg font-bold text-red-600">حدث خطأ</p>
            <p className="text-slate-500">{error}</p>
            <button
              onClick={fetchFilteredPosts}
              className="rounded-full bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-6xl">📋</span>
            <p className="text-lg font-bold text-slate-700">لا توجد منشورات</p>
            <p className="text-slate-500">جرّب تغيير الفلاتر أو كن أوّل من ينشر!</p>
            {isLoggedIn && (
              <button
                onClick={() => {
                  setFormData({ PostTitle:'',Description:'',TypeID:1,CountyID:3,ProfessionID:1,imagePath:'',Status:1,Latitude:null,Longitude:null });
                  setShowCreateModal(true);
                }}
                className="rounded-full bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                إنشاء منشور جديد
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.postID} {...cardProps(post)} />
            ))}
          </div>
        )}
      </main>

      {/* ━━━━ CREATE / EDIT MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 flex items-center justify-between rounded-t-3xl bg-emerald-600 px-6 py-4 text-white">
              <h2 className="text-xl font-black">
                {showEditModal ? 'تعديل المنشور' : 'إضافة منشور جديد'}
              </h2>
              <button onClick={resetForm} className="rounded-full p-2 transition hover:bg-white/20">
                <X className="size-5" />
              </button>
            </div>

            {(loadingCities || loadingCounties) && (
              <div className="border-b border-blue-100 bg-blue-50 px-6 py-2 text-center text-sm font-semibold text-blue-700">
                {loadingCities && '⏳ جاري تحميل المدن...'}
                {loadingCounties && '⏳ جاري تحميل المناطق...'}
              </div>
            )}

            <form onSubmit={showEditModal ? handleUpdatePost : handleCreatePost} className="space-y-5 p-6">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  عنوان المنشور <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" required
                  value={formData.PostTitle}
                  onChange={(e) => setFormData({ ...formData, PostTitle: e.target.value })}
                  placeholder="أدخل العنوان"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  الوصف <span className="text-red-500">*</span>
                </label>
                <textarea
                  required rows={4}
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  placeholder="أدخل الوصف"
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
  <label className="mb-1.5 block text-sm font-bold text-slate-700">
    عدد المتطوعين المطلوبين <span className="text-red-500">*</span>
  </label>
  <input
    type="number" required min={1} max={100}
    value={formData.ServicesRequiredCount}
    onChange={(e) => setFormData({ ...formData, ServicesRequiredCount: parseInt(e.target.value) })}
    placeholder="أدخل عدد المتطوعين"
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
  />
</div>

              {/* Type + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">نوع المنشور</label>
                  <select
                    value={formData.TypeID}
                    onChange={(e) => setFormData({ ...formData, TypeID: parseInt(e.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="1">تطوعي</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">المدينة</label>
                  <select
                    value={selectedCityForForm || ''}
                    onChange={(e) => setSelectedCityForForm(e.target.value ? parseInt(e.target.value) : null)}
                    disabled={cities.length === 0}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- اختر مدينة --</option>
                    {cities.map(c => <option key={c.cityID} value={c.cityID}>{c.cityName}</option>)}
                  </select>
                </div>
              </div>

              {/* County */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  المنطقة / المحافظة {selectedCityForForm && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={formData.CountyID}
                  onChange={(e) => setFormData({ ...formData, CountyID: parseInt(e.target.value) })}
                  disabled={!selectedCityForForm || filteredCounties.length === 0}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  {!selectedCityForForm ? (
                    <option value="">-- اختر مدينة أولاً --</option>
                  ) : filteredCounties.length === 0 ? (
                    <option value="">لا توجد مناطق لهذه المدينة</option>
                  ) : (
                    <>
                      <option value="">-- اختر منطقة --</option>
                      {filteredCounties.map(c => <option key={c.countyID} value={c.countyID}>{c.countyName}</option>)}
                    </>
                  )}
                </select>
              </div>

              {/* Profession */}
              <div>
<select
  value={formData.ProfessionID}
  onChange={(e) => setFormData({ ...formData, ProfessionID: Number(e.target.value) })}
  className="..."
>
  <option value="">اختر المهنة</option>
  
{professions.map((p) => (
  <option key={p.professionID} value={p.professionID} style={{color: '#1e293b', backgroundColor: 'white'}}>
    {p.professionTitle}
  </option>
))}
</select>
              </div>

              {/* Location */}
              <div>
                <button
                  type="button" onClick={openLocationModal}
                  className="w-full rounded-2xl border-2 border-dashed border-emerald-300 py-3 text-sm font-bold text-emerald-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <MapPin className="mr-1 inline size-4" /> تحديد الموقع على الخريطة
                </button>
                {formData.Latitude != null && (
                  <p className="mt-1.5 text-xs font-semibold text-emerald-700">
                    ✅ تم تحديد الموقع ({formData.Latitude.toFixed(5)}, {formData.Longitude.toFixed(5)})
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">صورة المنشور (اختياري)</label>
                <input
                  type="file" accept="image/*"
                  onChange={handleImageFileChange} disabled={imageUploading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
                />
                {imageUploading && <p className="mt-1 text-xs text-slate-500">⏳ جاري تحضير الصورة...</p>}
                <label className="mb-1 mt-3 block text-xs text-slate-500">أو رابط من الإنترنت</label>
                <input
                  type="url"
                  value={formData.imagePath.startsWith('data:') ? '' : formData.imagePath}
                  onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400"
                />
                {formData.imagePath && (
                  <div className="mt-3">
                    <img
                      src={getImagePreviewUrl(formData.imagePath)} alt="معاينة"
                      className="h-40 w-full rounded-2xl object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button type="button" onClick={() => setFormData({ ...formData, imagePath: '' })}
                      className="mt-1.5 text-xs text-red-500 hover:text-red-700">
                      إزالة الصورة
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? '⏳ جاري...' : showEditModal ? 'تحديث' : 'إنشاء'}
                </button>
                <button type="button" onClick={resetForm}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━━━ LOCATION MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between rounded-t-3xl bg-emerald-600 px-6 py-4 text-white">
              <h3 className="text-lg font-black">تحديد الموقع على الخريطة</h3>
              <button onClick={() => setShowLocationModal(false)} className="rounded-full p-2 transition hover:bg-white/20">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm text-slate-500">اضغط على الخريطة لاختيار الموقع، ثم أغلق النافذة عند الانتهاء.</p>
              <div className="h-96 overflow-hidden rounded-2xl border border-slate-200">
                <MapContainer center={selectedLocation || defaultMapCenter} zoom={10} scrollWheelZoom className="h-full w-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationSelector location={selectedLocation} onSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {selectedLocation
                    ? `✅ الموقع: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
                    : 'اضغط على الخريطة لتحديد الموقع'}
                </p>
                <button onClick={() => setShowLocationModal(false)}
                  className="rounded-2xl bg-slate-100 px-5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200">
                  تم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ DELETE CONFIRM MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-100 mx-auto">
              <Trash2 className="size-7 text-red-500" />
            </div>
            <h3 className="mb-2 text-center text-xl font-black text-slate-800">تأكيد الحذف</h3>
            <p className="mb-6 text-center text-slate-500">هل أنت متأكد من رغبتك في حذف هذا المنشور؟ لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={handleDeletePost} disabled={loading}
                className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50">
                {loading ? '⏳' : 'حذف'}
              </button>
              <button onClick={() => { setShowConfirmDelete(false); setDeletingPostId(null); }}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ SERVICE DETAILS MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showServiceModal && selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          isLoggedIn={isLoggedIn}
          onClose={() => setShowServiceModal(false)}
          onApply={(post) => {
            setShowServiceModal(false);
            setApplyingToPost({ postID: post.postID, postTitle: post.postTitle, postTypeName: post.postTypeName });
            setShowApplyModal(true);
          }}
          onLoginRequired={() => { setShowServiceModal(false); setShowLoginRequired(true); }}
        />
      )}

      {/* ━━━━ APPLY MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-emerald-600 px-8 py-5">
              <h2 className="text-xl font-black text-white">تقديم الطلب</h2>
              <p className="mt-1 text-sm text-emerald-100">{applyingToPost?.postTitle}</p>
            </div>
            <div className="p-8">
              <label className="mb-2 block text-sm font-bold text-slate-700">وصف طلبك (اختياري)</label>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                rows={4} placeholder="اكتب وصف طلبك هنا..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleApplyToService}
                  disabled={loading || appliedPosts.has(applyingToPost?.postID)}
                  className={`flex-1 rounded-2xl py-3 font-bold transition ${
                    appliedPosts.has(applyingToPost?.postID)
                      ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
                  }`}
                >
                  {loading ? '⏳ جاري الإرسال...'
                    : appliedPosts.has(applyingToPost?.postID) ? '✅ تم التقديم' : 'إرسال الطلب'}
                </button>
                <button
                  onClick={() => { setShowApplyModal(false); setApplyMessage(''); setApplyingToPost(null); }}
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ LOGIN REQUIRED MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showLoginRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-amber-100">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="mb-2 text-xl font-black text-slate-800">الرجاء تسجيل الدخول</h2>
            <p className="mb-6 text-slate-500">يجب عليك تسجيل الدخول للمتابعة</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowLoginRequired(false); navigate('/login'); }}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                تسجيل الدخول
              </button>
              <button onClick={() => setShowLoginRequired(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PostCard component
// ═══════════════════════════════════════════════════════════════════════════════
function PostCard({ post, onEdit, onDelete, onCardClick, isOwner, isLoggedIn, currentUser, onApplyClick, appliedPosts }) {
  const hasApplied = appliedPosts && appliedPosts.has(post.postID);
  const imageUrl = getPostImage(post);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-600/5 cursor-pointer"
      onClick={() => onCardClick(post)}
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={imageUrl}
          alt={post.postTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { if (e.target.src !== DEFAULT_POST_IMAGE) e.target.src = DEFAULT_POST_IMAGE; }}
        />
        {/* Badges */}
        <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          {post.postTypeName || 'تطوعي'}
        </span>
        {post.isComplete && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">مكتملة ✓</span>
        )}
        {!post.isComplete && isPostLocked(post) && (
          <span className="absolute left-3 top-3 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">🔒 مقفل</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 text-right">
        <h3
          className="mb-2 text-lg font-extrabold text-slate-800 transition-colors hover:text-emerald-600 line-clamp-1"
        >
          {post.postTitle}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-500 line-clamp-2">{post.description}</p>

        <div className="mb-4 flex flex-col gap-1.5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-amber-500" /> {post.countyName || 'غير محدد'}</span>
          {post.authorName && <span className="flex items-center gap-1.5"><User className="size-3.5 text-emerald-500" /> {post.authorName}</span>}
          {post.professionName && <span className="flex items-center gap-1.5"><Briefcase className="size-3.5 text-emerald-500" /> {post.professionName}</span>}
          {post.publishDateTime && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-slate-400" />
              {new Date(post.publishDateTime).toLocaleDateString('ar-JO')}
            </span>
          )}
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
            <button onClick={(e) => { e.stopPropagation(); onEdit(post); }}
              className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
              ✏️ تعديل
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(post.postID); }}
              className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">
              🗑️ حذف
            </button>
          </div>
        )}

        {/* Apply button */}
        {!isOwner && isLoggedIn && !post.isComplete && !isPostLocked(post) && (
          <div className="mt-auto border-t border-slate-100 pt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onApplyClick(post); }}
              disabled={hasApplied}
              className={`w-full rounded-2xl py-2.5 text-sm font-bold transition ${
                hasApplied
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20'
              }`}
            >
              {hasApplied ? '✅ تم التقدم' : 'تقدم للخدمة'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ServiceDetailsModal component
// ═══════════════════════════════════════════════════════════════════════════════
function ServiceDetailsModal({ service, isLoggedIn, onClose, onApply, onLoginRequired }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute left-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-red-50 hover:text-red-600">
          <X className="size-5" />
        </button>

        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={getPostImage(service)} alt={service.postTitle}
            className="h-full w-full object-cover"
            onError={(e) => { if (e.target.src !== DEFAULT_POST_IMAGE) e.target.src = DEFAULT_POST_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-4 right-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
            {service.postTypeName || 'تطوعي'}
          </span>
        </div>

        {/* Content */}
        <div className="p-7 text-right">
          <h2 className="mb-4 text-2xl font-black text-slate-800">{service.postTitle}</h2>

          <div className="mb-5 flex flex-col gap-2 text-sm text-slate-500">
            {service.authorName && <span className="flex items-center gap-2"><User className="size-4 text-emerald-500" /> {service.authorName}</span>}
            {service.professionName && <span className="flex items-center gap-2"><Briefcase className="size-4 text-emerald-500" /> {service.professionName}</span>}
            {service.countyName && <span className="flex items-center gap-2"><MapPin className="size-4 text-amber-500" /> {service.countyName}</span>}
            {service.publishDateTime && (
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-slate-400" />
                {new Date(service.publishDateTime).toLocaleDateString('ar-JO')}
              </span>
            )}
          </div>

          <p className="mb-6 leading-relaxed text-slate-600">{service.description}</p>

          {!service.isComplete && !isPostLocked(service) && isLoggedIn && (
            <button onClick={() => onApply(service)}
              className="w-full rounded-2xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20">
              التقديم للخدمة
            </button>
          )}
          {!service.isComplete && !isPostLocked(service) && !isLoggedIn && (
            <button onClick={onLoginRequired}
              className="w-full rounded-2xl bg-slate-200 py-3.5 font-bold text-slate-700 transition hover:bg-slate-300">
              سجّل دخولك للتقديم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;