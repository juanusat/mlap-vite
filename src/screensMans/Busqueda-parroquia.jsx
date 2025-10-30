import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MyBarSearchGen from '../components/MyBarSearchGen';
import MyMapContainer from '../components/MyMapContainer';
import ScreenMan from '../components/ScreenMan';
import '../utils/Estilos-Generales-1.css';
import './Busqueda-parroquia.css';
import * as publicChurchService from '../services/publicChurchService';

// const parroquiasDataOLD = [
//   {
//     id: 1,
//     nombre: "Santa María Catedral",
//     tipo: "parroquia",
//     latitud: -6.771611,
//     longitud: -79.837778,
//     direccion: "Plaza de Armas, Chiclayo",
//     telefono: "(074) 123-456",
//     parroco: "Padre José García",
//     descripcion: "Catedral principal de la Diócesis de Chiclayo",
//     eventos: [
//       { id: 1, nombre: "Matrimonio" },
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 4, nombre: "Confirmación" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 2,
//     nombre: "El Señor de los Milagros",
//     tipo: "parroquia",
//     latitud: -6.7725,
//     longitud: -79.8341,
//     direccion: "Av. Bolognesi 485, Chiclayo",
//     telefono: "(074) 234-567",
//     parroco: "Padre Miguel Rodríguez",
//     descripcion: "Parroquia dedicada al Señor de los Milagros",
//     eventos: [
//       { id: 1, nombre: "Matrimonio" },
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 4, nombre: "Confirmación" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 3,
//     nombre: "Santa Rosa de Lima",
//     tipo: "parroquia",
//     latitud: -6.748333,
//     longitud: -79.835,
//     direccion: "Calle Santa Rosa 123, Chiclayo",
//     telefono: "(074) 345-678",
//     parroco: "Padre Carlos Mendoza",
//     descripcion: "Parroquia en honor a Santa Rosa de Lima",
//     eventos: [
//       { id: 1, nombre: "Matrimonio" },
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 4, nombre: "Confirmación" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 4,
//     nombre: "San José Obrero",
//     tipo: "parroquia",
//     latitud: -6.7975,
//     longitud: -79.8441,
//     direccion: "Av. José Balta 789, Chiclayo",
//     telefono: "(074) 456-789",
//     parroco: "Padre Luis Fernández",
//     descripcion: "Parroquia dedicada a San José Obrero",
//     eventos: [
//       { id: 1, nombre: "Matrimonio" },
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 4, nombre: "Confirmación" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 5,
//     nombre: "Sagrado Corazón de Jesús",
//     tipo: "parroquia",
//     latitud: -6.7533,
//     longitud: -79.8525,
//     direccion: "Av. Leguía 234, Chiclayo",
//     telefono: "(074) 567-890",
//     parroco: "Padre Antonio Silva",
//     descripcion: "Parroquia del Sagrado Corazón de Jesús",
//     eventos: [
//       { id: 1, nombre: "Matrimonio" },
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 4, nombre: "Confirmación" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   }
// ];

// const capillasDataOLD = [
//   // Capillas de Santa María Catedral (id: 1)
//   {
//     id: 101,
//     nombre: "Capilla del Santísimo Sacramento",
//     tipo: "capilla",
//     parroquiaId: 1,
//     latitud: -6.7720,
//     longitud: -79.8385,
//     direccion: "Calle San José 145, Chiclayo",
//     telefono: "(074) 123-457",
//     encargado: "Hermana María Gonzáles",
//     descripcion: "Capilla dedicada al Santísimo Sacramento",
//     eventos: [
//       { id: 1, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 102,
//     nombre: "Capilla San Francisco",
//     tipo: "capilla",
//     parroquiaId: 1,
//     latitud: -6.7695,
//     longitud: -79.8395,
//     direccion: "Jr. Francisco Bolognesi 67, Chiclayo",
//     telefono: "(074) 123-458",
//     encargado: "Padre Juan Carlos",
//     descripcion: "Capilla en honor a San Francisco de Asís",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },

