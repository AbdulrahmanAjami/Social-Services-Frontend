import React, { useState, useEffect } from 'react';

import axios from 'axios';

import {

  Users,

  FileText,

  BarChart3,

  Trash2,

  Edit2,

  Search,

  ChevronDown,

  TrendingUp,

  Eye,

  EyeOff,

  AlertCircle,

  CheckCircle,

  XCircle,

  Download,

  Filter,

  ChevronLeft,

  ChevronRight,

  Calendar,

  MessageSquare,

  ArrowLeft,

  ShieldX,

  HeartHandshake,

} from 'lucide-react';

import { useAuth } from './AuthContext';

import { useNavigate } from 'react-router-dom';

import { postsAPI, userAPI } from './api';

import { CardSkeleton } from './components/Skeleton';



// Admin API with Bearer token

const adminApi = axios.create({ baseURL: 'https://yousefalhamad-001-site1.ltempurl.com/api' });

adminApi.interceptors.request.use(config => {

  const token = localStorage.getItem('adminToken');

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;

});



const Admin = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const ADMIN_USERNAME = 'aboodajami';


  // Extracts the admin's ID from the JWT token stored in localStorage.
// The token uses the long XML-based claim name for the user identifier.
const getAdminIdFromToken = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const idClaim =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return idClaim ? Number(idClaim) : null;
  } catch (err) {
    console.error('Error decoding admin token:', err);
    return null;
  }
};

  const handleAdminLogout = () => {

    localStorage.removeItem('adminToken');

    navigate('/admin/login', { replace: true });

  };



  // ============ STATE MANAGEMENT ============

  const [activeTab, setActiveTab] = useState('stats');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');



  // ============ CHECK AUTHORIZATION ============

  useEffect(() => {

    const checkToken = () => {

      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {

        navigate('/admin/login', { replace: true });

        return;

      }

      try {

        const payload = JSON.parse(atob(adminToken.split('.')[1]));

        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {

          localStorage.removeItem('adminToken');

          navigate('/admin/login', { replace: true });

        }

      } catch {

        localStorage.removeItem('adminToken');

        navigate('/admin/login', { replace: true });

      }

    };



    checkToken();

    // Check every minute

    const interval = setInterval(checkToken, 60000);

    return () => clearInterval(interval);

  }, [navigate]);



  // Statistics

  const [stats, setStats] = useState({

    totalPosts: 0,

    totalUsers: 0,

    ageDistribution: [],

  });



  // Posts Management

  const [posts, setPosts] = useState([]);

  const [postsSearch, setPostsSearch] = useState('');

  const [postsFilter, setPostsFilter] = useState('all');

  const [editingPost, setEditingPost] = useState(null);

  const [postPageIndex, setPostPageIndex] = useState(0);

  const postsPerPage = 10;



  // Users Management

  const [users, setUsers] = useState([]);

  const [usersSearch, setUsersSearch] = useState('');

  const [userPageIndex, setUserPageIndex] = useState(0);

  const usersPerPage = 10;



  // Blocked Users Management

  const [blockedUsers, setBlockedUsers] = useState([]);

  const [blockedUsersLoading, setBlockedUsersLoading] = useState(false);

  const [blockedUsersError, setBlockedUsersError] = useState('');



  // Volunteer Applications Management

  const [volunteerApplications, setVolunteerApplications] = useState([]);

  const [volunteerLoading, setVolunteerLoading] = useState(false);



  // Reports

  const [topPosts, setTopPosts] = useState([]);

  const [recentUsers, setRecentUsers] = useState([]);



  // Logs

  const [userLogs, setUserLogs] = useState([]);

  const [postLogs, setPostLogs] = useState([]);

  const [loginLogs, setLoginLogs] = useState([]);



  // ============ LOAD DATA ============

  useEffect(() => {

    loadAllData();

  }, []);



  // Load blocked users when tab is active

  useEffect(() => {

    if (activeTab === 'blocked') {

      fetchBlockedUsers();

    }

  }, [activeTab]);



  // Load volunteer applications when tab is active

  useEffect(() => {

    if (activeTab === 'volunteers') {

      fetchVolunteerApplications();

    }

  }, [activeTab]);



  const loadAllData = async () => {

    setLoading(true);

    setError('');

    try {

      // Get dashboard status

      const statsResponse = await adminApi.get('/Admin/GetDashBoardStatus');

      setStats({

        totalPosts: statsResponse.data.totalPost,

        totalUsers: statsResponse.data.totalUser,

        ageDistribution: [],

      });



      // Get user logs

      const userLogsRes = await adminApi.get('/Admin/GetUserLogs');

      setUserLogs(userLogsRes.data || []);



      // Get post logs

      const postLogsRes = await adminApi.get('/Admin/GetPostLogs');

      setPostLogs(postLogsRes.data || []);



      // Get login logs

      const loginLogsRes = await adminApi.get('/Admin/GetLoginOrRegisterLog');

      setLoginLogs(loginLogsRes.data || []);



      // Get posts

      const postsResponse = await adminApi.get('/Posts/Get All Posts');

      const realPosts = (postsResponse.data || []).map((post) => ({
        id: post.postID,
        title: post.postTitle,
        description: post.description,
        createdBy: post.authorName,
        userID: post.userID,        
        createdDate: post.publishDateTime,
        isLocked: post.status === 0,
        status: post.status === 1 ? 'Active' : 'Completed',
        feedbackCount: 0,
      }));

      setPosts(realPosts);

      const usersResponse = await adminApi.get('/Admin/GetAllUsres');
      const realUsers = (usersResponse.data || []).map(user => ({
        id: user.userID,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
        createdAt: user.createdAt,
      }));
      setUsers(realUsers);

    } catch (err) {

      setError('حدث خطأ في تحميل البيانات');

      console.error('Error loading admin data:', err);

    } finally {

      setLoading(false);

    }

  };



  const loadPosts = async () => {

    // هذه الدالة محفوظة للمستقبل عند ربطها بـ API الفعلي

    // حالياً يتم تحميل البيانات الوهمية من loadAllData

  };



  const generateAgeDistribution = (usersList) => {

    const distribution = {

      '18-25': 0,

      '26-35': 0,

      '36-45': 0,

      '46-55': 0,

      '56+': 0,

    };



    usersList.forEach((user) => {

      if (!user.age) return;

      if (user.age >= 18 && user.age <= 25) distribution['18-25']++;

      else if (user.age >= 26 && user.age <= 35) distribution['26-35']++;

      else if (user.age >= 36 && user.age <= 45) distribution['36-45']++;

      else if (user.age >= 46 && user.age <= 55) distribution['46-55']++;

      else distribution['56+']++;

    });



    return Object.entries(distribution).map(([range, count]) => ({

      range,

      count,

    }));

  };



  // ============ POSTS MANAGEMENT ============

  const handleDeletePost = async (postID) => {

    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;



    try {

      await adminApi.delete('/Posts/Delete Post', { params: { postID } });

      setPosts(posts.filter((p) => p.id !== postID));

      alert('تم حذف المنشور بنجاح');

    } catch (err) {

      alert('خطأ في حذف المنشور: ' + err.message);

    }

  };



  const handleUpdatePost = async (postID, updatedData) => {

    try {

      await postsAPI.updatePost(postID, updatedData);

      const updatedPosts = posts.map((p) =>

        p.id === postID ? { ...p, ...updatedData } : p

      );

      setPosts(updatedPosts);

      setEditingPost(null);

      alert('تم تحديث المنشور بنجاح');

    } catch (err) {

      alert('خطأ في تحديث المنشور: ' + err.message);

    }

  };



  const handleToggleUserAccount = async (userId, currentStatus) => {

    try {

      if (currentStatus) {

        // Block user

await adminApi.put('/Admin/BlockUser', null, { params: { UserID: userId } });
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u));

        alert('تم تعطيل حساب المستخدم بنجاح');

      } else {

        // Unblock user

        await adminApi.put('/Admin/UnBlockUser', null, { params: { UserID: userId } });

        setUsers(users.map(u => u.id === userId ? { ...u, isActive: true } : u));

        alert('تم تفعيل حساب المستخدم بنجاح');

      }

    } catch (err) {

      console.error('Error toggling user account:', err);

      alert('خطأ في تغيير حالة الحساب: ' + (err.response?.data?.message || err.message));

    }

  };



  // Blocked Users Functions

  const fetchBlockedUsers = async () => {
  setBlockedUsersLoading(true);
  setBlockedUsersError('');
  try {
    const response = await adminApi.get('/Admin/GetAllUsres');
    const allUsers = response.data || [];
    const blocked = allUsers
      .filter(user => user.isActive === false || user.isActive === 0)
      .map(user => ({
        id: user.userID,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      }));
    setBlockedUsers(blocked);
  } catch (err) {
    setBlockedUsersError('حدث خطأ في تحميل المستخدمين المحظورين');
    console.error('Error fetching blocked users:', err);
  } finally {
    setBlockedUsersLoading(false);
  }
};



  const handleUnblockUser = async (userId) => {

    if (!window.confirm('هل أنت متأكد من رفع الحظر عن هذا المستخدم؟')) return;



    try {

      await adminApi.put('/Admin/UnBlockUser', null, { params: { UserID: userId } });

      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));

      alert('تم رفع الحظر بنجاح');

    } catch (err) {

      console.error('Error unblocking user:', err);

      alert('خطأ في رفع الحظر: ' + (err.response?.data?.message || err.message));

    }

  };



  // Volunteer Applications Functions

