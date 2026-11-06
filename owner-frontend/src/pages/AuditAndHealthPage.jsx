import React from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Video, 
  CreditCard, 
  MapPin, 
  RotateCcw, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export default function AuditAndHealthPage() {
  const { 
    auditLogs, 
    camera, 
    applyDemoScenario, 
    resetToDefaults,
    showToast 
  } = useParkit();

  const isCameraOnline = camera.connectionStatus === 'ONLINE' && !camera.isStale;

  const systemServices = [
    {
      name: "Computer Vision Ingestion API",
      endpoint: "POST /api/detections",
      status: "OPERATIONAL",
      latency: "28ms",
      desc: "Ingests OpenCV slot occupancy payloads with timestamp and confidence."
    },
    {
      name: "Google Maps Pin Geocoding Service",
      endpoint: "POST /api/locations/from-map-link",
      status: "OPERATIONAL",
      latency: "94ms",
      desc: "Resolves pinned Google Maps share links to latitude and longitude."
    },
    {
      name: "Stripe Webhook Listener (Test Mode)",
      endpoint: "POST /api/payments/webhook",
      status: "OPERATIONAL",
      latency: "45ms",
      desc: "Idempotent event processor with HMAC signature verification."
    },
    {
      name: "Miniature Overhead Camera Stream (CAM-01)",
      endpoint: camera.streamUrl,
      status: isCameraOnline ? "OPERATIONAL" : "DEGRADED",
      latency: `${camera.latencyMs}ms`,
      desc: `Running at ${camera.fps} FPS. Resolution: ${camera.resolution}.`
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              System Assurance
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">Audit & Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            System Health & Immutable Audit Logs
          </h1>
          <p className="text-xs text-slate-400">
            Audit logging for manual slot overrides (PRD Section 7 & 9) and backend microservices health.
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 text-rose-400" />
          <span>Reset All Test States</span>
        </button>
      </div>

      {/* System Services Health Monitor */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Microservices & Endpoints Health</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Systems Operational</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemServices.map((service, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{service.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  service.status === 'OPERATIONAL'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {service.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <code className="text-emerald-400/90">{service.endpoint}</code>
                <span>{service.latency}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Manual Overrides & Configuration Audit Log</h3>
            <p className="text-xs text-slate-400">
              Every status override, baseline recalibration, and location registration is recorded with justification.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} audit entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Administrator</th>
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3">Change (Old → New)</th>
                <th className="py-2.5 px-3">Reason / Justification</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-300">{log.id}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-200">{log.actor}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {log.slotCode || "N/A"}
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-[11px]">
                    {log.oldValue ? `${log.oldValue} → ${log.newValue}` : log.newValue}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 max-w-xs truncate">
                    {log.reason || log.details}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
