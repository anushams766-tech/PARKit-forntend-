import { CheckCircle, Clock } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function ParkingHistoryTable({ sessions = [], onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EFF6FF] text-[#163A70] uppercase tracking-wider font-extrabold border-b border-[#BFDBFE]">
            <tr>
              <th className="py-3 px-4">Driver &amp; Vehicle</th>
              <th className="py-3 px-4">Parking Hub (Mysore)</th>
              <th className="py-3 px-4">Entry Timestamp</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Amount (INR)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#172554]">
            {sessions.map((sess) => (
              <tr key={sess.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3.5 px-4 font-bold">
                  <span className="text-[#163A70] font-extrabold block">{sess.driverName}</span>
                  <span className="font-mono font-bold text-[#2563EB] text-[11px]">{sess.vehiclePlate}</span>
                  <span className="block text-[10px] text-[#64748B] font-normal">
                    {sess.vehicleModel}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold">
                  {sess.locationName}
                  <span className="block text-[10px] text-[#64748B] font-normal truncate max-w-[200px]">
                    {sess.locationAddress}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#64748B]">
                  {formatDateTime(sess.entryTime)}
                </td>
                <td className="py-3.5 px-4 font-bold">
                  {sess.durationMinutes} mins
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#2563EB] text-sm">
                  {formatCurrency(sess.amountPaid || sess.estimatedAmount)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    {sess.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(sess)}
                    className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
