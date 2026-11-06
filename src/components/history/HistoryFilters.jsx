import SearchBar from '../common/SearchBar';

export default function HistoryFilters({
  searchPlate,
  onSearchChange,
  onSearchClear,
  selectedLocation,
  onLocationChange,
  locations = [],
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <SearchBar
        value={searchPlate}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={onSearchClear}
        placeholder="Filter by driver name or vehicle plate (KA09...)..."
      />

      <div className="flex items-center gap-2 shrink-0">
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#172554] cursor-pointer focus:outline-none focus:border-[#2563EB]"
        >
          <option value="all">All Mysore Localities</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.locality ? `${loc.locality} - ${loc.name}` : loc.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#CBD5E1] text-[#172554] cursor-pointer focus:outline-none focus:border-[#2563EB]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
