import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { locationService } from '../../services/locationService';
import { useParkingStatus } from '../../hooks/useParkingStatus';
import CameraStatus from '../../components/parking/CameraStatus';
import AvailabilitySummary from '../../components/parking/AvailabilitySummary';
import SlotGrid from '../../components/parking/SlotGrid';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { MapPin, Navigation, CreditCard, RefreshCw, ArrowLeft, ShieldCheck, Zap, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ParkingDetails() {
  const { locationId } = useParams();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook for live real-time camera updates & stale check
  const {
    status,
    loading: statusLoading,
    emptyCount,
    occupiedCount,
    uncertainCount,
    totalSlots,
    isStale,
    refetch,
  } = useParkingStatus(locationId);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await locationService.getLocationById(locationId);
      setLocation(res.data);
    } catch (err) {
      setError('Parking location details could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [locationId]);

  if (loading) {
    return <Loader text="Loading bay status & camera feeds..." />;
  }

  if (error || !location) {
    return <ErrorState message={error || 'Location not found'} onRetry={fetchLocation} />;
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address || (location.name + ', Mysore, Karnataka'))}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mysore Locations</span>
        </Link>
      </div>

      {/* Main Location Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] uppercase tracking-wider">
                PARKit Registered Hub
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                DEMO DATA
              </span>
              {location.locality && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {location.locality}, Mysore
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#163A70] mt-2">
              {location.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{location.address}</span>
            </p>
          </div>

          {/* Pricing & Navigation Action */}
          <div className="sm:text-right space-y-2 shrink-0">
            <div>
              <span className="text-2xl font-extrabold text-[#2563EB]">
                {formatCurrency(location.hourlyRate)}
              </span>
              <span className="text-xs text-[#64748B] font-medium"> / hour</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#163A70] border border-[#CBD5E1] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Directions</span>
              </a>

              <Link
                to={`/checkout/${location.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay Session (INR)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Camera Feed Freshness */}
        <CameraStatus
          camera={status?.camera || location.camera}
          onRecalibrate={refetch}
        />
      </div>

      {/* Availability Breakdown */}
      <AvailabilitySummary
        emptyCount={emptyCount}
        occupiedCount={occupiedCount}
        uncertainCount={uncertainCount}
        totalSlots={totalSlots || location.slots?.length}
      />

      {/* Visual Slot Grid */}
      <SlotGrid slots={location.slots || []} />

      {/* Policy Notice as per section 3 */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-xs text-[#64748B] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-[#163A70]">PARKit Transparency Standard</h5>
          <p>
            Slots marked as <strong>UNCERTAIN</strong> are excluded from available space counts to prevent arriving at filled bays. Payment settles parking session rates in Indian Rupees (₹) and does not guarantee reservation or slot locking.
          </p>
        </div>
      </div>
    </div>
  );
}
