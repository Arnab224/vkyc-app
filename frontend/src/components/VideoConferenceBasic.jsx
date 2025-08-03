import { useTracks, useParticipants, useLocalParticipant } from "@livekit/components-react";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import ParticipantGrid from "./ParticipantGrid";
import CallControls from "./CallControls";

const VideoConferenceBasic = ({ onEndCall, identity }) => {
  const tracks = useTracks();
  const participants = useParticipants();
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">Video Conference Room</h1>
          <span className="text-xs text-gray-400">(ID: {identity})</span>
          <div className="flex items-center gap-2 text-gray-300 ml-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {String(Math.floor(callDuration / 60)).padStart(2, "0")}:
              {String(callDuration % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          <Users className="w-4 h-4" />
          <span className="text-sm">{participants.length} participants</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <ParticipantGrid participants={participants} />
        <CallControls onEndCall={onEndCall} />
      </div>
    </div>
  );
};

export default VideoConferenceBasic;