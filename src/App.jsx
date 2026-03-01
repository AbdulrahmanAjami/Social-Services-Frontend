import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import HomePage from "./Mainpage.jsx";
import Services from "./Services.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Profile from "./Profile.jsx";
import MyApplications from "./MyApplications.jsx";
import TeamMembers from './TeamMembers';
import Contact from './contactus.jsx';
import VolunteerOfTheMonth from './Volunteerofthemonth.jsx';
import VisionMission from './Visionmission.jsx';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about/team" element={<TeamMembers />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/VolunteerOfTheMonth" element={<VolunteerOfTheMonth/>} />
          <Route path="/VisionMission" element={<VisionMission/>} />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;