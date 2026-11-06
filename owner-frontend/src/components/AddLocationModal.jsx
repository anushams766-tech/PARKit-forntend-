import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  X, 
  MapPin, 
  Link as LinkIcon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Camera, 
  DollarSign, 
  Clock,
  Layers,
  AlertCircle,
  LogOut,
  Building2
} from 'lucide-react';

export default function AddLocationModal({ onClose, isInitialSetup = false }) {
  const { addLocation, logout } = useParkit();

  const [step, setStep] = useState(1); // 1, 2, or 3
  const [mapsLink, setMapsLink] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [linkValidated, setLinkValidated] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  // Form Details
  const [locationData, setLocationData] = useState({
    name: 'PARKit Innovation Center - West Lot',
    level: 'Ground Floor - Sector B',
    address: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru, KA 560001',
    latitude: 12.9782,
    longitude: 77.5913,
    totalSpots: 6,
    hourlyRate: 40,
    availableHours: '24/7 (Mon - Sun)',
    cameraId: 'CAM-01',
    cameraName: 'Overhead Smartphone Cam (Miniature Model)',
    streamUrl: 'http://192.168.1.105:8080/video',
    description: 'Clean parking facility configured for OpenCV miniature lot occupancy detection.'
  });

  // Step 1: Link validation / parsing
  const handleValidateLink = () => {
    setIsSearching(true);
    setTimeout(() => {
      // Regex coordinate extraction
      const coordMatch = mapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || mapsLink.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        setLocationData(prev => ({
          ...prev,
          latitude: parseFloat(coordMatch[1]),
          longitude: parseFloat(coordMatch[2])
        }));
      }
      setIsSearching(false);
      setLinkValidated(true);
    }, 500);
  };

  // Step 2: Interactive map marker adjustment simulation
  const handleMapClick = (latOffset, lngOffset) => {
    setLocationData(prev => ({
      ...prev,
      latitude: Number((prev.latitude + latOffset).toFixed(4)),
      longitude: Number((prev.longitude + lngOffset).toFixed(4))
    }));
  };

  // Cancel handling for initial setup
  const handleCancelClick = () => {
    if (isInitialSetup) {
      setShowCancelPrompt(true);
    } else {
      onClose();
    }
  };

  // Final Submit
  const handleSaveAndActivate = (e) => {
    e.preventDefault();
    addLocation({
      ...locationData,
      totalSpots: parseInt(locationData.totalSpots) || 6,
      hourlyRate: parseFloat(locationData.hourlyRate) || 40,
      googleMapsUrl: mapsLink || `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`
    });
    if (onClose) onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isInitialSetup ? 'bg-gray-50' : 'bg-black/40 backdrop-blur-xs'
    } overflow-y-auto animate-in fade-in duration-200`}>
      
      <div 
        className={`w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6 my-auto ${
          isInitialSetup ? 'ring-1 ring-gray-200' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header: In Initial Setup show Logo and Welcome Banner */}
        {isInitialSetup ? (
          <div className="text-center pb-4 border-b border-gray-100 space-y-2">
            <div className="flex justify-center mb-1">
              <div className="h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-xs p-1 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="PARKit" 
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Step 2 of 3 • First-Time Location Setup
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                Add & Activate Your Parking Location
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-0.5">
                Before accessing your dashboard, please link your Google Maps parking facility and connect your camera.
              </p>
            </div>
          </div>
        ) : (
          /* Normal Modal Header */
          <div className="flex items-start justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Add Parking Location
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Follow 3 simple steps to register a new facility with Google Maps & Camera.
              </p>
            </div>
            <button
              onClick={handleCancelClick}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* 3-Step Progress Indicator */}
        <div className="flex items-center justify-between px-2 sm:px-6">
          
          {/* Step 1 Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              1
            </div>
            <span className={`text-xs ${step >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
              Link Location
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

          {/* Step 2 Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              2
            </div>
            <span className={`text-xs ${step >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
              Confirm on Map
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

          {/* Step 3 Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              3
            </div>
            <span className={`text-xs ${step >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
              Basic Details
            </span>
          </div>

        </div>

        {/* STEP 1: LINK LOCATION */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Paste Google Maps Link or Enter Location
              </label>
              
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    placeholder="https://maps.app.goo.gl/... or https://maps.google.com/?q=12.9782,77.5913"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleValidateLink}
                  disabled={isSearching}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 flex items-center space-x-1"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{isSearching ? 'Finding...' : 'Find & Validate'}</span>
                </button>
              </div>

              {/* Sample link filler shortcut */}
              <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                <span>Sample location shortcut:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMapsLink('https://maps.google.com/?q=12.9782,77.5913');
                    setLocationData(prev => ({
                      ...prev,
                      name: 'PARKit Innovation Center - West Lot',
                      address: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru, KA 560001',
                      latitude: 12.9782,
                      longitude: 77.5913
                    }));
                    setLinkValidated(true);
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Use Demo Parking Lot (Bengaluru)
                </button>
              </div>

              {linkValidated && (
                <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Location found and validated successfully. Click Next to confirm.</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Entering a pinned Google Maps share link automatically resolves its GPS coordinates, place context, and physical address.
            </p>
          </div>
        )}

        {/* STEP 2: CONFIRM ON MAP */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Interactive Map Location
              </h4>
              <p className="text-xs text-gray-500">
                Confirm your parking facility location or use the nudge buttons to align the map pin.
              </p>
            </div>

            {/* Interactive Map Visualizer */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-gray-300 h-52 flex items-center justify-center shadow-inner">
              
              {/* Map grid lines texture */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]"></div>

              {/* Pin Marker */}
              <div className="relative z-10 text-center animate-bounce">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg border-2 border-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold bg-white/95 text-gray-900 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm mt-1 block">
                  PARKit Location Pin
                </span>
              </div>

              {/* Coordinate adjust arrows */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/95 p-1 rounded-md border border-gray-200 text-[10px] text-gray-600 shadow-xs">
                <span>Move pin:</span>
                <button type="button" onClick={() => handleMapClick(0.0005, 0)} className="px-1.5 py-0.5 hover:bg-gray-100 rounded font-bold">↑</button>
                <button type="button" onClick={() => handleMapClick(-0.0005, 0)} className="px-1.5 py-0.5 hover:bg-gray-100 rounded font-bold">↓</button>
                <button type="button" onClick={() => handleMapClick(0, -0.0005)} className="px-1.5 py-0.5 hover:bg-gray-100 rounded font-bold">←</button>
                <button type="button" onClick={() => handleMapClick(0, 0.0005)} className="px-1.5 py-0.5 hover:bg-gray-100 rounded font-bold">→</button>
              </div>

              <div className="absolute top-2 right-2 bg-white/95 px-2.5 py-1 rounded text-[11px] font-mono font-semibold text-gray-700 border border-gray-200 shadow-xs">
                Lat: {locationData.latitude}, Lng: {locationData.longitude}
              </div>
            </div>

            {/* Resolved Address and Coordinates */}
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
              <div className="flex items-start justify-between">
                <span className="font-semibold text-gray-700">Confirmed Address:</span>
                <span className="text-gray-900 font-medium text-right max-w-xs">{locationData.address}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500 font-mono text-[11px]">
                <span>Coordinates:</span>
                <span className="text-blue-700 font-bold">{locationData.latitude}, {locationData.longitude}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BASIC DETAILS */}
        {step === 3 && (
          <form onSubmit={handleSaveAndActivate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parking Lot Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={locationData.name}
                  onChange={(e) => setLocationData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Level / Section
                </label>
                <input
                  type="text"
                  value={locationData.level}
                  onChange={(e) => setLocationData(prev => ({ ...prev, level: e.target.value }))}
                  placeholder="e.g. Ground Floor - Main Lot"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Number of Parking Spaces
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={locationData.totalSpots}
                  onChange={(e) => setLocationData(prev => ({ ...prev, totalSpots: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hourly Parking Rate (₹/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={locationData.hourlyRate}
                  onChange={(e) => setLocationData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Connected Camera ID
                </label>
                <input
                  type="text"
                  value={locationData.cameraId}
                  onChange={(e) => setLocationData(prev => ({ ...prev, cameraId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Camera Video Stream URL (RTSP / HTTP)
                </label>
                <input
                  type="text"
                  value={locationData.streamUrl}
                  onChange={(e) => setLocationData(prev => ({ ...prev, streamUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>
          </form>
        )}

        {/* Modal Bottom Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={step === 1 ? handleCancelClick : () => setStep(step - 1)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            {step > 1 && <ArrowLeft className="h-3.5 w-3.5" />}
            <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center space-x-1"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndActivate}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                Save & Activate Location
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Cancel Prompt Dialog for Initial Setup */}
      {showCancelPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h4 className="font-bold text-gray-900 text-sm">Cancel Location Setup?</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              If location setup is cancelled, no incomplete location will be saved. You will return to the sign-in screen.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={() => setShowCancelPrompt(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Stay in Setup
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelPrompt(false);
                  logout();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Cancel & Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
