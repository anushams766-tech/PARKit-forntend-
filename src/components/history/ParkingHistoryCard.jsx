import { Car, Clock, MapPin, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function ParkingHistoryCard({ session, onViewDetails }) {
  if (!session) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: Driver, Location & Vehicle info */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-xs font-extrabold text-[#2563EB]">
              {session.vehiclePlate}
            </span>
            {(session.source === 'DEMO' || session.source === 'DEMO DATA') && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-300">
                DEMO
              </span>
            )}
            <span className="text-xs font-bold text-[#163A70] flex items-center gap-1">
              <User className="w-3 h-3 text-[#2563EB]" />
              {session.driverName}
            </span>
            <span className="text-xs text-[#64748B]">
              • {session.vehicleModel}
            </span>
          </div>

          <h4 className="text-base font-extrabold text-[#163A70] mt-2">
            {session.locationName}
          </h4>
          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            {session.locationAddress}
          </p>
        </div>

        {/* Right: Amount in INR & Status */}
        <div className="text-right">
          <span className="text-xl font-extrabold text-[#2563EB] block">
            {formatCurrency(session.amountPaid || session.estimatedAmount)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
            <CheckCircle2 className="w-3 h-3" />
            {session.status}
          </span>
        </div>
      </div>

      {/* Timeline details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#F8FAFC] text-xs border border-[#E2E8F0]">
        <div>
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Entry Time</span>
          <strong className="text-[#172554]">{formatDateTime(session.entryTime)}</strong>
        </div>

        <div>
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Exit Time</span>
          <strong className="text-[#172554]">{session.exitTime ? formatDateTime(session.exitTime) : 'Ongoing'}</strong>
        </div>

        <div>
          <span className="text-[10px] text-[#64748B] uppercase font-bold block">Total Duration</span>
          <strong className="text-[#172554]">~{session.durationMinutes} minutes</strong>
        </div>
      </div>

      {/* Bottom details & Transaction reference */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E8F0]">
        <span className="text-[11px] font-mono text-[#64748B]">
          Ref: {session.transactionId || session.id}
        </span>

        {onViewDetails && (
          <button
            type="button"
            onClick={() => onViewDetails(session)}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Receipt / Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
