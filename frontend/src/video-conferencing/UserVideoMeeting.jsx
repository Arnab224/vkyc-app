import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";

const UserVideoMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomName, participantName } = location.state || {};
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!roomName || !participantName) {
      alert("Missing room or name");
      navigate("/dashboard");
      return;
    }

    const fetchToken = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/call/token", {
          roomName,
          participantName,
        });
        setToken(response.data.token);
      } catch (error) {
        console.error("Error fetching token", error);
      }
    };

    fetchToken();
  }, [roomName, participantName]);

  if (!token) return <p className="text-center mt-10">Connecting to LiveKit...</p>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    />
  );
};

export default UserVideoMeeting;