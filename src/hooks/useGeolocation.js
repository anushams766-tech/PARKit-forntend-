import { useState, useEffect, useCallback } from 'react';

export function useGeolocation(autoFetch = false) {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        let msg = 'Unable to retrieve location.';
        if (err.code === 1) msg = 'Location permission was denied. You can search manually.';
        else if (err.code === 2) msg = 'Location is unavailable. Please search manually.';
        else if (err.code === 3) msg = 'Location request timed out.';
        setError(msg);
        setLoading(false);
        // Fallback default coordinates (e.g. San Francisco downtown)
        setCoordinates({ lat: 37.7749, lng: -122.4194, isDefault: true });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (autoFetch) {
      requestLocation();
    }
  }, [autoFetch, requestLocation]);

  return { coordinates, error, loading, requestLocation };
}

