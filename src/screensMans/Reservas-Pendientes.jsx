import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import PaymentModal from '../components/PaymentModal';
import { 
  getPendingReservations, 
  searchPendingReservations, 
  cancelReservation,
  getReservationDetails,
  getReservationPaymentsForParishioner,
  createPaymentForParishioner
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

  const [showPaymentSidebar, setShowPaymentSidebar] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentReservation, setPaymentReservation] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentReservation, setCurrentPaymentReservation] = useState(null);

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
      setShowRequirementsSidebar(false);
      setShowPaymentSidebar(false);
      
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
      setShowSidebar(false);
      setShowPaymentSidebar(false);
      
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

  const handleViewPayments = async (reservation) => {
    try {
      setLoading(true);
      // Cerrar otros paneles antes de abrir este
      setShowSidebar(false);
      setShowRequirementsSidebar(false);
      
      const response = await getReservationPaymentsForParishioner(reservation.id);
      setPayments(response.data);
      setPaymentReservation(reservation);
      setShowPaymentSidebar(true);
    } catch (err) {
      console.error('Error al cargar pagos:', err);
      alert(err.message || 'Error al cargar historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentSidebar = () => {
    setShowPaymentSidebar(false);
    setPayments([]);
    setPaymentReservation(null);
  };

  const handleOpenPaymentModal = (reservation) => {
    setCurrentPaymentReservation(reservation);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentPaymentReservation(null);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await createPaymentForParishioner(currentPaymentReservation.id, paymentData);
      alert('Pago procesado exitosamente');
      handleClosePaymentModal();
      await loadReservations();
    } catch (err) {
      console.error('Error al procesar pago:', err);
      throw new Error(err.message || 'Error al procesar el pago');
    }
  };

  const handlePrintReceipt = async (reservation) => {
    try {
      setLoading(true);
      const details = await getReservationDetails(reservation.id);
      const data = details.data;
      
      // Crear un iframe oculto para imprimir
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'absolute';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = 'none';
      
      document.body.appendChild(printFrame);
      
      const printDocument = printFrame.contentWindow.document;
      printDocument.open();
      printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo de Reserva #${data.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              padding: 20px;
            }
            .receipt {
              max-width: 400px;
              margin: 0 auto;
              border: 1px solid #333;
              padding: 15px;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #333;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .header h1 {
              font-size: 16px;
              margin-bottom: 3px;
            }
            .header p {
              font-size: 10px;
              color: #666;
              margin: 3px 0;
            }
            .section {
              margin: 10px 0;
            }
            .section h3 {
              font-size: 12px;
              margin: 5px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px solid #ddd;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #333;
            }
            .value {
              color: #555;
            }
            .total {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #333;
              font-size: 12px;
              font-weight: bold;
            }
            .footer {
              margin-top: 15px;
              text-align: center;
              color: #666;
              font-size: 9px;
            }
            .footer p {
              margin: 3px 0;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>RECIBO DE RESERVA</h1>
              <p>Reserva #${data.id}</p>
              <p>${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div class="section">
              <h3>Información del Evento</h3>
              <div class="row">
                <span class="label">Evento:</span>
                <span class="value">${data.event_variant_name}</span>
              </div>
              <div class="row">
                <span class="label">Capilla:</span>
                <span class="value">${data.chapel?.name || 'N/A'}</span>
              </div>
              ${data.chapel?.parish_name ? `
              <div class="row">
                <span class="label">Parroquia:</span>
                <span class="value">${data.chapel.parish_name}</span>
              </div>` : ''}
              <div class="row">
                <span class="label">Fecha:</span>
                <span class="value">${new Date(data.event_date).toLocaleDateString('es-ES')}</span>
              </div>
              <div class="row">
                <span class="label">Hora:</span>
                <span class="value">${data.event_time ? data.event_time.substring(0, 5) : 'N/A'}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>Información del Beneficiario</h3>
              <div class="row">
                <span class="label">Nombre completo:</span>
                <span class="value">${data.beneficiary_full_name}</span>
              </div>
            </div>
            
            <div class="section">
              <h3>Detalles de Pago</h3>
              <div class="row">
                <span class="label">Precio del evento:</span>
                <span class="value">S/. ${parseFloat(data.current_price || 0).toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Monto pagado:</span>
                <span class="value">S/. ${parseFloat(data.paid_amount || 0).toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Saldo pendiente:</span>
                <span class="value">S/. ${(parseFloat(data.current_price || 0) - parseFloat(data.paid_amount || 0)).toFixed(2)}</span>
              </div>
            </div>
            
            <div class="total">
              <div class="row">
                <span>Estado:</span>
                <span>${
                  data.status === 'RESERVED' ? 'Reservado' :
                  data.status === 'IN_PROGRESS' ? 'En progreso' :
                  data.status === 'CANCELLED' ? 'Cancelado' :
                  data.status === 'COMPLETED' ? 'Completado' :
                  data.status === 'REJECTED' ? 'Rechazado' :
                  data.status
                }</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Gracias por su preferencia</p>
              <p>Este es un comprobante de su reserva</p>
            </div>
          </div>
        </body>
        </html>
      `);
      printDocument.close();
      
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 100);
      
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
      accessor: (row) => `S/ ${parseFloat(row.current_price || 0).toFixed(2)}` 
    },
    { 
      key: 'paid_amount', 
      header: 'Pagado', 
      accessor: (row) => `S/ ${parseFloat(row.paid_amount).toFixed(2)}` 
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
      key: 'acciones', header: 'Acciones', accessor: (row) => {
        const hasPendingBalance = parseFloat(row.paid_amount) < parseFloat(row.current_price);
        
        return (
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
              type="receipt"
              title="Ver pagos"
              onClick={() => handleViewPayments(row)}
            />
            {hasPendingBalance && (
              <MyButtonShortAction
                type="pay"
                title="Realizar pago"
                onClick={() => handleOpenPaymentModal(row)}
              />
            )}
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
        );
      }
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
                    gridColumnsLayout="70px auto auto auto 110px 90px 110px 110px 110px 280px"
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
        <MyPanelLateralConfig title={`Detalles de la Reserva #${currentReservation.id}`} onClose={handleCloseSidebar}>
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
            <p><strong>Precio del evento:</strong> S/ {parseFloat(currentReservation.current_price || 0).toFixed(2)}</p>
            <p><strong>Monto pagado:</strong> S/ {parseFloat(currentReservation.paid_amount).toFixed(2)}</p>
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
        <MyPanelLateralConfig title={`Requisitos de la Reserva #${currentRequirements.id}`} onClose={handleCloseRequirementsSidebar}>
          <div className="sidebar-list">
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

      {showPaymentSidebar && paymentReservation && (
        <MyPanelLateralConfig title={`Historial de Pagos - Reserva #${paymentReservation.id}`} onClose={handleClosePaymentSidebar}>
          <div className="sidebar-list">
            <p><strong>Evento:</strong> {paymentReservation.event_name}</p>
            <p><strong>Total:</strong> S/ {parseFloat(paymentReservation.current_price).toFixed(2)}</p>
            <p><strong>Pagado:</strong> S/ {parseFloat(paymentReservation.paid_amount).toFixed(2)}</p>
            <p><strong>Saldo:</strong> S/ {(parseFloat(paymentReservation.current_price) - parseFloat(paymentReservation.paid_amount)).toFixed(2)}</p>
            
            <hr className="divider-sidebar" />
            
            <h3 className="sidebar-subtitle">Pagos realizados</h3>
            {payments.length > 0 ? (
              <div className="payments-list">
                {payments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-header">
                      <span className="payment-amount">S/ {parseFloat(payment.amount).toFixed(2)}</span>
                      <span className="payment-date">
                        {new Date(payment.payment_date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {payment.registered_by && (
                      <div className="payment-worker">
                        Registrado por: {payment.registered_by}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay pagos registrados aún</p>
            )}
          </div>
        </MyPanelLateralConfig>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        reservation={currentPaymentReservation}
        onPaymentSuccess={handlePaymentSubmit}
      />
    </>
  );
}