import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Info } from 'lucide-react';

export default function PaymentSummary({
  location,
  vehicle,
  durationHours = 2,
  hourlyRate = 30.00,
}) {
  const subtotal = durationHours * hourlyRate;
  const platformFee = 5.00; // standard INR 5 platform technology fee
  const total = subtotal + platformFee;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
      <h4 className="text-xs font-extrabold text-[#163A70] uppercase tracking-wider pb-2 border-b border-[#E2E8F0]">
        Fare Breakdown (INR)
      </h4>

      {/* Breakdown rows */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-[#64748B]">
          <span>Parking Location</span>
          <span className="font-bold text-[#172554]">{location?.name || 'Selected Mysore Location'}</span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Vehicle Registration</span>
          <span className="font-mono font-bold text-[#2563EB]">{vehicle?.plate || 'KA09MN4821'}</span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Duration Rate ({durationHours} hrs × {formatCurrency(hourlyRate)})</span>
          <span className="font-bold text-[#172554]">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Computer Vision Telemetry Fee</span>
          <span className="font-bold text-[#172554]">{formatCurrency(platformFee)}</span>
        </div>

        <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-sm">
          <span className="font-extrabold text-[#172554]">Total Payable</span>
          <span className="text-xl font-extrabold text-[#2563EB]">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Strict disclaimer as per requirements */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Real-Time Availability Notice</span>
        </div>
        <p className="opacity-90 leading-relaxed">
          Payment covers parking session charges. Parking availability is continuously monitored via overhead cameras. Unused session fees can be adjusted via support.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
        <span>Simulated UPI &amp; FASTag Payment Test Gateway. No real bank accounts are debited.</span>
      </div>
    </div>
  );
}
