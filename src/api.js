import axios from 'axios';

// إنشاء axios instance مع base URL (مع /api)
const api = axios.create({
  baseURL: 'https://localhost:7244/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// إنشاء axios instance بدون /api في الـ baseURL
const apiBase = axios.create({
  baseURL: 'https://localhost:7244',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 🔐 INTERCEPTORS FOR API
// ============================================

// Interceptor للطلبات - إضافة JWT token تلقائياً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      params: config.params,
      hasToken: !!token,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': config.headers.Authorization ? 'Bearer ***' : 'None'
      }
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor للاستجابات - معالجة الأخطاء
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });
    
    // إذا كان الخطأ 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// 🔐 INTERCEPTORS FOR API BASE
// ============================================

// Interceptor للطلبات - إضافة JWT token تلقائياً
apiBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Base Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      params: config.params,
      hasToken: !!token,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': config.headers.Authorization ? 'Bearer ***' : 'None'
      }
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor للاستجابات - معالجة الأخطاء
apiBase.interceptors.response.use(
  (response) => {
    console.log('📥 API Base Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url
    });
    return response;
  },
  (error) => {
    console.error('❌ API Base Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });
    
    // إذا كان الخطأ 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// 🔐 AUTHENTICATION ENDPOINTS
// ============================================

export const authAPI = {
  register: (username, email, password) => 
    api.post('/Authentication/Register', { username, email, password }),
  
  login: (username, password) => 
    api.post('/Authentication/Login', { username, password }),
  
  refreshToken: (refreshToken) => 
    api.post('/Authentication/RefreshToken', { refreshToken }),
};

// ============================================
// 🌍 CITIES & COUNTIES ENDPOINTS
// ============================================

export const citiesAPI = {
  getCityName: (cityID) => 
    api.get(`/CitiesCounties/Get City Name`, { params: { cityID } }),
  
  getCountiesInCity: (cityID) => 
    api.get(`/CitiesCounties/Get Counties In City`, { params: { cityID } }),
  
  getAllCounties: () => 
    api.get(`CitiesCounties/Get All Counties`),
  
  getAllCities: () => 
    api.get(`CitiesCounties/Get All Cities`),
};

// ============================================
// ⭐ FEEDBACK ENDPOINTS
// ============================================

export const feedbackAPI = {
  createFeedback: (postID, rating, comment) => 
    api.post('/Feedback/Create', { postID, rating, comment }),
  
  getFeedbacksAppliedByUser: (username) => 
    api.post('/Feedback/Get Feedbacks Applied By User', { username }),
  
  getFeedbacksForUser: (username) => 
    api.post('/Feedback/Get Feedbacks For User', { username }),
  
  getUserAverageRating: (username) => 
    api.post('/Feedback/Get User Average Rating', { username }),
};

// ============================================
// 📝 POSTS ENDPOINTS
// ============================================

export const postsAPI = {
  getAllPosts: () => 
    api.get('/Posts/Get All Posts'),
  
  createPost: (postData) => 
    api.post('/Posts/Create Post', postData),
  
  deletePost: (postID) => 
    api.delete('/Posts/Delete Post', { params: { postID } }),
  
  updatePost: (postIDOrPayload, postData) => {
    const payload =
      typeof postIDOrPayload === 'object' && postIDOrPayload !== null && postData === undefined
        ? postIDOrPayload
        : { postID: postIDOrPayload, ...postData };
    return api.put('/Posts/Update Post', payload);
  },
  
  getUserPosts: (username) => 
    api.get('/Posts/Get User Posts Post', { params: { username } }),
  
  getMyPosts: () => 
    api.get('/Posts/Get My Posts'),
  
  getFilteredPosts: (filters = {}) => 
    api.get('/Posts/Get Filtered Posts', { params: filters }),
  
  completePost: (postID) => 
    api.post('/Posts/Complete Post', null, { params: { postID } }),
  
  lockPost: (postID) =>
    api.post('/Posts/Lock Post', null, { params: { postID } }),

  unlockPost: (postID) =>
    api.post('/Posts/Unlock Post', null, { params: { postID } }),
};

// ============================================
// 💼 SERVICES ENDPOINTS
// ============================================

export const servicesAPI = {
  createServiceApplication: (postID, description = null) => 
    api.post('/Services/Create Service Application', { postID, description }),
  
  getServiceApplicationsForPost: (postID) => 
    api.get('/Services/Get Service Applications for Post', { params: { postID } }),
  
  getServiceApplicationsForUser: (username) => 
    api.get('/Services/Get Service Applications for User', { params: { username } }),
  
  acceptService: (applicationID, message = null) => 
    api.post(`/Services/Accept Service?serviceApplicationID=${applicationID}&AcceptanceMessage=${encodeURIComponent(message || '')}`),
  
  rejectService: (applicationID, message = null) => 
    api.post(`/Services/Reject Service?serviceApplicationID=${applicationID}&AcceptanceMessage=${encodeURIComponent(message || '')}`),
  
  deleteServiceApplication: (applicationID) => 
    api.delete('/Services/Delete Service Application', { params: { applicationID } }),
};

// ============================================
// 👤 USER ENDPOINTS
// ============================================

export const userAPI = {
  deleteUser: () => 
    api.delete('/User/Delete User'),
  
  logoutEverywhere: () => 
    api.delete('/User/Logout Everywhere'),
  
  updatePersonalDetails: (userData) => 
    api.patch('/User/Update Personal Details', userData),
  
  updatePassword: (currentPassword, newPassword) => 
    api.patch('/User/Update User Password', { currentPassword, newPassword }),
  
  // الطريقة 1: GET /User/Get User بدون parameters
  getUser: () => 
    api.get('/User/Get User'),
  
  // الطريقة 2: GET /User/GetUser?username=xxx
  getUserByUsername: (username) => 
    api.get('/User/GetUser', { params: { username } }),
  
  // الطريقة 3: GET /User/Get User?userID=xxx
  getUserByUserID: (userID) => 
    api.get('/User/Get User', { params: { userID } }),
  
  // الطريقة 4: POST مع username في body
  getUserByUsernamePost: (username) => 
    api.post('/User/Get User', { username }),
};

export default api;
export { apiBase };
