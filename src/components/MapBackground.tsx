import { useEffect, useState } from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBackground() {
  const [mounted, setMounted] = useState(false);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !mapboxToken) {
    if (mounted && !mapboxToken) {
      console.warn("Mapbox token is missing from environment variables.");
    }
    return <div className="absolute inset-0 z-0 bg-neutral-950" />;
  }

  return (
    <div className="absolute inset-0 z-0 opacity-0 mapbox-container">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: 74.4371, // DHA Phase 6 roughly (Lahore, Pakistan)
          latitude: 31.4684,
          zoom: 14,
          pitch: 60,
          bearing: -15
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactive={true} 
      />
      {/* Dark gradient overlay for extreme legibility of the UI on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />
    </div>
  );
}
