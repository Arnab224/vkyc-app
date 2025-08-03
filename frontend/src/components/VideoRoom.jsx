import { useEffect, useState, useRef } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import axios from "axios";
import { determineUserRole } from "./RoleUtils";
import VideoConference from "./VideoConference";
import CallEndModal from "./CallEndModal";


const VideoRoom = ({ roomName, identity, onDisconnected, userRole }) => {
  const [token, setToken] = useState(null);
  const [showCallEndModal, setShowCallEndModal] = useState(false);
  const [finalCallData, setFinalCallData] = useState(null);
  const currentRoleRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/call/token`, { params: { roomName, identity } });
        setToken(res.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };
    fetchToken();
  }, [roomName, identity]);

  useEffect(() => {
    const currentRole = determineUserRole(userRole, identity);
    currentRoleRef.current = currentRole;

    if (currentRole === "admin") return;

    const showCallEndNotification = (callData) => {
      console.log("Showing call end notification:", callData);
      setFinalCallData(callData);
      setShowCallEndModal(true);
    };

    const handleStorageChange = (e) => {
      if (e.key === "callEndedNotification" && e.newValue) {
        try {
          const notificationData = JSON.parse(e.newValue);
          if (notificationData.type === "CALL_ENDED_BY_ADMIN") {
            showCallEndNotification(notificationData.callData);
          }
        } catch (error) {
          console.error("Error parsing notification data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check existing notification in case user opened tab after admin ended
    const existingNotification = localStorage.getItem("callEndedNotification");
    if (existingNotification) {
      try {
        const notificationData = JSON.parse(existingNotification);
        if (notificationData.type === "CALL_ENDED_BY_ADMIN") {
          showCallEndNotification(notificationData.callData);
        }
      } catch (error) {
        console.error("Error parsing existing notification data:", error);
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userRole, identity]);

  const handleDisconnection = () => {
    const detectedRole = currentRoleRef.current || determineUserRole(userRole, identity);

    setTimeout(() => {
      if (!showCallEndModal) {
        console.log("Handling disconnection for role:", detectedRole);
        onDisconnected?.();
        window.location.href = detectedRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      }
    }, 1000);
  };

  const handleUserDashboardRedirect = () => {
    console.log("Redirecting to user dashboard");
    localStorage.removeItem("callEndedNotification");
    setShowCallEndModal(false);
    onDisconnected?.();
    window.location.href = "/user/dashboard";
  };

  if (!token) {
    return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Joining...</div>;
  }

  return (
    <>
      {showCallEndModal && (
        <CallEndModal callData={finalCallData} onConfirm={handleUserDashboardRedirect} />
      )}
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        onDisconnected={handleDisconnection}
        connect
        audio
        video
      >
        
        <VideoConference onEndCall={handleDisconnection} userRole={userRole} identity={identity} />
      </LiveKitRoom>
    </>
  );
};

export default VideoRoom;