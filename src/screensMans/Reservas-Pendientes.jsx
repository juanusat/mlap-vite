import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import { 
  getPendingReservations, 
  searchPendingReservations, 
  cancelReservation,
  getReservationDetails
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

  // Estados para el panel lateral de detalles
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);

  // Estados para el panel lateral de requisitos
  const [showRequirementsSidebar, setShowRequirementsSidebar] = useState(false);
  const [currentRequirements, setCurrentRequirements] = useState(null);

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

  // Función para abrir el panel lateral de detalles
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

  // Función para cerrar el panel lateral de detalles
  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentReservation(null);
  };

  // Función para abrir el panel lateral de requisitos
  const handleOpenRequirementsSidebar = async (reservation) => {
    try {
      setLoading(true);
      const details = await getReservationDetails(reservation.id);
      setCurrentRequirements(details.data);
      setShowRequirementsSidebar(true);
    } catch (err) {
      console.error('Error al cargar requisitos:', err);
      alert(err.message || 'Error al cargar requisitos de la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el panel lateral de requisitos
  const handleCloseRequirementsSidebar = () => {
    setShowRequirementsSidebar(false);
    setCurrentRequirements(null);
  };

  // Función para imprimir el recibo de una reserva
  const handlePrintReceipt = async (reservation) => {
    try {
      setLoading(true);
      const details = await getReservationDetails(reservation.id);
      const data = details.data;
      
      // Crear contenedor temporal oculto
      const printContainer = document.createElement('div');
      printContainer.style.display = 'none';
      printContainer.innerHTML = `
        <div id="print-receipt" style="font-family: Arial, sans-serif; max-width: 400px; margin: 10px auto; padding: 10px; font-size: 11px;">
          <div style="border: 1px solid #333; padding: 15px;">
            <div style="text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
              <h1 style="margin: 0; font-size: 16px;">RECIBO DE RESERVA</h1>
              <p style="margin: 3px 0; color: #666; font-size: 10px;">Reserva #${data.id}</p>
              <p style="margin: 3px 0; color: #666; font-size: 10px;">${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div style="margin: 10px 0;">
              <h3 style="font-size: 12px; margin: 5px 0;">Información del Evento</h3>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Evento:</span>
                <span style="color: #555;">${data.event_variant_name}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Capilla:</span>
                <span style="color: #555;">${data.chapel?.name || 'N/A'}</span>
              </div>
              ${data.chapel?.parish_name ? `
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Parroquia:</span>
                <span style="color: #555;">${data.chapel.parish_name}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Fecha:</span>
                <span style="color: #555;">${new Date(data.event_date).toLocaleDateString('es-ES')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Hora:</span>
                <span style="color: #555;">${data.event_time ? data.event_time.substring(0, 5) : 'N/A'}</span>
              </div>
            </div>
            
            <div style="margin: 10px 0;">
              <h3 style="font-size: 12px; margin: 5px 0;">Información del Beneficiario</h3>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Nombre completo:</span>
                <span style="color: #555;">${data.beneficiary_full_name}</span>
              </div>
            </div>
            
            <div style="margin: 10px 0;">
              <h3 style="font-size: 12px; margin: 5px 0;">Detalles de Pago</h3>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Precio del evento:</span>
                <span style="color: #555;">$ ${parseFloat(data.current_price || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #ddd;">
                <span style="font-weight: bold; color: #333;">Monto pagado:</span>
                <span style="color: #555;">$ ${parseFloat(data.paid_amount || 0).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="font-weight: bold; color: #333;">Saldo pendiente:</span>
                <span style="color: #555;">$ ${(parseFloat(data.current_price || 0) - parseFloat(data.paid_amount || 0)).toFixed(2)}</span>
              </div>
            </div>
            
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #333; font-size: 12px; font-weight: bold;">
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span>Estado:</span>
                <span>${
                  data.status === 'RESERVED' ? 'Reservado' :
                  data.status === 'IN_PROGRESS' ? 'En progreso' :
                  data.status === 'CANCELLED' ? 'Cancelado' :
                  data.status
                }</span>
              </div>
            </div>
            
            <div style="margin-top: 15px; text-align: center; color: #666; font-size: 9px;">
              <p style="margin: 3px 0;">Gracias por su preferencia</p>
              <p style="margin: 3px 0;">Este es un comprobante de su reserva</p>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(printContainer);
      
      // Ocultar el contenido principal temporalmente
      const mainContent = document.querySelector('.content-module');
      const originalDisplay = mainContent.style.display;
      mainContent.style.display = 'none';
      
      // Mostrar el recibo para imprimir
      printContainer.style.display = 'block';
      
      // Imprimir
      window.print();
      
      // Restaurar el contenido original
      mainContent.style.display = originalDisplay;
      document.body.removeChild(printContainer);
      
    } catch (err) {
      console.error('Error al imprimir:', err);
      alert(err.message || 'Error al generar el recibo');
    } finally {
      setLoading(false);
    }
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
      key: 'chapel_name', 
      header: 'Capilla', 
      accessor: (row) => row.chapel_name 
    },
    { 
      key: 'event_date', 
      header: 'Fecha', 
      accessor: (row) => new Date(row.event_date).toLocaleDateString('es-ES')
    },
    { 
      key: 'event_time', 
      header: 'Hora', 
      accessor: (row) => {
        // Si event_time viene del backend (formato TIME de PostgreSQL: "HH:MM:SS")
        if (row.event_time) {
          // Extraer solo HH:MM
          return row.event_time.substring(0, 5);
        }
        // Fallback: intentar calcular desde event_date (por compatibilidad)
        return new Date(row.event_date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      }
    },
    { 
      key: 'current_price', 
      header: 'Precio', 
      accessor: (row) => `$ ${parseFloat(row.current_price || 0).toFixed(2)}` 
    },
    { 
      key: 'paid_amount', 
      header: 'Pagado', 
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
            type="view"
            title="Ver detalles"
            onClick={() => handleOpenSidebar(row)}
          />
          <MyButtonShortAction
            type="key"
            title="Requisitos"
            onClick={() => handleOpenRequirementsSidebar(row)}
          />
          <MyButtonShortAction
            type="print"
            title="Imprimir"
            onClick={() => handlePrintReceipt(row)}
          />
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
                    gridColumnsLayout="70px auto auto auto 110px 90px 110px 110px 110px 220px"
                    columnLeftAlignIndex={[2, 3, 4]}
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

      {showSidebar && currentReservation && (
        <MyPanelLateralConfig title={`Detalles de la Reserva #${currentReservation.id}`}>
          <div className="panel-lateral-close-btn">
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
          </div>
          <div className="sidebar-list">
            <p><strong>Beneficiario:</strong> {currentReservation.beneficiary_full_name}</p>
            <p><strong>Evento:</strong> {currentReservation.event_variant_name}</p>
            {currentReservation.chapel && (
              <>
                <p><strong>Capilla:</strong> {currentReservation.chapel.name}</p>
                <p><strong>Parroquia:</strong> {currentReservation.chapel.parish_name}</p>
              </>
            )}
            <p><strong>Fecha:</strong> {new Date(currentReservation.event_date).toLocaleDateString('es-ES')}</p>
            <p><strong>Hora:</strong> {currentReservation.event_time ? currentReservation.event_time.substring(0, 5) : 'No disponible'}</p>
            <p><strong>Precio del evento:</strong> $ {parseFloat(currentReservation.current_price || 0).toFixed(2)}</p>
            <p><strong>Monto pagado:</strong> $ {parseFloat(currentReservation.paid_amount).toFixed(2)}</p>
            <p><strong>Estado:</strong> {
              currentReservation.status === 'RESERVED' ? 'Reservado' :
              currentReservation.status === 'IN_PROGRESS' ? 'En progreso' :
              currentReservation.status === 'CANCELLED' ? 'Cancelado' :
              currentReservation.status
            }</p>
            <p><strong>Pago:</strong> {currentReservation.payment_status}</p>
          </div>
        </MyPanelLateralConfig>
      )}

      {showRequirementsSidebar && currentRequirements && (
        <MyPanelLateralConfig title={`Requisitos de la Reserva #${currentRequirements.id}`}>
          <div className="panel-lateral-close-btn">
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseRequirementsSidebar} />
          </div>
          <div className="sidebar-list">
            <h3 className="sidebar-subtitle">Requisitos</h3>
            {currentRequirements.requirements && currentRequirements.requirements.length > 0 ? (
              currentRequirements.requirements.map((req, index) => (
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