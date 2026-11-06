import { CheckCircle2, XCircle, HelpCircle, Building } from 'lucide-react';

export default function StatisticsCards({
  locationsCount = 0,
  emptyCount = 0,
  occupiedCount = 0,
  uncertainCount = 0,
}) {
  const cards = [
    {
      title: 'Demo Parking Hubs',
      value: locationsCount,
      subtext: 'Across Mysore Localities',
      icon: Building,
      color: 'text-[#2563EB]',
      bg: 'bg-[#EFF6FF]',
      border: 'border-[#BFDBFE]',
    },
    {
      title: 'EMPTY Spaces',
      value: emptyCount,
      subtext: 'Available for immediate parking',
      icon: CheckCircle2,
      color: 'text-[#16A34A]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      title: 'OCCUPIED Spaces',
      value: occupiedCount,
      subtext: 'Currently filled by vehicles',
      icon: XCircle,
      color: 'text-[#DC2626]',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
    },
    {
      title: 'UNCERTAIN Spaces',
      value: uncertainCount,
      subtext: 'EXCLUDED from available counts',
      icon: HelpCircle,
      color: 'text-[#D97706]',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#64748B]">
                  {c.title}
                </span>
                <div className={`p-2 rounded-xl ${c.bg} ${c.color} border ${c.border}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${c.color}`}>
                  {c.value}
                </p>
                <p className="text-[11px] text-[#64748B] mt-1 font-medium">
                  {c.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explicit status disclaimer badge */}
      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-[11px] text-[#64748B] flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-bold text-[#163A70]">Status Standard:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <strong className="text-[#172554]">EMPTY:</strong> Confirmed available space
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
          <strong className="text-[#172554]">OCCUPIED:</strong> Currently filled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <strong className="text-[#172554]">UNCERTAIN:</strong> Vision obstructed; not counted as vacant
        </span>
      </div>
    </div>
  );
}
