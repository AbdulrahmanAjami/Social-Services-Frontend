import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, LogOut, Mail, Phone, Calendar, Shield, Home, Edit, Trash2, Plus,
  Upload, X, Check, Clock, AlertCircle, UserCheck, UserX, Image as ImageIcon,
  HeartHandshake, Sparkles, CheckCircle, XCircle, Briefcase, FileText, Lock,
  ChevronDown, Bell, MapPin,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import api, { servicesAPI, userAPI, postsAPI, apiBase } from './api';
import { CardSkeleton, ButtonSkeleton } from './components/Skeleton';
import {
  dispatchPostCompleted, isPostComplete, isPostLocked, normalizePost,
  getPostImage, getRawImagePath, getImagePreviewUrl, fileToCompressedDataUrl, DEFAULT_POST_IMAGE,
} from './postUtils';

const API_BASE_URL = 'https://yousefalhamad-001-site1.ltempurl.com/api';

// ─── Shared input class ───────────────────────────────────────────────────────
const INPUT = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:opacity-60';

// ─── Alert component ──────────────────────────────────────────────────────────
function Alert({ type, children }) {
  const styles = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold ${styles}`}>
      <Icon className="size-4 shrink-0" /> {children}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  // Handle both numeric (1,2,3) and string ('pending','accepted','rejected') values
  const isRejected = status === 3 || status === 'rejected';
  const isAccepted = status === 2 || status === 'accepted';
  
  if (isRejected) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
        <XCircle className="size-3.5" /> مرفوض
      </span>
    );
  }
  if (isAccepted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        <CheckCircle className="size-3.5" /> مقبول
      </span>
    );
  }
  // Default to Pending for status 1, 'pending', or any other value
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
      <Clock className="size-3.5" /> قيد المراجعة
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Profile = () => {
  const navigate = useNavigate();
  const { user, accessToken, logout, updateUser } = useAuth();

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [isEditing, setIsEditing]   = useState(false);
  const [activeTab, setActiveTab]   = useState('info');
  const [scrolled, setScrolled]     = useState(false);

  // Stats (same as original)
  const [userStats] = useState({
    points: 850, participationCount: 12, volunteerHours: 45, rating: 92, totalRatings: 8,
  });

  const [formData, setFormData] = useState({
    firstName: '', secondName: '', lastName: '',
    email: '', phone: '', age: '', imagepath: '',
  });

  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Posts
  const [userPosts, setUserPosts]               = useState([]);
  const [myServicesFilter, setMyServicesFilter] = useState('incomplete');
  const [postsLoading, setPostsLoading]         = useState(false);

  // Applied services
  const [appliedServices, setAppliedServices]               = useState([]);
  const [appliedServicesLoading, setAppliedServicesLoading] = useState(false);
  const [appliedServicesError, setAppliedServicesError]     = useState('');

  // Modals
  const [showEditPostModal, setShowEditPostModal]   = useState(false);
  const [showDeleteModal, setShowDeleteModal]       = useState(false);
  const [showCompleteModal, setShowCompleteModal]   = useState(false);
  const [completeError, setCompleteError]           = useState('');
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedPost, setSelectedPost]             = useState(null);
  const [applicants, setApplicants]                 = useState([]);
  const [applicantsLoading, setApplicantsLoading]   = useState(false);
  const [applicantsError, setApplicantsError]       = useState('');
  const [showMessageModal, setShowMessageModal]     = useState(false);
  const [messageData, setMessageData] = useState({ applicantId: null, action: '', message: '', isEdit: false });

  // Post form
  const [postFormData, setPostFormData] = useState({ postID: 0, postTitle: '', description: '', countyID: '', imagePath: '' });
  const [counties, setCounties]               = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [editPostError, setEditPostError]     = useState('');
  const [postImageUploading, setPostImageUploading] = useState(false);

  // Certificate system
  const [certificateEligible, setCertificateEligible] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState('');
  const [certificateIssued, setCertificateIssued] = useState(false);

  // Feedback system
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Applicant feedback system
  const [selectedApplicantFeedback, setSelectedApplicantFeedback] = useState(null);
  const [showApplicantFeedbackModal, setShowApplicantFeedbackModal] = useState(false);
  const [applicantFeedbackLoading, setApplicantFeedbackLoading] = useState(false);
  const [userAverageRating, setUserAverageRating] = useState(4.2);

  // Voucher system
  const [voucherModal, setVoucherModal] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(userStats.points);

  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('').match(/.{4}/g).join('-');
  };

  const getRandomVolunteerImage = (postTitle) => {
    const keywords = ['volunteer', 'community', 'help', 'nature', 'education', 'food', 'garden', 'elderly', 'children', 'environment'];
    const random = keywords[Math.floor(Math.random() * keywords.length)];
    const seed = postTitle ? postTitle.length : Math.floor(Math.random() * 100);
    return `https://picsum.photos/seed/${seed}/400/250`;
  };

  // ── Scroll effect ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Certificate eligibility check ─────────────────────────────────────────────
  useEffect(() => {
    const checkCertificateEligibility = async () => {
      try {
        await api.get('/Volunteer/Is User allowed to Issue A Certificate');
        setCertificateEligible(true);
      } catch (error) {
        if (error.response?.status === 400) {
          setCertificateEligible(false);
        }
        // Handle errors silently
      }
    };
    checkCertificateEligibility();
  }, []);

  // ── Image handlers (identical to original) ───────────────────────────────
  const handlePostImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPostImageUploading(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      setPostFormData((prev) => ({ ...prev, imagePath: dataUrl }));
    } catch (err) { setEditPostError(err.message || 'تعذّر تحميل الصورة'); }
    finally { setPostImageUploading(false); e.target.value = ''; }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('يرجى اختيار صورة فقط!'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('حجم الصورة يجب أن يكون أقل من 5MB'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ── API calls (identical to original) ────────────────────────────────────
  const fetchUserDetails = async () => {
    if (!user?.username) { setError('لا توجد بيانات المستخدم'); return; }
    setLoading(true); setError('');
    try {
      const response = await api.get('/User/Get User', { params: { username: user.username } });
      const d = response.data;
      setFormData({
        firstName: d.firstName || '', secondName: d.secondName || '', lastName: d.lastName || '',
        email: d.email || '', phone: d.phone || '', age: d.age || '',
        imagepath: d.imagepath || d.profilePicture || '',
      });
      if (d.imagepath || d.profilePicture) setImagePreview(d.imagepath || d.profilePicture);
    } catch (err) {
      setError('خطأ في جلب بيانات المستخدم: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const fetchUserPosts = async () => {
    if (!user?.username || !accessToken) return;
    setPostsLoading(true);
    try {
      const response = await postsAPI.getUserPosts(user.username);
      setUserPosts(Array.isArray(response.data) ? response.data.map(normalizePost) : []);
    } catch { setUserPosts([]); }
    finally { setPostsLoading(false); }
  };

  
  const fetchAppliedServices = async () => {
    if (!user?.username || !accessToken) return;
    setAppliedServicesLoading(true); setAppliedServicesError('');
    try {
      const response = await servicesAPI.getServiceApplicationsForUser(user.username);
      const services = Array.isArray(response.data) ? response.data : [];
      
      // Log raw API response to debug status field
      console.log('📊 Raw API Response (Applied Services):', services);
      if (services.length > 0) {
        console.log('🔍 First service object keys:', Object.keys(services[0]));
        console.log('🔍 First service full object:', services[0]);
      }
      
      let allPosts = {};
      try {
        const postsResponse = await postsAPI.getFilteredPosts({});
        (Array.isArray(postsResponse.data) ? postsResponse.data : []).forEach(p => { allPosts[p.postID] = p; });
      } catch {}

      const parseDate = (d) => {
        if (!d) return 'غير متوفر';
        const date = new Date(d);
        return isNaN(date.getTime()) ? 'غير متوفر' : date.toLocaleDateString('ar-JO');
      };

setAppliedServices(services.map(s => {
  const postDetails = allPosts[s.postID] || {};

  // Map the numeric status code coming from the backend to the string values
  // the rest of the UI (StatusBadge, filters, etc.) expects.
  // Backend: 1 = Pending, 2 = Accepted, 3 = Rejected
  let status = 'pending'; // Default status
  if (s.status === 1) {
    status = 'pending';
  } else if (s.status === 2) {
    status = 'accepted';
  } else if (s.status === 3) {
    status = 'rejected';
  }
  
  console.log(`📋 Service ${s.serviceApplicationID}: status=${s.status}, mapped to="${status}"`);

  return {
    id: s.serviceApplicationID,
    serviceName: postDetails.postTitle || s.postTitle || 'خدمة بدون عنوان',
    authorName: postDetails.authorName || 'صاحب الخدمة',
    status,
    appliedDate: parseDate(s.applyDateTime || s.applicationDateTime || s.applicationDate),
    description: s.description,
    message: s.acceptanceMessage || s.message || s.responseMessage || s.serviceResponse || null,
    postID: s.postID,
    applicationID: s.serviceApplicationID,
  };
}));
    } catch (err) {
      setAppliedServicesError(err.response?.data?.message || err.message || 'فشل في جلب الخدمات المقدم عليها');
      setAppliedServices([]);
    } finally { setAppliedServicesLoading(false); }
  };


  const handleCancelApplication = async (serviceApplicationID) => {
    if (!window.confirm('هل أنت متأكد من إلغاء التقديم؟')) return;
    try {
      await api.delete('/Services/Delete Service Application', {
        params: { serviceApplicationID }
      });
      // Remove the cancelled application from the list
setAppliedServices(prev => prev.filter(s => s.applicationID !== serviceApplicationID));
      alert('✅ تم إلغاء التقديم بنجاح');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || err.message || 'فشل في إلغاء التقديم'));
    }
  };

  const fetchApplicants = async (postId) => {
    setApplicantsLoading(true); setApplicantsError('');
    try {
      const response = await servicesAPI.getServiceApplicationsForPost(postId);
      console.log('Applicants response:', response.data);
      let formatted = Array.isArray(response.data) ? response.data.map(app => {
        const id = app.applicationID || app.serviceApplicationID || app.id || app.ApplicationID;
        const userID = app.userID || app.userId || app.UserID;
        const acceptanceMessage = app.acceptanceMessage || app.message || app.responseMessage || '';
        let status = ''; // Default status
        if (app.status === 1) {
          status = 'pending';
        } else if (app.status === 2) {
          status = 'accepted';
        } else if (app.status === 3) {
          status = 'rejected';
        }
        console.log(`Applicant ${id}: accepted=${app.accepted}, status=${status}`);
        return {
          id, userID, status, accepted: app.accepted, acceptanceMessage,
          name: app.firstName && app.lastName ? `${app.firstName} ${app.secondName || ''} ${app.lastName}`.trim() : app.username || app.name,
          username: app.username || app.name || null,
          email: app.email || app.userEmail || 'غير متوفر',
          phone: app.phone || app.userPhone || 'غير متوفر',
          appliedDate: app.applicationDateTime || app.applicationDate || new Date().toISOString(),
          description: app.description || 'لا يوجد وصف',
        };
      }) : [];

      const withDetails = await Promise.all(formatted.map(async (a) => {
  if (!a.userID) return a;
       try {
    const r = await userAPI.getUserByUserID(a.userID);
    const d = r.data;
    return {
      ...a,
      name: d.firstName && d.lastName ? `${d.firstName} ${d.secondName || ''} ${d.lastName}`.trim() : d.username || a.name,
      username: d.username || a.username || null,
      email: d.email || a.email, phone: d.phone || a.phone,
    };
  } catch (err) {
    console.error(`Error fetching user details for userID ${a.userID}:`, err);
    return a;
  }
}));
      setApplicants(withDetails);
    } catch (err) {
      setApplicantsError(err.response?.data?.message || err.message || 'فشل في جلب المتقدمين');
      setApplicants([]);
    } finally { setApplicantsLoading(false); }
  };

  const fetchCounties = async () => {
    try {
      setLoadingCounties(true);
      const r = await apiBase.get('/CitiesCounties/Get All Counties');
      setCounties(Array.isArray(r.data) ? r.data : []);
    } catch { setCounties([]); }
    finally { setLoadingCounties(false); }
  };

  const getCurrentUserID = () => {
    const fromCtx = user?.userID ?? user?.id ?? user?.UserID;
    if (fromCtx != null) return Number(fromCtx);
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        const fromStorage = parsed?.userID ?? parsed?.id ?? parsed?.UserID;
        if (fromStorage != null) return Number(fromStorage);
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    if (user) fetchUserDetails();
    if (accessToken && user?.username) { fetchUserPosts(); fetchAppliedServices(); fetchCounties(); }
  }, [user?.username, accessToken]);

  // ── Fetch user rating ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const res = await api.post('/Feedback/Get User Average Rating', null, { params: { username: user.username } });
        console.log('Rating fetched for:', user.username, '→', res.data);
        setUserAverageRating(res.data);
      } catch { setUserAverageRating(null); }
    };
    if (user?.username) fetchUserRating();
  }, [user?.username]);

  useEffect(() => {
    if (activeTab === 'appliedServices' && user?.username && accessToken) fetchAppliedServices();
  }, [activeTab]);

  // ── CRUD handlers (identical to original) ────────────────────────────────
