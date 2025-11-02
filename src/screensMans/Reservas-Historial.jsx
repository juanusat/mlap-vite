import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import { 
  getHistoryReservations, 
  searchHistoryReservations,
  getReservationDetails
} from '../services/reservationService';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

export default function ReservasHistorial() {
    React.useEffect(() => {
      document.title = "MLAP | Historial de reservas";
    }, []);
  
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchTerm.trim()) {
        response = await searchHistoryReservations(searchTerm, currentPage, limit);
      } else {
        response = await getHistoryReservations(currentPage, limit);
      }

      setReservations(response.data);
      setDisplayedReservations(response.data);
      
      if (response.meta) {
        setTotalPages(response.meta.total_pages);
        setTotalRecords(response.meta.total_records);
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError(err.message || 'Error al cargar el historial de reservas');
    } finally {
      setLoading(false);
    }
  };

  // Cargar reservas cuando cambia la página o el término de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadReservations();
    }, searchTerm ? 500 : 0); // Solo delay si hay búsqueda

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  // Resetear a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm !== '') {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const handleOpenSidebar = async (reservation) => {
    try {
      setLoading(true);
      const details = await getReservationDetails(reservation.id);
      setCurrentReservation(details.data);
      setShowSidebar(true);
    } catch (err) {
      console.error('Error al cargar detalles:', err);
      alert(err.message || 'Error al cargar detalles de la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentReservation(null);
  };

  const reservationColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { 
      key: 'beneficiary_full_name', 
      header: 'Beneficiario', 
      accessor: (row) => row.beneficiary_full_name 
    },
    { key: 'event_name', header: 'Evento', accessor: (row) => row.event_name },
    { 
      key: 'event_date', 
      header: 'Fecha', 
      accessor: (row) => new Date(row.event_date).toLocaleDateString('es-ES')
    },
    { 
      key: 'event_time', 
      header: 'Hora', 
      accessor: (row) => {
        const date = new Date(row.event_date);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      }
    },
    { 
      key: 'paid_amount', 
      header: 'Monto', 
      accessor: (row) => `$ ${parseFloat(row.paid_amount).toFixed(2)}` 
    },
    { 
      key: 'status', 
      header: 'Estado', 
      accessor: (row) => {
        const statusMap = {
          'COMPLETED': 'Completado',
          'FULFILLED': 'Finalizado',
          'CANCELLED': 'Cancelado',
          'REJECTED': 'Rechazado'
        };
        return statusMap[row.status] || row.status;
      }
    },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction
            type="view"
            title="Ver"
            onClick={() => handleOpenSidebar(row)}
          />
        </MyGroupButtonsActions>
      )
    },
  ];

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Historial de Reservas</h2>
        <div className="app-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Cargando historial...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
              {error}
            </div>
          ) : (
            <>
              <div className="search-add">
                <div className="center-container">
                  <SearchBar 
                    onSearchChange={setSearchTerm}
                    placeholder="Buscar por nombre de evento..."
                  />
                </div>
              </div>
              
              {displayedReservations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No hay reservas en el historial</p>
                </div>
              ) : (
                <>
                  <DynamicTable
                    columns={reservationColumns}
                    data={displayedReservations}
                    gridColumnsLayout="80px 1fr 180px 120px 100px 100px 120px 220px"
                    columnLeftAlignIndex={[1, 2]}
                  />
                  
                  {totalPages > 1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '20px',
                      padding: '10px'
                    }}>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '5px 15px' }}
                      >
                        Anterior
                      </button>
                      <span>
                        Página {currentPage} de {totalPages} ({totalRecords} registros)
                      </span>
                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '5px 15px' }}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {showSidebar && currentReservation && (
        <MyPanelLateralConfig title={`Detalles de la Reserva #${currentReservation.id}`}>
          <div className="panel-lateral-close-btn">
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
          </div>
          <div className="sidebar-list">
            <p><strong>Beneficiario:</strong> {currentReservation.beneficiary_full_name}</p>
            <p><strong>Evento:</strong> {currentReservation.event_variant_name}</p>
            <p><strong>Fecha:</strong> {new Date(currentReservation.event_date).toLocaleDateString('es-ES')}</p>
            <p><strong>Hora:</strong> {new Date(currentReservation.event_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Monto:</strong> $ {parseFloat(currentReservation.paid_amount).toFixed(2)}</p>
            <p><strong>Estado:</strong> {
              currentReservation.status === 'COMPLETED' ? 'Completado' :
              currentReservation.status === 'FULFILLED' ? 'Finalizado' :
              currentReservation.status === 'CANCELLED' ? 'Cancelado' :
              currentReservation.status === 'REJECTED' ? 'Rechazado' :
              currentReservation.status
            }</p>
            <p><strong>Pago:</strong> {currentReservation.payment_status}</p>
            {currentReservation.chapel && (
              <>
                <p><strong>Capilla:</strong> {currentReservation.chapel.name}</p>
                <p><strong>Parroquia:</strong> {currentReservation.chapel.parish_name}</p>
              </>
            )}
            <hr className="divider-sidebar" />
            <h3 className="sidebar-subtitle">Requisitos</h3>
            {currentReservation.requirements && currentReservation.requirements.length > 0 ? (
              currentReservation.requirements.map((req, index) => (
                <div key={index} className="sidebar-list-item requirement-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={req.completed}
                      disabled
                    />
                    <span>{req.name}</span>
                  </label>
                </div>
              ))
            ) : (
              <p>No hay requisitos registrados</p>
            )}
          </div>
        </MyPanelLateralConfig>
      )}
    </>
  );
}