import { useEffect, useState } from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBackground() {
  const [mounted, setMounted] = useState(false);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 mapbox-container bg-neutral-950">
      {mounted && mapboxToken ? (
        <>
          <Map
            mapboxAccessToken={mapboxToken}
        style={{ width: '100vw', height: '100vh' }}
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
        </>
      ) : null}
      {/* Dark gradient overlay for extreme legibility of the UI on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />
    </div>
  );
}
