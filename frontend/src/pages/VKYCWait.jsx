import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const VKYCWait = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAccepted = () => {
      navigate("/vkyc-video");
    };

    socket.on("vkyc_accepted", handleAccepted);

    return () => {
      socket.off("vkyc_accepted", handleAccepted);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h2 className="text-2xl font-bold">Waiting for Admin to Accept VKYC...</h2>
      <p className="text-gray-600">Please stay on this page. You'll be redirected when the admin accepts your request.</p>
    </div>
  );
};

export default VKYCWait;
