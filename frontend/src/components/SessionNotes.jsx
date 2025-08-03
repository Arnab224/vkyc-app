import { useState } from "react";
import { FileText } from "lucide-react";

const SessionNotes = ({ notes, setNotes }) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between mb-3">
        <h3 className="text-white">Session Notes</h3>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-gray-400 hover:text-white"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
      {showNotes && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded text-white"
        />
      )}
    </div>
  );
};

export default SessionNotes;