import { Camera, AlertTriangle } from 'lucide-react';
import { CAMERA_STATUS } from '../../utils/constants';
import { formatRelativeTime, isDataStale } from '../../utils/dateHelpers';

export default function CameraStatus({ camera }) {
  if (!camera) {
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>No camera detection feed registered for this bay.</span>
      </div>
    );
  }

  const isConnected = camera.status === CAMERA_STATUS.CONNECTED;
  const stale = isDataStale(camera.lastDetection);

  return (
    <div className={`p-4 rounded-xl border text-xs transition-colors ${
      stale
        ? 'bg-amber-50 border-amber-300 text-amber-900'
        : isConnected
        ? 'bg-white border-[#E2E8F0] text-[#172554]'
        : 'bg-rose-50 border-rose-300 text-rose-900'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <Camera className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#163A70]">
                Overhead Camera: {camera.id || 'CV-Sensor #1'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {camera.status}
              </span>
            </div>

            <p className="text-[11px] text-[#64748B] mt-0.5">
              Last detection: <strong className="text-[#172554]">{formatRelativeTime(camera.lastDetection)}</strong>
              {camera.confidenceScore && ` • Vision confidence: ${(camera.confidenceScore * 100).toFixed(0)}%`}
            </p>
          </div>
        </div>

        <span className="text-[10px] text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded-lg border border-[#BFDBFE] font-bold">
          Mysore CV Pipeline
        </span>
      </div>

      {/* Freshness Warning Banner */}
      {stale && (
        <div className="mt-2.5 pt-2 border-t border-amber-200 flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>
            <strong>Warning: Detection data is stale (&gt;90s).</strong> Camera stream may have latency. Please verify bay availability visually upon arrival.
          </span>
        </div>
      )}
    </div>
  );
}
