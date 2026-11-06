import { useState, useMemo, useEffect, useRef } from 'react';
import { LOCATION_HIERARCHY, MYSORE_LOCALITIES } from '../../utils/locationData';
import { MapPin, Search, ChevronDown, Check, Globe, Building2, Navigation } from 'lucide-react';
import Button from './Button';

// Reusable Autocomplete Input Field
function AutocompleteField({
  label,
  value = '',
  onChange,
  onSelectSuggestion,
  suggestions = [],
  placeholder = '',
  icon: Icon = MapPin,
  disabled = false,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return suggestions.slice(0, 15);
    const q = query.toLowerCase().trim();
    return suggestions
      .filter((item) => {
        const text = typeof item === 'string' ? item : item.name || '';
        return text.toLowerCase().includes(q);
      })
      .slice(0, 15);
  }, [suggestions, query]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal);
    setIsOpen(true);
  };

  const handleSelect = (item) => {
    const text = typeof item === 'string' ? item : item.name || '';
    setQuery(text);
    onChange(text);
    if (onSelectSuggestion) onSelectSuggestion(item);
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      <label className="block text-xs font-semibold text-[#163A70]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
          <Icon className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] disabled:bg-[#F1F5F9] disabled:cursor-not-allowed transition-colors"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#94A3B8] hover:text-[#163A70] cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl bg-white border border-[#CBD5E1] shadow-lg py-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const text = typeof item === 'string' ? item : item.name || '';
              const isSelected = text.toLowerCase() === (value || '').toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#EFF6FF] font-bold text-[#2563EB]' : 'text-[#172554]'
                  }`}
                >
                  <span className="truncate">{text}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 ml-2" />}
                </button>
              );
            })
          ) : (
            <div className="px-3.5 py-2.5 text-center text-[#64748B]">
              <p>No matching suggestions.</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Press Enter or click away to keep &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CascadingLocationPicker({
  value = {
    country: 'India',
    state: 'Karnataka',
    district: 'Mysore (Mysuru)',
    locality: 'Vijayanagar',
  },
  onChange,
  onConfirm,
  showConfirmButton = false,
  includeLocality = true,
  disabled = false,
  className = '',
}) {
  const [localLocation, setLocalLocation] = useState(value);

  useEffect(() => {
    setLocalLocation(value);
  }, [value]);

  // Find country object
  const countryObj = useMemo(() => {
    return LOCATION_HIERARCHY.find(
      (c) => c.name.toLowerCase() === (localLocation.country || '').toLowerCase()
    ) || (localLocation.country === 'India' ? LOCATION_HIERARCHY[0] : null);
  }, [localLocation.country]);

  // Country suggestions
  const countrySuggestions = useMemo(() => {
    return LOCATION_HIERARCHY.map((c) => c.name);
  }, []);

  // State suggestions
  const stateSuggestions = useMemo(() => {
    if (!countryObj) return [];
    return countryObj.states.map((s) => s.name);
  }, [countryObj]);

  // Find state object
  const stateObj = useMemo(() => {
    if (!countryObj) return null;
    return countryObj.states.find(
      (s) => s.name.toLowerCase() === (localLocation.state || '').toLowerCase()
    );
  }, [countryObj, localLocation.state]);

  // District suggestions
  const districtSuggestions = useMemo(() => {
    if (!stateObj) return [];
    return (stateObj.districts || []).map((d) => (typeof d === 'string' ? d : d.name));
  }, [stateObj]);

  // Find district object
  const districtObj = useMemo(() => {
    if (!stateObj) return null;
    return (stateObj.districts || []).find((d) => {
      const name = typeof d === 'string' ? d : d.name;
      return name.toLowerCase() === (localLocation.district || '').toLowerCase();
    });
  }, [stateObj, localLocation.district]);

  // Locality suggestions
  const localitySuggestions = useMemo(() => {
    if (districtObj && typeof districtObj === 'object' && Array.isArray(districtObj.localities)) {
      return districtObj.localities;
    }
    // Fallback if Mysore/Mysuru
    const dist = (localLocation.district || '').toLowerCase();
    if (dist.includes('mysore') || dist.includes('mysuru')) {
      return MYSORE_LOCALITIES.map((l) => l.name);
    }
    return [];
  }, [districtObj, localLocation.district]);

  const updateField = (field, newVal) => {
    const updated = { ...localLocation, [field]: newVal };

    // Reset dependent fields when parent changes
    if (field === 'country') {
      const newCountryObj = LOCATION_HIERARCHY.find(
        (c) => c.name.toLowerCase() === newVal.toLowerCase()
      );
      if (newCountryObj) {
        const firstState = newCountryObj.states[0]?.name || '';
        updated.state = firstState;
        const firstDist = newCountryObj.states[0]?.districts[0];
        updated.district = typeof firstDist === 'string' ? firstDist : firstDist?.name || '';
        updated.locality = '';
      } else {
        updated.state = '';
        updated.district = '';
        updated.locality = '';
      }
    } else if (field === 'state') {
      if (countryObj) {
        const foundState = countryObj.states.find(
          (s) => s.name.toLowerCase() === newVal.toLowerCase()
        );
        if (foundState) {
          const firstDist = foundState.districts[0];
          updated.district = typeof firstDist === 'string' ? firstDist : firstDist?.name || '';
          updated.locality = '';
        } else {
          updated.district = '';
          updated.locality = '';
        }
      }
    } else if (field === 'district') {
      const distLower = newVal.toLowerCase();
      if (distLower.includes('mysore') || distLower.includes('mysuru')) {
        updated.locality = MYSORE_LOCALITIES[0].name;
      } else {
        updated.locality = '';
      }
    }

    setLocalLocation(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(localLocation);
    } else if (onChange) {
      onChange(localLocation);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Country */}
        <AutocompleteField
          label="Country"
          value={localLocation.country}
          suggestions={countrySuggestions}
          onChange={(val) => updateField('country', val)}
          placeholder="Type or select country (e.g. India)"
          icon={Globe}
          disabled={disabled}
          required
        />

        {/* State / Province / Territory */}
        <AutocompleteField
          label="State / Union Territory"
          value={localLocation.state}
          suggestions={stateSuggestions}
          onChange={(val) => updateField('state', val)}
          placeholder="Type or select state (e.g. Karnataka)"
          icon={Building2}
          disabled={disabled}
          required
        />

        {/* District / City */}
        <AutocompleteField
          label="District / City"
          value={localLocation.district}
          suggestions={districtSuggestions}
          onChange={(val) => updateField('district', val)}
          placeholder="Type or select city (e.g. Mysore / Mysuru)"
          icon={MapPin}
          disabled={disabled}
          required
        />

        {/* Locality */}
        {includeLocality && (
          <AutocompleteField
            label="Locality / Neighborhood"
            value={localLocation.locality}
            suggestions={localitySuggestions}
            onChange={(val) => updateField('locality', val)}
            placeholder="Type or select locality (e.g. Vijayanagar)"
            icon={Navigation}
            disabled={disabled}
          />
        )}
      </div>

      {/* Confirm Location Button */}
      {showConfirmButton && (
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            className="flex items-center justify-center gap-2 py-2.5"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Location</span>
          </Button>
        </div>
      )}
    </div>
  );
}
