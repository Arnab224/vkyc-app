import { CheckCircle, ImageIcon, Check, X } from "lucide-react";
import SessionNotes from "./SessionNotes";

const KYCPanel = ({
  kycStatus,
  setKycStatus,
  currentStep,
  setCurrentStep,
  notes,
  setNotes,
  showNotes,
  setShowNotes,
  handleNextStep,
  screenshot,
  
}) => {
  const kycSteps = [
    "Identity Verification",
    "Document Review",
    "Address Verification",
    "Aadhar Check",
    "Final Approval",
  ];

  const handleFinalApproval = (approved) => {
    if (approved) {
      setKycStatus("completed");
    } else {
      setKycStatus("failed");
    }
  };

  const isFinalApprovalStep = currentStep === 5;
  const shouldShowScreenshot = !isFinalApprovalStep;

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        
        {/* KYC Status */}
        <div className="flex justify-between mb-3">
          <h2 className="text-lg text-white">KYC Status</h2>
          <div
            className={`px-3 py-1 rounded-full text-xs ${
              kycStatus === "completed"
                ? "bg-green-900 text-green-300"
                : kycStatus === "failed"
                ? "bg-red-900 text-red-300"
                : "bg-yellow-900 text-yellow-300"
            }`}
          >
            {kycStatus}
          </div>
        </div>

        {/* KYC Steps */}
        {kycSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i + 1 < currentStep
                  ? "bg-green-600 text-white"
                  : i + 1 === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`${
                i + 1 <= currentStep ? "text-white" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}

        {shouldShowScreenshot && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 mb-2">Screenshot Preview:</h3>
            {screenshot ? (
              <img
                src={screenshot}
                alt="Screenshot"
                className="w-full h-auto border border-gray-600 rounded"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 text-sm p-4 border border-gray-700 rounded bg-gray-700/20">
                <ImageIcon className="w-6 h-6 mb-2" />
                No screenshot captured yet
              </div>
            )}
          </div>
        )}

        {/* Final Approval Section */}
        {isFinalApprovalStep && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-300 mb-3">Final Approval Decision:</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleFinalApproval(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Successful
              </button>
              <button
                onClick={() => handleFinalApproval(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded text-white flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Unsuccessfull
              </button>
            </div>
          </div>
        )}

        {!isFinalApprovalStep && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="flex-1 bg-gray-700 py-2 rounded text-white disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === 5}
              className="flex-1 bg-blue-600 py-2 rounded text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <SessionNotes
        notes={notes}
        setNotes={setNotes}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
    </div>
  );
};

export default KYCPanel;