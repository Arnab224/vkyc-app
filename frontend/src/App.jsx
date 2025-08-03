import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import VideoConferencing from "./pages/VideoConferencing";
import VKYCUpload from "./pages/VKYCUpload";
import VKYCWait from "./pages/VKYCWait";
import VKYCVideo from "./pages/VKYCVideo";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVKYCVideo from "./pages/AdminVKYCVideo";
import Profile from "./pages/Profile";
import AdminRegister from "./pages/AdminRegister";
import UserVideoLobby from "./video-conferencing/UserVideoLobby";
import UserVideoMeeting from "./video-conferencing/UserVideoMeeting";
import UserVideoRoom from "./pages/UserVideoRoom";
const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/user/login", "/user/register", "/admin/login"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

// Protect user routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />


          {/* Protected User Routes */}
          <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/video/lobby" element={<UserVideoLobby />} />
<Route path="/video/meeting" element={<UserVideoMeeting />} />
<Route path="/user-video-call-room" element={<UserVideoRoom />} />
          <Route path="/video-conferencing" element={<PrivateRoute><VideoConferencing /></PrivateRoute>} />
          <Route path="/vkyc-upload" element={<PrivateRoute><VKYCUpload /></PrivateRoute>} />
          <Route path="/vkyc-wait" element={<PrivateRoute><VKYCWait /></PrivateRoute>} />
          <Route path="/vkyc-video" element={<PrivateRoute><VKYCVideo /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/vkyc-room" element={<PrivateRoute><AdminVKYCVideo /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
