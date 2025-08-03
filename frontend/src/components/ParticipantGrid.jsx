import ParticipantView from "./ParticipantView";
import { Video } from "lucide-react";

const ParticipantGrid = ({ participants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {participants.length === 0 ? (
        <div className="bg-gray-800 rounded-lg flex flex-col items-center justify-center h-full text-gray-400">
          <Video className="w-16 h-16 mb-4" />
          <p>Waiting for participants...</p>
        </div>
      ) : (
        participants.map(p => <ParticipantView key={p.identity} participant={p} />)
      )}
    </div>
  );
};

export default ParticipantGrid;