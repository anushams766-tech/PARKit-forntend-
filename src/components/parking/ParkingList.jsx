import { useState } from 'react';
import ParkingCard from './ParkingCard';
import SearchBar from '../common/SearchBar';
import EmptyState from '../common/EmptyState';
import { Compass, Zap } from 'lucide-react';
import { SLOT_STATUS } from '../../utils/constants';

export default function ParkingList({
  locations = [],
  onSelectLocation,
  selectedLocality = 'all',
  onLocalityChange,
}) {
  const [search, setSearch] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterEvOnly, setFilterEvOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'price' | 'available'

  // Unique localities
  const localities = ['all', ...new Set(locations.map(l => l.locality).filter(Boolean))];

  // Filtering
  const filtered = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase()) ||
      (loc.locality && loc.locality.toLowerCase().includes(search.toLowerCase()));

    const matchesLocality = selectedLocality === 'all' || loc.locality === selectedLocality;

    const emptyCount = loc.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length || 0;
    const matchesAvailable = !filterAvailableOnly || emptyCount > 0;
    const matchesEv = !filterEvOnly || loc.slots?.some(s => s.type === 'ev' && s.status === SLOT_STATUS.EMPTY);

    return matchesSearch && matchesLocality && matchesAvailable && matchesEv;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') return (a.distanceMeters || 0) - (b.distanceMeters || 0);
    if (sortBy === 'price') return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    if (sortBy === 'available') {
      const emptyA = a.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length || 0;
      const emptyB = b.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length || 0;
      return emptyB - emptyA;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Search Mysore locality (e.g. Gokulam, Vijayanagar, Nazarbad)..."
        />

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Locality Dropdown Filter */}
          <select
            value={selectedLocality}
            onChange={(e) => onLocalityChange ? onLocalityChange(e.target.value) : null}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#172554] cursor-pointer focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Localities</option>
            {localities.filter(l => l !== 'all').map(locName => (
              <option key={locName} value={locName}>{locName}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFilterAvailableOnly(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              filterAvailableOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-[#CBD5E1] text-[#64748B]'
            }`}
          >
            Available Only
          </button>

          <button
            type="button"
            onClick={() => setFilterEvOnly(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
              filterEvOnly
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-[#CBD5E1] text-[#64748B]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>EV</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#172554] cursor-pointer focus:outline-none"
          >
            <option value="distance">Nearest</option>
            <option value="price">Lowest Tariff (₹)</option>
            <option value="available">Most Available</option>
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Mysore parking locations match your search"
          description="Try broadening your locality filter or clear the availability checkboxes."
          actionLabel="Show All Mysore Locations"
          onAction={() => {
            setSearch('');
            setFilterAvailableOnly(false);
            setFilterEvOnly(false);
            if (onLocalityChange) onLocalityChange('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((loc) => (
            <ParkingCard
              key={loc.id}
              location={loc}
              onSelect={onSelectLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
