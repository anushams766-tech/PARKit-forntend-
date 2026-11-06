import { Link } from 'react-router-dom';
import { MapPin, Navigation, Camera, ChevronRight, Zap } from 'lucide-react';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { formatRelativeTime, isDataStale } from '../../utils/dateHelpers';
import { SLOT_STATUS } from '../../utils/constants';

export default function ParkingCard({ location, onSelect }) {
  if (!location) return null;

  const emptyCount = location.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length || 0;
  const occupiedCount = location.slots?.filter(s => s.status === SLOT_STATUS.OCCUPIED).length || 0;
  const uncertainCount = location.slots?.filter(s => s.status === SLOT_STATUS.UNCERTAIN).length || 0;

  const isStale = isDataStale(location.camera?.lastDetection);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates?.lat || 12.3051},${location.coordinates?.lng || 76.6551}`;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                {location.locality || 'Mysore'}
              </span>
              {location.slots?.some(s => s.type === 'ev') && (
                <span className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-200" title="EV Charging Bay">
                  <Zap className="w-3 h-3" />
                </span>
              )}
            </div>

            <h3 className="font-extrabold text-base text-[#163A70] leading-snug mt-1.5">
              {location.name}
            </h3>

            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="truncate">{location.address}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-base font-extrabold text-[#2563EB]">
              {formatCurrency(location.hourlyRate)}/hr
            </span>
            <p className="text-[10px] text-[#64748B] font-semibold mt-0.5">
              {formatDistance(location.distanceMeters)}
            </p>
          </div>
        </div>

        {/* Live Slot Counts */}
        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs">
          <div>
            <span className="text-base font-extrabold text-[#16A34A] block leading-tight">
              {emptyCount}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#16A34A]">
              Empty
            </span>
          </div>

          <div className="border-x border-[#E2E8F0]">
            <span className="text-base font-extrabold text-[#DC2626] block leading-tight">
              {occupiedCount}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#DC2626]">
              Occupied
            </span>
          </div>

          <div>
            <span className="text-base font-extrabold text-[#D97706] block leading-tight">
              {uncertainCount}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#D97706]">
              Uncertain
            </span>
          </div>
        </div>

        {/* Camera Freshness & Status */}
        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Updated {formatRelativeTime(location.camera?.lastDetection)}</span>
          </div>

          {isStale && (
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
              Stale Data (&gt;90s)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#163A70] border border-[#BFDBFE] transition-colors"
          title="Open Google Maps directions for location context"
        >
          <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Directions</span>
        </a>

        <Link
          to={`/parking/${location.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors shadow-sm"
        >
          <span>View Slots</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
