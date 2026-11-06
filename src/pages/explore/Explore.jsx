import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MysoreLeafletMap from '../../components/parking/MysoreLeafletMap';
import ParkingCard from '../../components/parking/ParkingCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import DemoDataBar from '../../components/common/DemoDataBar';
import { locationService } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';
import { Map, List, MapPin, RefreshCw, Search, Sparkles, RotateCcw, Compass, ArrowRight } from 'lucide-react';
import { MYSORE_LOCALITIES } from '../../utils/locationData';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { currentLocation, isSampleMode, loadSampleProfile, resetSampleMode } = useAuth();

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [searchFilter, setSearchFilter] = useState(initialQuery);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [loading, setLoading] = useState(true);

  // Sync search filter when query param changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearchFilter(q);
    }
  }, [searchParams]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await locationService.getLocations();
      const list = res.data || [];
      setLocations(list);
      if (list.length > 0) {
        setSelectedLocation(list[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [isSampleMode]);

  // Handle destination search
  const filteredLocations = locations.filter((loc) => {
    const q = searchFilter.toLowerCase().trim();

    // Check if search query matches name, locality, address or district
    const matchesSearch =
      !q ||
      (loc.name && loc.name.toLowerCase().includes(q)) ||
      (loc.locality && loc.locality.toLowerCase().includes(q)) ||
      (loc.address && loc.address.toLowerCase().includes(q)) ||
      (loc.district && loc.district.toLowerCase().includes(q));

    // When a specific search filter is typed, prioritize search over the dropdown filter
    const matchesLocality =
      q.length > 0 ||
      selectedLocality === 'all' ||
      loc.locality?.toLowerCase() === selectedLocality.toLowerCase();

    return matchesLocality && matchesSearch;
  });

  const handleQuickLocalitySearch = (locName) => {
    setSearchFilter(locName);
    setSelectedLocality('all');
    setSearchParams({ q: locName });
  };

  const handleLoadDemo = () => {
    loadSampleProfile('usr_anusha_01');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Visible Demo Data Controls with 5 selectable profiles */}
      <DemoDataBar />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              {currentLocation?.district || 'Mysore (Mysuru)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#163A70] mt-1">
            Explore Registered Parking Hubs
          </h2>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={fetchLocations}
            className="p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
            title="Refresh availability"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="flex items-center p-1 rounded-xl bg-white border border-[#CBD5E1]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172554]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172554]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
              setSearchParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search destination or locality (e.g. Vijayanagar, Kuvempunagar, Gokulam)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => {
                setSearchFilter('');
                setSearchParams({});
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#64748B] hover:text-[#163A70] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={selectedLocality}
          onChange={(e) => {
            setSelectedLocality(e.target.value);
            if (e.target.value !== 'all') {
              setSearchFilter('');
              setSearchParams({});
            }
          }}
          className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#172554] cursor-pointer focus:outline-none focus:border-[#2563EB]"
        >
          <option value="all">All Mysore Localities</option>
          {MYSORE_LOCALITIES.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-[#64748B] font-semibold flex items-center gap-1 shrink-0">
          <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
          Quick areas:
        </span>
        {['Vijayanagar', 'Kuvempunagar', 'Gokulam', 'Jayalakshmipuram', 'Hebbal', 'Saraswathipuram'].map((locality) => (
          <button
            key={locality}
            type="button"
            onClick={() => handleQuickLocalitySearch(locality)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
              searchFilter.toLowerCase().includes(locality.toLowerCase())
                ? 'bg-[#2563EB] text-white font-bold'
                : 'bg-white hover:bg-[#EFF6FF] text-[#163A70] border border-[#CBD5E1]'
            }`}
          >
            {locality}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading registered parking hubs..." />
      ) : filteredLocations.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#CBD5E1] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] mx-auto flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h4 className="font-extrabold text-base text-[#163A70]">
              {searchFilter
                ? `No registered parking spaces found matching "${searchFilter}"`
                : 'No registered parking spaces found in this area'}
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              PARKit currently operates overhead computer-vision parking bays in Mysuru across:
            </p>

            {/* Clickable Locality Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {['Vijayanagar', 'Kuvempunagar', 'Jayalakshmipuram', 'Gokulam', 'Hebbal', 'Saraswathipuram', 'Bannimantap'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleQuickLocalitySearch(item)}
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
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <div
            className="bg-white rounded-2xl border border-[#CBD5E1] p-4 shadow-xs relative overflow-hidden"
            style={{ position: 'relative', overflow: 'hidden', zIndex: 0 }}
          >
            <MysoreLeafletMap
              locations={filteredLocations}
              userCoordinates={currentLocation?.coordinates}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              height="420px"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocations.map((loc) => (
              <ParkingCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLocations.map((loc) => (
            <ParkingCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}
