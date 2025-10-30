import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import { 
  getPendingReservations, 
  searchPendingReservations, 
  cancelReservation 
} from '../services/reservationService';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

export default function ReservasPendientes() {
  React.useEffect(() => {
    document.title = "MLAP | Reservas pendientes";
  }, []);
  
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  // Estados para el modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  // Cargar reservas pendientes
  useEffect(() => {
    loadReservations();
  }, [currentPage]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchTerm.trim()) {
        response = await searchPendingReservations(searchTerm, currentPage, limit);
      } else {
        response = await getPendingReservations(currentPage, limit);
      }

      setReservations(response.data);
      setDisplayedReservations(response.data);
      
      if (response.meta) {
        setTotalPages(response.meta.total_pages);
        setTotalRecords(response.meta.total_records);
      }
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError(err.message || 'Error al cargar las reservas pendientes');
    } finally {
      setLoading(false);
    }
  };

  // Buscar cuando cambia el término de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset a la primera página al buscar
      loadReservations();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Función para abrir el modal de confirmación
  const handleDeleteReservation = (reservation) => {
    setReservationToDelete(reservation);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setReservationToDelete(null);
  };

  // Función que se ejecuta al confirmar la eliminación
  const confirmDelete = async () => {
    if (reservationToDelete) {
      try {
        await cancelReservation(reservationToDelete.id);
        
        // Recargar la lista de reservas
        await loadReservations();
        
        handleCloseModal();
        alert('La reserva ha sido cancelada exitosamente');
      } catch (err) {
        console.error('Error al cancelar reserva:', err);
        alert(err.message || 'Error al cancelar la reserva');
      }
    }
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
      key: 'paid_amount', 
      header: 'Monto Pagado', 
      accessor: (row) => `$ ${parseFloat(row.paid_amount).toFixed(2)}` 
    },
    { 
      key: 'status', 
      header: 'Estado', 
      accessor: (row) => {
        const statusMap = {
          'RESERVED': 'Reservado',
          'IN_PROGRESS': 'En progreso',
          'CANCELLED': 'Cancelado'
        };
        return statusMap[row.status] || row.status;
      }
    },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction
            type="delete"
            title="Cancelar"
            onClick={() => handleDeleteReservation(row)}
          />
        </MyGroupButtonsActions>
      )
    },
  ];

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Reservas pendientes</h2>
        <div className="app-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Cargando reservas...
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
                  <p>No tienes reservas pendientes</p>
                </div>
              ) : (
                <>
                  <DynamicTable
                    columns={reservationColumns}
                    data={displayedReservations}
                    gridColumnsLayout="80px 1fr 180px 120px 140px 120px 220px"
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

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title="Confirmar cancelación"
        onAccept={confirmDelete}
        onCancel={handleCloseModal}
      >
        <h4>
          ¿Estás seguro que quieres cancelar tu reserva para el evento de {reservationToDelete?.event_name}?
        </h4>
      </Modal>
    </>
  );
}