// src/video-conferencing/UserVideoLobby.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserVideoLobby = () => {
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomName || !name) return alert("Enter room and name");
    navigate("/video/meeting", { state: { roomName, participantName: name } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-semibold">Join a Meeting</h1>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Join
      </button>
    </div>
  );
};

export default UserVideoLobby;