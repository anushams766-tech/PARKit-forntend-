import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  Video, 
  Camera, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  Layers, 
  Save, 
  Download,
  Wifi,
  WifiOff,
  Crosshair,
  Settings
} from 'lucide-react';

export default function LiveCameraPage({ onOpenSimulator, onSelectSlotForOverride }) {
  const { 
    activeSlots, 
    activeLocation, 
    camera, 
    setCamera, 
    recalibrateCamera,
    showToast
  } = useParkit();

  const [streamUrlInput, setStreamUrlInput] = useState(camera.streamUrl);
  const [sensitivityThreshold, setSensitivityThreshold] = useState(70);
  const [temporalSmoothing, setTemporalSmoothing] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const handleSaveStreamConfig = (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    setTimeout(() => {
      setCamera(prev => ({ ...prev, streamUrl: streamUrlInput, lastSeenAt: new Date().toISOString() }));
      setIsSavingConfig(false);
      showToast(`Camera stream URL updated: ${streamUrlInput}`);
    }, 400);
  };

  const handleCaptureScreenshot = () => {
    showToast(`Snapshot saved: miniature_lot_${Date.now()}.png (PRD Stage 5)`);
  };

  const isOnline = camera.connectionStatus === 'ONLINE' && !camera.isStale;

  return (
    <div className="space-y-6">
      
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isOnline ? 'Active Stream' : 'Connection Check Required'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">{camera.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Live Camera Feed & Slot Calibration
          </h1>
          <p className="text-xs text-slate-400">
            OpenCV top-down miniature monitoring, bay polygon alignment, and real-time detection inference.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSimulator}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Launch Simulator</span>
          </button>

          <button
            onClick={recalibrateCamera}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recalibrate Empty Baseline</span>
          </button>
        </div>
      </div>

      {/* Main Video Stream Monitor */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2 font-mono text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FEED: {camera.streamUrl}</span>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showPolygons}
                onChange={(e) => setShowPolygons(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Polygons</span>
            </label>

            <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={temporalSmoothing}
                onChange={(e) => setTemporalSmoothing(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Temporal Filter</span>
            </label>

            <button
              onClick={handleCaptureScreenshot}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1"
              title="Save current frame screenshot"
            >
              <Download className="h-3 w-3 text-emerald-400" />
              <span>Snapshot</span>
            </button>
          </div>
        </div>

        {/* Stream Canvas */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-2xl">
          
          {/* Simulated camera feed canvas */}
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
            {/* Top-down miniature asphalt lot styling */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900"></div>

            {/* Parking line grid texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Parking Bays Overlay P1..P6 */}
            <div className="relative w-full h-full p-6 sm:p-10 grid grid-cols-3 grid-rows-2 gap-4 sm:gap-6">
              {activeSlots.map((slot) => {
                const isEmpty = slot.status === 'EMPTY';
                const isOccupied = slot.status === 'OCCUPIED';
                const color = isEmpty ? 'emerald' : isOccupied ? 'rose' : 'amber';

                return (
                  <div
                    key={slot.id}
                    onClick={() => onSelectSlotForOverride && onSelectSlotForOverride(slot)}
                    className={`relative rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between p-3 sm:p-4 backdrop-blur-xs ${
                      showPolygons
                        ? isEmpty
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                          : isOccupied
                          ? 'border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-500/10'
                          : 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                        : 'border-transparent bg-slate-900/30'
                    }`}
                  >
                    {/* Slot Code Header */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-black text-white ${
                        isEmpty ? 'bg-emerald-600' : isOccupied ? 'bg-rose-600' : 'bg-amber-600'
                      }`}>
                        {slot.slotCode}
                      </span>

                      <span className="text-[11px] font-mono font-bold bg-slate-900/90 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700">
                        {(slot.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Vehicle Indicator */}
                    <div className="text-center my-auto">
                      {isOccupied && (
                        <div>
                          <Car className="h-10 w-10 text-rose-400 mx-auto animate-pulse" />
                          <span className="text-[11px] font-bold text-white block mt-1">{slot.vehicleType || "Toy Vehicle"}</span>
                        </div>
                      )}
                      {isEmpty && (
                        <div className="text-center">
                          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto opacity-70 mb-1" />
                          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">EMPTY BAY</span>
                        </div>
                      )}
                      {slot.status === 'UNCERTAIN' && (
                        <div className="text-center">
                          <AlertCircle className="h-8 w-8 text-amber-400 mx-auto animate-bounce mb-1" />
                          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">UNCERTAIN</span>
                        </div>
                      )}
                    </div>

                    {/* Coordinates hint */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>4-point polygon</span>
                      <span>Click to override</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OSD Telemetry Display (On-screen display) */}
          <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 font-mono text-xs text-slate-200 flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE CV INFERENCE</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>CAM: {camera.id}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-300">{camera.fps} FPS</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{camera.latencyMs} ms</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">Smoothing: {temporalSmoothing ? 'ON' : 'OFF'}</span>
          </div>

          {/* Empty Reference Calibrated badge */}
          <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 font-mono text-[11px] text-slate-300">
            Reference Baseline: <strong className="text-emerald-400">Calibrated</strong> ({new Date(camera.lastCalibrationAt).toLocaleTimeString()})
          </div>
        </div>

        {/* Stream Configuration & Sensitivity Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Stream URL Config */}
          <form onSubmit={handleSaveStreamConfig} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <label className="block text-xs font-semibold text-slate-200">
              Camera RTSP / HTTP Video Stream URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={streamUrlInput}
                onChange={(e) => setStreamUrlInput(e.target.value)}
                placeholder="http://192.168.1.105:8080/video"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-3 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shrink-0 flex items-center space-x-1"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Configure smartphone camera stream via IP Webcam or local laptop camera feed.
            </p>
          </form>

          {/* Detection Sensitivity Slider */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Detection Confidence Threshold</span>
              <span className="font-mono text-emerald-400 font-bold">{sensitivityThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={sensitivityThreshold}
              onChange={(e) => setSensitivityThreshold(e.target.value)}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50% (Permissive)</span>
              <span>70% (PRD Baseline)</span>
              <span>95% (Strict)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bays Table & Inspection */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Configured Parking Bays (P1 - P6)</h3>
            <p className="text-xs text-slate-400">Per-slot OpenCV detection status, confidence score, and audit overrides.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{activeSlots.length} bays monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Slot Code</th>
                <th className="py-2.5 px-3">Live Status</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Vehicle / Observation</th>
                <th className="py-2.5 px-3">Last Detection</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {activeSlots.map((slot) => {
                const isEmpty = slot.status === 'EMPTY';
                const isOccupied = slot.status === 'OCCUPIED';

                return (
                  <tr key={slot.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {slot.slotCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isEmpty 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : isOccupied 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {(slot.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">
                      {slot.vehicleType || "None"}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {new Date(slot.lastUpdatedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => onSelectSlotForOverride && onSelectSlotForOverride(slot)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors"
                      >
                        Override Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
