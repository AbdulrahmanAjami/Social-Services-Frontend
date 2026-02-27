import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, Trash2, Clock, CheckCircle, XCircle, Home } from 'lucide-react';
import { useAuth } from './AuthContext';

const API_BASE_URL = 'https://localhost:7244/api';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (user && accessToken) {
      fetchMyApplications();
    }
  }, [user, accessToken]);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Services/my-applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch applications');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!selectedApp) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/Services/${selectedApp.serviceApplicationID}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setApplications(applications.filter(app => app.serviceApplicationID !== selectedApp.serviceApplicationID));
        setShowDeleteModal(false);
        setSelectedApp(null);
        alert('✅ تم حذف الطلب بنجاح');
      } else {
        alert('❌ فشل حذف الطلب');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'قيد المراجعة', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> },
      1: { label: 'مقبول', color: 'bg-green-500', icon: <CheckCircle className="w-4 h-4" /> },
      2: { label: 'مرفوض', color: 'bg-red-500', icon: <XCircle className="w-4 h-4" /> }
    };

    const { label, color, icon } = statusMap[status] || statusMap[0];

    return (
      <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
        {icon}
        {label}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-6">الرجاء تسجيل الدخول</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* HEADER */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-all"
              >
                <Home className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">طلباتي</h1>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
            <p className="mt-6 text-white text-lg">جاري التحميل...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-600 text-7xl mb-6">📋</div>
            <p className="text-slate-400 text-xl mb-6">لم تقدم على أي خدمات بعد</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold transition-all"
            >
              تصفح الخدمات
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.serviceApplicationID}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {app.postTitle || 'خدمة'}
                    </h3>
                    {app.description && (
                      <p className="text-slate-400 mb-3">{app.description}</p>
                    )}
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>📅 {new Date(app.ApplyDateTime).toLocaleDateString('ar-JO')}</span>
                      <span>👤 {app.postOwnerName || 'صاحب الخدمة'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                    {app.status === 0 && (
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-8 text-center border border-slate-700">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">تأكيد الحذف</h2>
            <p className="text-slate-400 mb-8">
              هل أنت متأكد من حذف هذا الطلب؟<br />
              لن تتمكن من التراجع عن هذا الإجراء
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteApplication}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {loading ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedApp(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold transition-all"
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

export default MyApplications;