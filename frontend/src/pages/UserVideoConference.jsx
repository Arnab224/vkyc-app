import { useLocation, useNavigate } from "react-router-dom";
import VideoConferenceRoom from "../components/VideoConferenceRoom";

const UserVideoConference = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomName, participantName } = location.state || {};

  if (!roomName || !participantName) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-600">Missing room or participant information</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <VideoConferenceRoom roomName={roomName} participantName={participantName} />;
};

export default UserVideoConference;