const fetchVolunteerApplications = async () => {
  setVolunteerLoading(true);
  try {
    const response = await adminApi.get('/Volunteer/Get all Volunteer Applications');
    const applications = response.data || [];

    // Fetch the username for each application's userID in parallel.
    // If any individual lookup fails, fall back to showing the userID instead of crashing the whole list.
    const applicationsWithUsernames = await Promise.all(
      applications.map(async (app) => {
        try {
          const userRes = await adminApi.get('/User/Get User', {
            params: { userID: app.userID },
          });
          return { ...app, username: userRes.data?.username || `#${app.userID}` };
        } catch (err) {
          console.error(`Error fetching username for userID ${app.userID}:`, err);
          return { ...app, username: `#${app.userID}` };
        }
      })
    );

    setVolunteerApplications(applicationsWithUsernames);
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    alert('خطأ في تحميل طلبات التطوع');
  } finally {
    setVolunteerLoading(false);
  }
};




  const handleVolunteerResponse = async (volunteerApplicationID, isApproved) => {
  const action = isApproved ? 'قبول' : 'رفض';
  if (!window.confirm(`هل أنت متأكد من ${action} طلب التطوع؟`)) return;

  const adminID = getAdminIdFromToken();
  if (!adminID) {
    alert('تعذر تحديد هوية الأدمن، يرجى تسجيل الدخول مجدداً');
    return;
  }

  try {
    await adminApi.post('/Volunteer/Response To Volunteer Application', {
      volunteerApplicationID,
      adminID,
      isApproved
    });
    alert(`تم ${action} طلب التطوع بنجاح`);
    fetchVolunteerApplications();
  } catch (err) {
    console.error('Error responding to volunteer application:', err);
    alert('خطأ في معالجة الطلب: ' + (err.response?.data?.message || err.message));
  }
};







  const handleCompletePost = async (postID) => {

    try {

      await adminApi.post('/Posts/Complete Post', null, { params: { postID } });

      const updatedPosts = posts.map((p) =>

        p.id === postID ? { ...p, isLocked: true, status: 'Completed' } : p

      );

      setPosts(updatedPosts);

      alert('تم إكمال المنشور بنجاح');

    } catch (err) {

      alert('خطأ في إكمال المنشور: ' + err.message);

    }

  };



  const handleLockPost = async (postID) => {

    try {

      await adminApi.post('/Posts/Lock Post', null, { params: { postID } });

      const updatedPosts = posts.map((p) =>

        p.id === postID ? { ...p, isLocked: true } : p

      );

      setPosts(updatedPosts);

      alert('تم قفل المنشور بنجاح');

    } catch (err) {

      alert('خطأ في قفل المنشور: ' + err.message);

    }

  };



  const handleUnlockPost = async (postID) => {

    try {

      await postsAPI.unlockPost(postID);

      const updatedPosts = posts.map((p) =>

        p.id === postID ? { ...p, isLocked: false } : p

      );

      setPosts(updatedPosts);

      alert('تم فتح المنشور بنجاح');

    } catch (err) {

      alert('خطأ في فتح المنشور: ' + err.message);

    }

  };



  // ============ FILTERS & SEARCH ============
  const filteredPosts = posts
    .filter((post) => {
      if (postsFilter !== 'all') {
        if (postsFilter === 'active' && post.isLocked) return false;
        if (postsFilter === 'locked' && !post.isLocked) return false;
      }
      
      const searchUpdate = postsSearch.toLowerCase().trim();

      return (
        post.title?.toLowerCase().includes(searchUpdate) ||
        post.createdBy?.toLowerCase().includes(searchUpdate) ||
        post.userId?.toString().includes(searchUpdate) 
      );
    })

    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));



  const filteredUsers = users.filter((u) =>

    u.username?.toLowerCase().includes(usersSearch.toLowerCase()) ||

    u.email?.toLowerCase().includes(usersSearch.toLowerCase())

  );



  // Pagination

  const postsPages = Math.ceil(filteredPosts.length / postsPerPage);

  const currentPostsPage = filteredPosts.slice(

    postPageIndex * postsPerPage,

    (postPageIndex + 1) * postsPerPage

  );



  const usersPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsersPage = filteredUsers.slice(

    userPageIndex * usersPerPage,

    (userPageIndex + 1) * usersPerPage

  );



  // ============ RENDER FUNCTIONS ============



  // Statistics Section

  const renderStatistics = () => (

    <div className="space-y-6">

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-blue-100 text-sm">إجمالي المنشورات</p>

              <p className="text-4xl font-bold mt-2">{stats.totalPosts}</p>

            </div>

            <FileText size={40} className="opacity-80" />

          </div>

        </div>



        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-green-100 text-sm">إجمالي المستخدمين</p>

              <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>

            </div>

            <Users size={40} className="opacity-80" />

          </div>

        </div>

      </div>



      {/* Age Distribution Chart */}

      <div className="bg-white rounded-lg p-6 shadow-md">

        <div className="space-y-4">

          {stats.ageDistribution.map((item) => (

            <div key={item.range}>

              <div className="flex justify-between mb-1">

                <span className="text-sm font-medium text-gray-700">

                  {item.range} سنة

                </span>

                <span className="text-sm font-bold text-gray-900">

                  {item.count}

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">

                <div

                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"

                  style={{

                    width: `${

                      stats.ageDistribution.reduce((sum, a) => sum + a.count, 0) >

                      0

                        ? (item.count /

                            stats.ageDistribution.reduce(

                              (sum, a) => sum + a.count,

                              0

                            )) *

                          100

                        : 0

                    }%`,

                  }}

                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );



  // Posts Management Section

  const renderPostsManagement = () => (

    <div className="space-y-4">

      {/* Search and Filter */}

      <div className="bg-white rounded-lg p-4 shadow-md">

        <div className="flex flex-col md:flex-row gap-4 items-center">

          <div className="flex-1 relative">

            <Search className="absolute left-3 top-3 text-gray-400" size={20} />

            <input

              type="text"

              placeholder="ابحث عن منشور..."

              value={postsSearch}

              onChange={(e) => setPostsSearch(e.target.value)}

              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

            />

          </div>

          <select

            value={postsFilter}

            onChange={(e) => setPostsFilter(e.target.value)}

            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

          >

            <option value="all">جميع المنشورات</option>

            <option value="active">النشطة فقط</option>

            <option value="locked">المغلقة فقط</option>

          </select>

        </div>

      </div>



      {/* Posts Table */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">
                    المستخدم
                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  العنوان

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  صاحب المنشور

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  التاريخ

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  الحالة

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  الإجراءات

                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {currentPostsPage.length > 0 ? (

                currentPostsPage.map((post) => (

                  <tr key={post.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-gray-700">
                      {post.userID || '-'}
                    </td>

                    <td className="px-6 py-4 text-gray-900 font-medium">

                      {post.title}

                    </td>

                    <td className="px-6 py-4 text-gray-700">

                      {post.createdBy || 'مجهول'}

                    </td>

                    <td className="px-6 py-4 text-gray-700">

                      {new Date(post.createdDate).toLocaleDateString('ar-SA')}

                    </td>

                    <td className="px-6 py-4">

                      <span

                        className={`px-3 py-1 rounded-full text-xs font-semibold ${

                          post.isLocked

                            ? 'bg-red-100 text-red-800'

                            : 'bg-green-100 text-green-800'

                        }`}

                      >

                        {post.isLocked ? 'مغلق' : 'نشط'}

                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex gap-1 flex-wrap">

                        <button

                          onClick={() => handleDeletePost(post.id)}

                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"

                          title="حذف"

                        >

                          <Trash2 size={18} />

                        </button>

                        {!post.isLocked ? (

                          <>

                            <button

                              onClick={() => handleLockPost(post.id)}

                              className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600 hover:text-yellow-700"

                              title="قفل المنشور"

                            >

                              🔒

                            </button>

                          </>

                        ) : (

                          <button

                            onClick={() => handleUnlockPost(post.id)}

                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600 hover:text-purple-700"

                            title="فتح المنشور"

                          >

                            🔓

                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">

                    لا توجد منشورات

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>



        {/* Pagination */}

        {postsPages > 1 && (

          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">

            <button

              onClick={() => setPostPageIndex(Math.max(0, postPageIndex - 1))}

              disabled={postPageIndex === 0}

              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"

            >

              <ChevronLeft size={18} />

              السابق

            </button>

            <span className="text-gray-700">

              الصفحة {postPageIndex + 1} من {postsPages}

            </span>

            <button

              onClick={() =>

                setPostPageIndex(Math.min(postsPages - 1, postPageIndex + 1))

              }

              disabled={postPageIndex === postsPages - 1}

              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"

            >

              التالي

              <ChevronRight size={18} />

            </button>

          </div>

        )}

      </div>

    </div>

  );



  // Users Management Section

  const renderUsersManagement = () => (

    <div className="space-y-4">

      {/* Search */}

      <div className="bg-white rounded-lg p-4 shadow-md">

        <div className="relative">

          <Search className="absolute left-3 top-3 text-gray-400" size={20} />

          <input

            type="text"

            placeholder="ابحث عن مستخدم..."

            value={usersSearch}

            onChange={(e) => setUsersSearch(e.target.value)}

            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

          />

        </div>

      </div>



      {/* Users Table */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  اسم المستخدم

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  البريد الإلكتروني

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  الدور

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  الحالة

                </th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">

                  الإجراءات

                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {currentUsersPage.length > 0 ? (

                currentUsersPage.map((u) => (

                  <tr key={u.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-gray-900 font-medium">

                      {u.username}

                    </td>

                    <td className="px-6 py-4 text-gray-700">{u.email}</td>

                    <td className="px-6 py-4">

                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">

                        {u.role || 'مستخدم'}

                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span

                        className={`px-3 py-1 rounded-full text-xs font-semibold ${

                          u.isActive

                            ? 'bg-green-100 text-green-800'

                            : 'bg-red-100 text-red-800'

                        }`}

                      >

                        {u.isActive ? 'نشط' : 'معطل'}

                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <button

                        onClick={() => handleToggleUserAccount(u.id, u.isActive)}

                        className={`p-2 rounded-lg transition-colors ${

                          u.isActive

                            ? 'hover:bg-red-50 text-red-600'

                            : 'hover:bg-green-50 text-green-600'

                        }`}

                        title={

                          u.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'

                        }

                      >

                        {u.isActive ? (

                          <Eye size={18} />

                        ) : (

                          <EyeOff size={18} />

                        )}

                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">

                    لا يوجد مستخدمون

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>



        {/* Pagination */}

        {usersPages > 1 && (

          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">

            <button

              onClick={() => setUserPageIndex(Math.max(0, userPageIndex - 1))}

              disabled={userPageIndex === 0}

              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"

            >

              <ChevronLeft size={18} />

              السابق

            </button>

            <span className="text-gray-700">

              الصفحة {userPageIndex + 1} من {usersPages}

            </span>

            <button

              onClick={() =>

                setUserPageIndex(Math.min(usersPages - 1, userPageIndex + 1))

              }

              disabled={userPageIndex === usersPages - 1}

              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"

            >

              التالي

              <ChevronRight size={18} />

            </button>

          </div>

        )}

      </div>

    </div>

  );







  // User Logs

  const renderUserLogs = () => (

    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراء</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الوصف</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">التاريخ والوقت</th>

            </tr>

          </thead>

          <tbody className="divide-y">

            {userLogs.length > 0 ? (

              userLogs.map((log, idx) => (

                <tr key={idx} className="hover:bg-gray-50">

                  <td className="px-6 py-4 text-gray-900 font-medium">{log.action}</td>

                  <td className="px-6 py-4 text-gray-700">{log.targetDescription}</td>

                  <td className="px-6 py-4 text-gray-700">

                    {new Date(log.createdAt).toLocaleString('ar-SA')}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">

                  لا توجد سجلات مستخدمين

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );



  // Post Logs

  const renderPostLogs = () => (

    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراء</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الوصف</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">التاريخ والوقت</th>

            </tr>

          </thead>

          <tbody className="divide-y">

            {postLogs.length > 0 ? (

              postLogs.map((log, idx) => (

                <tr key={idx} className="hover:bg-gray-50">

                  <td className="px-6 py-4 text-gray-900 font-medium">{log.action}</td>

                  <td className="px-6 py-4 text-gray-700">{log.targetDescription}</td>

                  <td className="px-6 py-4 text-gray-700">

                    {new Date(log.createdAt).toLocaleString('ar-SA')}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">

                  لا توجد سجلات منشورات

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );



  // Login Logs

  const renderLoginLogs = () => (

    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراء</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">الوصف</th>

              <th className="px-6 py-3 text-right text-gray-700 font-semibold">التاريخ والوقت</th>

            </tr>

          </thead>

          <tbody className="divide-y">

            {loginLogs.length > 0 ? (

              loginLogs.map((log, idx) => (

                <tr key={idx} className="hover:bg-gray-50">

                  <td className="px-6 py-4 text-gray-900 font-medium">{log.action}</td>

                  <td className="px-6 py-4 text-gray-700">{log.targetDescription}</td>

                  <td className="px-6 py-4 text-gray-700">

                    {new Date(log.createdAt).toLocaleString('ar-SA')}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">

                  لا توجد سجلات دخول

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>  );



  // Blocked Users Section

  const renderBlockedUsers = () => (

    <div className="space-y-4">

      {blockedUsersError && (

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">

          <AlertCircle className="inline mr-2" size={20} />

          {blockedUsersError}

        </div>

      )}



      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">اسم المستخدم</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">البريد الإلكتروني</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">تاريخ الإنشاء</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراءات</th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {blockedUsersLoading ? (

                <tr>

                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">

                    جاري التحميل...

                  </td>

                </tr>

              ) : blockedUsers.length > 0 ? (

                blockedUsers.map((user) => (

                  <tr key={user.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-gray-900 font-medium">{user.username}</td>

                    <td className="px-6 py-4 text-gray-700">{user.email}</td>

                    <td className="px-6 py-4 text-gray-700">

                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : '-'}

                    </td>

                    <td className="px-6 py-4">

                      <button

                        onClick={() => handleUnblockUser(user.id)}

                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"

                      >

                        <CheckCircle size={18} />

                        رفع الحظر

                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">

                    لا يوجد مستخدمون محظورون

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );



  // Volunteer Applications Section

  const renderVolunteerApplications = () => (

    <div className="space-y-4">

      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">المستخدم</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الوصف</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الحالة</th>

                <th className="px-6 py-3 text-right text-gray-700 font-semibold">الإجراءات</th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {volunteerLoading ? (

                <tr>

                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">

                    جاري التحميل...

                  </td>

                </tr>

              ) : volunteerApplications.length > 0 ? (

                volunteerApplications.map((app) => (

                  <tr key={app.volunteerApplicationID} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-gray-900 font-medium">{app.username || '-'}</td>

                    <td className="px-6 py-4 text-gray-700">{app.description || '-'}</td>

                    <td className="px-6 py-4">

<span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    app.applicationStatus === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : app.applicationStatus === 'Approved'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }`}
>
  {app.applicationStatus === 'Pending'
    ? 'قيد الانتظار'
    : app.applicationStatus === 'Approved'
    ? 'مقبول'
    : 'مرفوض'}
</span>

                    </td>

                    <td className="px-6 py-4">

                      {app.applicationStatus === 'Pending' && (

                        <div className="flex gap-2">

                          <button

                            onClick={() => handleVolunteerResponse(app.volunteerApplicationID, true)}

                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"

                          >

                            <CheckCircle size={16} />

                            قبول

                          </button>

                          <button

                            onClick={() => handleVolunteerResponse(app.volunteerApplicationID, false)}

                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"

                          >

                            <XCircle size={16} />

                            رفض

                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">

                    لا توجد طلبات تطوع

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

  // ============ MAIN RENDER ============

  return (

    <div className="min-h-screen bg-gray-100" dir="rtl">

      {/* Header */}

      <div className="bg-white shadow-md sticky top-0 z-10">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>

            <p className="text-gray-600 mt-1">أهلاً {user?.username}</p>

          </div>

          <div className="flex items-center gap-2">

            <button

              onClick={() => navigate('/')}

              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"

              title="العودة إلى الصفحة الرئيسية"

            >

              <ArrowLeft size={20} />

              العودة للرئيسية

            </button>

            <button

              onClick={handleAdminLogout}

              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-medium"

              title="تسجيل خروج الآدمن"

            >

              تسجيل خروج الآدمن

            </button>

          </div>

        </div>

      </div>



      {/* Error Message */}

      {error && (

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded relative">

          <AlertCircle className="inline mr-2" size={20} />

          {error}

        </div>

      )}



      {/* Main Content */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Tabs */}

        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg p-2 shadow-md">

          <button

            onClick={() => setActiveTab('stats')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'stats'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            <BarChart3 className="inline mr-2" size={18} />

            الإحصائيات

          </button>

          <button

            onClick={() => setActiveTab('posts')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'posts'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            <FileText className="inline mr-2" size={18} />

            إدارة المنشورات

          </button>

          <button

            onClick={() => setActiveTab('users')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'users'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            <Users className="inline mr-2" size={18} />

            إدارة المستخدمين

          </button>

          <button

            onClick={() => setActiveTab('blocked')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'blocked'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            <ShieldX className="inline mr-2" size={18} />

            المحظورون

          </button>

          <button

            onClick={() => setActiveTab('volunteers')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'volunteers'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            <HeartHandshake className="inline mr-2" size={18} />

            طلبات التطوع

          </button>

          <button

            onClick={() => setActiveTab('userLogs')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'userLogs'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            سجل المستخدمين

          </button>

          <button

            onClick={() => setActiveTab('postLogs')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'postLogs'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            سجل المنشورات

          </button>

          <button

            onClick={() => setActiveTab('loginLogs')}

            className={`px-4 py-2 rounded-lg font-medium transition-colors ${

              activeTab === 'loginLogs'

                ? 'bg-blue-500 text-white'

                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            }`}

          >

            سجل الدخول

          </button>

        </div>



        {/* Tab Content */}

        {loading ? (

          <div className="py-8">

            <CardSkeleton count={3} />

          </div>

        ) : (

          <>

            {activeTab === 'stats' && renderStatistics()}

            {activeTab === 'posts' && renderPostsManagement()}

            {activeTab === 'users' && renderUsersManagement()}

            {activeTab === 'blocked' && renderBlockedUsers()}

            {activeTab === 'volunteers' && renderVolunteerApplications()}

            {activeTab === 'userLogs' && renderUserLogs()}

            {activeTab === 'postLogs' && renderPostLogs()}

            {activeTab === 'loginLogs' && renderLoginLogs()}

          </>

        )}

      </div>

    </div>

  );

};



export default Admin;

