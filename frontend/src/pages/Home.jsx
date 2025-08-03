import { useState } from "react";
import { Sun, Moon, Shield, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-black text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className="text-xl font-semibold">VKYC Platform</span>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo Section */}
        <div className={`mb-8 p-8 rounded-2xl transition-all duration-300 ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'
        }`}>
          <Shield className={`w-20 h-20 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>

        {/* Title Section */}
        <div className="text-center mb-12 max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to VKYC Platform
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Secure and reliable identity verification system
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Please select your login type to continue
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* User Login */}
          <button
            onClick={() => navigate("/user/login")}
            className={`group p-8 rounded-xl transition-all duration-200 hover:scale-105 ${
              isDark 
                ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 transition-all duration-200 ${
                isDark ? 'bg-blue-900/50 group-hover:bg-blue-800/50' : 'bg-blue-50'
              }`}>
                <Users className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Login</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Access your personal verification dashboard
              </p>
            </div>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/admin/login")}
            className={`group p-8 rounded-xl transition-all duration-200 hover:scale-105 ${
              isDark 
                ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 transition-all duration-200 ${
                isDark ? 'bg-green-900/50 group-hover:bg-green-800/50' : 'bg-green-50'
              }`}>
                <Settings className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Login</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage system settings and user accounts
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className={`mt-16 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-sm">
            Powered by secure verification technology
          </p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;