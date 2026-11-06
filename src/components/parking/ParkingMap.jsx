import MysoreLeafletMap from './MysoreLeafletMap';

export default function ParkingMap({
  locations = [],
  selectedLocation,
  onSelectLocation,
}) {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (googleApiKey) {
    return (
      <div className="relative w-full h-[440px] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-white">
        <iframe
          title="Google Maps Location View"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/search?key=${googleApiKey}&q=parking+near+Mysore`}
        />
      </div>
    );
  }

  // Interactive OpenStreetMap Leaflet Map centered on Mysore
  return (
    <div
      className="bg-white rounded-2xl border border-[#CBD5E1] p-3 shadow-xs relative overflow-hidden"
      style={{ position: 'relative', overflow: 'hidden', zIndex: 0 }}
    >
      <MysoreLeafletMap
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        height="440px"
      />
    </div>
  );
}
