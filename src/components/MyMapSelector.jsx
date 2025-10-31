import React, { useRef, useEffect, useState } from 'react';
import './MyMapContainer.css';

export default function MyMapSelector({ 
  onMapClick,
  selectedCoordinates = null,
  initialCenter = [-6.77, -79.84],
  initialZoom = 13
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Cargar Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.body.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
      if (mapRef.current && mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }
    };
  }, []);

  // Inicializar el mapa
  const initMap = () => {
    if (!window.L || !mapRef.current) return;
    
    if (mapRef.current._leaflet_id) {
      return;
    }

    const leafletMap = window.L.map(mapRef.current).setView(initialCenter, initialZoom);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Agregar evento de clic en el mapa
    leafletMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (onMapClick) {
        onMapClick({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      }
    });

    setMap(leafletMap);
  };

  // Actualizar marcador cuando cambian las coordenadas seleccionadas
  useEffect(() => {
    if (map && window.L) {
      // Limpiar marcador anterior
      if (marker) {
        map.removeLayer(marker);
      }

      // Agregar nuevo marcador si hay coordenadas seleccionadas
      if (selectedCoordinates) {
        const newMarker = window.L.marker([
          parseFloat(selectedCoordinates.lat), 
          parseFloat(selectedCoordinates.lng)
        ]).addTo(map);
        
        newMarker.bindPopup(`
          <b>Ubicación seleccionada</b><br>
          Lat: ${selectedCoordinates.lat}<br>
          Lng: ${selectedCoordinates.lng}
        `).openPopup();

        setMarker(newMarker);

        // Centrar el mapa en el marcador
        map.flyTo([
          parseFloat(selectedCoordinates.lat), 
          parseFloat(selectedCoordinates.lng)
        ], 15);
      }
    }
  }, [selectedCoordinates, map]);

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
      <div className="map-instructions">
        📍 Haz clic en cualquier punto del mapa para seleccionar la ubicación
      </div>
    </div>
  );
}
