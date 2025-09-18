import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components2/SearchBar';
import MyButtonShortAction from '../components2/MyButtonShortAction';
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
      { id: 1, nombre: "Misa Dominical", horario: "08:00 AM" },
      { id: 2, nombre: "Bautismo", horario: "Sábados 4:00 PM" },
      { id: 3, nombre: "Matrimonio", horario: "Por cita" },
      { id: 4, nombre: "Primera Comunión", horario: "Domingos 10:00 AM" }
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
      { id: 1, nombre: "Misa Diaria", horario: "06:00 AM" },
      { id: 2, nombre: "Confesiones", horario: "Viernes 6:00 PM" },
      { id: 3, nombre: "Rosario", horario: "Lunes 7:00 PM" }
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
      { id: 1, nombre: "Misa Vespertina", horario: "06:00 PM" },
      { id: 2, nombre: "Confirmación", horario: "Sábados 3:00 PM" },
      { id: 3, nombre: "Adoración Eucarística", horario: "Jueves 8:00 PM" }
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
      { id: 1, nombre: "Misa de Niños", horario: "Domingo 11:00 AM" },
      { id: 2, nombre: "Catequesis", horario: "Sábados 2:00 PM" },
      { id: 3, nombre: "Retiro Espiritual", horario: "Primer sábado del mes" }
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

  // Cargar Leaflet dinámicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      // Crear enlaces a los CSS y JS de Leaflet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Cargar Leaflet JS
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

  // Filtrar parroquias por búsqueda
  useEffect(() => {
    const filtered = parroquiasData.filter(parroquia =>
      parroquia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parroquia.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParroquias(filtered);
    
    // Actualizar marcadores en el mapa
    if (map) {
      updateMapMarkers(filtered);
    }
  }, [searchTerm, map]);

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

    // Limpiar marcadores existentes
    Object.values(markers).forEach(marker => {
      leafletMap.removeLayer(marker);
    });

    const newMarkers = {};

    // Agregar nuevos marcadores
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
    // Temporalmente redirige a inicio
    navigate('/inicio');
  };

  const scrollToSearch = () => {
    // Función para compatibilidad
  };
  

  return (
    <div className="content-module only-this">
      <h2 className='title-screen'>Búsqueda de Parroquias</h2>
      <div className="app-container">
        <div className="search-add">
          <div className="center-container">
            <SearchBar onSearchChange={setSearchTerm} placeholder="Buscar parroquia..." />
          </div>
        </div>
        
        <div className="map-container-wrapper">
          <div className="map-container">
            <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
          </div>
          
          {selectedParroquia && (
            <div className="parish-info-panel">
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
                        <span className="event-schedule">{evento.horario}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="parish-actions">
                  <MyButtonShortAction 
                    type="view" 
                    title="Ver Perfil Completo" 
                    onClick={handleVerPerfil} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

