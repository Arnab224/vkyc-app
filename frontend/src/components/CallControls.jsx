import { Mic, MicOff, Video, VideoOff, PhoneOff, Camera } from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";
import { useState, useEffect } from "react";

const CallControls = ({ onEndCall, isRecording, toggleRecording, userRole, captureScreenshot, kycStatus }) => {
  const { localParticipant } = useLocalParticipant();
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  
  useEffect(() => {
    if (localParticipant && !isInitialized) {
      
      setIsAudioEnabled(localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(localParticipant.isCameraEnabled);
      setIsInitialized(true);
    } else if (localParticipant && isInitialized) {
      
      setIsAudioEnabled(localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(localParticipant.isCameraEnabled);
    }
  }, [localParticipant, localParticipant?.isMicrophoneEnabled, localParticipant?.isCameraEnabled, isInitialized]);

  const toggleAudio = async () => {
    if (localParticipant) {
      try {
        const newState = !localParticipant.isMicrophoneEnabled;
        await localParticipant.setMicrophoneEnabled(newState);
        setIsAudioEnabled(newState);
      } catch (error) {
        console.error("Error toggling microphone:", error);
      }
    }
  };

  const toggleVideo = async () => {
    if (localParticipant) {
      try {
        const newState = !localParticipant.isCameraEnabled;
        await localParticipant.setCameraEnabled(newState);
        setIsVideoEnabled(newState);
      } catch (error) {
        console.error("Error toggling camera:", error);
      }
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-center gap-4">
      <button 
        onClick={toggleAudio} 
        className={`p-3 rounded-full transition-colors ${
          isAudioEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isAudioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
      </button>
      
      <button 
        onClick={toggleVideo} 
        className={`p-3 rounded-full transition-colors ${
          isVideoEnabled ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {isVideoEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
      </button>
      
      <button 
        onClick={toggleRecording} 
        className={`p-3 rounded-full transition-colors ${
          isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        <div className="w-4 h-4 bg-white rounded-sm" />
      </button>
      
      {userRole === "admin" && kycStatus !== "final-approved" && (
        <button 
          onClick={captureScreenshot} 
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
      )}
      
      <button 
        onClick={onEndCall} 
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
      >
        <PhoneOff className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default CallControls;