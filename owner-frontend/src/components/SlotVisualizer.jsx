import React, { useState } from 'react';
import { 
  Car, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  SlidersHorizontal, 
  Maximize2, 
  RefreshCw,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { useParkit } from '../context/ParkitContext';

export default function SlotVisualizer({ onSelectSlotForOverride }) {
  const { 
    activeSlots, 
    activeLocation, 
    camera, 
    recalibrateCamera, 
    occupancyPercentage,
    emptySlotsCount,
    occupiedSlotsCount,
    uncertainSlotsCount
  } = useParkit();

  const [viewMode, setViewMode] = useState('diagram'); // 'diagram' | 'camera_overlay'
  const [showConfidence, setShowConfidence] = useState(true);

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Miniature Parking Bays (Physical Model)</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {activeLocation?.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time computer vision inference mapped to bays P1 through P6. Click any bay for manual override.
          </p>
        </div>

        {/* View toggles & Recalibration */}
        <div className="flex items-center space-x-2">
          
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'diagram'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1">
                <Layers className="h-3 w-3" />
                <span>Bays Grid</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('camera_overlay')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'camera_overlay'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center space-x-1">
                <Camera className="h-3 w-3" />
                <span>OpenCV Feed</span>
              </span>
            </button>
          </div>

          {/* Confidence toggle */}
          <button
            onClick={() => setShowConfidence(!showConfidence)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
              showConfidence 
                ? 'bg-slate-800 border-slate-700 text-emerald-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Toggle Confidence Scores"
          >
            %{showConfidence ? ' On' : ' Off'}
          </button>

          {/* Quick Recalibrate Action */}
          <button
            onClick={recalibrateCamera}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="Capture empty reference baseline"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Recalibrate</span>
          </button>

        </div>
      </div>

      {/* Main Visualizer Canvas */}
      {viewMode === 'diagram' ? (
        /* Bays Grid Mode: 2 rows of 3 slots (P1-P3, P4-P6) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeSlots.map((slot) => {
              const isEmpty = slot.status === 'EMPTY';
              const isOccupied = slot.status === 'OCCUPIED';
              const isUncertain = slot.status === 'UNCERTAIN';

              return (
                <div
                  key={slot.id}
                  onClick={() => onSelectSlotForOverride && onSelectSlotForOverride(slot)}
                  className={`group relative cursor-pointer rounded-xl p-4 transition-all duration-200 border transform hover:-translate-y-0.5 hover:shadow-xl ${
                    isEmpty
                      ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400/80 shadow-emerald-500/5'
                      : isOccupied
                      ? 'bg-rose-950/25 border-rose-500/40 hover:border-rose-400/80 shadow-rose-500/5'
                      : 'bg-amber-950/25 border-amber-500/50 hover:border-amber-400/80 shadow-amber-500/5'
                  }`}
                >
                  {/* Top Bar inside Slot Card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black tracking-tight text-white font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {slot.slotCode}
                      </span>
                      {slot.manualOverride && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                          Manual Override
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                      isEmpty
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isOccupied
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                    }`}>
                      {isEmpty ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>EMPTY</span>
                        </>
                      ) : isOccupied ? (
                        <>
                          <Car className="h-3 w-3" />
                          <span>OCCUPIED</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>UNCERTAIN</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Center Visual Graphic */}
                  <div className={`h-24 rounded-lg flex flex-col items-center justify-center p-2 border-2 border-dashed transition-colors ${
                    isEmpty
                      ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400/60'
                      : isOccupied
                      ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                      : 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                  }`}>
                    {isEmpty ? (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Available</span>
                        <span className="text-[10px] text-slate-400">Ready for vehicle</span>
                      </div>
                    ) : isOccupied ? (
                      <div className="text-center">
                        <Car className="h-8 w-8 mx-auto text-rose-400 mb-1" />
                        <span className="text-xs font-bold text-white block">{slot.vehicleType || "Toy Vehicle"}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <AlertCircle className="h-7 w-7 mx-auto text-amber-400 mb-1" />
                        <span className="text-xs font-semibold text-amber-300 block">Ambiguous Detection</span>
                        <span className="text-[10px] text-slate-400">Below confidence threshold</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Stats & Confidence */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div>
                      {showConfidence && (
                        <span>
                          Confidence: <strong className="text-slate-200">{(slot.confidence * 100).toFixed(0)}%</strong>
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      {new Date(slot.lastUpdatedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Hover Hint */}
                  <div className="absolute inset-x-0 bottom-1 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] bg-slate-950/90 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 shadow">
                      Click to override status
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Driveway Lane Indicator */}
          <div className="relative py-2 text-center border-y border-dashed border-slate-800">
            <span className="px-3 py-1 bg-slate-950 text-[10px] font-mono uppercase tracking-widest text-slate-400 rounded-full border border-slate-800">
              Miniature Parking Lot Two-Way Drive Lane (Roadway Axis)
            </span>
          </div>
        </div>
      ) : (
        /* OpenCV Camera Overlay View */
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
          
          {/* Simulated live video stream background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
            {/* Camera grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Radar scanner sweep */}
            <div className="absolute h-96 w-96 rounded-full border border-emerald-500/10 flex items-center justify-center">
              <div className="h-64 w-64 rounded-full border border-emerald-500/20 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full border border-emerald-500/30"></div>
              </div>
            </div>

            {/* Render Slot Bounding Boxes (P1..P6) directly on the simulated camera frame */}
            <div className="relative w-full h-full p-8 grid grid-cols-3 grid-rows-2 gap-4">
              {activeSlots.map((slot) => {
                const isEmpty = slot.status === 'EMPTY';
                const isOccupied = slot.status === 'OCCUPIED';
                const color = isEmpty ? 'emerald' : isOccupied ? 'rose' : 'amber';

                return (
                  <div
                    key={slot.id}
                    onClick={() => onSelectSlotForOverride && onSelectSlotForOverride(slot)}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between p-2.5 ${
                      isEmpty 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : isOccupied 
                        ? 'border-rose-500 bg-rose-500/15' 
                        : 'border-amber-500 bg-amber-500/15'
                    }`}
                  >
                    {/* Bounding box corner markers */}
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isEmpty ? 'bg-emerald-600' : isOccupied ? 'bg-rose-600' : 'bg-amber-600'
                      }`}>
                        {slot.slotCode}: {slot.status}
                      </span>
                      <span className="text-[10px] bg-slate-900/80 px-1 rounded text-slate-300">
                        {(slot.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-center">
                      {isOccupied && (
                        <Car className="h-8 w-8 text-rose-400 mx-auto animate-pulse" />
                      )}
                      {isEmpty && (
                        <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">EMPTY BAY</span>
                      )}
                    </div>

                    <div className="text-[9px] font-mono text-slate-400 text-right">
                      polygon [4pts]
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Camera Telemetry Overlay */}
          <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-[11px] text-slate-200 flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE CV FEED</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>{camera.name}</span>
            <span className="text-slate-400">|</span>
            <span>{camera.fps} FPS</span>
            <span className="text-slate-400">|</span>
            <span>{camera.resolution}</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-[10px] text-slate-400">
            Click any polygon box to trigger manual override
          </div>
        </div>
      )}

      {/* Summary Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300"><strong>{emptySlotsCount}</strong> Empty</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400"></span>
            <span className="text-slate-300"><strong>{occupiedSlotsCount}</strong> Occupied</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-300"><strong>{uncertainSlotsCount}</strong> Uncertain</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-mono">
            Occupancy Rate: <strong className="text-emerald-400">{occupancyPercentage}%</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">
            Last sync: {new Date(camera.lastSeenAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

    </div>
  );
}