//   // Capillas de El Señor de los Milagros (id: 2)
//   {
//     id: 201,
//     nombre: "Capilla Virgen de Fátima",
//     tipo: "capilla",
//     parroquiaId: 2,
//     latitud: -6.7735,
//     longitud: -79.8355,
//     direccion: "Av. Grau 456, Chiclayo",
//     telefono: "(074) 234-568",
//     encargado: "Hermana Carmen López",
//     descripcion: "Capilla dedicada a la Virgen de Fátima",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },

//   // Capillas de Santa Rosa de Lima (id: 3)
//   {
//     id: 301,
//     nombre: "Capilla San Antonio",
//     tipo: "capilla",
//     parroquiaId: 3,
//     latitud: -6.7465,
//     longitud: -79.8365,
//     direccion: "Calle Los Laureles 89, Chiclayo",
//     telefono: "(074) 345-679",
//     encargado: "Padre Roberto Díaz",
//     descripcion: "Capilla dedicada a San Antonio de Padua",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 302,
//     nombre: "Capilla Virgen del Carmen",
//     tipo: "capilla",
//     parroquiaId: 3,
//     latitud: -6.7455,
//     longitud: -79.8335,
//     direccion: "Jr. El Carmen 234, Chiclayo",
//     telefono: "(074) 345-680",
//     encargado: "Hermana Rosa Medina",
//     descripcion: "Capilla en honor a la Virgen del Carmen",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 303,
//     nombre: "Capilla Santa Teresita",
//     tipo: "capilla",
//     parroquiaId: 3,
//     latitud: -6.7475,
//     longitud: -79.8345,
//     direccion: "Av. Santa Teresa 678, Chiclayo",
//     telefono: "(074) 345-681",
//     encargado: "Padre Miguel Herrera",
//     descripcion: "Capilla dedicada a Santa Teresita del Niño Jesús",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" }
//     ]
//   },

//   // Capillas de San José Obrero (id: 4)
//   {
//     id: 401,
//     nombre: "Capilla Cristo Rey",
//     tipo: "capilla",
//     parroquiaId: 4,
//     latitud: -6.7985,
//     longitud: -79.8455,
//     direccion: "Calle Cristo Rey 123, Chiclayo",
//     telefono: "(074) 456-790",
//     encargado: "Padre Carlos Vega",
//     descripcion: "Capilla dedicada a Cristo Rey",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },
//   {
//     id: 402,
//     nombre: "Capilla San Judas Tadeo",
//     tipo: "capilla",
//     parroquiaId: 4,
//     latitud: -6.7965,
//     longitud: -79.8425,
//     direccion: "Jr. San Judas 345, Chiclayo",
//     telefono: "(074) 456-791",
//     encargado: "Hermana Isabel Torres",
//     descripcion: "Capilla en honor a San Judas Tadeo",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   },

//   {
//     id: 501,
//     nombre: "Capilla Inmaculada Concepción",
//     tipo: "capilla",
//     parroquiaId: 5,
//     latitud: -6.7545,
//     longitud: -79.8535,
//     direccion: "Av. La Inmaculada 567, Chiclayo",
//     telefono: "(074) 567-891",
//     encargado: "Padre Fernando Ruiz",
//     descripcion: "Capilla de la Inmaculada Concepción",
//     eventos: [
//       { id: 2, nombre: "Bautismo" },
//       { id: 3, nombre: "Primera Comunión" },
//       { id: 5, nombre: "Misa de Difuntos" }
//     ]
//   }
// ];

