import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reverseGeocode, DEFAULT_USER_LOCATION } from '../../utils/locationData';
import CascadingLocationPicker from '../../components/common/CascadingLocationPicker';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { MapPin, Navigation, Compass, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { LOGO_PATH } from '../../utils/constants';

export default function LocationPermission() {
  const { updateLocation, user } = useAuth();
  const navigate = useNavigate();

  const [detecting, setDetecting] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualLocation, setManualLocation] = useState(DEFAULT_USER_LOCATION);
  const [errorNotice, setErrorNotice] = useState('');

  const proceedToDriverProfile = (finalLocation) => {
    updateLocation(finalLocation);
    // If user already completed onboarding, go to dashboard; otherwise go to Driver Details step
    if (user?.onboardingComplete) {
      navigate('/home', { replace: true });
    } else {
      navigate('/onboarding/profile', { replace: true });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorNotice('Geolocation is not supported by your browser. Please select your location manually below.');
      setShowManual(true);
      return;
    }

    setDetecting(true);
    setErrorNotice('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const resolved = await reverseGeocode(latitude, longitude);
          const finalLocation = {
            ...resolved,
            coordinates: { lat: latitude, lng: longitude },
            isDetected: true,
          };
          proceedToDriverProfile(finalLocation);
        } catch (e) {
          // Fallback to Mysore with detected coords
          const fallback = {
            country: 'India',
            state: 'Karnataka',
            district: 'Mysore (Mysuru)',
            locality: 'Vijayanagar',
            coordinates: { lat: latitude, lng: longitude },
            isDetected: true,
          };
          proceedToDriverProfile(fallback);
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        setErrorNotice('Location access was denied or timed out. Please type or select your location manually below.');
        setShowManual(true);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualConfirm = (confirmedLoc) => {
    const locWithCoords = {
      ...confirmedLoc,
      coordinates: confirmedLoc.coordinates || { lat: 12.3051, lng: 76.6554 },
      isDetected: false,
    };
    proceedToDriverProfile(locWithCoords);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-lg w-full space-y-6">
        {/* PARKit Logo Container */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto flex items-center justify-center p-2 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs overflow-hidden">
            <img
              src={LOGO_PATH}
              alt="PARKit Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Permission Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center relative shadow-xs">
              <Navigation className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#2563EB] animate-ping" />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              Where are you parking?
            </h2>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              PARKit locates overhead-camera monitored parking hubs in your district and neighborhood.
            </p>
          </div>

          {errorNotice && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              fullWidth
              disabled={detecting}
              onClick={handleUseCurrentLocation}
              className="flex items-center justify-center gap-2 py-3 text-sm shadow-sm"
            >
              {detecting ? (
                <>
                  <Loader size="sm" />
                  <span>Detecting GPS Coordinates...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Use My Current Location</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="w-full text-center text-xs font-bold text-[#2563EB] hover:text-[#163A70] py-2 transition-colors cursor-pointer"
            >
              {showManual ? 'Hide Manual Location Picker' : 'Or Search & Type Location Manually'}
            </button>
          </div>

          {/* Searchable Cascading Location Picker */}
          {showManual && (
            <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#163A70]">
                <Compass className="w-4 h-4 text-[#2563EB]" />
                <span>Select or Search Location</span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Type to search countries, Indian states, districts, and localities with instant autocomplete suggestions.
              </p>

              <CascadingLocationPicker
                value={manualLocation}
                onChange={setManualLocation}
                onConfirm={handleManualConfirm}
                showConfirmButton={true}
              />
            </div>
          )}

          {/* Status Note */}
          <div className="pt-2 text-center text-[11px] text-[#64748B] flex items-center justify-center gap-1.5 border-t border-[#F1F5F9]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Currently live in Mysuru with 10 overhead-camera verified hubs.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
