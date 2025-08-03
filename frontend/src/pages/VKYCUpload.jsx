import { useState } from "react";
import { Upload, FileText, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";

const VKYCUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a document");

    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/kyc/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      socket.emit("vkyc_request", {
        userSocketId: socket.id,
        name: "User",
      });

      alert("Document uploaded successfully. VKYC request sent.");
      navigate("/vkyc-wait");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video KYC Verification
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your identity document to begin the verification process
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />

              {!file ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    Drop your document here
                  </p>
                  <p className="text-gray-500 mb-4">or click to browse files</p>
                  <p className="text-sm text-gray-400">
                    Supports PDF, JPEG, PNG files up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatFileSize(file.size)}
                  </p>
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Ready to upload</span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="mt-8">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full flex items-center justify-center px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                  uploading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading Document...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload & Start VKYC
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Secure Document Upload
                  </h3>
                  <p className="text-xs text-gray-600">
                    Your documents are encrypted and processed securely. We comply with industry standards for data protection and privacy.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Steps Instructions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <p className="text-sm text-gray-600">Upload your ID document</p>
          </div>
          <div className="text-center p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <p className="text-sm text-gray-600">Wait for verification call</p>
          </div>
          <div className="text-center p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold text-sm">3</span>
            </div>
            <p className="text-sm text-gray-600">Complete video verification</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VKYCUpload;