export default function BuscarParroquia() {
  const navigate = useNavigate();
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
  const [mapCenter, setMapCenter] = useState(null); // Para controlar el centrado del mapa

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
        longitud: parseCoordinates(loc.coordinates)[1],
        parroquiaPadreId: loc.parroquia_padre_id || null
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
      setLoading(true);
      
      // Buscar la parroquia en allLocations usando el ID correcto
      const selectedParish = allLocations.find(l => l.id === parishId && l.tipo === 'parroquia');
      
      if (!selectedParish) {
        console.error('No se encontró la parroquia con ID:', parishId);
        setLoading(false);
        return;
      }

      // Usar el endpoint select-parish (ahora corregido en el backend)
      const response = await publicChurchService.selectParish(parishId);
      
      let chapels = [];
      if (response.data && response.data.chapels) {
        chapels = response.data.chapels.map(ch => ({
          id: ch.id,
          nombre: ch.name,
          direccion: ch.address,
          tipo: 'capilla',
          parroquiaId: parishId,
          coordinates: ch.coordinates,
          latitud: parseCoordinates(ch.coordinates)[0],
          longitud: parseCoordinates(ch.coordinates)[1]
        }));
      }
      
      setSelectedParroquiaForGrid(selectedParish);
      setParishChapels(chapels);
    } catch (error) {
      console.error('Error loading parish chapels:', error);
      // En caso de error, mostramos la parroquia seleccionada sin capillas
      const selectedParish = allLocations.find(l => l.id === parishId && l.tipo === 'parroquia');
      if (selectedParish) {
        setSelectedParroquiaForGrid(selectedParish);
        setParishChapels([]);
      }
    } finally {
      setLoading(false);
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

  const handleVerPerfil = () => {
    if (selectedLocation) {
      navigate(`/capilla?id=${selectedLocation.id}`);
    }
  };

  const handleMapLocationSelect = async (location) => {
    setSelectedLocation(location);
    setSelectedByUser(true);
    setSelectedParroquiaForGrid(null);
    await loadLocationDetails(location.id);
  };

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom);
  };

  const handleParroquiaSelect = async (e) => {
    const parishId = parseInt(e.target.value);
    if (parishId) {
      const parish = allLocations.find(l => l.id === parishId && l.tipo === 'parroquia');
      if (parish) {
        // Centrar el mapa sin establecer selectedLocation
        setMapCenter(parish);
        
        // Cargar capillas de la parroquia
        await loadParishWithChapels(parishId);
      }
    } else {
      setSelectedParroquiaForGrid(null);
      setParishChapels([]);
      setSelectedLocation(null);
      setSelectedByUser(false);
      setMapCenter(null);
    }
  };

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setSelectedByUser(true);
    setSelectedParroquiaForGrid(null);
    await loadLocationDetails(location.id);
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
            <MyMapContainer
              locations={filteredLocations}
              onLocationSelect={handleMapLocationSelect}
              selectedLocation={selectedLocation}
              mapCenter={mapCenter}
              initialCenter={[-6.77, -79.84]}
              initialZoom={13}
              onZoomChange={handleZoomChange}
            />

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
                        {allLocations.filter(l => l.tipo === 'parroquia').map(parroquia => (
                          <option key={parroquia.id} value={parroquia.id}>
                            {parroquia.nombre}
                          </option>
                        ))}
                      </select>
                      {selectedParroquiaForGrid && (
                        <button
                          className="clear-selection-btn"
                          onClick={() => {
                            setSelectedParroquiaForGrid(null);
                            setParishChapels([]);
                          }}
                        >
                          Limpiar selección
                        </button>
                      )}
                    </div>

                    <div className="instructions">
                      <p>
                        {selectedParroquiaForGrid
                          ? `Mostrando "${selectedParroquiaForGrid.nombre}" y sus capillas:`
                          : "Selecciona una parroquia del desplegable para ver sus capillas o haz clic en los marcadores del mapa."
                        }
                      </p>
                      <div className="parishes-list">
                        <h4>
                          {selectedParroquiaForGrid
                            ? `Capillas de ${selectedParroquiaForGrid.nombre}:`
                            : `${currentZoom >= 15 ? 'Parroquias y capillas' : 'Parroquias'} disponibles:`
                          }
                        </h4>
                        <div className="parishes-grid">
                          {loading ? (
                            <p>Cargando...</p>
                          ) : selectedParroquiaForGrid ? (
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

