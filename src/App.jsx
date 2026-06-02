import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ArrowUp } from 'lucide-react';
import { AuthProvider, useAuth } from "./AuthContext";
import HomePage from "./Mainpage.jsx";
import Posts from "./Posts.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Profile from "./Profile.jsx";
import MyApplications from "./MyApplications.jsx";
import TeamMembers from './TeamMembers';
import MapPage from './MapPage.jsx';
import Contact from './contactus.jsx';
import VolunteerOfTheMonth from './Volunteerofthemonth.jsx';
import VisionMission from './Visionmission.jsx';
import Admin from './Admin.jsx';

// Protected Route - يسمح لأي مستخدم مسجل دخول
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route - يسمح فقط للمسؤول المحدد
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  const ADMIN_USERNAME = 'aboodajami';
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const userData = JSON.parse(user);
    if (userData.username !== ADMIN_USERNAME) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about/team" element={<Navigate to="/about/partners" replace />} />
          <Route path="/about/partners" element={<TeamMembers />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/VolunteerOfTheMonth" element={<VolunteerOfTheMonth/>} />
          <Route path="/VisionMission" element={<VisionMission/>} />
          <Route path="/map" element={<MapPage/>} />

          {/* Protected Routes */}
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
        </Routes>

        <button
          type="button"
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300/40 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;