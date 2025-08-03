import { useEffect, useState } from "react";
import { Phone, PhoneCall, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

import socket from "../socket";

const AdminDashboard = () => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    acceptedCalls: 0,
    pendingCalls: 0,
    rejectedCalls: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`);
      const data = await res.json();
      setCallStats({
        totalCalls: data.totalCalls,
        acceptedCalls: data.acceptedCalls,
        pendingCalls: data.pendingCalls,
        rejectedCalls: data.rejectedCalls,
      });
      setRecentActivities(data.recentActivities);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  fetchStats();

  socket.on("vkyc_notification", (callData) => {
    setIncomingCall({
      ...callData,
      timestamp: new Date().toISOString(),
    });
    fetchStats();
  });

  return () => socket.off("vkyc_notification");
}, []);

  const handleAccept = () => {
    if (incomingCall?.userSocketId) {
      socket.emit("vkyc_accept", { userSocketId: incomingCall.userSocketId });
      window.open("/admin/vkyc-room", "_blank");
    
      setRecentActivities(prev => [{
        action: "Call Accepted",
        user: incomingCall.name || "Unknown User",
        time: "Just now",
        status: "success"
      }, ...prev.slice(0, 9)]);
      
      setIncomingCall(null);
      
      
      setCallStats(prev => ({
        ...prev,
        acceptedCalls: prev.acceptedCalls + 1,
        pendingCalls: Math.max(0, prev.pendingCalls - 1)
      }));
    } else {
      alert("No valid VKYC request to accept.");
    }
  };

  const handleReject = () => {
    if (incomingCall?.userSocketId) {
      socket.emit("vkyc_reject", { userSocketId: incomingCall.userSocketId });
      
      // Add to recent activities
      setRecentActivities(prev => [{
        action: "Call Rejected",
        user: incomingCall.name || "Unknown User",
        time: "Just now",
        status: "error"
      }, ...prev.slice(0, 9)]);
      
      setIncomingCall(null);
      
      // Update stats
      setCallStats(prev => ({
        ...prev,
        rejectedCalls: prev.rejectedCalls + 1,
        pendingCalls: Math.max(0, prev.pendingCalls - 1)
      }));
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">VKYC Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Phone} 
            label="Total Calls" 
            value={callStats.totalCalls}
            color="blue"
          />
          <StatCard 
            icon={CheckCircle} 
            label="Accepted" 
            value={callStats.acceptedCalls}
            color="green"
          />
          <StatCard 
            icon={Clock} 
            label="Pending" 
            value={callStats.pendingCalls}
            color="yellow"
          />
          <StatCard 
            icon={AlertCircle} 
            label="Rejected" 
            value={callStats.rejectedCalls}
            color="red"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Incoming VKYC Requests</h2>
          </div>
          
          <div className="p-6">
            {incomingCall ? (
              <div className="relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg animate-pulse"></div>
                
                {/* Call notification */}
                <div className="relative bg-white rounded-lg border-2 border-blue-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <PhoneCall className="h-6 w-6 text-blue-600 animate-bounce" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Incoming VKYC Call
                        </h3>
                        <p className="text-sm text-gray-600">
                          New verification request received
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(incomingCall.timestamp)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {incomingCall.userId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Customer Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {incomingCall.name || "Unknown User"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">Socket ID</p>
                        <p className="text-sm font-mono text-gray-900">
                          {incomingCall.userSocketId?.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAccept}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Accept Call</span>
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>Reject Call</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Requests
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  All VKYC requests have been processed. The system is ready to receive new verification calls.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action} - {activity.user}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;