import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import ChapelScheduleViewer from '../components/ChapelScheduleViewer';
import * as reservationService from '../services/reservationService';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import NoPermissionMessage from '../components/NoPermissionMessage';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

const STATUS_MAP = {
  'RESERVED': 'Reservado',
  'REJECTED': 'Rechazado',
  'IN_PROGRESS': 'En progreso',
  'COMPLETED': 'Completado',
  'FULFILLED': 'Cumplido',
  'CANCELLED': 'Cancelado'
};

export default function Reservas() {
  const { hasPermission } = usePermissions();
  const canRead = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_RESER_R);
  const canUpdate = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_RESER_U);

  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [payments, setPayments] = useState([]);
  const [showPaymentSidebar, setShowPaymentSidebar] = useState(false);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.listReservationsForManagement(page, 100);
      setReservations(response.data || []);
      setTotalPages(response.meta?.total_pages || 1);
    } catch (err) {
      setError(err.message || 'Error al cargar las reservas');
      console.error('Error al cargar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term || term.trim() === '') {
      loadReservations();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.searchReservationsForManagement(term, 1, 100);
      setReservations(response.data || []);
    } catch (err) {
      setError(err.message || 'Error al buscar reservas');
      console.error('Error al buscar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (reservation) => {
    try {
      setLoading(true);
      const response = await reservationService.getReservationDetailsForManagement(reservation.id);
      setCurrentReservation(response.data);
      setModalType('view');
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'Error al cargar detalles');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reservation) => {
    if (!canUpdate) {
      alert("No tienes permisos para editar reservas.");
      return;
    }
    setCurrentReservation(reservation);
    setModalType('edit');
    setShowModal(true);
  };

  const handleBlock = (reservation) => {
    if (!canUpdate) {
      alert("No tienes permisos para bloquear reservas.");
      return;
    }
    setCurrentReservation(reservation);
    setModalType('block');
    setShowModal(true);
  };

  const handlePay = (reservation) => {
    setCurrentReservation(reservation);
    setModalType('pay');
    setShowModal(true);
  };

  const handleTime = (reservation) => {
    setCurrentReservation(reservation);
    setModalType('time');
    setShowModal(true);
  };

  const handleViewPayments = async (reservation) => {
    try {
      setLoading(true);
      const response = await reservationService.getReservationPayments(reservation.id);
      setPayments(response.data || []);
      setCurrentReservation(reservation);
      setShowPaymentSidebar(true);
    } catch (err) {
      setError(err.message || 'Error al cargar pagos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentSidebar = () => {
    setShowPaymentSidebar(false);
    setPayments([]);
    setCurrentReservation(null);
  };

  const handleAccept = async () => {
    if (!currentReservation) return;
    
    try {
      setLoading(true);
      await reservationService.updateReservationStatus(currentReservation.id, 'IN_PROGRESS');
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al aceptar la reserva');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!currentReservation) return;
    
    try {
      setLoading(true);
      await reservationService.rejectReservation(currentReservation.id);
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al rechazar la reserva');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSidebar = (reservation) => {
    setCurrentReservation(reservation);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentReservation(null);
  };

  const handleComplete = async () => {
    if (!currentReservation) return;
    
    try {
      setLoading(true);
      await reservationService.updateReservationStatus(currentReservation.id, 'COMPLETED');
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al completar la reserva');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async () => {
    if (!currentReservation) return;
    
    try {
      setLoading(true);
      await reservationService.updateReservationStatus(currentReservation.id, 'FULFILLED');
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al marcar como cumplido');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    if (!currentReservation) return;
    
    try {
      setLoading(true);
      await reservationService.createPayment(currentReservation.id, {
        amount: parseFloat(paymentData.amount)
      });
      await loadReservations();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al registrar el pago');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReservation(null);
    setModalType(null);
  };

  React.useEffect(() => {
    document.title = "MLAP | Gestionar reservas";
    if (canRead) {
      loadReservations();
    }
  }, [canRead]);

  if (!canRead) {
    return <NoPermissionMessage />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const reservationColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'user_full_name', header: 'Usuario', accessor: (row) => row.user_full_name },
    { key: 'event_variant_name', header: 'Evento', accessor: (row) => row.event_variant_name },
    { key: 'chapel_name', header: 'Capilla', accessor: (row) => row.chapel_name },
    { key: 'event_date', header: 'Fecha', accessor: (row) => formatDate(row.event_date) },
    { key: 'event_time', header: 'Hora', accessor: (row) => formatTime(row.event_time) },
    { key: 'current_price', header: 'Precio', accessor: (row) => `$ ${parseFloat(row.current_price || 0).toFixed(2)}` },
    { key: 'paid_amount', header: 'Pagado', accessor: (row) => `$ ${parseFloat(row.paid_amount || 0).toFixed(2)}` },
    { key: 'status', header: 'Estado', accessor: (row) => STATUS_MAP[row.status] || row.status },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
          {canUpdate && row.status !== 'FULFILLED' && row.status !== 'REJECTED' && (
            <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
          )}
          {canUpdate && parseFloat(row.paid_amount || 0) < parseFloat(row.current_price || 0) && 
           row.status !== 'REJECTED' && row.status !== 'CANCELLED' && (
            <MyButtonShortAction type="pay" title="Pagar" onClick={() => handlePay(row)} />
          )}
          <MyButtonShortAction type="receipt" title="Ver Pagos" onClick={() => handleViewPayments(row)} />
          {(row.status === 'RESERVED' || row.status === 'IN_PROGRESS' || row.status === 'COMPLETED') && (
            <MyButtonShortAction type="block" title="Bloquear" onClick={() => handleBlock(row)} />
          )}
        </MyGroupButtonsActions>
      )
    },
  ];

  const getModalContentAndActions = () => {
    if (!currentReservation) return { title: '', content: null, onAccept: null, onCancel: null };

    switch (modalType) {
      case 'view':
        return {
          title: 'Detalles de la Reserva',
          content: (
            <div className="Inputs-add">
              <label>Evento</label>
              <input
                type="text"
                className="inputModal"
                value={currentReservation.event_variant_name || ''}
                disabled
              />
              <label>Capilla</label>
              <input
                type="text"
                className="inputModal"
                value={currentReservation.chapel_name || ''}
                disabled
              />
              <label>Fecha</label>
              <input
                type="text"
                className="inputModal"
                value={formatDate(currentReservation.event_date)}
                disabled
              />
              <label>Hora</label>
              <input
                type="text"
                className="inputModal"
                value={formatTime(currentReservation.event_time)}
                disabled
              />
              <label>Usuario</label>
              <input
                type="text"
                className="inputModal"
                value={currentReservation.user_full_name || ''}
                disabled
              />
              <label>Beneficiario</label>
              <input
                type="text"
                className="inputModal"
                value={currentReservation.beneficiary_full_name || 'N/A'}
                disabled
              />
              {currentReservation.mentions && currentReservation.mentions.length > 0 && (
                <>
                  <label style={{ marginTop: '15px', fontWeight: 'bold' }}>Menciones</label>
                  {currentReservation.mentions.map((mention, index) => (
                    <div key={mention.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '3px solid #4CAF50' }}>
                      <label style={{ fontSize: '0.9em', color: '#666' }}>
                        {mention.mention_type_name}
                      </label>
                      <input
                        type="text"
                        className="inputModal"
                        value={mention.mention_name}
                        disabled
                        style={{ marginTop: '5px' }}
                      />
                    </div>
                  ))}
                </>
              )}
              <label>Precio del Evento</label>
              <input
                type="text"
                className="inputModal"
                value={`$ ${parseFloat(currentReservation.current_price || 0).toFixed(2)}`}
                disabled
              />
              <label>Monto Pagado</label>
              <input
                type="text"
                className="inputModal"
                value={`$ ${parseFloat(currentReservation.paid_amount || 0).toFixed(2)}`}
                disabled
              />
              <label>Estado</label>
              <input
                type="text"
                className="inputModal"
                value={STATUS_MAP[currentReservation.status] || currentReservation.status}
                disabled
              />
            </div>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        if (currentReservation.status === 'RESERVED') {
          return {
            title: 'Confirmar reserva',
            content: (
              <div>
                <h4>¿Desea confirmar la reserva #{currentReservation.id}?</h4>
                <p><strong>Estado actual:</strong> {STATUS_MAP[currentReservation.status]}</p>
              </div>
            ),
            onAccept: handleAccept,
            onCancel: handleCloseModal
          };
        } else if (currentReservation.status === 'IN_PROGRESS') {
          return {
            title: 'Completar reserva',
            content: (
              <div>
                <h4>¿Desea completar la reserva #{currentReservation.id}?</h4>
              </div>
            ),
            onAccept: handleComplete,
            onCancel: handleCloseModal
          };
        } else if (currentReservation.status === 'COMPLETED') {
          return {
            title: 'Reserva cumplida',
            content: (
              <div>
                <h4>¿Desea marcar como cumplida la reserva #{currentReservation.id}?</h4>
              </div>
            ),
            onAccept: handleFulfill,
            onCancel: handleCloseModal
          };
        }
        break;
      case 'block':
        return {
          title: 'Rechazar reserva',
          content: (
            <div>
              <h4>¿Está seguro que desea rechazar la reserva #{currentReservation.id}?</h4> 
            </div>
          ),
          onAccept: handleReject,
          onCancel: handleCloseModal
        };
      case 'pay':
        return {
          title: 'Registrar Pago',
          content: (
            <PaymentForm 
              reservation={currentReservation} 
              onSubmit={handlePaymentSubmit}
            />
          ),
          onAccept: () => document.getElementById('payment-form')?.requestSubmit(),
          onCancel: handleCloseModal
        };
      default:
        return {
          title: '',
          content: null,
          onAccept: null,
          onCancel: null
        };
    }
  };

  const modalProps = getModalContentAndActions();

  function PaymentForm({ reservation, onSubmit }) {
    const [amount, setAmount] = useState('');
    const currentPrice = parseFloat(reservation?.current_price || 0);
    const paidAmount = parseFloat(reservation?.paid_amount || 0);
    const remaining = currentPrice - paidAmount;

    const handleSubmit = (e) => {
      e.preventDefault();
      const paymentAmount = parseFloat(amount);
      
      if (paymentAmount <= 0) {
        alert('El monto debe ser mayor a 0');
        return;
      }
      
      if (paymentAmount > remaining) {
        alert(`El monto no puede exceder el saldo pendiente: $ ${remaining.toFixed(2)}`);
        return;
      }
      
      onSubmit({ amount: paymentAmount });
    };

    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="Inputs-add">
          <label>Precio del Evento</label>
          <input
            type="text"
            className="inputModal"
            value={`$ ${currentPrice.toFixed(2)}`}
            disabled
          />
          
          <label>Monto Actual Pagado</label>
          <input
            type="text"
            className="inputModal"
            value={`$ ${paidAmount.toFixed(2)}`}
            disabled
          />
          
          <label>Saldo Pendiente</label>
          <input
            type="text"
            className="inputModal"
            value={`$ ${remaining.toFixed(2)}`}
            disabled
          />
          
          <label>Monto a Pagar</label>
          <input
            type="number"
            className="inputModal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            max={remaining}
            step="0.01"
            required
          />
        </div>
      </form>
    );
  }

  return (
    <>
      {error && <div className="error-message" style={{padding: '1rem', margin: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px'}}>{error}</div>}
      {loading && <div className="loading-message" style={{padding: '1rem', margin: '1rem', textAlign: 'center'}}>Cargando...</div>}
      
      <div className="content-module only-this">
        <h2 className='title-screen'>Gestión de Reservas</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={handleSearch} />
            </div>
          </div>
          <DynamicTable
            columns={reservationColumns}
            data={reservations}
            gridColumnsLayout="70px 180px 1fr 160px 110px 90px 100px 100px 120px 260px"
            columnLeftAlignIndex={[1, 2, 3]}
          />
        </div>
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={modalProps.title}
          onAccept={modalProps.onAccept}
          onCancel={modalProps.onCancel}
        >
          {modalProps.content}
        </Modal>
        
        {showPaymentSidebar && (
          <div className="sidebar-overlay" onClick={handleClosePaymentSidebar}>
            <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
              <div className="sidebar-header">
                <h3>Historial de Pagos - Reserva #{currentReservation?.id}</h3>
                <button onClick={handleClosePaymentSidebar}>✕</button>
              </div>
              <div className="sidebar-content">
                {payments.length === 0 ? (
                  <p>No hay pagos registrados</p>
                ) : (
                  <div className="payments-list">
                    {payments.map((payment) => (
                      <div key={payment.id} className="payment-item">
                        <div className="payment-info">
                          <span className="payment-amount">$ {parseFloat(payment.amount).toFixed(2)}</span>
                          <span className="payment-date">{new Date(payment.payment_date).toLocaleString('es-ES')}</span>
                        </div>
                        {payment.registered_by_worker_name && (
                          <div className="payment-worker">Registrado por: {payment.registered_by_worker_name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}