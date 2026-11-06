import { useAuth } from '../../context/AuthContext';
import { Sparkles, MapPin } from 'lucide-react';
import { APP_TAGLINE } from '../../utils/constants';

export default function WelcomeHeader() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const driverName = user?.name || 'Driver';
  const locationText = `${user?.location?.district || 'Mysore (Mysuru)'}, ${user?.location?.state || 'Karnataka'}, ${user?.location?.country || 'India'}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE]/50 to-[#EFF6FF] border border-[#BFDBFE] p-6 sm:p-8 text-[#172554] shadow-sm">
      {/* Decorative subtle blue radial glow */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#163A70] border border-[#93C5FD]">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{APP_TAGLINE}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#163A70]">
          {getGreeting()}, {driverName}!
        </h2>

        <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-bold">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span>Active Operating Region: {locationText}</span>
        </div>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
          Real-time parking spaces verified by overhead computer vision cameras across Mysore. Check vacant bays, verify camera freshness, and navigate effortlessly.
        </p>
      </div>
    </div>
  );
}
