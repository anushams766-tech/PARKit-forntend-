import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency } from '../../utils/formatters';
import { SLOT_STATUS } from '../../utils/constants';

// Mysore default coordinates (Mysore Palace / Central City)
const DEFAULT_CENTER = [12.3051, 76.6551];

export default function MysoreLeafletMap({
  locations = [],
  userCoordinates,
  selectedLocation,
  onSelectLocation,
  height = '360px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const navigate = useNavigate();

  // Initial map creation with StrictMode safety and resize handling
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safety: Remove any dangling Leaflet instance or ID to prevent "Map container is already initialized"
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const initialCenter = userCoordinates?.lat && userCoordinates?.lng
      ? [userCoordinates.lat, userCoordinates.lng]
      : selectedLocation?.coordinates?.lat && selectedLocation?.coordinates?.lng
      ? [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]
      : DEFAULT_CENTER;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Initial resize trigger after DOM layout calculation
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    // ResizeObserver to resize map when container or sidebar changes
    let resizeObserver = null;
    if (typeof window !== 'undefined' && window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
    };
  }, []);

  // Update center when user coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoordinates?.lat && userCoordinates?.lng) {
      map.setView([userCoordinates.lat, userCoordinates.lng], 14, { animate: true });

      // Render or update user position marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = L.divIcon({
        className: 'user-position-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 999px; background: rgba(37, 99, 235, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 14px; height: 14px; border-radius: 999px; background: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const userMarker = L.marker([userCoordinates.lat, userCoordinates.lng], {
        icon: userIcon,
        zIndexOffset: 100,
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 11px; font-weight: bold; color: #163A70; padding: 2px;">
          📍 You are here
        </div>
      `);

      userMarkerRef.current = userMarker;
    }
  }, [userCoordinates]);

  // Sync parking markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous parking markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (!locations || locations.length === 0) return;

    locations.forEach((loc) => {
      if (!loc || !loc.coordinates?.lat || !loc.coordinates?.lng) return;

      const emptySlots = loc.slots?.filter(s => s.status === SLOT_STATUS.EMPTY).length || 0;
      const occupiedSlots = loc.slots?.filter(s => s.status === SLOT_STATUS.OCCUPIED).length || 0;
      const isSelected = selectedLocation?.id === loc.id;
      const displayLocality = loc.locality || (loc.name ? loc.name.split(' ')[0] : 'Hub');

      // Blue marker pill
      const bluePinIcon = L.divIcon({
        className: 'parkit-blue-marker',
        html: `
          <div style="
            background-color: ${isSelected ? '#163A70' : '#2563EB'};
            color: #FFFFFF;
            padding: 5px 9px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 5px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
            white-space: nowrap;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            <span style="width: 7px; height: 7px; border-radius: 999px; background-color: ${emptySlots > 0 ? '#10B981' : '#F43F5E'}; display: inline-block;"></span>
            <span>${displayLocality}</span>
            <span style="background: rgba(255,255,255,0.25); padding: 1px 5px; border-radius: 8px; font-size: 10px;">${emptySlots} free</span>
          </div>
        `,
        iconSize: [110, 32],
        iconAnchor: [55, 16],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], {
        icon: bluePinIcon,
        zIndexOffset: isSelected ? 50 : 10,
      }).addTo(map);

      // Directions URL to Google Maps
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address || ((loc.name || 'Mysore') + ', Mysore, Karnataka'))}`;

      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #172554; padding: 4px; min-width: 220px;">
          <div style="font-size: 10px; font-weight: 800; color: #2563EB; text-transform: uppercase; margin-bottom: 2px;">
            ${loc.locality || 'Mysore Hub'}
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #163A70; margin-bottom: 4px; line-height: 1.2;">
            ${loc.name || 'Parking Hub'}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
            ${loc.address || 'Mysore, Karnataka'}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 8px; border-radius: 8px; margin-bottom: 8px;">
            <div>
              <span style="color: #10B981; font-weight: 800;">${emptySlots} Available</span>
              <span style="color: #64748B; font-size: 10px; margin-left: 4px;">(${occupiedSlots} taken)</span>
            </div>
            <strong style="color: #2563EB; font-size: 12px;">${formatCurrency(loc.hourlyRate)}/hr</strong>
          </div>

          <div style="display: flex; gap: 6px;">
            <a
              href="${directionsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="flex: 1; text-align: center; background: #EFF6FF; color: #2563EB; padding: 6px 8px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 11px; border: 1px solid #BFDBFE;"
            >
              Directions
            </a>
            <button
              id="btn-view-${loc.id}"
              style="flex: 1; text-align: center; background: #2563EB; color: #FFFFFF; padding: 6px 8px; border-radius: 8px; border: none; font-weight: 700; font-size: 11px; cursor: pointer;"
            >
              View Parking
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 280,
        autoPan: true,
      });

      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`btn-view-${loc.id}`);
        if (viewBtn) {
          viewBtn.onclick = () => {
            navigate(`/parking/${loc.id}`);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      markersRef.current.push(marker);
    });
  }, [locations, selectedLocation]);

  return (
    <div
      className="parkit-map-wrapper relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-xs bg-[#F8FAFC]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
        isolation: 'isolate',
      }}
    >
      <div
        ref={mapContainerRef}
        className="parkit-map-container"
        style={{
          height,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 0,
        }}
      />
    </div>
  );
}
