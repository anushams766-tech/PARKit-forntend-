import { Link } from 'react-router-dom';
import { Car, Clock, MapPin, ChevronRight, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function RecentActivity({ activeSession, recentSessions = [] }) {
  return (
    <div className="space-y-4">
      {/* Active Session Highlight if ongoing */}
      {activeSession ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-[#EFF6FF] border-2 border-[#2563EB] shadow-md shadow-[#2563EB]/10 text-[#172554]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#2563EB] text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              ACTIVE PARKING SESSION
            </div>
            <span className="text-xs font-mono font-bold text-[#163A70] bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">
              Bay: {activeSession.slotNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-extrabold text-[#163A70]">{activeSession.locationName}</h4>
              <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                {activeSession.locationAddress}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-mono font-extrabold text-[#172554]">
                  {activeSession.vehiclePlate}
                </span>
                <span className="text-xs text-[#64748B] font-medium">
                  {activeSession.vehicleModel}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[#BFDBFE] pt-3 sm:pt-0 sm:pl-4">
              <div className="text-left sm:text-right">
                <p className="text-xs text-[#64748B]">Elapsed: ~{activeSession.durationMinutes} mins</p>
                <p className="text-2xl font-extrabold text-[#2563EB]">
                  {formatCurrency(activeSession.estimatedAmount)}
                </p>
              </div>

              <Link
                to={`/sessions/${activeSession.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors mt-2 shadow-sm"
              >
                <span>View Session Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Activity List */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
          <h3 className="text-xs font-bold text-[#163A70] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            Recent Parking Sessions
          </h3>
          <Link
            to="/parking-history"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">
            No previous sessions recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentSessions.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#163A70]">{sess.locationName}</h5>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Driver: <strong className="text-[#172554]">{sess.driverName}</strong> • Plate: <span className="font-mono font-bold text-[#2563EB]">{sess.vehiclePlate}</span> • {sess.durationMinutes} mins
                    </p>
                    <span className="text-[10px] text-[#94A3B8] mt-1 block">
                      {formatDateTime(sess.entryTime)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-extrabold text-[#172554] text-sm">
                    {formatCurrency(sess.amountPaid || sess.estimatedAmount)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
