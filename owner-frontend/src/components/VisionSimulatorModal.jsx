import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  X, 
  Activity, 
  Send, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Sliders, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function VisionSimulatorModal({ onClose }) {
  const { activeSlots, camera, ingestVisionDetection } = useParkit();

  // Local draft state of slots for simulation
  const [simSlots, setSimSlots] = useState(() => {
    return activeSlots.map(s => ({
      slot_id: s.slotCode,
      status: s.status,
      confidence: s.confidence
    }));
  });

  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'json'
  const [jsonInput, setJsonInput] = useState('');

  // Toggle single slot status
  const toggleSlotStatus = (slotId) => {
    setSimSlots(prev => prev.map(s => {
      if (s.slot_id === slotId) {
        let nextStatus = 'EMPTY';
        let nextConf = 0.97;
        if (s.status === 'EMPTY') {
          nextStatus = 'OCCUPIED';
          nextConf = 0.93;
        } else if (s.status === 'OCCUPIED') {
          nextStatus = 'UNCERTAIN';
          nextConf = 0.58;
        } else {
          nextStatus = 'EMPTY';
          nextConf = 0.98;
        }
        return { ...s, status: nextStatus, confidence: nextConf };
      }
      return s;
    }));
  };

  // Set confidence slider
  const updateConfidence = (slotId, val) => {
    setSimSlots(prev => prev.map(s => {
      if (s.slot_id === slotId) {
        return { ...s, confidence: parseFloat(val) };
      }
      return s;
    }));
  };

  // Generate PRD-compliant payload
  const currentPayload = {
    camera_id: camera.id,
    timestamp: new Date().toISOString(),
    total_slots: simSlots.length,
    available_slots: simSlots.filter(s => s.status === 'EMPTY').length,
    occupied_slots: simSlots.filter(s => s.status === 'OCCUPIED').length,
    uncertain_slots: simSlots.filter(s => s.status === 'UNCERTAIN').length,
    slots: simSlots
  };

  const handleSendPayload = () => {
    if (activeTab === 'json' && jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput);
        ingestVisionDetection(parsed);
        onClose();
      } catch (err) {
        alert('Invalid JSON: ' + err.message);
      }
    } else {
      ingestVisionDetection(currentPayload);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Computer Vision Ingestion Simulator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OpenCV Ingestion Test
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Simulate moving toy cars into bays or testing lighting conditions as described in PRD Stage 7.
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

        {/* Tab switch: Interactive Bays vs Raw JSON */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors ${
              activeTab === 'visual'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Interactive Bays Clicker</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('json');
              setJsonInput(JSON.stringify(currentPayload, null, 2));
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors ${
              activeTab === 'json'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Raw Ingestion JSON</span>
          </button>
        </div>

        {activeTab === 'visual' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Click any bay to cycle its state (<span className="text-emerald-400 font-semibold">EMPTY</span> → <span className="text-rose-400 font-semibold">OCCUPIED</span> → <span className="text-amber-400 font-semibold">UNCERTAIN</span>), then click <strong>"Dispatch Detection Update"</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {simSlots.map((s) => {
                const isEmpty = s.status === 'EMPTY';
                const isOccupied = s.status === 'OCCUPIED';
                const isUncertain = s.status === 'UNCERTAIN';

                return (
                  <div
                    key={s.slot_id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {s.slot_id}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleSlotStatus(s.slot_id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-transform active:scale-95 ${
                          isEmpty
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isOccupied
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {s.status}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSlotStatus(s.slot_id)}
                      className={`w-full py-3 rounded-lg border border-dashed flex items-center justify-center space-x-1.5 transition-colors ${
                        isEmpty 
                          ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                          : isOccupied
                          ? 'border-rose-500/40 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10'
                          : 'border-amber-500/40 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10'
                      }`}
                    >
                      {isEmpty ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-semibold">Bay Free</span>
                        </>
                      ) : isOccupied ? (
                        <>
                          <Car className="h-4 w-4" />
                          <span className="text-xs font-semibold">Toy Car Parked</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-semibold">Shadow / Low Conf</span>
                        </>
                      )}
                    </button>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Confidence</span>
                        <span className="font-mono text-slate-200">{(s.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="1.0"
                        step="0.05"
                        value={s.confidence}
                        onChange={(e) => updateConfidence(s.slot_id, e.target.value)}
                        className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 pt-2">
              <span className="text-xs text-slate-400">Quick batch presets:</span>
              <button
                type="button"
                onClick={() => setSimSlots(prev => prev.map(s => ({ ...s, status: 'EMPTY', confidence: 0.98 })))}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
              >
                Clear All (All Empty)
              </button>
              <button
                type="button"
                onClick={() => setSimSlots(prev => prev.map((s, i) => ({ ...s, status: i % 2 === 0 ? 'OCCUPIED' : 'EMPTY', confidence: 0.95 })))}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Alternate (50% Occupied)
              </button>
            </div>
          </div>
        ) : (
          /* JSON Input Editor */
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Payload format conforms directly to the PRD Section 5 & 8 detection ingestion endpoint:
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              className="w-full font-mono text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">
            Endpoint: <code className="text-emerald-400">POST /api/detections</code>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendPayload}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Detection Update</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
