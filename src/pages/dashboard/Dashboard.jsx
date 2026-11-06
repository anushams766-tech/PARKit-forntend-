import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { locationService } from '../../services/locationService';
import MysoreLeafletMap from '../../components/parking/MysoreLeafletMap';
import DemoDataBar from '../../components/common/DemoDataBar';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  Search,
  MapPin,
  Navigation,
  ArrowRight,
  Clock,
  Car,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { formatRelativeTime } from '../../utils/dateHelpers';
import { calculateDistanceKm } from '../../utils/locationData';
import { SLOT_STATUS } from '../../utils/constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, currentLocation, updateLocation, isSampleMode, loadSampleProfile, resetSampleMode, sampleProfile } = useAuth();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);

  const fetchParkingData = async () => {
    setLoading(true);
    try {
      const coords = currentLocation?.coordinates;
      let res;
      if (coords?.lat && coords?.lng) {
        res = await locationService.getNearbyLocations(coords.lat, coords.lng);
      } else {
        res = await locationService.getLocations();
      }
      const locList = res.data || [];
      setLocations(locList);
      if (locList.length > 0) {
        setSelectedLocation(locList[0]);
      }
    } catch (err) {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingData();
  }, [currentLocation, isSampleMode]);

  // Handle "Use Current Location" button on search card
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        updateLocation({
          ...currentLocation,
          coordinates: { lat: latitude, lng: longitude },
          isDetected: true,
        });
      },
      () => {
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (locName) => {
    setSearchQuery(locName);
  };

  const handleLoadDemo = () => {
    loadSampleProfile('usr_anusha_01');
  };

  // Filter locations if search query is entered directly on dashboard
  const displayedLocations = searchQuery.trim()
    ? locations.filter(loc => {
        const q = searchQuery.toLowerCase().trim();
        return (
          (loc.name && loc.name.toLowerCase().includes(q)) ||
          (loc.locality && loc.locality.toLowerCase().includes(q)) ||
          (loc.address && loc.address.toLowerCase().includes(q)) ||
          (loc.district && loc.district.toLowerCase().includes(q))
        );
      })
    : locations;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Visible Demo Data Option with 5 selectable profiles */}
      <DemoDataBar />

      {/* Driver Greeting using actual user's name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
            Hello, {user?.name || 'Driver'} 👋
          </h1>
          <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>
              {currentLocation?.isDetected ? 'Detected GPS Area:' : 'Operating Area:'}{' '}
              <strong className="text-[#172554]">{currentLocation?.locality ? `${currentLocation.locality}, ` : ''}{currentLocation?.district || 'Mysore'}</strong>
            </span>
          </p>
        </div>
      </div>

      {/* Prominent Ola/Uber Inspired Search Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#CBD5E1] shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70] tracking-tight">
          Where do you want to park?
        </h2>
        <p className="text-xs text-[#64748B] mt-1 mb-4">
          Discover verified overhead camera parking spaces in your area.
        </p>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination or locality (e.g. Vijayanagar, Kuvempunagar, Gokulam)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F8FAFC] border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#64748B] hover:text-[#163A70] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#EFF6FF] text-[#163A70] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer"
                title="Detect GPS coordinates"
              >
                <Navigation className={`w-3.5 h-3.5 text-[#2563EB] ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating...' : 'Use current location'}</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
              >
                <span>Find Parking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Locality Suggestions */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto text-xs">
          <span className="text-[11px] text-[#64748B] font-semibold flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            Popular areas:
          </span>
          {['Vijayanagar', 'Kuvempunagar', 'Gokulam', 'Jayalakshmipuram', 'Hebbal'].map((locality) => (
            <button
              key={locality}
              type="button"
              onClick={() => handleQuickSearch(locality)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                searchQuery.toLowerCase().includes(locality.toLowerCase())
                  ? 'bg-[#2563EB] text-white font-bold'
                  : 'bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#163A70] border border-[#CBD5E1]'
              }`}
            >
              {locality}
            </button>
          ))}
        </div>
      </div>

      {/* Designated "Live Parking Map" Card Container */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-4 sm:p-5 shadow-xs relative overflow-hidden space-y-3 z-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#163A70]">
                Live Parking Map
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Interactive overhead camera parking hubs in Mysuru
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[#2563EB] font-bold bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tap pins for live vacant slots
          </span>
        </div>

        {/* Map Container strictly constrained with position: relative, defined height and overflow: hidden */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-[#E2E8F0] shadow-xs bg-[#F8FAFC]"
          style={{ position: 'relative', overflow: 'hidden', zIndex: 0 }}
        >
          <MysoreLeafletMap
            locations={displayedLocations}
            userCoordinates={currentLocation?.coordinates}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            height="360px"
          />
        </div>
      </div>

      {/* Nearby Parking Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#163A70]">
            Nearby Parking {searchQuery ? `(matching "${searchQuery}")` : ''}
          </h3>
          {displayedLocations.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <Loader text="Searching for registered parking spaces..." />
        ) : displayedLocations.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#CBD5E1] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="font-extrabold text-base text-[#163A70]">
                {searchQuery
                  ? `No registered parking spaces found matching "${searchQuery}"`
                  : 'No registered PARKit parking spaces found nearby.'}
              </h4>
              <p className="text-xs text-[#64748B]">
                {searchQuery
                  ? `Currently, PARKit is registered in Mysuru across Vijayanagar, Kuvempunagar, Jayalakshmipuram, Gokulam, Hebbal, Saraswathipuram, and Bannimantap.`
                  : 'Try exploring registered hubs or load sample data to test the system.'}
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {['Vijayanagar', 'Kuvempunagar', 'Gokulam', 'Jayalakshmipuram', 'Hebbal'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickSearch(item)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] hover:bg-[#DBEAFE] cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {!isSampleMode && (
                <div className="pt-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleLoadDemo}
                    className="inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Demo Mysore Parking Data</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedLocations.map((loc) => {
              const emptySlots = loc.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length ?? 0;
              const totalSlots = loc.slots?.length ?? 0;
              const distKm = currentLocation?.coordinates
                ? calculateDistanceKm(
                    currentLocation.coordinates.lat,
                    currentLocation.coordinates.lng,
                    loc.coordinates?.lat,
                    loc.coordinates?.lng
                  )
                : null;

              return (
                <div
                  key={loc.id}
                  onClick={() => navigate(`/parking/${loc.id}`)}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-[#CBD5E1] shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        {loc.locality || 'Mysore Hub'}
                      </span>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#163A70] group-hover:text-[#2563EB] transition-colors mt-1">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                        <span className="truncate">{loc.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-extrabold text-[#2563EB]">
                        {formatCurrency(loc.hourlyRate)}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">/ hour</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {emptySlots} of {totalSlots} spaces free
                    </span>

                    <span className="text-xs font-semibold text-[#64748B]">
                      {distKm !== null ? `${distKm} km away` : 'Near you'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