const handleUpdate = async () => {
  setError(''); setSuccess(''); setLoading(true);
  try {
    const imageChanged = !!imageFile;

    const data = {
      Username: user.username,
      FirstName: formData.firstName,
      SecondName: formData.secondName,
      LastName: formData.lastName,
      Email: formData.email,
      Phone: formData.phone,
      Age: parseInt(formData.age) || 0,
      Imagepath: formData.imagepath,
    };

    const form = new FormData();
    // Append each text field individually using the "data.FieldName" naming the API expects
    Object.entries(data).forEach(([key, value]) => {
      form.append(`data.${key}`, value ?? '');
    });
    // Only attach the actual binary file if the user picked a new one
    if (imageFile) {
      form.append('Image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/User/Update Personal Details?imageChanged=${imageChanged}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      // Note: no 'Content-Type' header here — the browser sets the correct
      // multipart/form-data boundary automatically when sending a FormData body
      body: form,
    });

    if (!response.ok) throw new Error('Failed to update profile');

    setSuccess('تم تحديث الملف الشخصي بنجاح!');
    setIsEditing(false);
    updateUser({ ...user, ...formData });
    setImageFile(null);
    // Re-fetch user details to get the updated image path from the server
    await fetchUserDetails();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    setError('فشل تحديث الملف الشخصي: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const handleDeletePost = async () => {
  if (!selectedPost) return;
  console.log('Deleting post:', selectedPost.postID);
  setLoading(true);
  try {
    await api.delete('/Posts/Delete Post', { params: { postID: selectedPost.postID } });
    setUserPosts(p => p.filter(post => post.postID !== selectedPost.postID));
    setShowDeleteModal(false); setSelectedPost(null);
    setSuccess('✅ تم حذف المنشور بنجاح'); setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Delete post error:', err);
    // Check if error is due to applicants (500 error)
    if (err.response?.status === 500) {
      setError('❌ لا يمكنك حذف الخدمة، هناك متقدمين لهذه الخدمة!');
    } else {
      setError('❌ ' + (err.response?.data?.message || err.response?.data || err.message || 'فشل حذف المنشور'));
    }
    setTimeout(() => setError(''), 3000);
  } finally { setLoading(false); }
};

  const handleUpdatePost = async (e) => {
    e?.preventDefault();
    if (!postFormData.postTitle?.trim() || !postFormData.description?.trim()) { setEditPostError('الرجاء ملء العنوان والوصف'); return; }
    if (!postFormData.countyID) { setEditPostError('الرجاء اختيار المنطقة'); return; }
    const userID = getCurrentUserID();
    if (!userID) { setEditPostError('تعذر تحديد المستخدم. أعد تسجيل الدخول'); return; }
    setLoading(true); setEditPostError(''); setError('');
    const payload = {
      postID: postFormData.postID, userID,
      postTitle: postFormData.postTitle.trim(), description: postFormData.description.trim(),
      countyID: Number(postFormData.countyID), imagePath: postFormData.imagePath?.trim() || '',
    };
    try {
      await postsAPI.updatePost(payload);
      const selectedCounty = counties.find(c => c.countyID === payload.countyID);
      setUserPosts(prev => prev.map(post =>
        post.postID === payload.postID
          ? { ...post, postTitle: payload.postTitle, description: payload.description, imagePath: payload.imagePath, countyID: payload.countyID, countyName: selectedCounty?.countyName || post.countyName }
          : post
      ));
      setShowEditPostModal(false); setSelectedPost(null);
      setSuccess('✅ تم تحديث الخدمة بنجاح'); setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || err.message || 'فشل تحديث الخدمة';
      setEditPostError(msg); setError('❌ ' + msg); setTimeout(() => setError(''), 5000);
    } finally { setLoading(false); }
  };

  const handleCompletePost = async () => {
    if (!selectedPost) return;
    setLoading(true); setCompleteError(''); setError('');
    try {
      const id = selectedPost.postID;
      await postsAPI.completePost(id);
      setUserPosts(prev => prev.map(p => p.postID === id ? { ...p, isComplete: true } : p));
      dispatchPostCompleted(id);
      setShowCompleteModal(false);
      setShowFeedbackModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : null) || err.message || 'فشل في إتمام الخدمة';
      setCompleteError(msg); setError('❌ ' + msg); setTimeout(() => setError(''), 5000);
    } finally { setLoading(false); }
  };

  const handleSubmitFeedback = async () => {
    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const acceptedApplicants = applicants.filter(a => a.status === 'accepted');
      for (const applicant of acceptedApplicants) {
        const rating = feedbackRatings[applicant.id] || 3;
        await api.post('/Feedback/Create Feedback', {
          serviceApplicationID: applicant.id,
          rating: rating,
          notes: '',
          createdAt: new Date().toISOString()
        });
      }
      setShowFeedbackModal(false);
      setSelectedPost(null);
      setFeedbackRatings({});
      setSuccess('✅ تم إتمام الخدمة وإرسال التقييمات بنجاح');
      setTimeout(() => setSuccess(''), 3000);
} catch (err) {
  console.error('Feedback error:', err.response?.data);
  console.error('Feedback error status:', err.response?.status);
  setFeedbackError(err.response?.data?.message || err.message || 'فشل في إرسال التقييمات');
} finally {
      setFeedbackLoading(false);
    }
  };

