import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  X, 
  CheckCircle2, 
  Car, 
  RotateCcw, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function ManualStatusChangeModal({ spot, onClose }) {
  const { updateSpotStatus } = useParkit();

  const [selectedStatus, setSelectedStatus] = useState(spot ? spot.status : 'AVAILABLE');
  const [reason, setReason] = useState('');

  if (!spot) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateSpotStatus(spot.id, selectedStatus, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Change Status: {spot.spotNumber}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a new status for this parking space.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Camera Reading Badge */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
          <span className="text-gray-600 font-medium">Current Camera Reading:</span>
          <span className="px-2 py-0.5 rounded font-bold bg-gray-200 text-gray-800 uppercase text-[11px]">
            {spot.cameraReading}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Options: Available, Parked, Reset to Camera */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Option 1: Available */}
              <button
                type="button"
                onClick={() => setSelectedStatus('AVAILABLE')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'AVAILABLE'
                    ? 'bg-green-50 border-green-500 text-green-800 ring-2 ring-green-200 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <span className="text-xs block">Available</span>
                <span className="text-[10px] text-gray-400 font-normal">Empty bay</span>
              </button>

              {/* Option 2: Parked */}
              <button
                type="button"
                onClick={() => setSelectedStatus('PARKED')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'PARKED'
                    ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-200 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Car className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <span className="text-xs block">Parked</span>
                <span className="text-[10px] text-gray-400 font-normal">Occupied</span>
              </button>

              {/* Option 3: Reset to Camera */}
              <button
                type="button"
                onClick={() => setSelectedStatus('RESET_TO_CAMERA')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'RESET_TO_CAMERA'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-200 font-bold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <RotateCcw className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <span className="text-xs block">Reset</span>
                <span className="text-[10px] text-gray-400 font-normal">Use camera</span>
              </button>

            </div>
          </div>

          {/* Optional Reason Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Verified empty by staff inspection"
              className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick Reason Suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-gray-400 self-center">Quick options:</span>
            {[
              "Verified empty in person",
              "Toy car parked in bay",
              "Lighting shadow / glare",
              "Bay reserved"
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setReason(preset)}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Buttons: Cancel & Save */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Save Status
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
