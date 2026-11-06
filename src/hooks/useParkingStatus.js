import { useState, useEffect, useRef, useCallback } from 'react';
import { parkingService } from '../services/parkingService';
import { POLLING_INTERVAL_MS, STALE_DATA_THRESHOLD_SECONDS, SLOT_STATUS } from '../utils/constants';

export function useParkingStatus(locationId) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const timerRef = useRef(null);
  const wsRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    if (!locationId) return;
    try {
      const res = await parkingService.getLocationStatus(locationId);
      setStatus(res.data);
      setIsDemo(res.isDemo);

      // Check freshness
      if (res.data?.lastDetection) {
        const diffSeconds = (Date.now() - new Date(res.data.lastDetection).getTime()) / 1000;
        setIsStale(diffSeconds > STALE_DATA_THRESHOLD_SECONDS);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch real-time parking status');
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    if (!locationId) return;

    fetchStatus();

    // Attempt WebSocket connection where supported
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//localhost:8000/ws/parking/${locationId}`;

    let socketOpened = false;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        socketOpened = true;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStatus(data);
          setIsStale(false);
        } catch (e) {
          // ignore parse error
        }
      };

      ws.onerror = () => {
        // Fallback to polling
      };
    } catch (e) {
      // WebSocket not available, fallback to polling
    }

    // Polling interval fallback (runs every 5-10s)
    timerRef.current = setInterval(() => {
      if (!socketOpened) {
        fetchStatus();
      }
    }, POLLING_INTERVAL_MS);

    // Cleanup on unmount - essential!
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [locationId, fetchStatus]);

  // Derived counts
  const emptyCount = status?.emptySlots || 0;
  const occupiedCount = status?.occupiedSlots || 0;
  const uncertainCount = status?.uncertainSlots || 0;
  const totalSlots = status?.totalSlots || (emptyCount + occupiedCount + uncertainCount);

  return {
    status,
    loading,
    error,
    isStale,
    isDemo,
    emptyCount,
    occupiedCount,
    uncertainCount,
    totalSlots,
    refetch: fetchStatus,
  };
}

