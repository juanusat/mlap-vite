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
        { id: 5, nombre: "Misa de Mención" }
      ]
    },
    {
      id: 2,
      nombre: "El Señor de los Milagros",
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
        { id: 5, nombre: "Misa de Mención" }
      ]
    },
    {
      id: 3,
      nombre: "Santa Rosa de Lima",
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
        { id: 5, nombre: "Misa de Mención" }
      ]
    },
    {
      id: 4,
      nombre: "San José Obrero",
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
        { id: 5, nombre: "Misa de Mención" }
      ]
    }
  ];
export default function BuscarParroquia() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState({});
  const [selectedParroquia, setSelectedParroquia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParroquias, setFilteredParroquias] = useState(parroquiasData);
  const [searchParams] = useSearchParams(); //  Hook para leer parámetros de la URL

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

  // Filtrar parroquias por búsqueda (este useEffect ya existía y funciona con el nuevo cambio)
  useEffect(() => {
    const filtered = parroquiasData.filter(parroquia =>
      parroquia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parroquia.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParroquias(filtered);
    
    // Si la parroquia seleccionada no está en los resultados filtrados, deseleccionarla
    if (selectedParroquia && !filtered.find(p => p.id === selectedParroquia.id)) {
      setSelectedParroquia(null);
    }
    
    // Actualizar marcadores en el mapa
    if (map) {
      updateMapMarkers(filtered);
    }
  }, [searchTerm, map, selectedParroquia]);

  const initMap = () => {
    if (!window.L || !mapRef.current) return;

    const leafletMap = window.L.map(mapRef.current).setView([-6.77, -79.84], 13);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    setMap(leafletMap);
    updateMapMarkers(parroquiasData, leafletMap);
  };

  const updateMapMarkers = (parroquias, leafletMap = map) => {
    if (!leafletMap || !window.L) return;

    Object.values(markers).forEach(marker => {
      leafletMap.removeLayer(marker);
    });

    const newMarkers = {};

    parroquias.forEach(parroquia => {
      const marker = window.L.marker([parroquia.latitud, parroquia.longitud])
        .addTo(leafletMap)
        .bindPopup(`<b>${parroquia.nombre}</b><br>Haz clic para ver más.`);

      marker.on('click', () => {
        setSelectedParroquia(parroquia);
        leafletMap.flyTo([parroquia.latitud, parroquia.longitud], 15);
      });

      newMarkers[parroquia.id] = marker;
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
      setSelectedParroquia(parroquia);
      if (map && parroquia) {
        map.flyTo([parroquia.latitud, parroquia.longitud], 15);
      }
    } else {
      setSelectedParroquia(null);
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
                placeholder="Buscar parroquia..." 
              />
            </div>
          </div>
          
          <div className="map-container-wrapper">
            <div className="map-container">
              <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
            </div>
            
            <div className="parish-info-panel">
              {!selectedParroquia ? (
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
                        defaultValue=""
                      >
                        <option value="">-- Selecciona una parroquia --</option>
                        {filteredParroquias.map(parroquia => (
                          <option key={parroquia.id} value={parroquia.id}>
                            {parroquia.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="instructions">
                      <p>Puedes seleccionar una parroquia de la lista o hacer clic directamente en los marcadores del mapa para ver su información detallada.</p>
                      
                      <div className="parishes-list">
                        <h4>Parroquias disponibles:</h4>
                        <div className="parishes-grid">
                          {filteredParroquias.map(parroquia => (
                            <div 
                              key={parroquia.id} 
                              className="parish-card"
                              onClick={() => {
                                setSelectedParroquia(parroquia);
                                if (map) {
                                  map.flyTo([parroquia.latitud, parroquia.longitud], 15);
                                }
                              }}
                            >
                              <h5>{parroquia.nombre}</h5>
                              <p>{parroquia.direccion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Panel de información de parroquia seleccionada
                <div className="parish-details-panel">
                  <div className="parish-info-header">
                    <h3>{selectedParroquia.nombre}</h3>
                    <button 
                      className="close-panel-btn"
                      onClick={() => setSelectedParroquia(null)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="parish-info-content">
                    <div className="parish-basic-info">
                      <p><strong>Dirección:</strong> {selectedParroquia.direccion}</p>
                      <p><strong>Teléfono:</strong> {selectedParroquia.telefono}</p>
                      <p><strong>Párroco:</strong> {selectedParroquia.parroco}</p>
                      <p><strong>Descripción:</strong> {selectedParroquia.descripcion}</p>
                    </div>
                    
                    <div className="parish-events">
                      <h4>Actos Litúrgicos Disponibles</h4>
                      <div className="events-list">
                        {selectedParroquia.eventos.map(evento => (
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

