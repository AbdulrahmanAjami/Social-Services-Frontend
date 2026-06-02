import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { postsAPI, userAPI } from './api';
import { CardSkeleton } from './components/Skeleton';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ADMIN_USERNAME = 'aboodajami';

  // ============ STATE MANAGEMENT ============
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============ CHECK AUTHORIZATION ============
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || userData.username !== ADMIN_USERNAME) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      navigate('/', { replace: true });
    }
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

  // Reports
  const [topPosts, setTopPosts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // ============ LOAD DATA ============
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      // حمل المستخدمين أولاً
      const dummyUsers = [
        {
          id: 1,
          username: 'aboodajami',
          email: 'abood@example.com',
          role: 'Admin',
          isActive: true,
          age: 28,
          joinedDate: '2023-01-15',
        },
        {
          id: 2,
          username: 'ahmad_ali',
          email: 'ahmad@example.com',
          role: 'User',
          isActive: true,
          age: 24,
          joinedDate: '2024-01-10',
        },
        {
          id: 3,
          username: 'fatima_hassan',
          email: 'fatima@example.com',
          role: 'User',
          isActive: true,
          age: 31,
          joinedDate: '2023-06-20',
        },
        {
          id: 4,
          username: 'mohammed_khalil',
          email: 'mohammad@example.com',
          role: 'User',
          isActive: false,
          age: 45,
          joinedDate: '2023-03-05',
        },
        {
          id: 5,
          username: 'sara_mahmoud',
          email: 'sara@example.com',
          role: 'User',
          isActive: true,
          age: 22,
          joinedDate: '2024-02-14',
        },
        {
          id: 6,
          username: 'ali_hassan',
          email: 'ali@example.com',
          role: 'User',
          isActive: true,
          age: 35,
          joinedDate: '2023-11-22',
        },
        {
          id: 7,
          username: 'leila_karim',
          email: 'leila@example.com',
          role: 'User',
          isActive: true,
          age: 26,
          joinedDate: '2024-01-18',
        },
        {
          id: 8,
          username: 'omar_saleh',
          email: 'omar@example.com',
          role: 'User',
          isActive: true,
          age: 29,
          joinedDate: '2023-09-11',
        },
      ];
      setUsers(dummyUsers);

      // حمل المنشورات
      await loadPosts();

      // حساب الإحصائيات
      const dummyPosts = [
        {
          id: 1,
          title: 'التطوع في حملة البيئة',
          description: 'نحتاج متطوعين للمشاركة في حملة تنظيف البيئة',
          createdBy: 'ahmad_ali',
          createdDate: '2024-04-20T10:30:00',
          isLocked: false,
          feedbackCount: 12,
          status: 'Active',
        },
        {
          id: 2,
          title: 'مساعدة العائلات المحتاجة',
          description: 'برنامج مساعدة شهري للعائلات في المناطق النائية',
          createdBy: 'fatima_hassan',
          createdDate: '2024-04-18T14:15:00',
          isLocked: false,
          feedbackCount: 28,
          status: 'Active',
        },
        {
          id: 3,
          title: 'تعليم الأطفال في المدارس الريفية',
          description: 'مشروع تطوعي لتحسين التعليم في المناطق الريفية',
          createdBy: 'ali_hassan',
          createdDate: '2024-04-15T09:20:00',
          isLocked: true,
          feedbackCount: 8,
          status: 'Completed',
        },
        {
          id: 4,
          title: 'مشروع الرعاية الصحية',
          description: 'فحوصات صحية مجانية للمجتمع',
          createdBy: 'sara_mahmoud',
          createdDate: '2024-04-12T11:45:00',
          isLocked: false,
          feedbackCount: 19,
          status: 'Active',
        },
        {
          id: 5,
          title: 'مبادرة تعليم اللغات الأجنبية',
          description: 'تعليم اللغة الإنجليزية والفرنسية للبالغين',
          createdBy: 'leila_karim',
          createdDate: '2024-04-10T16:30:00',
          isLocked: false,
          feedbackCount: 2,
          status: 'Active',
        },
        {
          id: 6,
          title: 'برنامج تطوير المهارات',
          description: 'دورات تدريبية في المهارات الحياتية والعملية',
          createdBy: 'omar_saleh',
          createdDate: '2024-04-08T13:00:00',
          isLocked: false,
          feedbackCount: 22,
          status: 'Active',
        },
        {
          id: 7,
          title: 'حملة جمع التبرعات',
          description: 'جمع تبرعات لدعم المشاريع الخيرية',
          createdBy: 'ahmad_ali',
          createdDate: '2024-04-05T10:00:00',
          isLocked: true,
          feedbackCount: 10,
          status: 'Completed',
        },
        {
          id: 8,
          title: 'مشروع الشباب والتوظيف',
          description: 'توفير فرص تدريب وتوظيف للشباب العاطلين',
          createdBy: 'fatima_hassan',
          createdDate: '2024-04-02T15:20:00',
          isLocked: false,
          feedbackCount: 5,
          status: 'Active',
        },
        {
          id: 9,
          title: 'برنامج الرعاية الاجتماعية',
          description: 'دعم الأسر ذات الدخل المنخفض',
          createdBy: 'ali_hassan',
          createdDate: '2024-03-30T12:10:00',
          isLocked: false,
          feedbackCount: 15,
          status: 'Active',
        },
        {
          id: 10,
          title: 'مبادرة نظافة المدن',
          description: 'حملة شاملة لنظافة وتحسين المدن',
          createdBy: 'sara_mahmoud',
          createdDate: '2024-03-25T08:45:00',
          isLocked: false,
          feedbackCount: 7,
          status: 'Active',
        },
      ];

      setStats({
        totalPosts: dummyPosts.length,
        totalUsers: dummyUsers.length,
        ageDistribution: generateAgeDistribution(dummyUsers),
      });

      // عيّن المنشورات الوهمية
      setPosts(dummyPosts);

      // أكثر المنشورات تفاعلاً
      const sortedByFeedback = [...dummyPosts]
        .sort((a, b) => (b.feedbackCount || 0) - (a.feedbackCount || 0))
        .slice(0, 5);
      setTopPosts(sortedByFeedback);

      // آخر المستخدمين المسجلين
      const recentUsersList = [...dummyUsers]
        .sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate))
        .slice(0, 5);
      setRecentUsers(recentUsersList);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error(err);
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
      await postsAPI.deletePost(postID);
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
    // سيتم تنفيذ عند توفر API
    alert('سيتم تنفيذ هذه الميزة عند توفر API');
  };

  const handleCompletePost = async (postID) => {
    try {
      await postsAPI.completePost(postID);
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
      await postsAPI.lockPost(postID);
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
      return (
        post.title?.toLowerCase().includes(postsSearch.toLowerCase()) ||
        post.description?.toLowerCase().includes(postsSearch.toLowerCase())
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          توزيع أعمار المستخدمين
        </h3>
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
                          onClick={() => setEditingPost(post.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
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
                            <button
                              onClick={() => handleCompletePost(post.id)}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600 hover:text-green-700"
                              title="إكمال المنشور"
                            >
                              ✓
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

  // Reports Section
  const renderReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Posts */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <TrendingUp size={22} className="text-blue-600" />
          أكثر المنشورات تفاعلاً
        </h3>
        <div className="space-y-3">
          {topPosts.length > 0 ? (
            topPosts.map((post, idx) => (
              <div
                key={post.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {post.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {post.createdBy || 'مجهول'}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-semibold">
                  <MessageSquare size={16} />
                  {post.feedbackCount || 0}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              لا توجد منشورات
            </p>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Users size={22} className="text-green-600" />
          آخر المستخدمين المسجلين
        </h3>
        <div className="space-y-3">
          {recentUsers.length > 0 ? (
            recentUsers.map((u, idx) => (
              <div
                key={u.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {u.username}
                  </p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Calendar size={16} className="text-gray-400" />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              لا يوجد مستخدمون جدد
            </p>
          )}
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
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            title="العودة إلى الصفحة الرئيسية"
          >
            <ArrowLeft size={20} />
            العودة للرئيسية
          </button>
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
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="inline mr-2" size={18} />
            التقارير
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
            {activeTab === 'reports' && renderReports()}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
