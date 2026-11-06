export default function AvailabilitySummary({
  emptyCount = 0,
  occupiedCount = 0,
  uncertainCount = 0,
  totalSlots = 0,
}) {
  const calculatedTotal = totalSlots || (emptyCount + occupiedCount + uncertainCount);
  const emptyPercent = calculatedTotal > 0 ? (emptyCount / calculatedTotal) * 100 : 0;
  const occupiedPercent = calculatedTotal > 0 ? (occupiedCount / calculatedTotal) * 100 : 0;
  const uncertainPercent = calculatedTotal > 0 ? (uncertainCount / calculatedTotal) * 100 : 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#163A70] uppercase tracking-wider">
          Space Availability
        </h4>
        <span className="text-xs font-mono font-bold text-[#64748B]">
          Total Capacity: {calculatedTotal} bays
        </span>
      </div>

      {/* Visual Progress Bar */}
      <div className="h-3.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden flex border border-[#E2E8F0]">
        <div
          style={{ width: `${emptyPercent}%` }}
          className="bg-[#16A34A] transition-all duration-300"
          title={`Empty: ${emptyCount} (${emptyPercent.toFixed(0)}%)`}
        />
        <div
          style={{ width: `${occupiedPercent}%` }}
          className="bg-[#DC2626] transition-all duration-300"
          title={`Occupied: ${occupiedCount} (${occupiedPercent.toFixed(0)}%)`}
        />
        <div
          style={{ width: `${uncertainPercent}%` }}
          className="bg-[#D97706] transition-all duration-300"
          title={`Uncertain: ${uncertainCount} (${uncertainPercent.toFixed(0)}%)`}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xl font-extrabold text-[#16A34A]">
            {emptyCount}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A]">
            Empty (Available)
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-xl font-extrabold text-[#DC2626]">
            {occupiedCount}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
            Occupied
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xl font-extrabold text-[#D97706]">
            {uncertainCount}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">
            Uncertain
          </p>
        </div>
      </div>
    </div>
  );
}
