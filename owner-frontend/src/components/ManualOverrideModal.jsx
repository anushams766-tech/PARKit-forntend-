import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Car, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export default function ManualOverrideModal({ slot, onClose }) {
  const { overrideSlot, currentUser } = useParkit();
  const [selectedStatus, setSelectedStatus] = useState(slot ? slot.status : 'EMPTY');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!slot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A valid audit reason is required for manual overrides.');
      return;
    }

    overrideSlot(slot.id, selectedStatus, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Manual Slot Status Override</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono font-bold text-emerald-400 border border-slate-700">
                  {slot.slotCode}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Authorized override bypasses OpenCV inference and logs an immutable audit trail entry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Current CV Status</span>
            <span className="font-bold text-white font-mono">{slot.status}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Detection Confidence</span>
            <span className="font-bold text-emerald-400 font-mono">{(slot.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Override Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select New Overridden Status
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              
              <button
                type="button"
                onClick={() => setSelectedStatus('EMPTY')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'EMPTY'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-2 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs block">EMPTY</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('OCCUPIED')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'OCCUPIED'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold ring-2 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Car className="h-5 w-5 mx-auto mb-1 text-rose-400" />
                <span className="text-xs block">OCCUPIED</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('UNCERTAIN')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedStatus === 'UNCERTAIN'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-2 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <AlertCircle className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">UNCERTAIN</span>
              </button>

            </div>
          </div>

          {/* Reason Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Audit Reason / Justification <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={3}
              placeholder="e.g. Physical check verified toy car removed from slot P2. Glare/shadow caused false positive."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {error && (
              <p className="text-[11px] text-rose-400 mt-1 font-medium">{error}</p>
            )}
          </div>

          {/* Quick preset reasons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 mr-1 self-center">Quick presets:</span>
            {[
              "Physically verified empty",
              "Toy car parked in bay",
              "Lighting shadow interference",
              "Slot maintenance / reserved"
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setReason(preset)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Actor Info */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Logging Administrator: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">Immutable Log</span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              Confirm & Save Override
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
