import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MyBarSearchGen from '../components/MyBarSearchGen';
import MyButtonShortAction from '../components/MyButtonShortAction';
import ScreenMan from '../components/ScreenMan';
import '../utils/Estilos-Generales-1.css';
import './Busqueda-parroquia.css';
import * as publicChurchService from '../services/publicChurchService';

const parroquiasDataOLD = [
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

const capillasDataOLD = [
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

export default function BuscarParroquia() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null); 
  const [selectedByUser, setSelectedByUser] = useState(false);
  const [selectedParroquiaForGrid, setSelectedParroquiaForGrid] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]); 
  const [searchParams] = useSearchParams();
  const [currentZoom, setCurrentZoom] = useState(13);
  const [loading, setLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [locationActs, setLocationActs] = useState([]);
  const [parishChapels, setParishChapels] = useState([]);

  const parseCoordinates = (coordString) => {
    if (!coordString) return [0, 0];
    const parts = coordString.split(',').map(s => parseFloat(s.trim()));
    return parts.length === 2 ? parts : [0, 0];
  };

  const loadAllLocations = async () => {
    try {
      setLoading(true);
      const response = await publicChurchService.searchChurches('', 1, 1000);
      const locations = response.data.map(loc => ({
        id: loc.id,
        nombre: loc.name,
        direccion: loc.address,
        tipo: loc.type.toLowerCase() === 'parroquia' ? 'parroquia' : 'capilla',
        coordinates: loc.coordinates,
        latitud: parseCoordinates(loc.coordinates)[0],
        longitud: parseCoordinates(loc.coordinates)[1]
      }));
      setAllLocations(locations);
      setFilteredLocations(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadParishWithChapels = async (parishId) => {
    try {
      const response = await publicChurchService.selectParish(parishId);
      if (response.data.selected_parish) {
        const parish = {
          id: response.data.selected_parish.id,
          nombre: response.data.selected_parish.name,
          direccion: response.data.selected_parish.address,
          tipo: 'parroquia',
          coordinates: response.data.selected_parish.coordinates,
          latitud: parseCoordinates(response.data.selected_parish.coordinates)[0],
          longitud: parseCoordinates(response.data.selected_parish.coordinates)[1]
        };
        
        const chapels = response.data.chapels.map(ch => ({
          id: ch.id,
          nombre: ch.name,
          direccion: ch.address,
          tipo: 'capilla',
          parroquiaId: parishId,
          coordinates: ch.coordinates,
          latitud: parseCoordinates(ch.coordinates)[0],
          longitud: parseCoordinates(ch.coordinates)[1]
        }));
        
        setSelectedParroquiaForGrid(parish);
        setParishChapels(chapels);
      }
    } catch (error) {
      console.error('Error loading parish chapels:', error);
    }
  };

  const loadLocationDetails = async (locationId) => {
    try {
      const [infoResponse, actsResponse] = await Promise.all([
        publicChurchService.getChapelInfo(locationId),
        publicChurchService.getChapelActs(locationId)
      ]);
      
      setLocationDetails(infoResponse.data);
      setLocationActs(actsResponse.data);
    } catch (error) {
      console.error('Error loading location details:', error);
    }
  };

  useEffect(() => {
    loadAllLocations();
  }, []);
 
  useEffect(() => {
    const urlSearchTerm = searchParams.get('q');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams]);

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

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const response = await publicChurchService.searchChurches(searchTerm, 1, 1000);
        const locations = response.data.map(loc => ({
          id: loc.id,
          nombre: loc.name,
          direccion: loc.address,
          tipo: loc.type.toLowerCase() === 'parroquia' ? 'parroquia' : 'capilla',
          coordinates: loc.coordinates,
          latitud: parseCoordinates(loc.coordinates)[0],
          longitud: parseCoordinates(loc.coordinates)[1]
        }));
        setFilteredLocations(locations);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm !== undefined) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    if (map && filteredLocations.length > 0) {
      updateMapMarkers(filteredLocations);
    }
  }, [filteredLocations, map, currentZoom]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;
    
    if (mapRef.current._leaflet_id) {
      return;
    }

    const leafletMap = window.L.map(mapRef.current).setView([-6.77, -79.84], 13);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    leafletMap.on('zoomend', () => {
      const zoom = leafletMap.getZoom();
      setCurrentZoom(zoom);
    });

    setMap(leafletMap);
  };

  const updateMapMarkers = (locations, leafletMap = map, zoom = currentZoom) => {
    if (!leafletMap || !window.L) return;

    Object.values(markers).forEach(marker => {
      leafletMap.removeLayer(marker);
    });

    const newMarkers = {};
    const locationsToShow = zoom >= 15 ? locations : locations.filter(l => l.tipo === 'parroquia');

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

      marker.on('click', async () => {
        setSelectedLocation(location);
        setSelectedByUser(true);
        leafletMap.flyTo([location.latitud, location.longitud], 15);
        await loadLocationDetails(location.id);
      });

      newMarkers[`${location.tipo}-${location.id}`] = marker;
    });

    setMarkers(newMarkers);
  };

  const handleVerPerfil = () => {
    if (selectedLocation) {
      navigate(`/capilla?id=${selectedLocation.id}`);
    }
  };

  const handleParroquiaSelect = async (e) => {
    const parishId = parseInt(e.target.value);
    if (parishId) {
      const parish = filteredLocations.find(l => l.id === parishId && l.tipo === 'parroquia');
      if (parish) {
        await loadParishWithChapels(parishId);
        setSelectedLocation(null);
        setSelectedByUser(false);
        if (map) {
          map.flyTo([parish.latitud, parish.longitud], 15);
        }
      }
    } else {
      setSelectedParroquiaForGrid(null);
      setParishChapels([]);
      setSelectedLocation(null);
      setSelectedByUser(false);
    }
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setSelectedByUser(true);
    setSelectedParroquiaForGrid(null);
    await loadLocationDetails(location.id);
    if (map) {
      map.flyTo([location.latitud, location.longitud], 15);
    }
  };

  return (
    <ScreenMan>
      <div className="content-module only-this">
        <h2 className='title-screen'>Búsqueda de Parroquias</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <MyBarSearchGen
                mode="local"
                value={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Buscar parroquias y capillas..."
              />
            </div>
          </div>

          <div className="map-container-wrapper">
            <div className="map-container">
              <div ref={mapRef} style={{ width: '100%', height: '600px' }} />
              <div className={`zoom-info ${currentZoom >= 15 ? 'show-chapels' : ''}`}>
                {currentZoom >= 15
                  ? "🔍 Zoom alto: Se muestran parroquias y capillas"
                  : "🔍 Haz zoom para ver las capillas"
                }
              </div>
            </div>

            <div className="parish-info-panel">
              {!selectedLocation ? (
                <div className="parish-selector-panel">
                  <div className="parish-info-header">
                    <h3>Seleccionar Parroquia</h3>
                  </div>
                  <div className="parish-info-content">
                    <div className="parish-selector">
                      <select
                        id="parroquia-select"
                        className="parroquia-select"
                        onChange={handleParroquiaSelect}
                        value={selectedParroquiaForGrid ? selectedParroquiaForGrid.id : ""}
                      >
                        <option value="">-- Selecciona una parroquia --</option>
                        {filteredLocations.filter(l => l.tipo === 'parroquia').map(parroquia => (
                          <option key={parroquia.id} value={parroquia.id}>
                            {parroquia.nombre}
                          </option>
                        ))}
                      </select>
                      {selectedParroquiaForGrid && searchTerm && (
                        <button
                          className="clear-selection-btn"
                          onClick={() => {
                            setSelectedParroquiaForGrid(null);
                            setParishChapels([]);
                            setSearchTerm('');
                          }}
                        >
                          Ver todas las ubicaciones
                        </button>
                      )}
                    </div>

                    <div className="instructions">
                      <p>
                        {selectedParroquiaForGrid
                          ? `Resultados para "${selectedParroquiaForGrid.nombre}":`
                          : searchTerm
                            ? `Resultados de búsqueda para "${searchTerm}":`
                            : "Puedes seleccionar una parroquia de la lista o hacer clic directamente en los marcadores del mapa para ver información detallada."
                        }
                      </p>
                      <div className="parishes-list">
                        <h4>
                          {selectedParroquiaForGrid
                            ? `${selectedParroquiaForGrid.nombre} y todas sus capillas:`
                            : searchTerm
                              ? `Resultados encontrados (${filteredLocations.filter(location => currentZoom >= 15 || location.tipo === 'parroquia').length}):`
                              : `${currentZoom >= 15 ? 'Parroquias y capillas' : 'Parroquias'} disponibles:`
                          }
                        </h4>
                        <div className="parishes-grid">
                          {loading ? (
                            <p>Cargando...</p>
                          ) : selectedParroquiaForGrid ? (
                            <>
                              {(!searchTerm ||
                                selectedParroquiaForGrid.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                selectedParroquiaForGrid.direccion.toLowerCase().includes(searchTerm.toLowerCase())
                              ) && (
                                  <div
                                    key={`parroquia-${selectedParroquiaForGrid.id}`}
                                    className="parish-card parroquia-card"
                                    onClick={() => handleLocationSelect(selectedParroquiaForGrid)}
                                  >
                                    <h5>{selectedParroquiaForGrid.nombre}</h5>
                                    <p>{selectedParroquiaForGrid.direccion}</p>
                                    <span className="location-type">Parroquia</span>
                                  </div>
                                )}
                              {parishChapels.map(capilla => (
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
                <div className="parish-details-panel">
                  <div className="parish-info-header">
                    <h3>{selectedLocation.nombre}</h3>
                    <button
                      className="close-panel-btn"
                      onClick={() => {
                        setSelectedLocation(null);
                        setSelectedParroquiaForGrid(null);
                        setSelectedByUser(false);
                        setLocationDetails(null);
                        setLocationActs([]);
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="parish-info-content">
                    {locationDetails ? (
                      <>
                        <div className="parish-basic-info">
                          <p><strong>Tipo:</strong> {locationDetails.type}</p>
                          <p><strong>Dirección:</strong> {locationDetails.address}</p>
                          <p><strong>Teléfono:</strong> {locationDetails.phone}</p>
                          {locationDetails.parroco && (
                            <p><strong>Párroco:</strong> {locationDetails.parroco}</p>
                          )}
                          {locationDetails.encargado && (
                            <p><strong>Encargado:</strong> {locationDetails.encargado}</p>
                          )}
                          {locationDetails.description && (
                            <p><strong>Descripción:</strong> {locationDetails.description}</p>
                          )}
                          {locationDetails.parroquia_padre_name && (
                            <p><strong>Parroquia:</strong> {locationDetails.parroquia_padre_name}</p>
                          )}
                        </div>

                        <div className="parish-events">
                          <h4>Actos Litúrgicos Disponibles</h4>
                          <div className="events-list">
                            {locationActs.length > 0 ? (
                              locationActs.map(evento => (
                                <div key={evento.id} className="event-item">
                                  <span className="event-name">{evento.name}</span>
                                </div>
                              ))
                            ) : (
                              <p>No hay actos litúrgicos disponibles</p>
                            )}
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
                      </>
                    ) : (
                      <p>Cargando información...</p>
                    )}
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

