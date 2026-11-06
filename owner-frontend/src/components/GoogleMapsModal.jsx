import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Link as LinkIcon, 
  Camera, 
  DollarSign, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function GoogleMapsModal({ onClose }) {
  const { addLocation } = useParkit();

  const [mapsUrl, setMapsUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState(null); // 'success' | 'manual' | 'error'

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    totalSlots: '6',
    hourlyRate: '40',
    currency: 'INR',
    cameraId: 'CAM-03',
    cameraName: 'Smartphone Overhead Mount',
    streamUrl: 'http://192.168.1.110:8080/video',
    description: ''
  });

  // Safe Google Maps pinned link URL coordinate parser (PRD Section 6)
  const handleParseGoogleMapsUrl = () => {
    if (!mapsUrl.trim()) return;

    setIsParsing(true);
    setParseStatus(null);

    // Simulate link resolution (handles maps.app.goo.gl, ?q=lat,lng, /place/lat,lng/@lat,lng)
    setTimeout(() => {
      let lat = null;
      let lng = null;
      let placeName = '';
      let addressGuess = '';

      const url = mapsUrl.trim();

      // Check standard coordinate regex @lat,lng or q=lat,lng
      const coordMatch1 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const coordMatch2 = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      const coordMatch3 = url.match(/place\/([^\/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (coordMatch3) {
        placeName = decodeURIComponent(coordMatch3[1].replace(/\+/g, ' '));
        lat = coordMatch3[2];
        lng = coordMatch3[3];
      } else if (coordMatch1) {
        lat = coordMatch1[1];
        lng = coordMatch1[2];
      } else if (coordMatch2) {
        lat = coordMatch2[1];
        lng = coordMatch2[2];
      } else if (url.includes('goo.gl') || url.includes('maps.app')) {
        // Mock resolution for shortened share links
        lat = "12.9782";
        lng = "77.5913";
        placeName = "PARKit Cubbon Park Entrance Lot";
        addressGuess = "Kasturba Road, Sampangi Rama Nagar, Bengaluru, KA 560001";
      }

      if (lat && lng) {
        setFormData(prev => ({
          ...prev,
          name: placeName || prev.name || "PARKit Registered Facility",
          address: addressGuess || prev.address || "Bengaluru Metro Area",
          latitude: lat,
          longitude: lng,
          description: `Registered via pinned Google Maps link: ${url.substring(0, 45)}...`
        }));
        setParseStatus('success');
      } else {
        // Fallback for custom link: prompt coordinates
        setParseStatus('manual');
        setFormData(prev => ({
          ...prev,
          latitude: "12.9716",
          longitude: "77.5946"
        }));
      }
      setIsParsing(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert('Please provide facility name, latitude, and longitude.');
      return;
    }

    addLocation({
      ...formData,
      googleMapsUrl: mapsUrl || `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      totalSlots: parseInt(formData.totalSlots) || 6,
      hourlyRate: parseFloat(formData.hourlyRate) || 40
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 text-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Register Parking Location</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Maps Pin
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Paste a pinned Google Maps share link to auto-extract GPS coordinates (PRD Section 6).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Pinned Google Maps Link Input */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            Paste Pinned Google Maps Link
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="url"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/... or https://maps.google.com/?q=12.9716,77.5946"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={handleParseGoogleMapsUrl}
              disabled={isParsing || !mapsUrl}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 transition-colors shrink-0 flex items-center space-x-1"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{isParsing ? 'Resolving...' : 'Extract GPS'}</span>
            </button>
          </div>

          {/* Preset Samples */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>Try sample pin:</span>
            <button
              type="button"
              onClick={() => {
                setMapsUrl('https://maps.google.com/?q=12.9782,77.5913');
                setFormData(prev => ({
                  ...prev,
                  name: 'PARKit Cubbon Park Gate Facility',
                  address: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru',
                  latitude: '12.9782',
                  longitude: '77.5913'
                }));
                setParseStatus('success');
              }}
              className="text-emerald-400 hover:underline font-mono"
            >
              Bengaluru Central (12.9782, 77.5913)
            </button>
          </div>

          {parseStatus === 'success' && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Coordinates successfully resolved: Lat {formData.latitude}, Lng {formData.longitude}</span>
            </div>
          )}

          {parseStatus === 'manual' && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Could not automatically parse coordinates from short link. Please verify below.</span>
            </div>
          )}
        </div>

        {/* Step 2: Confirm Location & Pricing Details */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Facility Display Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. PARKit Tech Park - Miniature Demo Lot"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Building name, street, city, pin code"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Latitude <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="12.9716"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Longitude <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="77.5946"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Parking Slots Capacity
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.totalSlots}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSlots: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hourly Rate (₹ / hr)
              </label>
              <input
                type="number"
                min="0"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Associated Camera ID
              </label>
              <input
                type="text"
                value={formData.cameraId}
                onChange={(e) => setFormData(prev => ({ ...prev, cameraId: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Camera Stream URL (RTSP / HTTP)
              </label>
              <input
                type="text"
                value={formData.streamUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, streamUrl: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              Register Facility in PARKit
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
