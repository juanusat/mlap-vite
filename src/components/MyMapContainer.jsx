import React, { useRef, useEffect, useState } from 'react';
import './MyMapContainer.css';

export default function MyMapContainer({ 
  locations = [], 
  onLocationSelect,
  selectedLocation = null,
  mapCenter = null, // Nueva prop para controlar el centrado del mapa
  initialCenter = [-6.77, -79.84],
  initialZoom = 13,
  onZoomChange
}) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

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

    leafletMap.on('zoomend', () => {
      const zoom = leafletMap.getZoom();
      setCurrentZoom(zoom);
      if (onZoomChange) {
        onZoomChange(zoom);
      }
    });

    setMap(leafletMap);
  };

  // Actualizar marcadores cuando cambian las ubicaciones o el zoom
  useEffect(() => {
    if (map && locations.length > 0) {
      updateMapMarkers(locations, map, currentZoom);
      
      // Si hay una sola ubicación, centrar el mapa en ella
      if (locations.length === 1) {
        map.flyTo([locations[0].latitud, locations[0].longitud], 15);
      }
    }
  }, [locations, map, currentZoom]);

  // Centrar mapa cuando cambia mapCenter (desde el dropdown)
  useEffect(() => {
    if (map && mapCenter) {
      map.flyTo([mapCenter.latitud, mapCenter.longitud], 15);
    }
  }, [mapCenter, map]);

  // Centrar mapa cuando cambia selectedLocation (click en marcador o grilla)
  useEffect(() => {
    if (map && selectedLocation) {
      map.flyTo([selectedLocation.latitud, selectedLocation.longitud], 15);
    }
  }, [selectedLocation, map]);

  const updateMapMarkers = (locs, leafletMap, zoom) => {
    if (!leafletMap || !window.L) return;

    // Limpiar marcadores anteriores
    Object.values(markers).forEach(marker => {
      leafletMap.removeLayer(marker);
    });

    const newMarkers = {};
    const locationsToShow = zoom >= 15 ? locs : locs.filter(l => l.tipo === 'parroquia');

    locationsToShow.forEach(location => {
      const isParroquia = location.tipo === 'parroquia';
      const iconColor = isParroquia ? 'red' : 'blue';
      const iconSize = isParroquia ? [35, 35] : [32, 32];

      const customIcon = window.L.divIcon({
        className: `custom-marker-${location.tipo}`,
        html: `<div style="
          background-color: ${iconColor};
          width: ${iconSize[0]}px;
          height: ${iconSize[1]}px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            color: var(--color-n-0);
            font-weight: bold;
            font-size: ${isParroquia ? '12px' : '10px'};
            transform: rotate(45deg);
          ">
            ${isParroquia ? 'P' : 'C'}
          </div>
        </div>`,
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]]
      });

      const marker = window.L.marker([location.latitud, location.longitud], { icon: customIcon })
        .addTo(leafletMap)
        .bindPopup(`
          <b>${location.nombre}</b><br>
          <small>${location.tipo === 'parroquia' ? 'Parroquia' : 'Capilla'}</small><br>
          Haz clic para ver más.
        `);

      marker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
        leafletMap.flyTo([location.latitud, location.longitud], 15);
      });

      newMarkers[`${location.tipo}-${location.id}`] = marker;
    });

    setMarkers(newMarkers);
  };

  return (
    <div className="map-container">
      <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
      <div className={`zoom-info ${currentZoom >= 15 ? 'show-chapels' : ''}`}>
        {currentZoom >= 15
          ? "🔍 Zoom alto: Se muestran parroquias y capillas"
          : "🔍 Haz zoom para ver las capillas"
        }
      </div>
    </div>
  );
}
