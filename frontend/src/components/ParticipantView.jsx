import { useRef, useEffect } from "react";
import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

const ParticipantView = ({ participant }) => {
  const videoRef = useRef(null);
  const videoTrack = useTracks([Track.Source.Camera], { onlySubscribed: false }).find(t => t.participant.identity === participant.identity);
  const audioTrack = useTracks([Track.Source.Microphone], { onlySubscribed: false }).find(t => t.participant.identity === participant.identity);

  useEffect(() => {
    if (videoTrack?.publication?.videoTrack && videoRef.current) {
      const el = videoTrack.publication.videoTrack.attach();
      Object.assign(el.style, { width: "100%", height: "100%", objectFit: "cover" });
      videoRef.current.appendChild(el);
      return () => {
        videoTrack.publication.videoTrack.detach(el);
        el.remove();
      };
    }
  }, [videoTrack]);

  useEffect(() => {
    if (audioTrack?.publication?.audioTrack) {
      const el = audioTrack.publication.audioTrack.attach();
      document.body.appendChild(el);
      return () => {
        audioTrack.publication.audioTrack.detach(el);
        el.remove();
      };
    }
  }, [audioTrack]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden">
      {videoTrack?.publication.isSubscribed ? (
        <div ref={videoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">Camera off</div>
      )}
    </div>
  );
};

export default ParticipantView;