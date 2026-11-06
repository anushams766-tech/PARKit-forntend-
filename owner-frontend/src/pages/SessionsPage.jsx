import React from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  Clock, 
  Car, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  DollarSign, 
  ArrowRight,
  LogOut
} from 'lucide-react';

export default function SessionsPage() {
  const { 
    sessions, 
    activeLocation, 
    endSession,
    showToast 
  } = useParkit();

  const activeSessions = sessions.filter(s => s.status === 'ACTIVE');
  const pastSessions = sessions.filter(s => s.status !== 'ACTIVE');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Operations
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">{activeSessions.length} Active Parked</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Parking Sessions Management
          </h1>
          <p className="text-xs text-slate-400">
            Real-time duration tracking, backend-calculated parking charges, and Stripe session references.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">Facility Rate</span>
            <span className="text-emerald-400 font-bold">₹{activeLocation.hourlyRate}/hr</span>
          </div>
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-sm font-bold text-white">Active Parking Sessions ({activeSessions.length})</h3>
          </div>
          <span className="text-xs text-slate-400">Duration updates in real time</span>
        </div>

        {activeSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active parking sessions in this facility.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Session & User</th>
                  <th className="py-2.5 px-3">Vehicle Plate</th>
                  <th className="py-2.5 px-3">Assigned Bay</th>
                  <th className="py-2.5 px-3">Check-in Time</th>
                  <th className="py-2.5 px-3">Elapsed Duration</th>
                  <th className="py-2.5 px-3">Amount Due</th>
                  <th className="py-2.5 px-3">Payment Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activeSessions.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{sess.id}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{sess.userName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-200 border border-slate-700 font-bold">
                        {sess.userPlate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        {sess.slotCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px]">
                      {new Date(sess.startedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-emerald-400" />
                        <span>{sess.durationMinutes} mins</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      ₹{sess.amountDue}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {sess.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => endSession(sess.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors inline-flex items-center space-x-1"
                        title="End session"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>Check-out</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Historical Completed Sessions */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Completed Sessions History</h3>
          <span className="text-xs text-slate-400">{pastSessions.length} recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Session ID</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Vehicle Plate</th>
                <th className="py-2.5 px-3">Bay</th>
                <th className="py-2.5 px-3">Total Duration</th>
                <th className="py-2.5 px-3">Fee Paid</th>
                <th className="py-2.5 px-3">Stripe Reference</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {pastSessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-300">{sess.id}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{sess.userName}</td>
                  <td className="py-3 px-3 text-slate-300">{sess.userPlate}</td>
                  <td className="py-3 px-3 text-emerald-400">{sess.slotCode}</td>
                  <td className="py-3 px-3 text-slate-400">{sess.durationMinutes} mins</td>
                  <td className="py-3 px-3 font-bold text-white">₹{sess.amountDue}</td>
                  <td className="py-3 px-3 text-slate-400 text-[10px] truncate max-w-[140px]">{sess.stripePaymentId}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {sess.status}
                    </span>
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
