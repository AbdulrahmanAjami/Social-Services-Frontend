import React, { useState, useEffect, useMemo } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { 

  User, LogOut, Mail, Phone, Calendar, Shield, Home, Edit, Trash2, Plus, 

  Upload, X, Check, Clock, AlertCircle, UserCheck, UserX, Image as ImageIcon,

  Handshake, Sparkles, CheckCircle, XCircle, Briefcase, FileText, Lock

} from 'lucide-react';

import { useAuth } from './AuthContext';

import { servicesAPI, userAPI, postsAPI, apiBase } from './api';

import { CardSkeleton, ButtonSkeleton } from './components/Skeleton';

import { dispatchPostCompleted, isPostComplete, isPostLocked, normalizePost, getPostImage, getRawImagePath, getImagePreviewUrl, fileToCompressedDataUrl, DEFAULT_POST_IMAGE } from './postUtils';

import './Profile.css';



const API_BASE_URL = 'https://localhost:7244/api';



const INPUT_CLASS = 'profile-input';



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

  const [myServicesFilter, setMyServicesFilter] = useState('incomplete');

  const [appliedServices, setAppliedServices] = useState([]);

  const [appliedServicesLoading, setAppliedServicesLoading] = useState(false);

  const [appliedServicesError, setAppliedServicesError] = useState('');

  const [postsLoading, setPostsLoading] = useState(false);

  const [showEditPostModal, setShowEditPostModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [completeError, setCompleteError] = useState('');

  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  const [applicants, setApplicants] = useState([]);

  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const [applicantsError, setApplicantsError] = useState('');

  const [showMessageModal, setShowMessageModal] = useState(false);

  const [messageData, setMessageData] = useState({

    applicantId: null,

    action: '', // 'accept' or 'reject'

    message: '',

    isEdit: false

  });

  const [postFormData, setPostFormData] = useState({

    postID: 0,

    postTitle: '',

    description: '',

    countyID: '',

    imagePath: '',

  });

  const [counties, setCounties] = useState([]);

  const [loadingCounties, setLoadingCounties] = useState(false);

  const [editPostError, setEditPostError] = useState('');

  const [postImageUploading, setPostImageUploading] = useState(false);

  const handlePostImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPostImageUploading(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      setPostFormData((prev) => ({ ...prev, imagePath: dataUrl }));
    } catch (err) {
      setEditPostError(err.message || 'تعذّر تحميل الصورة');
    } finally {
      setPostImageUploading(false);
      e.target.value = '';
    }
  };

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

    if (!user) {

      console.log('⚠️ No user data available in context');

      setError('لا توجد بيانات المستخدم');

      return;

    }



    console.log('✅ Using user data from AuthContext:', user);

    

    // تحديث formData من البيانات المحفوظة في context

    setFormData({

      firstName: user.firstName || user.name?.split(' ')[0] || '',

      secondName: user.secondName || '',

      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',

      email: user.email || '',

      phone: user.phone || '',

      age: user.age || '',

      imagepath: user.imagepath || user.profilePicture || ''

    });



    if (user.imagepath || user.profilePicture) {

      setImagePreview(user.imagepath || user.profilePicture);

    }



    console.log('✅ User form data loaded successfully');

  };



  const fetchUserPosts = async () => {

    if (!user?.username || !accessToken) {

      console.error('⚠️ No username or access token available');

      return;

    }

    

    setPostsLoading(true);

    

    try {

      console.log('🔍 Fetching user posts for:', user.username);

      const response = await postsAPI.getUserPosts(user.username);

      const data = Array.isArray(response.data)

        ? response.data.map(normalizePost)

        : [];

      console.log('✅ User posts received:', data);

      setUserPosts(data);

    } catch (err) {

      console.error('❌ Error fetching user posts:', {

        message: err.message,

        response: err.response?.data,

        status: err.response?.status

      });

      setUserPosts([]);

    } finally {

      setPostsLoading(false);

    }

  };



  // Fetch applied services from API

  const fetchAppliedServices = async () => {

    if (!user?.username || !accessToken) {

      console.log('⚠️ No username or token available');

      return;

    }



    setAppliedServicesLoading(true);

    setAppliedServicesError('');



    try {

      console.log('🔍 Fetching applied services for:', user.username);

      

      const response = await servicesAPI.getServiceApplicationsForUser(user.username);

      

      console.log('✅ Applied services received:', response.data);

      

      // ✅ طباعة جميع الـ fields الموجودة في أول service للتحقق

      if (Array.isArray(response.data) && response.data.length > 0) {

        console.log('🔍 First service structure - ALL FIELDS:');

        const firstService = response.data[0];

        console.log('Fields:', Object.keys(firstService));

        console.log('Full object:', firstService);

        console.log('Message field:', firstService.message);

        console.log('ResponseMessage field:', firstService.responseMessage);

        console.log('ServiceResponse field:', firstService.serviceResponse);

        console.log('AcceptanceMessage field:', firstService.acceptanceMessage);

        console.log('Note field:', firstService.note);

      }

      

      const services = Array.isArray(response.data) ? response.data : [];

      

      // جلب تفاصيل جميع المنشورات المطلوبة

      let allPosts = {};

      

      try {

        const postsResponse = await postsAPI.getFilteredPosts({});

        const postsList = Array.isArray(postsResponse.data) ? postsResponse.data : [];

        

        // إنشاء map من postID إلى تفاصيل المنشور

        postsList.forEach(post => {

          allPosts[post.postID] = post;

        });

        

        console.log('📋 Posts map created:', Object.keys(allPosts).length, 'posts');

      } catch (postErr) {

        console.warn('⚠️ Could not fetch posts details:', postErr.message);

      }

      

      // تحويل البيانات من API إلى الصيغة المطلوبة

      const formattedServices = services.map(service => {

        const postDetails = allPosts[service.postID] || {};

        

        // دالة لتحويل التاريخ

        const parseDate = (dateString) => {

          if (!dateString) return 'غير متوفر';

          

          try {

            // محاولة تحويل التاريخ

            const date = new Date(dateString);

            

            // التحقق من أن التاريخ صحيح

            if (isNaN(date.getTime())) {

              return 'غير متوفر';

            }

            

            return date.toLocaleDateString('ar-JO');

          } catch (err) {

            console.warn('⚠️ Invalid date:', dateString, err.message);

            return 'غير متوفر';

          }

        };

        

        // ✅ تحديد الـ status من البيانات المرجعة من الـ API

        let status = 'pending';

        if (service.accepted === true) {

          status = 'accepted';

        } else if (service.accepted === false) {

          status = 'rejected';

        } else if (service.status) {

          status = service.status.toLowerCase();

        }

        

        console.log('📊 Service status mapping:', {

          applicationID: service.applicationID,

          accepted: service.accepted,

          status: service.status,

          finalStatus: status,

          messageField: service.message,

          responseMessageField: service.responseMessage,

          serviceResponseField: service.serviceResponse,

          acceptanceMessageField: service.acceptanceMessage

        });

        

        return {

          id: service.applicationID,

          serviceName: postDetails.postTitle || service.postTitle || 'خدمة بدون عنوان',

          authorName: postDetails.authorName || 'صاحب الخدمة',

          status: status,

          appliedDate: parseDate(service.applicationDateTime || service.applicationDate),

          description: service.description,

          message: service.acceptanceMessage || service.message || service.responseMessage || service.serviceResponse || null,

          postID: service.postID,

          applicationID: service.applicationID,

          rawDate: service.applicationDateTime || service.applicationDate

        };

      });

      

      console.log('✅ Formatted services:', formattedServices);

      console.log('📝 Messages in formatted services:', formattedServices.map(s => ({ id: s.id, message: s.message })));

      setAppliedServices(formattedServices);

    } catch (err) {

      console.error('❌ Error fetching applied services:', err);

      const errorMessage = err.response?.data?.message || err.message || 'فشل في جلب الخدمات المقدم عليها';

      setAppliedServicesError(errorMessage);

      setAppliedServices([]);

    } finally {

      setAppliedServicesLoading(false);

    }

  };



  // Fetch applicants for a service

  const fetchApplicants = async (postId) => {

    setApplicantsLoading(true);

    setApplicantsError('');

    

    try {

      console.log('📡 جاري جلب المتقدمين للمنشور:', postId);

      const response = await servicesAPI.getServiceApplicationsForPost(postId);

      

      console.log('✅ تم جلب المتقدمين بنجاح:');

      console.log('📋 Full Response:', response.data);

      

      // طباعة أول عنصر لفحص البنية

      if (Array.isArray(response.data) && response.data.length > 0) {

        console.log('🔍 First applicant structure:', response.data[0]);

        console.log('🔍 Field names:', Object.keys(response.data[0]));

      }

      

      // تحويل البيانات من API إلى الصيغة المطلوبة

      let formattedApplicants = Array.isArray(response.data) 

        ? response.data.map(app => {

            const id = app.applicationID || app.serviceApplicationID || app.id || app.ApplicationID || app.ServiceApplicationID;

            const userID = app.userID || app.userId || app.UserID;

            const acceptanceMessage = app.acceptanceMessage || app.message || app.responseMessage || '';



            let status = 'pending';

            if (app.accepted === true) {

              status = 'accepted';

            } else if (app.accepted === false && acceptanceMessage) {

              status = 'rejected';

            }



            return {

              id: id,

              userID: userID,

              name: app.userName || app.userFullName || 'مستخدم بدون اسم',

              email: app.userEmail || 'غير متوفر',

              phone: app.userPhone || 'غير متوفر',

              appliedDate: app.applicationDateTime || app.applicationDate || new Date().toISOString(),

              status,

              accepted: app.accepted,

              acceptanceMessage,

              description: app.description || 'لا يوجد وصف'

            };

          })

        : [];

      

      // ✅ جلب معلومات المستخدم الكاملة لكل متقدم

      const applicantsWithUserDetails = await Promise.all(

        formattedApplicants.map(async (applicant) => {

          if (applicant.userID && (applicant.name === 'مستخدم بدون اسم' || applicant.email === 'غير متوفر' || applicant.phone === 'غير متوفر')) {

            try {

              console.log('🔍 جاري جلب معلومات المستخدم:', applicant.userID);

              const userResponse = await userAPI.getUserByUserID(applicant.userID);

              const userData = userResponse.data;

              

              console.log('✅ تم جلب معلومات المستخدم:', userData);

              

              // دمج بيانات المستخدم مع بيانات المتقدم

              return {

                ...applicant,

                name: userData.firstName && userData.lastName 

                  ? `${userData.firstName} ${userData.secondName || ''} ${userData.lastName}`.trim()

                  : userData.username || applicant.name,

                email: userData.email || applicant.email,

                phone: userData.phone || applicant.phone

              };

            } catch (userErr) {

              console.warn('⚠️ فشل جلب معلومات المستخدم:', applicant.userID, userErr.message);

              return applicant;

            }

          }

          return applicant;

        })

      );

      

      console.log('✅ Formatted applicants with user details:', applicantsWithUserDetails);

      setApplicants(applicantsWithUserDetails);

    } catch (err) {

      console.error('❌ خطأ في جلب المتقدمين:', err);

      const errorMessage = err.response?.data?.message || 

                          err.message || 

                          'فشل في جلب المتقدمين';

      setApplicantsError(errorMessage);

      setApplicants([]);

    } finally {

      setApplicantsLoading(false);

    }

  };



  const handleAcceptApplicant = (applicantId) => {

    setMessageData({

      applicantId,

      action: 'accept',

      message: '',

      isEdit: false

    });

    setShowMessageModal(true);

  };



  const handleRejectApplicant = (applicantId) => {

    setMessageData({

      applicantId,

      action: 'reject',

      message: '',

      isEdit: false

    });

    setShowMessageModal(true);

  };



  const handleEditApplicantDecision = (applicant) => {

    setMessageData({

      applicantId: applicant.id,

      action: applicant.status === 'accepted' ? 'accept' : 'reject',

      message: applicant.acceptanceMessage || '',

      isEdit: true

    });

    setShowMessageModal(true);

  };



  const submitAcceptReject = async () => {

    if (!messageData.message.trim()) {

      setError('الرجاء كتابة رسالة');

      setTimeout(() => setError(''), 3000);

      return;

    }



    setLoading(true);

    setError('');



    try {

      const actionText = messageData.action === 'accept' ? 'قبول' : 'رفض';



      console.log('📝 جاري ' + (messageData.isEdit ? 'تعديل' : actionText) + ' المتقدم مع رسالة...');

      console.log('applicantId:', messageData.applicantId);

      console.log('message:', messageData.message);

      

      // ✅ استدعاء الـ API المناسبة

      if (messageData.action === 'accept') {

        await servicesAPI.acceptService(messageData.applicantId, messageData.message);

      } else {

        await servicesAPI.rejectService(messageData.applicantId, messageData.message);

      }

      

      console.log('✅ تم ' + actionText + ' المتقدم بنجاح');



      setSuccess(messageData.isEdit

        ? `✅ تم تحديث القرار بنجاح`

        : `✅ تم ${actionText} المتقدم وإرسال الرسالة بنجاح`);

      setShowMessageModal(false);

      setMessageData({ applicantId: null, action: '', message: '', isEdit: false });



      if (selectedPost?.postID) {

        await fetchApplicants(selectedPost.postID);

      }



      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {

      console.error('❌ خطأ في ' + messageData.action + ':', err);

      const errorMessage = err.response?.data?.message || 

                          err.message || 

                          'فشل في ' + (messageData.action === 'accept' ? 'القبول' : 'الرفض');

      setError('❌ ' + errorMessage);

      setTimeout(() => setError(''), 3000);

    } finally {

      setLoading(false);

    }

  };



  const fetchCounties = async () => {

    try {

      setLoadingCounties(true);

      const response = await apiBase.get('/CitiesCounties/Get All Counties');

      setCounties(Array.isArray(response.data) ? response.data : []);

    } catch (err) {

      console.error('❌ خطأ في جلب المناطق:', err);

      setCounties([]);

    } finally {

      setLoadingCounties(false);

    }

  };



  const getCurrentUserID = () => {

    const fromContext = user?.userID ?? user?.id ?? user?.UserID;

    if (fromContext != null) return Number(fromContext);



    try {

      const stored = localStorage.getItem('user');

      if (stored && stored !== 'undefined') {

        const parsed = JSON.parse(stored);

        const fromStorage = parsed?.userID ?? parsed?.id ?? parsed?.UserID;

        if (fromStorage != null) return Number(fromStorage);

      }

    } catch (err) {

      console.warn('⚠️ تعذر قراءة user من localStorage:', err);

    }



    return null;

  };



  useEffect(() => {

    if (user) {

      fetchUserDetails();

    }

    if (accessToken && user?.username) {

      fetchUserPosts();

      fetchAppliedServices();

      fetchCounties();

    }

  }, [user?.username, accessToken]);



  // ✅ إعادة جلب الخدمات المقدم عليها عند التبديل إلى التبويب

  useEffect(() => {

    if (activeTab === 'appliedServices' && user?.username && accessToken) {

      console.log('🔄 تبديل إلى تبويب الخدمات المقدم عليها - جاري إعادة الجلب...');

      fetchAppliedServices();

    }

  }, [activeTab]);



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

      console.log('🗑️ جاري حذف المنشور:', { postID: selectedPost.postID });

      

      // استخدام postsAPI.deletePost

      const response = await postsAPI.deletePost(selectedPost.postID);

      

      console.log('✅ تم حذف المنشور بنجاح:', response.data);

      

      // حذف المنشور من القائمة مباشرة

      setUserPosts(userPosts.filter(post => post.postID !== selectedPost.postID));

      

      // إغلاق الـ modal

      setShowDeleteModal(false);

      setSelectedPost(null);

      

      // عرض رسالة النجاح

      setSuccess('✅ تم حذف المنشور بنجاح');

      setTimeout(() => setSuccess(''), 3000);

      

    } catch (err) {

      console.error('❌ خطأ في حذف المنشور:', err);

      

      const errorMessage = err.response?.data?.message || 

                          err.response?.data || 

                          err.message || 

                          'فشل حذف المنشور';

      

      setError('❌ ' + errorMessage);

      setTimeout(() => setError(''), 3000);

    } finally {

      setLoading(false);

    }

  };



  const handleUpdatePost = async (e) => {

    e?.preventDefault();



    if (!postFormData.postTitle?.trim() || !postFormData.description?.trim()) {

      setEditPostError('الرجاء ملء العنوان والوصف');

      return;

    }



    if (!postFormData.countyID) {

      setEditPostError('الرجاء اختيار المنطقة');

      return;

    }



    const userID = getCurrentUserID();

    if (!userID) {

      setEditPostError('تعذر تحديد المستخدم. أعد تسجيل الدخول وحاول مرة أخرى');

      return;

    }



    setLoading(true);

    setEditPostError('');

    setError('');



    const payload = {

      postID: postFormData.postID,

      userID,

      postTitle: postFormData.postTitle.trim(),

      description: postFormData.description.trim(),

      countyID: Number(postFormData.countyID),

      imagePath: postFormData.imagePath?.trim() || '',

    };



    try {

      await postsAPI.updatePost(payload);



      const selectedCounty = counties.find(

        (c) => c.countyID === payload.countyID

      );



      setUserPosts((prev) =>

        prev.map((post) =>

          post.postID === payload.postID

            ? {

                ...post,

                postTitle: payload.postTitle,

                description: payload.description,

                imagePath: payload.imagePath,

                countyID: payload.countyID,

                countyName: selectedCounty?.countyName || post.countyName,

              }

            : post

        )

      );



      setShowEditPostModal(false);

      setSelectedPost(null);

      setSuccess('✅ تم تحديث الخدمة بنجاح');

      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {

      console.error('❌ خطأ في تحديث الخدمة:', err);

      const errorMessage =

        err.response?.data?.message ||

        (typeof err.response?.data === 'string' ? err.response.data : null) ||

        err.message ||

        'فشل تحديث الخدمة';

      setEditPostError(errorMessage);

      setError('❌ ' + errorMessage);

      setTimeout(() => setError(''), 5000);

    } finally {

      setLoading(false);

    }

  };



  const openEditModal = (post) => {

    setSelectedPost(post);

    setEditPostError('');

    setPostFormData({

      postID: post.postID,

      postTitle: post.postTitle || '',

      description: post.description || '',

      countyID: post.countyID ? String(post.countyID) : '',

      imagePath: getRawImagePath(post) || '',

    });

    if (counties.length === 0) {

      fetchCounties();

    }

    setShowEditPostModal(true);

  };



  const closeEditPostModal = () => {

    setShowEditPostModal(false);

    setSelectedPost(null);

    setEditPostError('');

  };



  const openDeleteModal = (post) => {

    setSelectedPost(post);

    setShowDeleteModal(true);

  };



  const openCompleteModal = (post) => {

    setSelectedPost(post);

    setCompleteError('');

    setShowCompleteModal(true);

  };



  const handleCompletePost = async () => {

    if (!selectedPost) return;



    setLoading(true);

    setCompleteError('');

    setError('');



    try {

      const completedPostID = selectedPost.postID;

      await postsAPI.completePost(completedPostID);



      setUserPosts((prev) =>

        prev.map((post) =>

          post.postID === completedPostID

            ? { ...post, isComplete: true }

            : post

        )

      );

      dispatchPostCompleted(completedPostID);



      setShowCompleteModal(false);

      setSelectedPost(null);

      setSuccess('✅ تم إكمال الخدمة بنجاح');

      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {

      console.error('❌ خطأ في إكمال الخدمة:', err);

      const errorMessage = err.response?.data?.message ||

        (typeof err.response?.data === 'string' ? err.response.data : null) ||

        err.message ||

        'فشل في إكمال الخدمة';

      setCompleteError(errorMessage);

      setError('❌ ' + errorMessage);

      setTimeout(() => setError(''), 5000);

    } finally {

      setLoading(false);

    }

  };



  const openApplicantsModal = (post) => {

    setSelectedPost(post);

    setApplicants([]);

    setShowApplicantsModal(true);

    fetchApplicants(post.postID);

  };



  const displayedUserPosts = useMemo(() => {

    return userPosts.filter((post) =>

      myServicesFilter === 'complete'

        ? isPostComplete(post)

        : !isPostComplete(post)

    );

  }, [userPosts, myServicesFilter]);



  const handleLogout = () => {

    logout();

    navigate('/login');

  };



  const getStatusBadge = (status) => {

    switch (status) {

      case 'accepted':

        return (

          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-bold border border-emerald-200">

            <CheckCircle className="w-4 h-4" />

            مقبول

          </span>

        );

      case 'rejected':

        return (

          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full text-sm font-bold border border-rose-200">

            <XCircle className="w-4 h-4" />

            مرفوض

          </span>

        );

      default:

        return (

          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-sm font-bold border border-amber-200">

            <Clock className="w-4 h-4" />

            قيد المراجعة

          </span>

        );

    }

  };



  const profileTabs = [

    { id: 'info', label: 'المعلومات الشخصية', icon: User },

    { id: 'myServices', label: 'خدماتي', icon: Briefcase, count: userPosts.length },

    { id: 'appliedServices', label: 'الخدمات المقدم عليها', icon: FileText, count: appliedServices.length },

  ];



  if (loading && !formData.firstName) {

    return (

      <div className="profile-page min-h-screen flex items-center justify-center">

        <div className="w-full max-w-6xl px-4 py-12">

          <CardSkeleton count={3} />

        </div>

      </div>

    );

  }



  return (

    <div className="profile-page relative" dir="rtl">

      <div className="profile-bg-mesh fixed inset-0 pointer-events-none" aria-hidden />



      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.5rem] flex justify-between items-center">

          <button

            type="button"

            onClick={() => navigate('/')}

            className="flex items-center gap-3 group"

          >

            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">

              <Handshake className="w-6 h-6 text-white" strokeWidth={2.5} />

            </div>

            <div className="text-right hidden sm:block">

              <p className="text-sm font-black leading-tight">

                <span className="text-emerald-600">Participate</span>

                <span className="text-slate-600"> & Make</span>

              </p>

              <p className="text-[10px] font-bold tracking-widest text-teal-600">A CHANGE</p>

            </div>

          </button>

          <div className="flex items-center gap-2">

            <Link

              to="/"

              className="profile-btn-primary px-4 py-2.5 text-sm flex items-center gap-2"

            >

              <Home className="w-4 h-4" />

              <span className="hidden md:inline">الرئيسية</span>

            </Link>

            <button

              type="button"

              onClick={handleLogout}

              className="px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2"

            >

              <LogOut className="w-4 h-4" />

              <span className="hidden md:inline">خروج</span>

            </button>

          </div>

        </div>

      </header>



      <section className="profile-hero-gradient relative px-4 pt-10 pb-24 sm:px-6">

        <div className="max-w-7xl mx-auto relative z-10">

          <p className="text-emerald-100/90 text-sm font-bold mb-1">لوحة المتطوع</p>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">ملفي الشخصي</h1>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0fdfa] to-transparent" />

      </section>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20 pb-16">

        <div className="profile-glass rounded-3xl p-6 md:p-8 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">

            <div className="flex flex-col sm:flex-row items-center gap-6 lg:flex-1">

              <div className="relative shrink-0">

                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-60 blur profile-blob" />

                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-xl ring-4 ring-white">

                  {imagePreview || formData.imagepath ? (

                    <img

                      src={imagePreview || formData.imagepath}

                      alt=""

                      className="w-full h-full rounded-xl object-cover"

                    />

                  ) : (

                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">

                      <User className="w-14 h-14 text-emerald-600" />

                    </div>

                  )}

                </div>

                {isEditing && (

                  <label className="absolute -bottom-1 -left-1 w-10 h-10 profile-btn-primary rounded-xl flex items-center justify-center cursor-pointer shadow-lg">

                    <Upload className="w-5 h-5" />

                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                  </label>

                )}

              </div>

              <div className="text-center sm:text-right flex-1">

                <h2 className="text-2xl md:text-3xl font-black text-slate-800">

                  {formData.firstName} {formData.lastName}

                </h2>

                <p className="text-teal-600 font-bold mt-1">@{user?.username}</p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">

                    <Mail className="w-4 h-4 text-emerald-600" />

                    {formData.email}

                  </span>

                  {formData.phone && (

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">

                      <Phone className="w-4 h-4 text-emerald-600" />

                      {formData.phone}

                    </span>

                  )}

                </div>

              </div>

            </div>

            {!isEditing && (

              <button

                type="button"

                onClick={() => setIsEditing(true)}

                className="profile-btn-primary px-6 py-3 flex items-center justify-center gap-2 shrink-0"

              >

                <Edit className="w-5 h-5" />

                تعديل الملف

              </button>

            )}

          </div>

        </div>



        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="profile-stat-card stat-violet">

            <div className="flex items-center justify-between mb-3 relative">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">

                <Sparkles className="w-5 h-5 text-white" />

              </div>

              <span className="text-xs font-bold text-violet-600">النقاط</span>

            </div>

            <p className="text-3xl font-black text-slate-800">{userStats.points}</p>

            <p className="text-sm text-slate-500 font-semibold mt-0.5">نقطة تطوع</p>

          </div>

          <div className="profile-stat-card stat-emerald">

            <div className="flex items-center justify-between mb-3 relative">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">

                <CheckCircle className="w-5 h-5 text-white" />

              </div>

              <span className="text-xs font-bold text-emerald-600">المشاركات</span>

            </div>

            <p className="text-3xl font-black text-slate-800">{userStats.participationCount}</p>

            <p className="text-sm text-slate-500 font-semibold mt-0.5">خدمة تطوعية</p>

          </div>

          <div className="profile-stat-card stat-cyan">

            <div className="flex items-center justify-between mb-3 relative">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">

                <Clock className="w-5 h-5 text-white" />

              </div>

              <span className="text-xs font-bold text-cyan-600">الساعات</span>

            </div>

            <p className="text-3xl font-black text-slate-800">{userStats.volunteerHours}</p>

            <p className="text-sm text-slate-500 font-semibold mt-0.5">ساعة عمل</p>

          </div>

          <div className="profile-stat-card stat-teal">

            <div className="flex items-center justify-between mb-3 relative">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">

                <CheckCircle className="w-5 h-5 text-white" />

              </div>

              <span className="text-xs font-bold text-teal-600">التقييم</span>

            </div>

            <p className="text-3xl font-black text-slate-800">

              {userStats.rating}

              <span className="text-lg text-slate-400 font-bold">/100</span>

            </p>

            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">

              <div

                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-700"

                style={{ width: `${userStats.rating}%` }}

              />

            </div>

            <p className="text-xs text-slate-500 font-semibold mt-1">{userStats.totalRatings} تقييم</p>

          </div>

        </div>



        {error && (

          <div className="profile-alert error mb-6">

            <AlertCircle className="w-5 h-5 shrink-0" />

            {error}

          </div>

        )}

        {success && (

          <div className="profile-alert success mb-6">

            <CheckCircle className="w-5 h-5 shrink-0" />

            {success}

          </div>

        )}



        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          <nav className="profile-glass w-full lg:w-72 shrink-0 rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto">

            {profileTabs.map((tab) => {

              const Icon = tab.icon;

              const isActive = activeTab === tab.id;

              return (

                <button

                  key={tab.id}

                  type="button"

                  onClick={() => setActiveTab(tab.id)}

                  className={`profile-nav-btn ${isActive ? 'active' : ''}`}

                >

                  <Icon className="w-5 h-5 shrink-0" />

                  <span className="flex-1 text-right">{tab.label}</span>

                  {tab.count != null && (

                    <span

                      className={`text-xs font-black px-2 py-0.5 rounded-full ${

                        isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'

                      }`}

                    >

                      {tab.count}

                    </span>

                  )}

                </button>

              );

            })}

          </nav>



          <main className="flex-1 w-full min-w-0">

        {activeTab === 'info' && (

          <div className="profile-glass rounded-3xl p-6 md:p-8">

            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">

              <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />

              المعلومات الشخصية

            </h2>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* First Name */}

              <div>

                <label className="block text-slate-700 font-bold mb-2">الاسم الأول</label>

                <input 

                  type="text" 

                  value={formData.firstName} 

                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 

                  disabled={!isEditing} 

                  className={`${INPUT_CLASS} disabled:opacity-60`} 

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

                  className={`${INPUT_CLASS} disabled:opacity-60`} 

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

                  className={`${INPUT_CLASS} disabled:opacity-60`} 

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

                  className={`${INPUT_CLASS} disabled:opacity-60`} 

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

                    className={`${INPUT_CLASS} pr-12 disabled:opacity-60`} 

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

                    className={`${INPUT_CLASS} pr-12 disabled:opacity-60`} 

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

                      className={`${INPUT_CLASS} pr-12`} 

                    />

                  </div>

                </div>

              )}

            </div>



            {/* Action Buttons */}

            {isEditing && (

              <div className="flex gap-4 mt-8">

                <button

                  type="button"

                  onClick={handleUpdate}

                  disabled={loading}

                  className="flex-1 profile-btn-primary py-4 flex items-center justify-center gap-2"

                >

                  {loading ? (

                    <>

                      <ButtonSkeleton />

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



            <div className="mt-8 pt-8 border-t border-slate-200">

              <h3 className="text-lg font-black text-slate-800 mb-4">معلومات الحساب</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-emerald-50/50 px-5 py-4 rounded-xl border border-slate-200">

                  <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">

                    <Calendar className="w-5 h-5 text-white" />

                  </div>

                  <div>

                    <p className="text-xs text-slate-500 font-semibold">عضو منذ</p>

                    <p className="font-bold text-slate-800">

                      {user?.creationDate ? new Date(user.creationDate).toLocaleDateString('ar-JO') : 'غير متوفر'}

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 bg-gradient-to-br from-slate-50 to-teal-50/50 px-5 py-4 rounded-xl border border-slate-200">

                  <div className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm">

                    <Shield className="w-5 h-5 text-white" />

                  </div>

                  <div>

                    <p className="text-xs text-slate-500 font-semibold">حالة الحساب</p>

                    <p className="font-bold text-emerald-700">{user?.isActive ? 'نشط ✓' : 'غير نشط'}</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}



        {activeTab === 'myServices' && (

          <div className="profile-glass rounded-3xl overflow-hidden">

            <div className="profile-section-header mine px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <h2 className="text-xl font-bold text-white">خدماتي ({userPosts.length})</h2>

              <Link

                to="/posts"

                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-bold transition-all backdrop-blur-sm"

              >

                <Plus className="w-5 h-5" />

                إضافة خدمة

              </Link>

            </div>



            <div className="p-6 md:p-8">

              {!postsLoading && userPosts.length > 0 && (

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4">

                  <div>

                    <p className="text-slate-500 text-sm font-semibold mb-1">تصفية الخدمات</p>

                    <p className="text-slate-800 font-bold">

                      {displayedUserPosts.length} من {userPosts.length} خدمة

                    </p>

                  </div>

                  <select

                    value={myServicesFilter}

                    onChange={(e) => setMyServicesFilter(e.target.value)}

                    className={`${INPUT_CLASS} min-w-[220px] font-bold cursor-pointer bg-white`}

                  >

                    <option value="incomplete">خدمات غير مكتملة</option>

                    <option value="complete">خدمات مكتملة</option>

                  </select>

                </div>

              )}



              {postsLoading ? (

                <div className="py-8">

                  <CardSkeleton count={2} />

                </div>

              ) : userPosts.length === 0 ? (

                <div className="text-center py-16">

                  <div className="text-slate-300 text-7xl mb-6">📋</div>

                  <p className="text-slate-600 text-xl font-bold mb-6">لم تقم بإضافة أي خدمات بعد</p>

                  <Link to="/posts" className="inline-block profile-btn-primary px-6 py-3 text-sm">

                    أضف خدمتك الأولى

                  </Link>

                </div>

              ) : displayedUserPosts.length === 0 ? (

                <div className="text-center py-16">

                  <div className="text-slate-300 text-7xl mb-6">

                    {myServicesFilter === 'complete' ? '✅' : '⏳'}

                  </div>

                  <p className="text-slate-600 text-xl font-bold mb-2">

                    {myServicesFilter === 'complete'

                      ? 'لا توجد خدمات مكتملة بعد'

                      : 'لا توجد خدمات غير مكتملة'}

                  </p>

                  <p className="text-slate-500 mb-6">

                    {myServicesFilter === 'complete'

                      ? 'عند إكمال إحدى خدماتك ستظهر هنا'

                      : 'جميع خدماتك مكتملة أو لم تُضف بعد'}

                  </p>

                  {myServicesFilter === 'complete' && (

                    <button

                      type="button"

                      onClick={() => setMyServicesFilter('incomplete')}

                      className="profile-btn-primary px-6 py-2.5 text-sm"

                    >

                      عرض الخدمات غير المكتملة

                    </button>

                  )}

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {displayedUserPosts.map((post) => (

                    <div key={post.postID} className="profile-service-card">

                      <div className="relative h-48 overflow-hidden">

                        <img 

                          src={getPostImage(post)} 

                          alt={post.postTitle} 

                          className="w-full h-full object-cover" 

                          onError={(e) => {

                            if (e.target.src !== DEFAULT_POST_IMAGE) {

                              e.target.src = DEFAULT_POST_IMAGE;

                            }

                          }}

                        />

                        {isPostComplete(post) && (

                          <span className="post-badge complete">

                            <CheckCircle className="w-3.5 h-3.5" />

                            مكتمل

                          </span>

                        )}

                        {!isPostComplete(post) && isPostLocked(post) && (

                          <span className="post-badge locked">

                            <Lock className="w-3.5 h-3.5" />

                            مقفل

                          </span>

                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>

                      </div>

                      <div className="p-4">

                        <h3 className="text-base font-bold text-slate-800 mb-1.5 leading-snug">{post.postTitle}</h3>

                        <p className="text-slate-500 mb-3 line-clamp-2 text-sm leading-relaxed">{post.description || 'لا يوجد وصف'}</p>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 gap-2">

                          <span className="font-medium truncate">📍 {post.countyName || 'غير محدد'}</span>

                          <span className="font-medium shrink-0">📅 {new Date(post.publishDateTime).toLocaleDateString('ar-JO')}</span>

                        </div>



                        <div className="post-actions">

                          <button

                            type="button"

                            onClick={() => openApplicantsModal(post)}

                            className="post-action post-action-primary"

                          >

                            <UserCheck />

                            عرض المتقدمين

                          </button>



                          {!isPostComplete(post) && !isPostLocked(post) && (

                            <button

                              type="button"

                              onClick={() => openCompleteModal(post)}

                              disabled={loading}

                              className="post-action post-action-accent"

                            >

                              <CheckCircle />

                              إكمال الخدمة

                            </button>

                          )}



                          <div className="post-actions-row">

                            <button

                              type="button"

                              onClick={() => openEditModal(post)}

                              className="post-action post-action-muted"

                            >

                              <Edit />

                              تعديل

                            </button>

                            <button

                              type="button"

                              onClick={() => openDeleteModal(post)}

                              className="post-action post-action-danger"

                            >

                              <Trash2 />

                              حذف

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        )}



        {activeTab === 'appliedServices' && (

          <div className="profile-glass rounded-3xl overflow-hidden">

            <div className="profile-section-header applied px-6 py-5">

              <h2 className="text-xl font-bold text-white">

                الخدمات المقدم عليها ({appliedServices.length})

              </h2>

            </div>



            <div className="p-6 md:p-8">

              {/* Error State */}

              {appliedServicesError && (

                <div className="mb-6 bg-rose-50 border-2 border-rose-500 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3">

                  <AlertCircle className="w-5 h-5 flex-shrink-0" />

                  <span>{appliedServicesError}</span>

                </div>

              )}



              {/* Loading State */}

              {appliedServicesLoading ? (

                <div className="py-8">

                  <CardSkeleton count={2} />

                </div>

              ) : appliedServices.length === 0 ? (

                <div className="text-center py-16">

                  <div className="text-slate-300 text-7xl mb-6">📝</div>

                  <p className="text-slate-600 text-xl font-bold mb-6">لم تتقدم لأي خدمات بعد</p>

                  <Link to="/posts" className="inline-block profile-btn-primary px-6 py-3 text-sm">

                    تصفح الخدمات المتاحة

                  </Link>

                </div>

              ) : (

                <div className="space-y-4">

                  {appliedServices.map((service) => (

                    <div key={service.id} className="applied-service-card">

                      <div className="flex items-start justify-between gap-4 mb-3">

                        <div className="flex-1 min-w-0">

                          <h3 className="text-base font-bold text-slate-800 mb-1.5">{service.serviceName}</h3>

                          

                          {service.authorName && (

                            <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm">

                              <User className="w-4 h-4 text-slate-400 shrink-0" />

                              {service.authorName}

                            </div>

                          )}

                          

                          <p className="text-slate-500 text-sm mb-2 leading-relaxed">{service.description || 'لا يوجد وصف'}</p>

                          

                          <div className="flex items-center gap-1 text-xs text-slate-500">

                            <Calendar className="w-3.5 h-3.5 text-slate-400" />

                            <span>تقديم: {service.appliedDate}</span>

                          </div>

                        </div>

                        <div>

                          {getStatusBadge(service.status)}

                        </div>

                      </div>

                      

                      {/* Message from service owner */}

                      {service.message ? (

                        <div className={`mt-3 p-3 rounded-lg border ${

                          service.status === 'accepted'

                            ? 'bg-emerald-50/80 border-emerald-200'

                            : service.status === 'rejected'

                            ? 'bg-rose-50/80 border-rose-200'

                            : 'bg-amber-50/80 border-amber-200'

                        }`}>

                          <div className="flex items-start gap-2.5">

                            <div className={`applied-message-icon ${

                              service.status === 'accepted'

                                ? 'accepted'

                                : service.status === 'rejected'

                                ? 'rejected'

                                : 'pending'

                            }`}>

                              <Mail className="w-4 h-4" />

                            </div>

                            <div className="flex-1 min-w-0">

                              <p className="text-sm font-semibold text-slate-700 mb-0.5">رسالة من صاحب الخدمة</p>

                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">

                                {service.message}

                              </p>

                            </div>

                          </div>

                        </div>

                      ) : service.status !== 'pending' ? (

                        <div className={`mt-3 px-3 py-2 rounded-lg border text-sm ${

                          service.status === 'accepted'

                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'

                            : 'bg-rose-50/80 border-rose-200 text-rose-800'

                        }`}>

                          {service.status === 'accepted'

                            ? 'تم قبول طلبك بنجاح'

                            : 'تم رفض طلبك'}

                        </div>

                      ) : null}

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        )}

          </main>

        </div>

      </div>



      {/* Applicants Modal */}

      {showApplicantsModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

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

              {/* Error State */}

              {applicantsError && (

                <div className="mb-6 bg-rose-50 border-2 border-rose-500 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3">

                  <AlertCircle className="w-5 h-5 flex-shrink-0" />

                  <span>{applicantsError}</span>

                </div>

              )}



              {/* Success Message */}

              {success && (

                <div className="mb-6 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-3">

                  <Check className="w-5 h-5 flex-shrink-0" />

                  <span>{success}</span>

                </div>

              )}



              {/* Error Message */}

              {error && (

                <div className="mb-6 bg-rose-50 border-2 border-rose-500 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3">

                  <AlertCircle className="w-5 h-5 flex-shrink-0" />

                  <span>{error}</span>

                </div>

              )}



              {/* Loading State */}

              {applicantsLoading ? (

                <div className="py-8">

                  <CardSkeleton count={2} />

                </div>

              ) : applicants.length === 0 ? (

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

                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">

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

                              {applicant.description && (

                                <p className="flex items-start gap-2 mt-3 bg-white p-3 rounded-lg border border-slate-200">

                                  <FileText className="w-4 h-4 mt-1 flex-shrink-0" />

                                  <span className="text-slate-700 font-semibold">{applicant.description}</span>

                                </p>

                              )}

                            </div>

                          </div>

                        </div>



                        <div className="flex flex-col gap-2 min-w-[160px]">

                          {applicant.status === 'pending' ? (

                            <>

                              <button

                                onClick={() => handleAcceptApplicant(applicant.id)}

                                disabled={loading}

                                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"

                              >

                                <UserCheck className="w-5 h-5" />

                                قبول

                              </button>

                              <button

                                onClick={() => handleRejectApplicant(applicant.id)}

                                disabled={loading}

                                className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"

                              >

                                <UserX className="w-5 h-5" />

                                رفض

                              </button>

                            </>

                          ) : (

                            <div className="flex flex-col gap-2">

                              <div className={`px-4 py-2.5 rounded-xl font-bold text-center ${

                                applicant.status === 'accepted'

                                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'

                                  : 'bg-rose-100 text-rose-700 border-2 border-rose-300'

                              }`}>

                                {applicant.status === 'accepted' ? 'تم القبول ✅' : 'تم الرفض ❌'}

                              </div>

                              {applicant.acceptanceMessage && (

                                <div className="bg-white p-3 rounded-lg border-2 border-slate-200">

                                  <p className="text-xs font-semibold text-slate-600 mb-1">الرسالة:</p>

                                  <p className="text-sm text-slate-700 font-semibold whitespace-pre-wrap">{applicant.acceptanceMessage}</p>

                                </div>

                              )}

                              <button

                                onClick={() => handleEditApplicantDecision(applicant)}

                                className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"

                              >

                                <Edit className="w-5 h-5" />

                                تعديل

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



      {/* Edit Post Modal */}

      {showEditPostModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-6 flex justify-between items-center z-10">

              <h2 className="text-2xl font-bold text-white">تعديل الخدمة ✏️</h2>

              <button

                type="button"

                onClick={closeEditPostModal}

                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"

              >

                ×

              </button>

            </div>



            <form onSubmit={handleUpdatePost} className="p-8 space-y-6">

              {editPostError && (

                <div className="bg-rose-50 border-2 border-rose-500 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2">

                  <AlertCircle className="w-5 h-5 flex-shrink-0" />

                  <span className="font-semibold">{editPostError}</span>

                </div>

              )}



              <div>

                <label className="block text-slate-700 font-bold mb-2">

                  عنوان المنشور <span className="text-rose-500">*</span>

                </label>

                <input

                  type="text"

                  value={postFormData.postTitle}

                  onChange={(e) =>

                    setPostFormData({ ...postFormData, postTitle: e.target.value })

                  }

                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"

                  placeholder="عنوان الخدمة"

                  required

                />

              </div>



              <div>

                <label className="block text-slate-700 font-bold mb-2">

                  الوصف <span className="text-rose-500">*</span>

                </label>

                <textarea

                  value={postFormData.description}

                  onChange={(e) =>

                    setPostFormData({ ...postFormData, description: e.target.value })

                  }

                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 h-32 resize-none outline-none"

                  placeholder="وصف الخدمة"

                  required

                />

              </div>



              <div>

                <label className="block text-slate-700 font-bold mb-2">

                  المنطقة <span className="text-rose-500">*</span>

                </label>

                <select

                  value={postFormData.countyID}

                  onChange={(e) =>

                    setPostFormData({ ...postFormData, countyID: e.target.value })

                  }

                  disabled={loadingCounties}

                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none cursor-pointer disabled:opacity-60"

                  required

                >

                  <option value="">

                    {loadingCounties ? 'جاري تحميل المناطق...' : '-- اختر المنطقة --'}

                  </option>

                  {counties.map((county) => (

                    <option key={county.countyID} value={county.countyID}>

                      {county.countyName}

                    </option>

                  ))}

                </select>

              </div>



              <div>

                <label className="block text-slate-700 font-bold mb-2">صورة المنشور</label>

                <input

                  type="file"

                  accept="image/*"

                  onChange={handlePostImageFileChange}

                  disabled={postImageUploading}

                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 disabled:opacity-50"

                />

                {postImageUploading && (

                  <p className="mt-2 text-sm text-slate-500">⏳ جاري تحضير الصورة...</p>

                )}

                <p className="mt-2 text-xs text-slate-500">اختر صورة من جهازك — لا حاجة لرابط https</p>

                <label className="block text-slate-600 text-sm mt-3 mb-1">أو رابط من الإنترنت</label>

                <input

                  type="url"

                  value={postFormData.imagePath.startsWith('data:') ? '' : postFormData.imagePath}

                  onChange={(e) =>

                    setPostFormData({ ...postFormData, imagePath: e.target.value })

                  }

                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"

                  placeholder="https://example.com/image.jpg"

                />

                {postFormData.imagePath && (

                  <img

                    src={getImagePreviewUrl(postFormData.imagePath)}

                    alt="معاينة"

                    className="mt-3 w-full h-40 object-cover rounded-xl border-2 border-slate-200"

                    onError={(e) => {

                      e.target.style.display = 'none';

                    }}

                  />

                )}

                {postFormData.imagePath && (

                  <button

                    type="button"

                    onClick={() => setPostFormData({ ...postFormData, imagePath: '' })}

                    className="mt-2 text-sm text-red-600 hover:text-red-700"

                  >

                    إزالة الصورة

                  </button>

                )}

              </div>



              <div className="flex gap-3 pt-2 border-t-2 border-slate-100">

                <button

                  type="submit"

                  disabled={loading || loadingCounties}

                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg"

                >

                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}

                </button>

                <button

                  type="button"

                  onClick={closeEditPostModal}

                  disabled={loading}

                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"

                >

                  إلغاء

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* Complete Service Modal */}

      {showCompleteModal && selectedPost && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">

            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500">

              <CheckCircle className="w-10 h-10 text-emerald-600" />

            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">إكمال الخدمة</h2>

            <p className="text-slate-600 mb-2">هل أنت متأكد أن الخدمة اكتملت؟</p>

            <p className="text-emerald-600 text-lg font-bold mb-4">"{selectedPost.postTitle}"</p>

            <p className="text-slate-500 text-sm mb-4">

              بعد الإكمال لن يظهر زر الإكمال ولن يتمكن المتطوعون من التقديم على هذه الخدمة.

            </p>



            {completeError && (

              <div className="mb-6 bg-rose-50 border-2 border-rose-500 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2 text-right text-sm">

                <AlertCircle className="w-5 h-5 flex-shrink-0" />

                <span>{completeError}</span>

              </div>

            )}



            <div className="flex gap-3">

              <button

                onClick={handleCompletePost}

                disabled={loading}

                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg"

              >

                {loading ? 'جاري الإكمال...' : 'نعم، اكتملت'}

              </button>

              <button

                onClick={() => {

                  setShowCompleteModal(false);

                  setSelectedPost(null);

                  setCompleteError('');

                }}

                disabled={loading}

                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"

              >

                إلغاء

              </button>

            </div>

          </div>

        </div>

      )}



      {/* Delete Modal */}

      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

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



      {/* Message Modal for Accept/Reject/Edit */}

      {showMessageModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">

          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl">

            <div className={`px-8 py-6 rounded-t-3xl flex justify-between items-center ${

              messageData.action === 'accept' 

                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 

                : 'bg-gradient-to-r from-rose-500 to-pink-500'

            }`}>

              <h2 className="text-2xl font-bold text-white">

                {messageData.isEdit

                  ? 'تعديل القرار'

                  : messageData.action === 'accept' ? '✅ قبول المتقدم' : '❌ رفض المتقدم'}

              </h2>

              <button 

                onClick={() => {

                  setShowMessageModal(false);

                  setMessageData({ applicantId: null, action: '', message: '', isEdit: false });

                }} 

                className="text-white hover:text-slate-200 text-3xl font-light w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all"

              >

                ×

              </button>

            </div>

            

            <div className="p-8 space-y-6">

              {messageData.isEdit && (

                <div>

                  <label className="block text-slate-700 font-bold mb-3">تغيير القرار</label>

                  <div className="flex gap-3">

                    <button

                      type="button"

                      onClick={() => setMessageData({ ...messageData, action: 'accept' })}

                      className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${

                        messageData.action === 'accept'

                          ? 'bg-emerald-500 text-white border-emerald-600'

                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'

                      }`}

                    >

                      قبول ✅

                    </button>

                    <button

                      type="button"

                      onClick={() => setMessageData({ ...messageData, action: 'reject' })}

                      className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${

                        messageData.action === 'reject'

                          ? 'bg-rose-500 text-white border-rose-600'

                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'

                      }`}

                    >

                      رفض ❌

                    </button>

                  </div>

                </div>

              )}



              <div>

                <label className="block text-slate-700 font-bold mb-3 text-lg">

                  {messageData.action === 'accept' ? 'رسالة القبول' : 'رسالة الرفض'} <span className="text-rose-500">*</span>

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

              </div>

            </div>



            <div className="px-8 pb-8 flex gap-3">

              <button 

                onClick={submitAcceptReject} 

                disabled={loading || !messageData.message.trim()}

                className={`flex-1 text-white py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 shadow-lg ${

                  messageData.action === 'accept'

                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'

                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'

                }`}

              >

                {loading ? 'جاري الإرسال...' : messageData.isEdit ? 'حفظ التعديل' : 'إرسال'}

              </button>

              <button 

                onClick={() => {

                  setShowMessageModal(false);

                  setMessageData({ applicantId: null, action: '', message: '', isEdit: false });

                }}

                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-all duration-300"

              >

                إلغاء

              </button>

            </div>

          </div>

        </div>

      )}



    </div>

  );

};



export default Profile;