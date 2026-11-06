import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShieldAlert, 
  Settings,
  HelpCircle,
  ExternalLink,
  Sliders,
  Car
} from 'lucide-react';
import { useParkit } from '../context/ParkitContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { totalSlotsCount, emptySlotsCount, occupiedSlotsCount, uncertainSlotsCount } = useParkit();

  const navigation = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'live-camera', name: 'Live Camera & Bays', icon: Video, badge: `${emptySlotsCount} Free` },
    { id: 'locations', name: 'Locations & Maps', icon: MapPin, badge: null },
    { id: 'sessions', name: 'Active Sessions', icon: Clock, badge: `${occupiedSlotsCount} Active` },
    { id: 'payments', name: 'Stripe Test Payments', icon: CreditCard, badge: 'Test Mode' },
    { id: 'audit', name: 'Audit & Health', icon: ShieldAlert, badge: null },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/50 backdrop-blur-md flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Operations & Control
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.badge.includes('Free')
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.badge.includes('Test')
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Miniature Bays Quick Widget */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Car className="h-3.5 w-3.5 text-emerald-400" />
              <span>Miniature Model Status</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">6 Slots</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[10px]">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <div className="text-sm font-bold">{emptySlotsCount}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">EMPTY</div>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <div className="text-sm font-bold">{occupiedSlotsCount}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">OCCUPIED</div>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <div className="text-sm font-bold">{uncertainSlotsCount}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">UNCERTAIN</div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center justify-between">
            <span>PARKit System</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">v1.2 MVP</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            OpenCV CV-based miniature detection + Stripe test mode integration.
          </p>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
          <span>PARKit Admin Portal</span>
          <span className="font-mono text-emerald-400">Hackathon Ready</span>
        </div>
      </div>
    </aside>
  );
}
