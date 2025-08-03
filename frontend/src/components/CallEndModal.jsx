import { CheckCircle } from "lucide-react";

const CallEndModal = ({ callData, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Call Completed</h2>
          <p className="text-gray-300 mb-6">
            The verification call has been completed by the admin.
            {callData && (
              <span className="block mt-2 text-sm">
                Duration: {callData.callSummary?.totalDuration}<br />
                Status: {callData.callSummary?.status}<br />
                Last Step: {callData.callSummary?.kycStep}
              </span>
            )}
          </p>
          <button onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallEndModal;