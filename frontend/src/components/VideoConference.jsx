import { useParticipants, useTracks } from "@livekit/components-react";
import { Shield, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import ParticipantGrid from "./ParticipantGrid";
import CallControls from "./CallControls";
import KYCPanel from "./KYCPanel";
import { Track } from "livekit-client";
import { useLocalParticipant } from "@livekit/components-react";

const determineCleanRole = (userRole, identity) => {
  if (userRole?.toLowerCase() === "admin") return "admin";
  if (identity?.toLowerCase().includes("admin") || identity?.toLowerCase().includes("agent")) return "admin";
  if (window.location.pathname.includes("/admin")) return "admin";
  return "user";
};

const VideoConference = ({ onEndCall, userRole, identity }) => {
  const participants = useParticipants();
  const tracks = useTracks();
  const localParticipant = useLocalParticipant();
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [kycStatus, setKycStatus] = useState("in-progress");
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  const role = determineCleanRole(userRole, identity);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCaptureScreenshot = async () => {
    try {
      let videoTrack = null;

      console.log("All tracks:", tracks);
      console.log("Current identity:", identity);
      console.log("Current role:", role);
      console.log("All participants:", participants);

      if (role === 'admin') {
        let userVideoTracks = tracks.filter(track =>
          track.source === Track.Source.Camera &&
          track.participant?.identity !== identity
        );

        console.log("User video tracks (approach 1):", userVideoTracks);

        if (userVideoTracks.length === 0) {
          userVideoTracks = tracks.filter(track =>
            track.source === Track.Source.Camera &&
            !track.participant?.identity?.toLowerCase().includes('admin') &&
            !track.participant?.identity?.toLowerCase().includes('agent')
          );
          console.log("User video tracks (approach 2):", userVideoTracks);
        }

        if (userVideoTracks.length === 0) {
          const nonAdminParticipants = participants.filter(p =>
            determineCleanRole(null, p.identity) !== 'admin'
          );
          console.log("Non-admin participants:", nonAdminParticipants);

          if (nonAdminParticipants.length > 0) {
            userVideoTracks = tracks.filter(track =>
              track.source === Track.Source.Camera &&
              track.participant?.identity === nonAdminParticipants[0].identity
            );
            console.log("User video tracks (approach 3):", userVideoTracks);
          }
        }

        if (userVideoTracks.length === 0) {
          userVideoTracks = tracks.filter(track =>
            track.source === Track.Source.Camera
          );
          if (userVideoTracks.length > 1) {
            userVideoTracks = userVideoTracks.slice(1);
          }
          console.log("User video tracks (approach 4):", userVideoTracks);
        }

        if (userVideoTracks.length > 0) {
          videoTrack = userVideoTracks[0].track;
          console.log("Selected video track:", videoTrack);
        }
      } else {
        const videoTracks = tracks.filter(track => track.source === Track.Source.Camera);
        if (videoTracks.length > 0) {
          videoTrack = videoTracks[0].track;
        }
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (videoTrack) {
        console.log("Capturing from video track:", videoTrack);
        const videoElement = document.createElement('video');
        videoElement.srcObject = new MediaStream([videoTrack.mediaStreamTrack]);
        videoElement.muted = true;
        videoElement.playsInline = true;

        await new Promise((resolve, reject) => {
          videoElement.onloadedmetadata = () => {
            videoElement.play().then(resolve).catch(reject);
          };
          videoElement.onerror = reject;
        });

        await new Promise(resolve => setTimeout(resolve, 200));

        canvas.width = videoElement.videoWidth || 640;
        canvas.height = videoElement.videoHeight || 480;
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        videoElement.pause();
        videoElement.srcObject = null;
      } else {
        console.log("No video track found, trying DOM elements");

        const videoElements = document.querySelectorAll('video');
        let capturedFromDOM = false;

        console.log("Found video elements:", videoElements.length);

        if (role === 'admin' && videoElements.length > 1) {
          for (let i = 1; i < videoElements.length; i++) {
            const videoEl = videoElements[i];
            if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
              canvas.width = videoEl.videoWidth;
              canvas.height = videoEl.videoHeight;
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              capturedFromDOM = true;
              console.log("Captured from DOM video element:", i);
              break;
            }
          }
        } else {
          for (let videoEl of videoElements) {
            if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
              canvas.width = videoEl.videoWidth;
              canvas.height = videoEl.videoHeight;
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              capturedFromDOM = true;
              console.log("Captured from DOM video element");
              break;
            }
          }
        }

        if (!capturedFromDOM) {
          canvas.width = 640;
          canvas.height = 480;
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(role === 'admin' ? 'No User Video Available' : 'No Video Available', canvas.width/2, canvas.height/2 - 40);
          ctx.font = '16px Arial';
          ctx.fillStyle = '#9ca3af';
          ctx.fillText('Screenshot captured at: ' + new Date().toLocaleTimeString(), canvas.width/2, canvas.height/2 + 20);
          ctx.fillStyle = '#6b7280';
          ctx.font = '12px Arial';
          ctx.fillText('Call Duration: ' + String(Math.floor(callDuration / 60)).padStart(2, "0") + ':' + String(callDuration % 60).padStart(2, "0"), canvas.width/2, canvas.height/2 + 60);
        }
      }

      const imgData = canvas.toDataURL("image/png");
      setScreenshot(imgData);

      if (videoTrack) {
        alert(role === 'admin' ? "User's video screenshot captured successfully!" : "Screenshot captured successfully from video track!");
      } else if (document.querySelectorAll('video').length > 0) {
        alert("Screenshot captured from available video element!");
      } else {
        alert(role === 'admin' ? "No user video available - placeholder screenshot created!" : "No video available - placeholder screenshot created!");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Screenshot Error', canvas.width/2, canvas.height/2 - 20);
      ctx.font = '14px Arial';
      ctx.fillText('Captured at: ' + new Date().toLocaleTimeString(), canvas.width/2, canvas.height/2 + 20);
      const imgData = canvas.toDataURL("image/png");
      setScreenshot(imgData);
      alert("Error occurred but placeholder screenshot created!");
    }
  };

  const handleNextStep = () => {
    if (kycStatus !== "final-approved" && !screenshot) {
      alert("Please capture a screenshot before proceeding to the next KYC step.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    setScreenshot(null);
  };

  const handleAdminEndCall = () => {
    const callData = {
      callSummary: {
        totalDuration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
        status: kycStatus,
        kycStep: currentStep,
      },
    };

    const notification = {
      type: "CALL_ENDED_BY_ADMIN",
      callData,
    };

    localStorage.setItem("callEndedNotification", JSON.stringify(notification));
    window.dispatchEvent(new CustomEvent("callEndedByAdmin", { detail: notification }));

    setTimeout(() => {
      onEndCall();
    }, 500);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-semibold text-white">VKYC Verification Call</h1>
          <span className="text-xs text-gray-400">(Role: {role} | ID: {identity})</span>
          <div className="flex items-center gap-2 text-gray-300 ml-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {String(Math.floor(callDuration / 60)).padStart(2, "0")}:
              {String(callDuration % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-red-400">Recording</span>
            </div>
          )}
          <Users className="w-4 h-4" />
          <span className="text-sm">{participants.length} participants</span>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-4 flex flex-col">
          <ParticipantGrid participants={participants} />
          <CallControls 
            onEndCall={role === "admin" ? handleAdminEndCall : onEndCall}
            isRecording={isRecording}
            toggleRecording={() => setIsRecording((prev) => !prev)}
            userRole={role}
            captureScreenshot={handleCaptureScreenshot}
            kycStatus={kycStatus}
          />
        </div>

        {role === "admin" && (
          <KYCPanel
            kycStatus={kycStatus}
            setKycStatus={setKycStatus}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            notes={notes}
            setNotes={setNotes}
            showNotes={showNotes}
            setShowNotes={setShowNotes}
            handleNextStep={handleNextStep}
            screenshot={screenshot}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default VideoConference;