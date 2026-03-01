import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, LogOut, Mail, Phone, Calendar, Shield, Home, Edit, Trash2, Plus, 
  Upload, X, Check, Clock, AlertCircle, UserCheck, UserX, Image as ImageIcon,
  Handshake, Sparkles, CheckCircle, XCircle, Briefcase, FileText
} from 'lucide-react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://localhost:7244/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // info, myServices, appliedServices
  
  // User statistics
  const [userStats, setUserStats] = useState({
    points: 850,              // نقاط التطوع
    participationCount: 12,   // عدد المشاركات
    volunteerHours: 45,       // ساعات التطوع
    rating: 92,               // التقييم من 100
    totalRatings: 8           // عدد التقييمات
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    imagepath: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [appliedServices, setAppliedServices] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({
    applicantId: null,
    action: '', // 'accept' or 'reject'
    message: ''
  });
  const [postFormData, setPostFormData] = useState({
    PostID: 0,
    PostTitle: '',
    Description: '',
    TypeID: 1,
    CountyID: 1,
    imagePath: ''
  });

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار صورة فقط!');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }
      
      setImageFile(file);
      
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
  };

  const fetchUserDetails = async () => {
    if (!user?.username) {
      console.log('⚠️ No username available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Fetching user details for:', user.username);
      
      const url = `${API_BASE_URL}/User/GetUser?username=${encodeURIComponent(user.username)}`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      console.log('✅ User data received:', data);
      
      setFormData({
        firstName: data.firstName || '',
        secondName: data.secondName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        age: data.age || '',
        imagepath: data.imagepath || ''
      });

      if (data.imagepath) {
        setImagePreview(data.imagepath);
      }

      updateUser(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('فشل في جلب بيانات المستخدم: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    if (!accessToken) {
      console.error('No access token');
      return;
    }
    
    setPostsLoading(true);
    setError('');
    
    try {
      const url = `${API_BASE_URL}/Posts/GetMyPosts`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserPosts(Array.isArray(data) ? data : []);
      } else {
        console.error('❌ Error fetching posts:', response.status);
        setUserPosts([]);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch applied services (mock data - replace with actual API)
  const fetchAppliedServices = async () => {
    // TODO: Replace with actual API call
    setAppliedServices([
      {
        id: 1,
        serviceName: 'زيارة مستشفى الأطفال',
        status: 'pending',
        appliedDate: '2024-02-15',
        description: 'مبادرة لرسم البسمة',
        message: null
      },
      {
        id: 2,
        serviceName: 'تنظيف الحي',
        status: 'accepted',
        appliedDate: '2024-02-10',
        description: 'تنظيف وتجميل الحي',
        message: 'تم قبولك في هذه المبادرة. نتطلع للعمل معك!'
      },
      {
        id: 3,
        serviceName: 'مساعدة كبار السن',
        status: 'rejected',
        appliedDate: '2024-02-08',
        description: 'برنامج لمساعدة كبار السن',
        message: 'نعتذر، تم إغلاق باب التسجيل لهذه المبادرة.'
      }
    ]);
  };

  // Fetch applicants for a service
  const fetchApplicants = async (postId) => {
    // TODO: Replace with actual API call
    setApplicants([
      {
        id: 1,
        name: 'أحمد محمود',
        email: 'ahmad@example.com',
        phone: '0791234567',
        appliedDate: '2024-02-18',
        status: 'pending'
      },
      {
        id: 2,
        name: 'سارة علي',
        email: 'sara@example.com',
        phone: '0797654321',
        appliedDate: '2024-02-17',
        status: 'pending'
      }
    ]);
  };

  const handleAcceptApplicant = (applicantId) => {
    setMessageData({
      applicantId: applicantId,
      action: 'accept',
      message: ''
    });
    setShowMessageModal(true);
  };

  const handleRejectApplicant = (applicantId) => {
    setMessageData({
      applicantId: applicantId,
      action: 'reject',
      message: ''
    });
    setShowMessageModal(true);
  };

  const submitAcceptReject = () => {
    if (!messageData.message.trim()) {
      setError('الرجاء كتابة رسالة');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // TODO: API call with message
    const actionText = messageData.action === 'accept' ? 'قبول' : 'رفض';
    const newStatus = messageData.action === 'accept' ? 'accepted' : 'rejected';
    
    setApplicants(applicants.map(app => 
      app.id === messageData.applicantId 
        ? { ...app, status: newStatus, message: messageData.message } 
        : app
    ));
    
    setSuccess(`تم ${actionText} المتقدم وإرسال الرسالة بنجاح`);
    setShowMessageModal(false);
    setMessageData({ applicantId: null, action: '', message: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  useEffect(() => {
    if (accessToken && user?.username) {
      fetchUserDetails();
      fetchUserPosts();
      fetchAppliedServices();
    }
  }, [accessToken, user?.username]);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let imagePath = formData.imagepath;
      
      if (imageFile) {
        const timestamp = Date.now();
        const extension = imageFile.name.split('.').pop();
        const safeName = user.username.replace(/[^a-zA-Z0-9]/g, '_');
        imagePath = `${safeName}_${timestamp}.${extension}`;
      }

      const requestBody = {
        Username: user.username,
        FirstName: formData.firstName,
        SecondName: formData.secondName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        Age: parseInt(formData.age) || 0,
        ImagePath: imagePath
      };

      console.log('📤 Sending update:', requestBody);

      const url = `${API_BASE_URL}/User/UpdatePersonalDetails`;
      console.log('📡 Updating at:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update error:', errorText);
        throw new Error('Failed to update profile');
      }

      const responseText = await response.text();
      console.log('✅ Update success:', responseText);

      setSuccess('تم تحديث الملف الشخصي بنجاح!');
      setIsEditing(false);
      
      updateUser({
        ...user,
        firstName: formData.firstName,
        secondName: formData.secondName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        imagepath: imagePath
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Update error:', err);
      setError('فشل تحديث الملف الشخصي: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Posts/DeletePost?postID=${selectedPost.postID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('تم حذف الخدمة بنجاح');
        setShowDeleteModal(false);
        setSelectedPost(null);
        setUserPosts(userPosts.filter(post => post.postID !== selectedPost.postID));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('فشل حذف الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!postFormData.PostTitle || !postFormData.Description) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/Posts/UpdatePost`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postFormData)
      });

      if (response.ok) {
        setSuccess('تم تحديث الخدمة بنجاح');
        setShowEditPostModal(false);
        
        setUserPosts(userPosts.map(post => 
          post.postID === postFormData.PostID 
            ? { ...post, postTitle: postFormData.PostTitle, description: postFormData.Description, imagePath: postFormData.imagePath }
            : post
        ));
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to update post');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('فشل تحديث الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (post) => {
    setSelectedPost(post);
    setPostFormData({
      PostID: post.postID,
      PostTitle: post.postTitle,
      Description: post.description || '',
      TypeID: post.typeID || 1,
      CountyID: post.countyID || 1,
      imagePath: post.imagePath || ''
    });
    setShowEditPostModal(true);
  };

  const openDeleteModal = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const openApplicantsModal = (post) => {
    setSelectedPost(post);
    fetchApplicants(post.postID);
    setShowApplicantsModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            مقبول
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-sm font-bold">
            <XCircle className="w-4 h-4" />
            مرفوض
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
            <Clock className="w-4 h-4" />
            قيد المراجعة
          </span>
        );
    }
  };

  if (loading && !formData.firstName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-6 text-slate-700 text-lg font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
                <h1 className="text-xl font-black tracking-tight">
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

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to="/" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:scale-105">
                <Home className="w-5 h-5" />
                <span className="hidden md:inline">الرئيسية</span>
              </Link>
              <button onClick={handleLogout} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden mb-8 relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-12">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image - Centered */}
              <div className="relative mb-6">
                <div className="relative">
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-30 animate-pulse-slow"></div>
                  
                  <div className="relative w-40 h-40 rounded-3xl bg-white p-2 shadow-2xl transform hover:scale-105 transition-all duration-300">
                    {imagePreview || formData.imagepath ? (
                      <img
                        src={imagePreview || formData.imagepath}
                        alt="Profile"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <User className="w-20 h-20 text-emerald-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl flex items-center justify-center cursor-pointer shadow-xl transform hover:scale-110 transition-all">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info - Centered */}
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-3">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-emerald-600 font-bold text-xl mb-4">@{user?.username}</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-600">
                  <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">{formData.email}</span>
                  </span>
                  {formData.phone && (
                    <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold">{formData.phone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button - Centered */}
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center gap-3"
                >
                  <Edit className="w-5 h-5" />
                  تعديل الملف الشخصي
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Points */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-amber-600 font-bold">النقاط المحصلة</p>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 mb-1">{userStats.points}</p>
              <p className="text-sm text-amber-700 font-semibold">نقطة تطوع</p>
            </div>
          </div>

          {/* Participation Count */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600 font-bold">المشاركات</p>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 mb-1">{userStats.participationCount}</p>
              <p className="text-sm text-emerald-700 font-semibold">خدمة تطوعية</p>
            </div>
          </div>

          {/* Volunteer Hours */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 font-bold">ساعات التطوع</p>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 mb-1">{userStats.volunteerHours}</p>
              <p className="text-sm text-blue-700 font-semibold">ساعة عمل</p>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {userStats.rating >= 90 ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-600 font-bold">التقييم</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-4xl font-black text-slate-800">{userStats.rating}</p>
                <p className="text-lg font-bold text-purple-600">/100</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${userStats.rating}%` }}
                  ></div>
                </div>
                <p className="text-xs text-purple-700 font-semibold">({userStats.totalRatings} تقييم)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-rose-50 border-2 border-rose-500 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'info'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </button>
            <button
              onClick={() => setActiveTab('myServices')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'myServices'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              خدماتي ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('appliedServices')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'appliedServices'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              الخدمات المقدم عليها ({appliedServices.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden p-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6">المعلومات الشخصية</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">الاسم الأول</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                  disabled={!isEditing} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                />
              </div>

              {/* Second Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">الاسم الثاني</label>
                <input 
                  type="text" 
                  value={formData.secondName} 
                  onChange={(e) => setFormData({ ...formData, secondName: e.target.value })} 
                  disabled={!isEditing} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">اسم العائلة</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                  disabled={!isEditing} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">العمر</label>
                <input 
                  type="number" 
                  value={formData.age} 
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                  disabled={!isEditing} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    disabled={!isEditing} 
                    className="w-full pr-12 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    disabled={!isEditing} 
                    className="w-full pr-12 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60 transition-all outline-none" 
                  />
                </div>
              </div>

              {/* Image Path */}
              {isEditing && (
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-bold mb-2">رابط الصورة الشخصية (اختياري)</label>
                  <div className="relative">
                    <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={formData.imagepath} 
                      onChange={(e) => setFormData({ ...formData, imagepath: e.target.value })} 
                      placeholder="أو أدخل رابط الصورة"
                      className="w-full pr-12 pl-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleUpdate} 
                  disabled={loading} 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      حفظ التعديلات
                    </>
                  )}
                </button>
                <button 
                  onClick={() => { 
                    setIsEditing(false); 
                    fetchUserDetails(); 
                    setImageFile(null);
                    setImagePreview(null);
                  }} 
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  إلغاء
                </button>
              </div>
            )}

            {/* Account Info */}
            <div className="mt-8 pt-8 border-t-2 border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">معلومات الحساب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-xl border-2 border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">عضو منذ</p>
                    <p className="font-bold text-slate-800">{user?.creationDate ? new Date(user.creationDate).toLocaleDateString('ar-JO') : 'غير متوفر'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-xl border-2 border-slate-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">حالة الحساب</p>
                    <p className="font-bold text-emerald-600">{user?.isActive ? 'نشط ✓' : 'غير نشط'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Services Tab */}
        {activeTab === 'myServices' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">خدماتي ({userPosts.length})</h2>
                <Link to="/services" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg">
                  <Plus className="w-5 h-5" />
                  إضافة خدمة جديدة
                </Link>
              </div>
            </div>

            <div className="p-8">
              {postsLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
                  <p className="mt-6 text-slate-600 text-lg font-semibold">جاري تحميل الخدمات...</p>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-slate-300 text-7xl mb-6">📋</div>
                  <p className="text-slate-600 text-xl font-bold mb-6">لم تقم بإضافة أي خدمات بعد</p>
                  <Link to="/services" className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105">
                    أضف خدمتك الأولى
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPosts.map((post) => (
                    <div key={post.postID} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.imagePath || 'https://images.unsplash.com/photo-1559027615-cd99713b8bb7?w=800&q=80'} 
                          alt={post.postTitle} 
                          className="w-full h-full object-cover" 
                        />
                        {post.isComplete && (
                          <span className="absolute top-3 right-3 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            مكتملة
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{post.postTitle}</h3>
                        <p className="text-slate-600 mb-4 line-clamp-2 text-sm">{post.description || 'لا يوجد وصف'}</p>
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b-2 border-slate-100">
                          <span className="flex items-center gap-1 font-semibold">📍 {post.countyName || 'غير محدد'}</span>
                          <span className="flex items-center gap-1 font-semibold">📅 {new Date(post.publishDateTime).toLocaleDateString('ar-JO')}</span>
                        </div>
                        
                        {/* Applicants Button */}
                        <button 
                          onClick={() => openApplicantsModal(post)} 
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold mb-3 shadow-lg"
                        >
                          <UserCheck className="w-5 h-5" />
                          عرض المتقدمين
                        </button>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => openEditModal(post)} 
                            className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold"
                          >
                            <Edit className="w-4 h-4" />
                            تعديل
                          </button>
                          <button 
                            onClick={() => openDeleteModal(post)} 
                            className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
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

        {/* Applied Services Tab */}
        {activeTab === 'appliedServices' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">الخدمات المقدم عليها ({appliedServices.length})</h2>
            </div>

            <div className="p-8">
              {appliedServices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-slate-300 text-7xl mb-6">📝</div>
                  <p className="text-slate-600 text-xl font-bold mb-6">لم تتقدم لأي خدمات بعد</p>
                  <Link to="/services" className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105">
                    تصفح الخدمات المتاحة
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appliedServices.map((service) => (
                    <div key={service.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{service.serviceName}</h3>
                          <p className="text-slate-600 mb-3">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1 font-semibold">
                              <Calendar className="w-4 h-4" />
                              تقديم: {new Date(service.appliedDate).toLocaleDateString('ar-JO')}
                            </span>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                      
                      {/* Message from service owner */}
                      {service.message && (
                        <div className={`mt-4 p-4 rounded-xl border-2 ${
                          service.status === 'accepted' 
                            ? 'bg-emerald-50 border-emerald-300' 
                            : 'bg-rose-50 border-rose-300'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              service.status === 'accepted' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}>
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 mb-1">رسالة من صاحب الخدمة:</p>
                              <p className={`${
                                service.status === 'accepted' ? 'text-emerald-800' : 'text-rose-800'
                              } leading-relaxed`}>
                                {service.message}
                              </p>
                            </div>
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

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">المتقدمون على: {selectedPost?.postTitle}</h2>
              <button 
                onClick={() => setShowApplicantsModal(false)} 
                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-8">
              {applicants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-300 text-6xl mb-4">👥</div>
                  <p className="text-slate-600 text-lg font-semibold">لا يوجد متقدمون حتى الآن</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                            <User className="w-7 h-7 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{applicant.name}</h3>
                            <div className="space-y-1 text-sm text-slate-600">
                              <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {applicant.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {applicant.phone}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                تقديم: {new Date(applicant.appliedDate).toLocaleDateString('ar-JO')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {applicant.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAcceptApplicant(applicant.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
                              >
                                <UserCheck className="w-5 h-5" />
                                قبول
                              </button>
                              <button
                                onClick={() => handleRejectApplicant(applicant.id)}
                                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
                              >
                                <UserX className="w-5 h-5" />
                                رفض
                              </button>
                            </>
                          ) : (
                            <div>
                              {getStatusBadge(applicant.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">تعديل الخدمة</h2>
              <button 
                onClick={() => setShowEditPostModal(false)} 
                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2">عنوان الخدمة <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={postFormData.PostTitle} 
                  onChange={(e) => setPostFormData({...postFormData, PostTitle: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">وصف الخدمة <span className="text-rose-500">*</span></label>
                <textarea 
                  value={postFormData.Description} 
                  onChange={(e) => setPostFormData({...postFormData, Description: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 h-32 resize-none outline-none" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2">رابط الصورة</label>
                <input 
                  type="text" 
                  value={postFormData.imagePath} 
                  onChange={(e) => setPostFormData({...postFormData, imagePath: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none" 
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 px-8 py-6 flex gap-3">
              <button 
                onClick={handleUpdatePost} 
                disabled={loading} 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
              <button 
                onClick={() => setShowEditPostModal(false)} 
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-rose-500">
              <Trash2 className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">تأكيد الحذف</h2>
            <p className="text-slate-600 mb-2">هل أنت متأكد من حذف هذه الخدمة؟</p>
            <p className="text-emerald-600 text-lg font-bold mb-4">"{selectedPost?.postTitle}"</p>
            <p className="text-rose-600 text-sm mb-8 font-semibold">لن تتمكن من التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button 
                onClick={handleDeletePost} 
                disabled={loading} 
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {loading ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal for Accept/Reject */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
            <div className={`px-8 py-6 rounded-t-3xl ${
              messageData.action === 'accept' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                : 'bg-gradient-to-r from-rose-500 to-pink-500'
            }`}>
              <h2 className="text-2xl font-bold text-white">
                {messageData.action === 'accept' ? '✓ قبول المتقدم' : '✗ رفض المتقدم'}
              </h2>
            </div>
            
            <div className="p-8">
              <label className="block text-slate-700 font-bold mb-3 text-lg">
                اكتب رسالة للمتقدم <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={messageData.message}
                onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                placeholder={messageData.action === 'accept' 
                  ? 'مثال: تم قبولك في هذه المبادرة. نتطلع للعمل معك!'
                  : 'مثال: نعتذر، تم إغلاق باب التسجيل لهذه المبادرة.'
                }
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 h-32 resize-none outline-none"
              />
              <p className="text-sm text-slate-500 mt-2">
                * سيتم إرسال هذه الرسالة للمتقدم مع حالة الطلب
              </p>
            </div>

            <div className="px-8 pb-8 flex gap-3">
              <button 
                onClick={submitAcceptReject} 
                disabled={loading}
                className={`flex-1 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg ${
                  messageData.action === 'accept'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                }`}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال'}
              </button>
              <button 
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageData({ applicantId: null, action: '', message: '' });
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }

        .animate-float {
          animation: float 3s infinite ease-in-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Shimmer effect for cards on hover */
        .group:hover .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Smooth hover transitions */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Profile;