const openApplicantFeedback = async (applicant) => {
  setSelectedApplicantFeedback(null);
  setShowApplicantFeedbackModal(true);
  setApplicantFeedbackLoading(true);

  if (!applicant.username) {
    setSelectedApplicantFeedback({ name: applicant.name, averageRating: null, recentFeedbacks: [] });
    setApplicantFeedbackLoading(false);
    return;
  }

  try {
    // Get the average rating for this user
    const avgRes = await api.post('/Feedback/Get User Average Rating', null, {
      params: { username: applicant.username },
    });

    // Get the full feedback history for this user
    const feedbacksRes = await api.post('/Feedback/Get Feedbacks For User', null, {
      params: { username: applicant.username },
    });

    const allFeedbacks = Array.isArray(feedbacksRes.data) ? feedbacksRes.data : [];

    // Sort by most recent first, then take only the latest 3
    const recentFeedbacks = [...allFeedbacks]
      .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))
      .slice(0, 3)
      .map(fb => ({ rating: fb.rating, notes: fb.notes, createdAt: fb.createdAt }));

    setSelectedApplicantFeedback({
      name: applicant.name,
      averageRating: typeof avgRes.data === 'number' ? avgRes.data : parseFloat(avgRes.data) || 0,
      recentFeedbacks,
    });
  } catch (err) {
    console.error('Error fetching applicant feedback:', err);
    setSelectedApplicantFeedback({ name: applicant.name, averageRating: null, recentFeedbacks: [] });
  } finally {
    setApplicantFeedbackLoading(false);
  }
};

  const submitAcceptReject = async () => {
    if (!messageData.message.trim()) { setError('الرجاء كتابة رسالة'); setTimeout(() => setError(''), 3000); return; }
    setLoading(true); setError('');
    try {
      if (messageData.action === 'accept') await servicesAPI.acceptService(messageData.applicantId, messageData.message);
      else await servicesAPI.rejectService(messageData.applicantId, messageData.message);
      const actionText = messageData.action === 'accept' ? 'القبول' : 'الرفض';
      setSuccess(messageData.isEdit ? '✅ تم تحديث القرار بنجاح' : `✅ تم ${actionText} بنجاح`);
      setShowMessageModal(false);
      setMessageData({ applicantId: null, action: '', message: '', isEdit: false });
      if (selectedPost?.postID) await fetchApplicants(selectedPost.postID);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || err.message || 'فشل في العملية'));
      setTimeout(() => setError(''), 3000);
    } finally { setLoading(false); }
  };

  // ── Modal openers ─────────────────────────────────────────────────────────
  const openEditModal = (post) => {
    setSelectedPost(post); setEditPostError('');
    setPostFormData({ postID: post.postID, postTitle: post.postTitle || '', description: post.description || '', countyID: post.countyID ? String(post.countyID) : '', imagePath: getRawImagePath(post) || '' });
    if (counties.length === 0) fetchCounties();
    setShowEditPostModal(true);
  };
  const openDeleteModal   = (post) => { setSelectedPost(post); setShowDeleteModal(true); };
  const openCompleteModal = (post) => { setSelectedPost(post); setCompleteError(''); setShowCompleteModal(true); };
  const openApplicantsModal = (post) => { setSelectedPost(post); setApplicants([]); setShowApplicantsModal(true); fetchApplicants(post.postID); };
  const handleAcceptApplicant = (id) => { setMessageData({ applicantId: id, action: 'accept', message: '', isEdit: false }); setShowMessageModal(true); };
  const handleRejectApplicant = (id) => { setMessageData({ applicantId: id, action: 'reject', message: '', isEdit: false }); setShowMessageModal(true); };
  const handleEditApplicantDecision = (a) => { setMessageData({ applicantId: a.id, action: a.status === 'accepted' ? 'accept' : 'reject', message: a.acceptanceMessage || '', isEdit: true }); setShowMessageModal(true); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const displayedUserPosts = useMemo(() =>
    userPosts.filter(p => myServicesFilter === 'complete' ? isPostComplete(p) : !isPostComplete(p)),
    [userPosts, myServicesFilter]
  );

  const profileTabs = [
    { id: 'info',            label: 'المعلومات الشخصية',    icon: User },
    { id: 'myServices',      label: 'خدماتي',               icon: Briefcase, count: userPosts.length },
    { id: 'appliedServices', label: 'الخدمات المقدم عليها', icon: FileText,  count: appliedServices.length },
  ];

  // Loading screen
  if (loading && !formData.firstName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" dir="rtl">
        <div className="w-full max-w-4xl px-4 py-12"><CardSkeleton count={3} /></div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-print, .certificate-print * { visibility: visible; }
          .certificate-print {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 40px;
            background: white;
          }
        }
      `}</style>
      <div className="min-h-screen bg-slate-50" dir="rtl">

      {/* ━━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className={`sticky top-0 z-50 border-b border-slate-200/60 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <span className="relative flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/25">
              <HeartHandshake className="size-6 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-base font-black tracking-tight text-slate-900">
                Participate <span className="text-emerald-600">&amp;</span> Make
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">a change</span>
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              <Home className="size-4" /> <span className="hidden md:inline">الرئيسية</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
              <LogOut className="size-4" /> <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* ━━━━ HERO BANNER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-5 pb-24 pt-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-emerald-100">
            <Sparkles className="size-3.5" /> لوحة المتطوع
          </span>
          <h1 className="text-3xl font-black text-white md:text-4xl">ملفي الشخصي</h1>
        </div>
      </section>

      {/* ━━━━ MAIN CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mx-auto max-w-7xl -mt-14 px-5 pb-16 md:px-8 relative z-10">

        {/* Profile card */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="size-28 overflow-hidden rounded-2xl ring-4 ring-white shadow-xl md:size-32">
                {(imagePreview || (formData.imagepath && !imageError)) ? (
                  <img 
                    src={imagePreview || formData.imagepath} 
                    alt="صورة المستخدم" 
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                    <User className="size-14 text-emerald-600" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -left-2 flex size-10 cursor-pointer items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700">
                  <Upload className="size-4" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-right">
              <h2 className="text-2xl font-black text-slate-800 md:text-3xl">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="mt-1 font-bold text-emerald-600">@{user?.username}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <Mail className="size-3.5 text-emerald-600" /> {formData.email}
                </span>
                {formData.phone && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    <Phone className="size-3.5 text-emerald-600" /> {formData.phone}
                  </span>
                )}
              </div>
            </div>

            {!isEditing && (
              <button onClick={() => setIsEditing(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700">
                <Edit className="size-4" /> تعديل الملف
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { label: 'نقطة تطوع',    value: userStats.points,             sub: 'النقاط',      color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', lineColor: 'bg-violet-500', text: 'text-violet-600', icon: Sparkles },
            { label: 'خدمة تطوعية',  value: userStats.participationCount, sub: 'المشاركات',   color: 'from-emerald-500 to-teal-600',  bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', lineColor: 'bg-emerald-500', text: 'text-emerald-600', icon: CheckCircle },
            { label: '/5',          value:(Number(userAverageRating) || 0).toFixed(1), sub: 'التقييم',     color: 'from-amber-500 to-orange-600',  bgColor: 'bg-amber-50', borderColor: 'border-amber-200', lineColor: 'bg-amber-500', text: 'text-amber-600',    icon: Shield },
          ].map(({ label, value, sub, color, bgColor, borderColor, lineColor, text, icon: Icon }) => (
            <div key={sub} className={`flex flex-col gap-4 rounded-3xl border ${borderColor} ${bgColor} p-6 md:p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 min-h-48 justify-between`}>
              {/* Top: Icon + Label */}
              <div className="flex items-center justify-between">
                <span className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
                  <Icon className="size-7 text-white" />
                </span>
                <span className={`text-sm font-bold ${text}`}>{sub}</span>
              </div>
              
              {/* Middle: Main Value */}
              <div className="flex-grow flex items-center">
                <div>
                  <div className="text-5xl font-black text-slate-800">
                    {value}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 mt-2">{label}</div>
                </div>
              </div>
              
              {/* Bottom: Progress bar */}
              {sub === 'التقييم' ? (
                <div className="space-y-2">
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700" style={{ width: `${(value / 5) * 100}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 text-center">من 5 نجوم</p>
                </div>
              ) : (
                <div className={`h-1.5 rounded-full ${lineColor}`} />
              )}
</div>
          ))}
        </div>
      </div>

        {/* ━━━━ CERTIFICATE SYSTEM

        {/* ━━━━ CERTIFICATE SYSTEM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {certificateEligible && !certificateIssued && (
          <div className="mb-6 overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-amber-500 text-white">
                    <Sparkles className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">🏆 أنت مؤهل للحصول على شهادة تطوع!</h3>
                    <p className="text-sm text-slate-600">يمكنك الآن توليد شهادة تقدير لمساهماتك التطوعية</p>
                  </div>
                </div>
                <button
onClick={async () => {
  setCertificateLoading(true);
  setCertificateError('');
  try {
    await api.post('/Volunteer/Issue Certificate');
    // جيب آخر شهادة بعد التوليد
    const certsResponse = await api.get('/Volunteer/Get Certificates');
    const certs = certsResponse.data;
    const lastCert = Array.isArray(certs) ? certs[certs.length - 1] : null;
    setCertificate(lastCert);
    setCertificateIssued(true);
  } catch (err) {
    setCertificateError(err.response?.data?.message || err.message || 'فشل في توليد الشهادة');
  } finally {
    setCertificateLoading(false);
  }
}}
                  disabled={certificateLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {certificateLoading ? (
                    <>
                      <Clock className="size-4 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      توليد الشهادة
                    </>
                  )}
                </button>
              </div>
              {certificateError && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
                  <AlertCircle className="size-4" />
                  {certificateError}
                </div>
              )}
            </div>
          </div>
        )}

{certificateIssued && certificate && (
  <div className="mb-6 overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm certificate-print">
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">✅ تم إصدار شهادتك بنجاح!</h3>
            <p className="text-sm text-slate-600">رقم الشهادة: {certificate.certificateID}</p>
            <p className="text-sm text-slate-600">
              نوع الشهادة: <span className="font-bold text-emerald-700">{certificate?.classifcation}</span>
            </p>
            <p className="text-sm text-slate-600">
              عدد الخدمات: <span className="font-bold">{certificate?.numberOfAccomplishedServices}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 hover:shadow-md"
        >
          <CheckCircle className="size-4" />
          طباعة الشهادة
        </button>
      </div>
      {certificateError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
          <AlertCircle className="size-4" />
          {certificateError}
        </div>
      )}
    </div>

    {/* Certificate Design */}
    <div className="relative bg-[#fdfaf5] px-8 py-12 text-center"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e0d8 1px, transparent 0)', backgroundSize: '28px 28px' }}>
      {/* Outer decorative border */}
      <div className="pointer-events-none absolute inset-4 rounded-2xl border-2 border-emerald-800/10" />
      <div className="pointer-events-none absolute inset-6 rounded-xl border border-emerald-800/5" />

      {/* Corner ornaments */}
      {['top-5 right-5', 'top-5 left-5', 'bottom-5 right-5', 'bottom-5 left-5'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} size-8 opacity-20`}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1 L12 1 L1 12 Z" fill="#065f46"/>
            <path d="M31 31 L20 31 L31 20 Z" fill="#065f46"/>
          </svg>
        </div>
      ))}

      <div className="relative mx-auto max-w-xl">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-emerald-800/20 bg-emerald-50">
            <HeartHandshake className="size-5 text-emerald-700" />
          </div>
          <div className="text-right leading-tight">
            <p className="text-base font-black text-emerald-800">شارك</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">وأحدث فرقاً</p>
          </div>
        </div>

        {/* Decorative line */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-emerald-800/15" />
          <div className="flex gap-1.5">
            <div className="size-1.5 rounded-full bg-amber-500/60" />
            <div className="size-1.5 rounded-full bg-emerald-600/60" />
            <div className="size-1.5 rounded-full bg-amber-500/60" />
          </div>
          <div className="h-px flex-1 bg-emerald-800/15" />
        </div>

        {/* Title */}
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">شهادة تطوع</p>
        <p className="mb-5 text-xs font-semibold tracking-wide text-slate-400">Certificate of Volunteering</p>

        {/* Recipient */}
        <p className="mb-1 text-xs text-slate-500">This is to certify that</p>
        <h3 className="mb-1 font-serif text-3xl font-bold text-emerald-800 md:text-4xl"
          style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
          {formData.firstName || user?.username || 'المتطوع'}
          {formData.lastName ? ` ${formData.lastName}` : ''}
        </h3>
        <p className="mb-6 text-sm font-medium text-slate-400">@{user?.username}</p>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <CheckCircle className="size-4 text-emerald-600" />
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Achievement text */}
        <p className="mb-2 text-sm leading-relaxed text-slate-600">
          has successfully completed
        </p>
        <p className="mb-2 text-2xl font-black text-emerald-700">
          {certificate?.numberOfAccomplishedServices || 0} Volunteer Services
        </p>
        <p className="mb-2 text-sm text-slate-500">
          Certificate Type: <span className="font-bold text-emerald-700">{certificate?.classifcation || 'N/A'}</span>
        </p>
        <p className="mb-8 text-sm text-slate-500">
          through the <span className="font-bold text-emerald-700">Participate & Make A Change</span> volunteer platform
        </p>

        {/* Footer row */}
        <div className="flex items-end justify-between border-t border-slate-200/80 pt-6">
          <div className="text-right">
            <div className="mb-1 h-px w-28 bg-slate-300" />
            <p className="text-[10px] text-slate-400">التوقيع</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50">
              <CheckCircle className="size-5 text-emerald-600" />
            </div>
            <p className="text-[10px] font-bold text-emerald-700">معتمدة</p>
          </div>
          <div className="text-left">
            <div className="mb-1 h-px w-28 bg-slate-300" />
            <p className="text-[10px] text-slate-400">
              {certificate?.creationDate ? new Date(certificate.creationDate).toLocaleDateString('ar-JO') : new Date().toLocaleDateString('ar-JO')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        {!certificateEligible && !certificateIssued && (
          <div className="mb-6 overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 shadow-sm">
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-400 text-white">
                    <Lock className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-700">🔒 شهادة التطوع</h3>
                    <p className="text-sm text-slate-500">أكمل المزيد من الخدمات للحصول على شهادتك</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('أنت لا تستوفي الشروط بعد. أكمل المزيد من الخدمات التطوعية للحصول على شهادتك!')}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-300 px-6 py-2.5 text-sm font-bold text-slate-600 cursor-not-allowed"
                >
                  <Lock className="size-4" />
                  غير مؤهل بعد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ━━━━ VOUCHERS SECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-800">مكافآت النقاط</h2>
                <p className="mt-0.5 text-xs text-slate-500">استبدل نقاطك بقسائم من متاجر متنوعة</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <Sparkles className="size-3.5" />
                {currentPoints} نقطة
              </span>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { brand: 'Carrefour',    emoji: '🛒', category: 'سوبرماركت',   discount: '50 د.أ',     desc: 'قسيمة تسوق في كارفور الأردن',            points: 200 },
              { brand: 'Zain',         emoji: '📱', category: 'اتصالات',     discount: '10 د.أ',     desc: 'رصيد شحن لجميع خطوط زين',                points: 150 },
              { brand: 'Books@Cafe',   emoji: '☕',  category: 'مقاهي',       discount: 'وجبة مجانية', desc: 'وجبة مجانية من قائمة Books@Cafe',         points: 250 },
              { brand: 'Virgin',       emoji: '🎵', category: 'ترفيه',       discount: '15% خصم',    desc: 'خصم على الكتب والإلكترونيات في Virgin',   points: 180 },
              { brand: 'Talabat',      emoji: '🍕', category: 'توصيل طعام', discount: '5 د.أ',      desc: 'كود خصم على أي طلب من طلبات',             points: 100 },
              { brand: 'Cinepolis',    emoji: '🎬', category: 'سينما',       discount: 'تذكرة مجانية', desc: 'تذكرة سينما مجانية في Cinepolis',        points: 350 },
            ].map((v, i) => {
              const canRedeem = currentPoints >= v.points;
              return (
                <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200">
                  {/* Top strip */}
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{v.emoji}</span>
                      <span className="text-sm font-extrabold text-slate-800">{v.brand}</span>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                      {v.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    {/* Voucher value */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl font-black text-emerald-700">{v.discount}</span>
                    </div>

                    <p className="mb-4 text-xs leading-relaxed text-slate-500">{v.desc}</p>

                    {/* Points badge */}
                    <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <Sparkles className="size-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-600">
                        {v.points} نقطة للاستبدال
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${Math.min((currentPoints / v.points) * 100, 100)}%` }}
                      />
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        if (!canRedeem) return;
                        const code = generateVoucherCode();
                        setCurrentPoints(prev => prev - v.points);
                        setVoucherModal({ brand: v.brand, discount: v.discount, code, points: v.points });
                      }}
                      disabled={!canRedeem}
                      className={`mt-auto w-full rounded-xl py-2 text-xs font-bold transition ${
                        canRedeem
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'cursor-not-allowed bg-slate-100 text-slate-400'
                      }`}
                    >
                      {canRedeem ? 'استبدال القسيمة' : `ناقصك ${v.points - currentPoints} نقطة`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voucher Success Modal */}
        {voucherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl text-center">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-xl font-black text-white">مبروك!</h2>
                <p className="text-emerald-100 text-sm mt-1">تم استبدال قسيمة {voucherModal.brand} بنجاح</p>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm mb-3">قيمة القسيمة: <span className="font-black text-emerald-700">{voucherModal.discount}</span></p>
                <div className="bg-slate-50 border-2 border-dashed border-emerald-300 rounded-2xl px-6 py-4 mb-4">
                  <p className="text-xs text-slate-400 mb-1">كود القسيمة</p>
                  <p className="text-xl font-black text-slate-800 tracking-widest">{voucherModal.code}</p>
                </div>
                <p className="text-xs text-slate-400 mb-5">احتفظ بهذا الكود واستخدمه عند الشراء</p>
                <button
                  onClick={() => setVoucherModal(null)}
                  className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
                >
                  تم ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {error   && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
        {success && <div className="mb-4"><Alert type="success">{success}</Alert></div>}

        {/* Layout: sidebar nav + main */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Sidebar nav */}
          <nav className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:w-64">
            {profileTabs.map(({ id, label, icon: Icon, count }) => {
              const active = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 px-5 py-3.5 text-right text-sm font-bold transition last:border-0 ${active ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {count != null && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Main panel */}
          <div className="min-w-0 flex-1">

            {/* ── INFO TAB ─────────────────────────────────────────────── */}
            {activeTab === 'info' && (
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5 md:px-8">
                  <h2 className="flex items-center gap-2 text-lg font-black text-slate-800">
                    <span className="inline-block h-6 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                    المعلومات الشخصية
                  </h2>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    {[
                      { label: 'الاسم الأول',   key: 'firstName',   type: 'text' },
                      { label: 'الاسم الثاني',  key: 'secondName',  type: 'text' },
                      { label: 'اسم العائلة',   key: 'lastName',    type: 'text' },
                      { label: 'العمر',          key: 'age',         type: 'number' },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>
                        <input type={type} value={formData[key]} disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className={INPUT} />
                      </div>
                    ))}
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input type="email" value={formData.email} disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`${INPUT} pr-10`} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-slate-700">رقم الهاتف</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input type="tel" value={formData.phone} disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`${INPUT} pr-10`} />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">رابط الصورة الشخصية (اختياري)</label>
                        <div className="relative">
                          <ImageIcon className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                          <input type="text" value={formData.imagepath} placeholder="أو أدخل رابط الصورة"
                            onChange={(e) => setFormData({ ...formData, imagepath: e.target.value })}
                            className={`${INPUT} pr-10`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex gap-3">
                      <button onClick={handleUpdate} disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                        {loading ? '⏳ جاري الحفظ...' : <><Check className="size-4" /> حفظ التعديلات</>}
                      </button>
                      <button onClick={() => { setIsEditing(false); fetchUserDetails(); setImageFile(null); setImagePreview(null); setImageError(false); }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                        <X className="size-4" /> إلغاء
                      </button>
                    </div>
                  )}

                  {/* Account info */}
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <h3 className="mb-4 text-base font-black text-slate-800">معلومات الحساب</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
                          <Calendar className="size-5 text-white" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400">عضو منذ</p>
                          <p className="font-bold text-slate-800">
                            {user?.creationDate ? new Date(user.creationDate).toLocaleDateString('ar-JO') : 'غير متوفر'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-600 shadow-sm">
                          <Shield className="size-5 text-white" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400">حالة الحساب</p>
                          <p className="font-bold text-emerald-700">{user?.isActive === 1 ? 'نشط ✓' : 'غير نشط'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MY SERVICES TAB ──────────────────────────────────────── */}
            {activeTab === 'myServices' && (
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-emerald-600 px-6 py-5">
                  <h2 className="text-lg font-black text-white">خدماتي ({userPosts.length})</h2>
                  <Link to="/posts"
                    className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/30">
                    <Plus className="size-4" /> إضافة خدمة
                  </Link>
                </div>

                <div className="p-6 md:p-8">
                  {!postsLoading && userPosts.length > 0 && (
                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-bold text-slate-700">{displayedUserPosts.length} من {userPosts.length} خدمة</p>
                      <select value={myServicesFilter} onChange={(e) => setMyServicesFilter(e.target.value)}
                        className="min-w-[200px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 outline-none cursor-pointer focus:border-emerald-400">
                        <option value="incomplete">خدمات غير مكتملة</option>
                        <option value="complete">خدمات مكتملة</option>
                      </select>
                    </div>
                  )}

                  {postsLoading ? (
                    <div className="py-8"><CardSkeleton count={2} /></div>
                  ) : userPosts.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      <span className="text-6xl">📋</span>
                      <p className="text-lg font-bold text-slate-700">لم تقم بإضافة أي خدمات بعد</p>
                      <Link to="/posts" className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
                        أضف خدمتك الأولى
                      </Link>
                    </div>
                  ) : displayedUserPosts.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                      <span className="text-5xl">{myServicesFilter === 'complete' ? '✅' : '⏳'}</span>
                      <p className="font-bold text-slate-700">
                        {myServicesFilter === 'complete' ? 'لا توجد خدمات مكتملة بعد' : 'لا توجد خدمات غير مكتملة'}
                      </p>
                      {myServicesFilter === 'complete' && (
                        <button onClick={() => setMyServicesFilter('incomplete')}
                          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
                          عرض الخدمات غير المكتملة
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {displayedUserPosts.map((post) => (
                        <article key={post.postID} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img src={getPostImage(post) !== DEFAULT_POST_IMAGE ? getPostImage(post) : getRandomVolunteerImage(post.postTitle)} alt={post.postTitle}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => { if (e.target.src !== DEFAULT_POST_IMAGE) e.target.src = DEFAULT_POST_IMAGE; }} />
                            {isPostComplete(post) && (
                              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                                <CheckCircle className="size-3" /> مكتمل
                              </span>
                            )}
                            {!isPostComplete(post) && isPostLocked(post) && (
                              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                <Lock className="size-3" /> مقفل
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="mb-1 font-extrabold text-slate-800 line-clamp-1">{post.postTitle}</h3>
                            <p className="mb-3 text-xs leading-relaxed text-slate-500 line-clamp-2">{post.description || 'لا يوجد وصف'}</p>
                            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                              <span className="flex items-center gap-1"><MapPin className="size-3 text-amber-500" /> {post.countyName || 'غير محدد'}</span>
                              <span>{new Date(post.publishDateTime).toLocaleDateString('ar-JO')}</span>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button onClick={() => openApplicantsModal(post)}
                                className="w-full rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">
                                <UserCheck className="mr-1 inline size-3.5" /> عرض المتقدمين
                              </button>
                              {!isPostComplete(post) && !isPostLocked(post) && (
                                <button onClick={() => openCompleteModal(post)} disabled={loading}
                                  className="w-full rounded-xl bg-teal-50 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100">
                                  <CheckCircle className="mr-1 inline size-3.5" /> إتمام الخدمة
                                </button>
                              )}
                              <div className="flex gap-2">
                                <button onClick={() => openEditModal(post)}
                                  className="flex-1 rounded-xl bg-blue-50 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
                                  <Edit className="mr-1 inline size-3.5" /> تعديل
                                </button>
                                <button onClick={() => openDeleteModal(post)}
                                  className="flex-1 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">
                                  <Trash2 className="mr-1 inline size-3.5" /> حذف
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── APPLIED SERVICES TAB ─────────────────────────────────── */}
            {activeTab === 'appliedServices' && (
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-amber-500 px-6 py-5">
                  <h2 className="text-lg font-black text-white">الخدمات المقدم عليها ({appliedServices.length})</h2>
                </div>
                <div className="p-6 md:p-8">
                  {appliedServicesError && <div className="mb-5"><Alert type="error">{appliedServicesError}</Alert></div>}

                  {appliedServicesLoading ? (
                    <div className="py-8"><CardSkeleton count={2} /></div>
                  ) : appliedServices.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      <span className="text-6xl">📝</span>
                      <p className="text-lg font-bold text-slate-700">لم تتقدم لأي خدمات بعد</p>
                      <Link to="/posts" className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
                        تصفح الخدمات المتاحة
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
{appliedServices.map((s) => (
  <div key={s.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-right">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="mb-1 font-extrabold text-slate-800">{s.serviceName}</h3>
        {s.authorName && (
          <p className="mb-1.5 flex items-center gap-2 text-sm text-slate-500">
            <User className="size-3.5 text-slate-400" /> {s.authorName}
          </p>
        )}
        <p className="mb-2 text-sm text-slate-500 leading-relaxed">{s.description || 'لا يوجد وصف'}</p>
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="size-3.5" /> تقديم: {s.appliedDate}
        </p>
      </div>
      <StatusBadge status={s.status} />
    </div>

    {/* Message from owner */}
    {s.message ? (
      <div className={`mt-4 rounded-xl border p-4 ${s.status === 'accepted' ? 'border-emerald-200 bg-emerald-50' : s.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-start gap-2.5">
          <Mail className={`size-4 mt-0.5 shrink-0 ${s.status === 'accepted' ? 'text-emerald-600' : s.status === 'rejected' ? 'text-red-500' : 'text-amber-600'}`} />
          <div>
            <p className="text-xs font-bold text-slate-600 mb-1">رسالة من صاحب الخدمة</p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{s.message}</p>
          </div>
        </div>
      </div>
    ) : s.status !== 'pending' ? (
      <div className={`mt-3 rounded-xl border px-4 py-2.5 text-sm font-semibold ${s.status === 'accepted' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
        {s.status === 'accepted' ? 'تم قبول طلبك بنجاح' : 'تم رفض طلبك'}
      </div>
    ) : null}

    {/* Cancel application button */}
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => handleCancelApplication(s.applicationID)}
        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
      >
        <XCircle className="size-4" /> إلغاء التقديم
      </button>
    </div>
  </div>
))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ━━━━ APPLICANTS MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showApplicantsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
              <h2 className="text-lg font-black text-white">المتقدمون على: {selectedPost?.postTitle}</h2>
              <button onClick={() => setShowApplicantsModal(false)} className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              {applicantsError && <div className="mb-4"><Alert type="error">{applicantsError}</Alert></div>}
              {success && <div className="mb-4"><Alert type="success">{success}</Alert></div>}
              {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}

              {applicantsLoading ? (
                <div className="py-8"><CardSkeleton count={2} /></div>
              ) : applicants.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <span className="text-5xl">👥</span>
                  <p className="font-bold text-slate-600">لا يوجد متقدمون حتى الآن</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {applicants.map((a) => (
                    <div key={a.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100">
                            <User className="size-6 text-emerald-600" />
                          </span>
                          <div className="flex-1">
                            <h3 className="mb-1.5 font-extrabold text-slate-800">
                              {a.name}
                              <button
                                onClick={() => openApplicantFeedback(a)}
                                className="text-xs font-bold text-emerald-600 hover:underline mr-2"
                              >
                                ⭐ عرض التقييم
                              </button>
                            </h3>
                            <div className="flex flex-col gap-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> {a.email}</span>
                              <span className="flex items-center gap-1.5"><Phone className="size-3.5" /> {a.phone}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {new Date(a.appliedDate).toLocaleDateString('ar-JO')}</span>
                            </div>
                            {a.description && (
                              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
                                <FileText className="mb-1 inline size-3.5 text-slate-400" /> {a.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[150px]">
                          {a.status === 'pending' ? (
                            <>
                              <button onClick={() => handleAcceptApplicant(a.id)} disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                                <UserCheck className="size-4" /> قبول
                              </button>
                              <button onClick={() => handleRejectApplicant(a.id)} disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-50">
                                <UserX className="size-4" /> رفض
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <div className={`rounded-xl border px-3 py-2 text-center text-sm font-bold ${a.status === 'accepted' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                {a.status === 'accepted' ? 'تم القبول ✅' : 'تم الرفض ❌'}
                              </div>
                              {a.acceptanceMessage && (
                                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                                  <p className="mb-1 font-bold">الرسالة:</p>
                                  <p className="whitespace-pre-wrap">{a.acceptanceMessage}</p>
                                </div>
                              )}
                              <button onClick={() => handleEditApplicantDecision(a)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-500 py-2.5 text-sm font-bold text-white transition hover:bg-slate-600">
                                <Edit className="size-4" /> تعديل
                              </button>
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

      {/* ━━━━ APPLICANT FEEDBACK MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showApplicantFeedbackModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-emerald-600 px-6 py-4">
              <h2 className="text-lg font-black text-white">تقييم {selectedApplicantFeedback?.name}</h2>
              <button
                onClick={() => { setShowApplicantFeedbackModal(false); setSelectedApplicantFeedback(null); }}
                className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              >✕</button>
            </div>
            <div className="p-6">
              {applicantFeedbackLoading ? (
                <div className="py-8 text-center text-slate-500">جاري التحميل...</div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-emerald-50 py-5">
                    <span className="text-4xl font-black text-emerald-700">
                      {selectedApplicantFeedback?.averageRating?.toFixed(1) || '0.0'}
                    </span>
                    <div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xl ${s <= Math.round(selectedApplicantFeedback?.averageRating || 0) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">متوسط التقييم</p>
                    </div>
                  </div>
                  <h3 className="mb-3 font-bold text-slate-700">آخر 3 تقييمات</h3>
                  {selectedApplicantFeedback?.recentFeedbacks?.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-4">لا توجد تقييمات بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedApplicantFeedback?.recentFeedbacks?.map((fb, i) => (
                        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-sm ${s <= fb.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-400">
                              {new Date(fb.createdAt).toLocaleDateString('ar-JO')}
                            </span>
                          </div>
                          {fb.notes && <p className="text-xs text-slate-600">{fb.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ EDIT POST MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showEditPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between rounded-t-3xl bg-emerald-600 px-6 py-4">
              <h2 className="text-lg font-black text-white">تعديل الخدمة</h2>
              <button onClick={() => { setShowEditPostModal(false); setSelectedPost(null); setEditPostError(''); }}
                className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePost} className="space-y-5 p-6 md:p-8">
              {editPostError && <Alert type="error">{editPostError}</Alert>}

              {[
                { label: 'عنوان المنشور', key: 'postTitle', type: 'input', required: true },
                { label: 'الوصف',          key: 'description', type: 'textarea', required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  {type === 'textarea' ? (
                    <textarea value={postFormData[key]} required rows={4}
                      onChange={(e) => setPostFormData({ ...postFormData, [key]: e.target.value })}
                      className={`${INPUT} resize-none`} />
                  ) : (
                    <input type="text" value={postFormData[key]} required
                      onChange={(e) => setPostFormData({ ...postFormData, [key]: e.target.value })}
                      className={INPUT} />
                  )}
                </div>
              ))}

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">المنطقة <span className="text-red-500">*</span></label>
                <select value={postFormData.countyID} required disabled={loadingCounties}
                  onChange={(e) => setPostFormData({ ...postFormData, countyID: e.target.value })}
                  className={`${INPUT} cursor-pointer`}>
                  <option value="">{loadingCounties ? 'جاري التحميل...' : '-- اختر المنطقة --'}</option>
                  {counties.map(c => <option key={c.countyID} value={c.countyID}>{c.countyName}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">صورة المنشور</label>
                <input type="file" accept="image/*" onChange={handlePostImageFileChange} disabled={postImageUploading}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50" />
                {postImageUploading && <p className="mt-1 text-xs text-slate-400">⏳ جاري تحضير الصورة...</p>}
                <label className="mb-1 mt-3 block text-xs text-slate-500">أو رابط من الإنترنت</label>
                <input type="url" value={postFormData.imagePath.startsWith('data:') ? '' : postFormData.imagePath}
                  onChange={(e) => setPostFormData({ ...postFormData, imagePath: e.target.value })}
                  placeholder="https://example.com/image.jpg" className={INPUT} />
                {postFormData.imagePath && (
                  <>
                    <img src={getImagePreviewUrl(postFormData.imagePath)} alt="معاينة"
                      className="mt-3 h-40 w-full rounded-2xl object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                    <button type="button" onClick={() => setPostFormData({ ...postFormData, imagePath: '' })}
                      className="mt-1.5 text-xs text-red-500 hover:text-red-700">إزالة الصورة</button>
                  </>
                )}
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button type="submit" disabled={loading || loadingCounties}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => { setShowEditPostModal(false); setSelectedPost(null); setEditPostError(''); }} disabled={loading}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ━━━━ COMPLETE MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showCompleteModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="size-8 text-emerald-600" />
            </div>
            <h2 className="mb-2 text-xl font-black text-slate-800">إتمام الخدمة</h2>
            <p className="mb-1 text-slate-500">هل أنت متأكد أن الخدمة اكتملت؟</p>
            <p className="mb-3 font-bold text-emerald-700">"{selectedPost.postTitle}"</p>
            <p className="mb-6 text-sm text-slate-400">بعد الإكمال لن يتمكن المتطوعون من التقديم على هذه الخدمة.</p>
            {completeError && <div className="mb-4"><Alert type="error">{completeError}</Alert></div>}
            <div className="flex gap-3">
              <button onClick={handleCompletePost} disabled={loading}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                {loading ? 'جاري الإكمال...' : 'نعم، اكتملت'}
              </button>
              <button onClick={() => { setShowCompleteModal(false); setSelectedPost(null); setCompleteError(''); }} disabled={loading}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ FEEDBACK MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showFeedbackModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-emerald-600 px-6 py-5">
              <h2 className="text-lg font-black text-white">⭐ تقييم المتطوعين</h2>
              <p className="text-sm text-emerald-100">قيّم كل متطوع شارك في: {selectedPost.postTitle}</p>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {feedbackError && <Alert type="error">{feedbackError}</Alert>}
              {applicants.filter(a => a.status === 'accepted').length === 0 ? (
                <p className="text-center text-slate-500 py-8">لا يوجد متطوعون مقبولون لتقييمهم</p>
              ) : (
                applicants.filter(a => a.status === 'accepted').map((applicant) => (
                  <div key={applicant.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">{applicant.name || applicant.username || 'متطول'}</span>
                      </div>
                      <StatusBadge status={applicant.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">التقييم:</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFeedbackRatings(prev => ({ ...prev, [applicant.id]: rating }))}
                          className={`size-8 rounded-full transition ${
                            (feedbackRatings[applicant.id] || 3) >= rating
                              ? 'bg-amber-400 text-white'
                              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-4 flex gap-3">
              <button
                onClick={handleSubmitFeedback}
                disabled={feedbackLoading || applicants.filter(a => a.status === 'accepted').length === 0}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {feedbackLoading ? 'جاري الإرسال...' : 'إرسال التقييمات'}
              </button>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedPost(null);
                  setFeedbackRatings({});
                  setFeedbackError('');
                }}
                disabled={feedbackLoading}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
              >
                تخطي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ DELETE MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="size-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-black text-slate-800">تأكيد الحذف</h2>
            <p className="mb-1 text-slate-500">هل أنت متأكد من حذف هذه الخدمة؟</p>
            <p className="mb-2 font-bold text-emerald-700">"{selectedPost?.postTitle}"</p>
            <p className="mb-6 text-sm font-semibold text-red-500">لن تتمكن من التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button onClick={handleDeletePost} disabled={loading}
                className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-50">
                {loading ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━ ACCEPT / REJECT MESSAGE MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showMessageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className={`flex items-center justify-between px-6 py-5 ${messageData.action === 'accept' ? 'bg-emerald-600' : 'bg-red-500'}`}>
              <h2 className="text-lg font-black text-white">
                {messageData.isEdit ? 'تعديل القرار' : messageData.action === 'accept' ? 'قبول المتقدم' : 'رفض المتقدم'}
              </h2>
              <button onClick={() => { setShowMessageModal(false); setMessageData({ applicantId: null, action: '', message: '', isEdit: false }); }}
                className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {messageData.isEdit && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">تغيير القرار</label>
                  <div className="flex gap-3">
                    {['accept', 'reject'].map(a => (
                      <button key={a} type="button" onClick={() => setMessageData({ ...messageData, action: a })}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition border-2 ${messageData.action === a
                          ? a === 'accept' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-red-500 text-white border-red-600'
                          : a === 'accept' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {a === 'accept' ? 'قبول ✅' : 'رفض ❌'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {messageData.action === 'accept' ? 'رسالة القبول' : 'رسالة الرفض'} <span className="text-red-500">*</span>
                </label>
                <textarea value={messageData.message} rows={4} resize="none"
                  onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                  placeholder={messageData.action === 'accept' ? 'مثال: تم قبولك في هذه المبادرة!' : 'مثال: نعتذر، تم إغلاق باب التسجيل.'}
                  className={`${INPUT} resize-none`} />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 px-6 pb-6 pt-4">
              <button onClick={submitAcceptReject} disabled={loading || !messageData.message.trim()}
                className={`flex-1 rounded-2xl py-3 font-bold text-white transition disabled:opacity-50 ${messageData.action === 'accept' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'}`}>
                {loading ? 'جاري الإرسال...' : messageData.isEdit ? 'حفظ التعديل' : 'إرسال'}
              </button>
              <button onClick={() => { setShowMessageModal(false); setMessageData({ applicantId: null, action: '', message: '', isEdit: false }); }}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

  

export default Profile;
    </div>);
};
