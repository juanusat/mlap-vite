import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import ChapelScheduleViewer from '../components/ChapelScheduleViewer';
import * as reservationService from '../services/reservationService';
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
  React.useEffect(() => {
    document.title = "MLAP | Gestionar reservas";
    loadReservations();
  }, []);
  
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
      const details = await reservationService.getReservationDetailsForManagement(reservation.id);
      setCurrentReservation(details);
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
    setCurrentReservation(reservation);
    setModalType('edit');
    setShowModal(true);
  };

  const handleBlock = (reservation) => {
    setCurrentReservation(reservation);
    setModalType('block');
    setShowModal(true);
  };

  const handleTime = (reservation) => {
    setCurrentReservation(reservation);
    setModalType('time');
    setShowModal(true);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReservation(null);
    setModalType(null);
  };

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
    { key: 'current_price', header: 'Precio', accessor: (row) => `$ ${parseFloat(row.current_price || 0).toFixed(2)}` },
    { key: 'paid_amount', header: 'Pagado', accessor: (row) => `$ ${parseFloat(row.paid_amount || 0).toFixed(2)}` },
    { key: 'status', header: 'Estado', accessor: (row) => STATUS_MAP[row.status] || row.status },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
          {row.status !== 'FULFILLED' && row.status !== 'REJECTED' && (
            <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
          )}
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
            <div style={{ display: 'flex', gap: '20px', maxHeight: '70vh', overflow: 'auto' }}>
              {/* Columna izquierda: Detalles de la reserva */}
              <div className="Inputs-add" style={{ flex: '0 0 400px' }}>
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
              
              {/* Columna derecha: Horario de la capilla */}
              <ChapelScheduleViewer 
                chapelId={currentReservation.chapel_id} 
                parishId={localStorage.getItem('parish_id')} 
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
            gridColumnsLayout="70px 200px 200px 1fr 110px 100px 100px 120px 240px"
            columnLeftAlignIndex={[1, 2, 3, 4]}
          />
        </div>
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title={modalProps.title}
          onAccept={modalProps.onAccept}
          onCancel={modalProps.onCancel}
        >
          <div style={modalType === 'view' ? { minWidth: '1000px' } : {}}>
            {modalProps.content}
          </div>
        </Modal>
      </div>
    </>
  );
}