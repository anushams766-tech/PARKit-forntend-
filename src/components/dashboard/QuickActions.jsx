import { Link } from 'react-router-dom';
import { Compass, Car, Clock, CreditCard, Settings } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { to: '/explore', label: 'Explore Parking', icon: Compass, color: 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]' },
    { to: '/vehicles', label: 'My Vehicles', icon: Car, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { to: '/parking-history', label: 'Parking History', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { to: '/payments', label: 'Payments', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { to: '/settings', label: 'Settings', icon: Settings, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-[#163A70] uppercase tracking-wider">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.to}
              to={act.to}
              className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB] p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group transition-all duration-150 shadow-xs hover:shadow-md"
            >
              <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 border ${act.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#172554]">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
