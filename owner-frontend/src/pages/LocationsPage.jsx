import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  MapPin, 
  Plus, 
  ExternalLink, 
  Car, 
  Video, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  Navigation,
  Edit3,
  Search,
  Globe
} from 'lucide-react';

export default function LocationsPage({ onOpenGoogleMaps }) {
  const { 
    locations, 
    activeLocationId, 
    setActiveLocationId, 
    updateLocation,
    showToast 
  } = useParkit();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingLocId, setEditingLocId] = useState(null);
  const [editRate, setEditRate] = useState('');

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveRate = (loc) => {
    if (!editRate) return;
    updateLocation({ ...loc, hourlyRate: parseFloat(editRate) });
    setEditingLocId(null);
    showToast(`Updated hourly rate for ${loc.name} to ₹${editRate}/hr`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Facility Network
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">{locations.length} Locations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Registered Parking Facilities & Maps
          </h1>
          <p className="text-xs text-slate-400">
            Locations registered via pinned Google Maps links (PRD Section 6) for nearby discovery and CV monitoring.
          </p>
        </div>

        <button
          onClick={onOpenGoogleMaps}
          className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 transform active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Location (Google Maps)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facilities by name, city, address, or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Locations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLocations.map((loc) => {
          const isActive = loc.id === activeLocationId;

          return (
            <div
              key={loc.id}
              className={`rounded-2xl p-5 border transition-all space-y-4 shadow-xl ${
                isActive
                  ? 'bg-slate-900/90 border-emerald-500/50 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      {loc.id}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Currently Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{loc.name}</h3>
                  <p className="text-xs text-slate-400 flex items-start space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </p>
                </div>

                {!isActive && (
                  <button
                    onClick={() => setActiveLocationId(loc.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    Select Facility
                  </button>
                )}
              </div>

              {/* Map Preview Container */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-36 flex items-center justify-center">
                {/* Visual Map graphic */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-60"></div>
                
                {/* Pin marker */}
                <div className="relative z-10 text-center animate-bounce">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                    <MapPin className="h-5 w-5 text-emerald-300" />
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded-full border border-slate-700 mt-1 block">
                    {loc.latitude}, {loc.longitude}
                  </span>
                </div>

                {/* Google Maps link tag */}
                <a
                  href={loc.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-800 px-2 py-1 rounded text-[10px] font-medium text-slate-300 border border-slate-700 flex items-center space-x-1 transition-colors"
                >
                  <ExternalLink className="h-2.5 w-2.5 text-emerald-400" />
                  <span>Open in Google Maps</span>
                </a>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-sans">Capacity</span>
                  <span className="text-white font-bold">{loc.totalSlots} Bays</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-sans">Hourly Rate</span>
                  {editingLocId === loc.id ? (
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input
                        type="number"
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        className="w-12 px-1 py-0.5 text-xs bg-slate-900 border border-emerald-500 rounded text-white"
                      />
                      <button
                        onClick={() => handleSaveRate(loc)}
                        className="text-[10px] bg-emerald-500 text-slate-950 px-1 py-0.5 rounded font-bold"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">₹{loc.hourlyRate}/hr</span>
                      <button
                        onClick={() => {
                          setEditingLocId(loc.id);
                          setEditRate(loc.hourlyRate);
                        }}
                        className="text-slate-400 hover:text-white"
                        title="Edit rate"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-sans">Camera Feed</span>
                  <span className="text-slate-300 font-bold truncate block">{loc.cameraId || "None"}</span>
                </div>
              </div>

              {/* Details & Notes */}
              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                {loc.description || "Registered physical smart parking installation."}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
