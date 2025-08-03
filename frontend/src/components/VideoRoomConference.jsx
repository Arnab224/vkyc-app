import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import axios from "axios";
import VideoConference from "./VideoConference";

const VideoConferenceRoom = ({ roomName, participantName }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/video-call/usertoken`, {
          roomName,
          participantName,
        });
        setToken(res.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    getToken();
  }, [roomName, participantName]);

  if (!token) {
    return <div className="text-center text-white mt-20">Getting token...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      connect
      audio
      video
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default VideoConferenceRoom;