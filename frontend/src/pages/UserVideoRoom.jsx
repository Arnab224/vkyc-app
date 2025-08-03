import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import VideoConference from "../components/VideoConference";

const UserVideoRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomName, participantName } = location.state || {};

  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomName || !participantName) {
      setError("Missing room or participant info.");
      return;
    }

    const fetchToken = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/video-call/usertoken`,
          { roomName, participantName }
        );
        setToken(response.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
        setError("Failed to fetch token. Please try again.");
      }
    };

    fetchToken();
  }, [roomName, participantName]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (!token) {
    return (
      <p className="text-center mt-10 text-lg text-gray-700">Connecting to room...</p>
    );
  }

  return (
    <div className="h-screen">
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        connect
        audio
        video
      >
        <VideoConference
          identity={participantName}
          userRole="user"
          onEndCall={() => navigate("/user/dashboard")}
        />
      </LiveKitRoom>
    </div>
  );
};

export default UserVideoRoom;