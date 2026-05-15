import { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
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
              zoom: 15.5,
              pitch: 70,
              bearing: -20
            }}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            interactive={true}
            terrain={{ source: 'my-mapbox-dem', exaggeration: 1.5 }}
          >
            <Source
              id="my-mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
            <Layer
              id="3d-buildings"
              source="composite"
              source-layer="building"
              filter={['==', 'extrude', 'true']}
              type="fill-extrusion"
              minzoom={15}
              paint={{
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.6
              }}
            />
          </Map>
        </>
      ) : null}
      {/* Dark gradient overlay for extreme legibility of the UI on top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />
    </div>
  );
}
