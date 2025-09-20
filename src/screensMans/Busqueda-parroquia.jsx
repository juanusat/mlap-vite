import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import MyBarSearchGen from '../components/MyBarSearchGen';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import ScreenMan from '../components/ScreenMan';
import '../utils/Estilos-Generales-1.css';
import './Busqueda-parroquia.css';
import '../App.css';


// Datos simulados de parroquias con coordenadas y eventos
const parroquiasData = [
    {
      id: 1,
      nombre: "Santa María Catedral",
      tipo: "parroquia",
      latitud: -6.771611,
      longitud: -79.837778,
      direccion: "Plaza de Armas, Chiclayo",
      telefono: "(074) 123-456",
      parroco: "Padre José García",
      descripcion: "Catedral principal de la Diócesis de Chiclayo",
      eventos: [
        { id: 1, nombre: "Matrimonio" },
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 4, nombre: "Confirmación" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 2,
      nombre: "El Señor de los Milagros",
      tipo: "parroquia",
      latitud: -6.7725,
      longitud: -79.8341,
      direccion: "Av. Bolognesi 485, Chiclayo",
      telefono: "(074) 234-567",
      parroco: "Padre Miguel Rodríguez",
      descripcion: "Parroquia dedicada al Señor de los Milagros",
      eventos: [
        { id: 1, nombre: "Matrimonio" },
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 4, nombre: "Confirmación" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 3,
      nombre: "Santa Rosa de Lima",
      tipo: "parroquia",
      latitud: -6.748333,
      longitud: -79.835,
      direccion: "Calle Santa Rosa 123, Chiclayo",
      telefono: "(074) 345-678",
      parroco: "Padre Carlos Mendoza",
      descripcion: "Parroquia en honor a Santa Rosa de Lima",
      eventos: [
        { id: 1, nombre: "Matrimonio" },
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 4, nombre: "Confirmación" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 4,
      nombre: "San José Obrero",
      tipo: "parroquia",
      latitud: -6.7975,
      longitud: -79.8441,
      direccion: "Av. José Balta 789, Chiclayo",
      telefono: "(074) 456-789",
      parroco: "Padre Luis Fernández",
      descripcion: "Parroquia dedicada a San José Obrero",
      eventos: [
        { id: 1, nombre: "Matrimonio" },
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 4, nombre: "Confirmación" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 5,
      nombre: "Sagrado Corazón de Jesús",
      tipo: "parroquia",
      latitud: -6.7533,
      longitud: -79.8525,
      direccion: "Av. Leguía 234, Chiclayo",
      telefono: "(074) 567-890",
      parroco: "Padre Antonio Silva",
      descripcion: "Parroquia del Sagrado Corazón de Jesús",
      eventos: [
        { id: 1, nombre: "Matrimonio" },
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 4, nombre: "Confirmación" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    }
  ];

// Datos simulados de capillas asociadas a parroquias
const capillasData = [
    // Capillas de Santa María Catedral (id: 1)
    {
      id: 101,
      nombre: "Capilla del Santísimo Sacramento",
      tipo: "capilla",
      parroquiaId: 1,
      latitud: -6.7720,
      longitud: -79.8385,
      direccion: "Calle San José 145, Chiclayo",
      telefono: "(074) 123-457",
      encargado: "Hermana María Gonzáles",
      descripcion: "Capilla dedicada al Santísimo Sacramento",
      eventos: [
        { id: 1, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 102,
      nombre: "Capilla San Francisco",
      tipo: "capilla",
      parroquiaId: 1,
      latitud: -6.7695,
      longitud: -79.8395,
      direccion: "Jr. Francisco Bolognesi 67, Chiclayo",
      telefono: "(074) 123-458",
      encargado: "Padre Juan Carlos",
      descripcion: "Capilla en honor a San Francisco de Asís",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    
    // Capillas de El Señor de los Milagros (id: 2)
    {
      id: 201,
      nombre: "Capilla Virgen de Fátima",
      tipo: "capilla",
      parroquiaId: 2,
      latitud: -6.7735,
      longitud: -79.8355,
      direccion: "Av. Grau 456, Chiclayo",
      telefono: "(074) 234-568",
      encargado: "Hermana Carmen López",
      descripcion: "Capilla dedicada a la Virgen de Fátima",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    
    // Capillas de Santa Rosa de Lima (id: 3)
    {
      id: 301,
      nombre: "Capilla San Antonio",
      tipo: "capilla",
      parroquiaId: 3,
      latitud: -6.7465,
      longitud: -79.8365,
      direccion: "Calle Los Laureles 89, Chiclayo",
      telefono: "(074) 345-679",
      encargado: "Padre Roberto Díaz",
      descripcion: "Capilla dedicada a San Antonio de Padua",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 302,
      nombre: "Capilla Virgen del Carmen",
      tipo: "capilla",
      parroquiaId: 3,
      latitud: -6.7455,
      longitud: -79.8335,
      direccion: "Jr. El Carmen 234, Chiclayo",
      telefono: "(074) 345-680",
      encargado: "Hermana Rosa Medina",
      descripcion: "Capilla en honor a la Virgen del Carmen",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 303,
      nombre: "Capilla Santa Teresita",
      tipo: "capilla",
      parroquiaId: 3,
      latitud: -6.7475,
      longitud: -79.8345,
      direccion: "Av. Santa Teresa 678, Chiclayo",
      telefono: "(074) 345-681",
      encargado: "Padre Miguel Herrera",
      descripcion: "Capilla dedicada a Santa Teresita del Niño Jesús",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" }
      ]
    },
    
    // Capillas de San José Obrero (id: 4)
    {
      id: 401,
      nombre: "Capilla Cristo Rey",
      tipo: "capilla",
      parroquiaId: 4,
      latitud: -6.7985,
      longitud: -79.8455,
      direccion: "Calle Cristo Rey 123, Chiclayo",
      telefono: "(074) 456-790",
      encargado: "Padre Carlos Vega",
      descripcion: "Capilla dedicada a Cristo Rey",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    {
      id: 402,
      nombre: "Capilla San Judas Tadeo",
      tipo: "capilla",
      parroquiaId: 4,
      latitud: -6.7965,
      longitud: -79.8425,
      direccion: "Jr. San Judas 345, Chiclayo",
      telefono: "(074) 456-791",
      encargado: "Hermana Isabel Torres",
      descripcion: "Capilla en honor a San Judas Tadeo",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    },
    
    // Capillas de Sagrado Corazón de Jesús (id: 5)
    {
      id: 501,
      nombre: "Capilla Inmaculada Concepción",
      tipo: "capilla",
      parroquiaId: 5,
      latitud: -6.7545,
      longitud: -79.8535,
      direccion: "Av. La Inmaculada 567, Chiclayo",
      telefono: "(074) 567-891",
      encargado: "Padre Fernando Ruiz",
      descripcion: "Capilla de la Inmaculada Concepción",
      eventos: [
        { id: 2, nombre: "Bautismo" },
        { id: 3, nombre: "Primera Comunión" },
        { id: 5, nombre: "Misa de Difuntos" }
      ]
    }
  ];

// Función para obtener todas las ubicaciones (parroquias + capillas)
const getAllLocations = () => {
  return [...parroquiasData, ...capillasData];
};

// Función para obtener capillas de una parroquia específica
const getCapillasByParroquia = (parroquiaId) => {
  return capillasData.filter(capilla => capilla.parroquiaId === parroquiaId);
};
export default function BuscarParroquia() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null); // Cambié de selectedParroquia
  const [selectedParroquiaForGrid, setSelectedParroquiaForGrid] = useState(null); // Nueva para el grid
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(getAllLocations()); // Cambié de filteredParroquias
  const [searchParams] = useSearchParams(); //  Hook para leer parámetros de la URL
  const [currentZoom, setCurrentZoom] = useState(13);

  //  Nuevo useEffect para leer el parámetro de la URL al cargar la página
  useEffect(() => {
    const urlSearchTerm = searchParams.get('q');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

  // Cargar Leaflet dinámicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      // ... (código existente) ...
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
      // Limpiar en unmount
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Filtrar ubicaciones por búsqueda (parroquias y capillas)
  useEffect(() => {
    const allLocations = getAllLocations();
    const filtered = allLocations.filter(location =>
      location.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
    
    // Si la ubicación seleccionada no está en los resultados filtrados, deseleccionarla
    if (selectedLocation && !filtered.find(l => l.id === selectedLocation.id && l.tipo === selectedLocation.tipo)) {
      setSelectedLocation(null);
    }
    
    // Si la parroquia seleccionada para el grid no está en las parroquias filtradas, deseleccionarla
    if (selectedParroquiaForGrid) {
      const filteredParroquias = filtered.filter(l => l.tipo === 'parroquia');
      if (!filteredParroquias.find(p => p.id === selectedParroquiaForGrid.id)) {
        setSelectedParroquiaForGrid(null);
      }
    }
    
    // Actualizar marcadores en el mapa
    if (map) {
      updateMapMarkers(filtered);
    }
  }, [searchTerm, map, selectedLocation, selectedParroquiaForGrid]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    const leafletMap = window.L.map(mapRef.current).setView([-6.77, -79.84], 13);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Escuchar cambios de zoom
    leafletMap.on('zoomend', () => {
      const zoom = leafletMap.getZoom();
      setCurrentZoom(zoom);
      updateMapMarkers(filteredLocations, leafletMap, zoom);
    });

    setMap(leafletMap);
    updateMapMarkers(getAllLocations(), leafletMap, 13);
  };

  const updateMapMarkers = (locations, leafletMap = map, zoom = currentZoom) => {
    if (!leafletMap || !window.L) return;

    // Limpiar marcadores existentes
    Object.values(markers).forEach(marker => {
      leafletMap.removeLayer(marker);
    });

    const newMarkers = {};

    // Mostrar solo parroquias en zoom bajo, ambas en zoom alto
    const locationsToShow = zoom >= 15 ? locations : locations.filter(l => l.tipo === 'parroquia');

    locationsToShow.forEach(location => {
      // Crear iconos diferentes para parroquias y capillas
      const isParroquia = location.tipo === 'parroquia';
      const iconColor = isParroquia ? 'red' : 'blue';
      const iconSize = isParroquia ? [25, 41] : [20, 32];
      
      // Crear marcador personalizado
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
            color: white;
            font-weight: bold;
            font-size: ${isParroquia ? '12px' : '10px'};
            transform: rotate(45deg);
          ">
            ${isParroquia ? 'P' : 'C'}
          </div>
        </div>`,
        iconSize: iconSize,
        iconAnchor: [iconSize[0]/2, iconSize[1]]
      });

      const marker = window.L.marker([location.latitud, location.longitud], { icon: customIcon })
        .addTo(leafletMap)
        .bindPopup(`
          <b>${location.nombre}</b><br>
          <small>${location.tipo === 'parroquia' ? 'Parroquia' : 'Capilla'}</small><br>
          Haz clic para ver más.
        `);

      marker.on('click', () => {
        setSelectedLocation(location);
        leafletMap.flyTo([location.latitud, location.longitud], 15);
      });

      newMarkers[`${location.tipo}-${location.id}`] = marker;
    });

    setMarkers(newMarkers);
  };

  const handleVerPerfil = () => {
    navigate('/inicio');
  };

  const handleParroquiaSelect = (e) => {
    const parroquiaId = parseInt(e.target.value);
    if (parroquiaId) {
      const parroquia = parroquiasData.find(p => p.id === parroquiaId);
      setSelectedParroquiaForGrid(parroquia);
      setSelectedLocation(null); // Limpiar selección individual
      if (map && parroquia) {
        map.flyTo([parroquia.latitud, parroquia.longitud], 15);
      }
    } else {
      setSelectedParroquiaForGrid(null);
      setSelectedLocation(null);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSelectedParroquiaForGrid(null); // Limpiar selección del grid
    if (map) {
      map.flyTo([location.latitud, location.longitud], 15);
    }
  };

  //  Modificamos la SearchBar para que reciba y muestre el término de búsqueda
  //   y para que actualice el searchTerm del estado cuando el usuario escribe.
  return (
    <ScreenMan>
      <div className="content-module only-this">
        <h2 className='title-screen'>Búsqueda de Parroquias</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <MyBarSearchGen 
                mode="local"
                value={searchTerm} //  Pasamos el valor del estado al componente
                onSearchChange={setSearchTerm} 
                placeholder="Buscar parroquias y capillas..." 
              />
            </div>
          </div>
          
          <div className="map-container-wrapper">
            <div className="map-container">
              <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
            </div>
            
            <div className="parish-info-panel">
              {!selectedLocation ? (
                // Panel por defecto con combo box
                <div className="parish-selector-panel">
                  <div className="parish-info-header">
                    <h3>Seleccionar Parroquia</h3>
                  </div>
                  
                  <div className="parish-info-content">
                    <div className="parish-selector">
                      <label htmlFor="parroquia-select">Elige una parroquia:</label>
                      <select 
                        id="parroquia-select"
                        className="parroquia-select"
                        onChange={handleParroquiaSelect}
                        value={selectedParroquiaForGrid ? selectedParroquiaForGrid.id : ""}
                      >
                        <option value="">-- Selecciona una parroquia --</option>
                        {parroquiasData.filter(parroquia => {
                          // Solo mostrar parroquias que coincidan con la búsqueda
                          return parroquia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 parroquia.direccion.toLowerCase().includes(searchTerm.toLowerCase());
                        }).map(parroquia => (
                          <option key={parroquia.id} value={parroquia.id}>
                            {parroquia.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="instructions">
                      <div className={`zoom-info ${currentZoom >= 15 ? 'show-chapels' : ''}`}>
                        {currentZoom >= 15 
                          ? "🔍 Zoom alto: Se muestran parroquias y capillas" 
                          : "🔍 Haz zoom para ver las capillas"
                        }
                      </div>
                      <p>
                        {selectedParroquiaForGrid 
                          ? `Selecciona la parroquia "${selectedParroquiaForGrid.nombre}" o una de sus capillas:` 
                          : "Puedes seleccionar una parroquia de la lista o hacer clic directamente en los marcadores del mapa para ver información detallada."
                        }
                      </p>
                      
                      <div className="parishes-list">
                        <h4>
                          {selectedParroquiaForGrid 
                            ? `${selectedParroquiaForGrid.nombre} y sus capillas:` 
                            : `${currentZoom >= 15 ? 'Parroquias y capillas' : 'Parroquias'} disponibles:`
                          }
                        </h4>
                        <div className="parishes-grid">
                          {selectedParroquiaForGrid ? (
                            // Mostrar parroquia seleccionada y sus capillas
                            <>
                              <div 
                                key={`parroquia-${selectedParroquiaForGrid.id}`}
                                className="parish-card parroquia-card"
                                onClick={() => handleLocationSelect(selectedParroquiaForGrid)}
                              >
                                <h5>{selectedParroquiaForGrid.nombre}</h5>
                                <p>{selectedParroquiaForGrid.direccion}</p>
                                <span className="location-type">Parroquia</span>
                              </div>
                              {getCapillasByParroquia(selectedParroquiaForGrid.id).map(capilla => (
                                <div 
                                  key={`capilla-${capilla.id}`}
                                  className="parish-card capilla-card"
                                  onClick={() => handleLocationSelect(capilla)}
                                >
                                  <h5>{capilla.nombre}</h5>
                                  <p>{capilla.direccion}</p>
                                  <span className="location-type">Capilla</span>
                                </div>
                              ))}
                            </>
                          ) : (
                            // Mostrar todas las ubicaciones filtradas
                            filteredLocations
                              .filter(location => currentZoom >= 15 || location.tipo === 'parroquia')
                              .map(location => (
                                <div 
                                  key={`${location.tipo}-${location.id}`}
                                  className={`parish-card ${location.tipo}-card`}
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  <h5>{location.nombre}</h5>
                                  <p>{location.direccion}</p>
                                  <span className="location-type">
                                    {location.tipo === 'parroquia' ? 'Parroquia' : 'Capilla'}
                                  </span>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Panel de información de ubicación seleccionada
                <div className="parish-details-panel">
                  <div className="parish-info-header">
                    <h3>{selectedLocation.nombre}</h3>
                    <button 
                      className="close-panel-btn"
                      onClick={() => {
                        setSelectedLocation(null);
                        setSelectedParroquiaForGrid(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="parish-info-content">
                    <div className="parish-basic-info">
                      <p><strong>Tipo:</strong> {selectedLocation.tipo === 'parroquia' ? 'Parroquia' : 'Capilla'}</p>
                      <p><strong>Dirección:</strong> {selectedLocation.direccion}</p>
                      <p><strong>Teléfono:</strong> {selectedLocation.telefono}</p>
                      <p><strong>{selectedLocation.tipo === 'parroquia' ? 'Párroco' : 'Encargado'}:</strong> {selectedLocation.parroco || selectedLocation.encargado}</p>
                      <p><strong>Descripción:</strong> {selectedLocation.descripcion}</p>
                      {selectedLocation.tipo === 'capilla' && (
                        <p><strong>Parroquia madre:</strong> {parroquiasData.find(p => p.id === selectedLocation.parroquiaId)?.nombre}</p>
                      )}
                    </div>
                    
                    <div className="parish-events">
                      <h4>Actos Litúrgicos Disponibles</h4>
                      <div className="events-list">
                        {selectedLocation.eventos.map(evento => (
                          <div key={evento.id} className="event-item">
                            <span className="event-name">{evento.nombre}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="parish-actions">
                      <button 
                        className="btn-ver-perfil"
                        onClick={handleVerPerfil}
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScreenMan>
  );
}

