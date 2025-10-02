import React, { useState, useEffect } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

const initialUsers = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  nombre: `Usuario ${i + 1}`,
}));

const eventsOptions = [
  { nombre: "Bautizo", descripcion: "Ceremonia para el sacramento del bautismo." },
  { nombre: "Primera comunión", descripcion: "Recibimiento del sacramento de la Eucaristía por primera vez." },
  { nombre: "Confirmación", descripcion: "Ceremonia para el sacramento de la confirmación." },
  { nombre: "Matrimonio", descripcion: "Celebración del sacramento del matrimonio." },
  { nombre: "Funeral", descripcion: "Misa en memoria de un difunto." },
  { nombre: "Misa dominical", descripcion: "Misa habitual del domingo." },
  { nombre: "Adoración Eucarística", descripcion: "Tiempo de oración y adoración al Santísimo Sacramento." },
  { nombre: "Vigilia de Oración", descripcion: "Noche de oración antes de una festividad o evento importante." },
  { nombre: "Retiro espiritual", descripcion: "Jornada de reflexión y crecimiento espiritual." },
  { nombre: "Catequesis", descripcion: "Clases de formación religiosa." },
  { nombre: "Confesión", descripcion: "Sacramento de la penitencia y la reconciliación." },
  { nombre: "Unción de los Enfermos", descripcion: "Sacramento para aquellos que se enfrentan a una enfermedad o ancianidad." },
  { nombre: "Rosario en comunidad", descripcion: "Oración del rosario en grupo." },
  { nombre: "Via Crucis", descripcion: "Meditación sobre la pasión de Cristo." },
  { nombre: "Reunión de grupo de oración", descripcion: "Encuentro semanal para orar juntos." }
];

const getRandomDate = () => {
  const start = new Date(2025, 0, 1);
  const end = new Date(2025, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toLocaleDateString();
};

const initialRequirementsData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Requisito ${i + 1}`
}));

const initialReservationsData = Array.from({ length: 40 }, (_, i) => {
  const randomUser = initialUsers[Math.floor(Math.random() * initialUsers.length)];
  const randomEvent = eventsOptions[Math.floor(Math.random() * eventsOptions.length)];
  const randomAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  return {
    id: i + 1,
    evento: randomEvent.nombre,
    fecha: getRandomDate(),
    estado: 'Reservado',
    pagoCompletado: false,
    requisitos: initialRequirementsData.map(req => ({ ...req, completado: false })),
    monto: randomAmount,
  };
});

export default function ReservasPendientes() {
  const [reservations, setReservations] = useState(initialReservationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [displayedReservations, setDisplayedReservations] = useState(initialReservationsData);

  // Estados para el modal de confirmación
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    const filteredData = reservations.filter((reservation) =>
      Object.values(reservation).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setDisplayedReservations(filteredData);
  }, [reservations, searchTerm]);

  const handleOpenSidebar = (reservation) => {
    setCurrentReservation(reservation);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentReservation(null);
  };

  const handleToggleRequirement = (reqId) => {
    if (!currentReservation) return;
    const updatedRequirements = currentReservation.requisitos.map(req =>
      req.id === reqId ? { ...req, completado: !req.completado } : req
    );
    setCurrentReservation({ ...currentReservation, requisitos: updatedRequirements });
  };

  const handleTogglePayment = () => {
    if (!currentReservation) return;
    setCurrentReservation({ ...currentReservation, pagoCompletado: !currentReservation.pagoCompletado });
  };

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
  const confirmDelete = () => {
    if (reservationToDelete) {
      const updatedReservations = reservations.filter(
        (reservation) => reservation.id !== reservationToDelete.id
      );
      setReservations(updatedReservations);
      handleCloseModal();
    }
  };

  const reservationColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'evento', header: 'Evento', accessor: (row) => row.evento },
    { key: 'fecha', header: 'Fecha', accessor: (row) => row.fecha },
    { key: 'monto', header: 'Monto', accessor: (row) => `$ ${row.monto.toFixed(2)}` },
    { key: 'estado', header: 'Estado', accessor: (row) => row.estado },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction
            type="delete"
            title="Eliminar"
            onClick={() => handleDeleteReservation(row)}
          />
          {row.estado === 'En progreso' && (
            <MyButtonShortAction type="key" title="Ver Requisitos" onClick={() => handleOpenSidebar(row)} />
          )}
        </MyGroupButtonsActions>
      )
    },
  ];

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Reservas pendientes</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
          </div>
          <DynamicTable
            columns={reservationColumns}
            data={displayedReservations}
            gridColumnsLayout="90px auto 170px 100px 140px 220px"
            columnLeftAlignIndex={[2, 3]}
          />
        </div>
      </div>
      {showSidebar && currentReservation && (
        <MyPanelLateralConfig>
          <div className="panel-lateral-header">
            <h2 className="sidebar-title">{`Detalles de la Reserva #${currentReservation.id}`}</h2>
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
          </div>
          <div className="sidebar-list">
            <hr className="divider-sidebar" />
            <h3 className="sidebar-subtitle">Requisitos</h3>
            {currentReservation.requisitos.map(req => (
              <div key={req.id} className="sidebar-list-item requirement-item">
                <label>
                  <input
                    type="checkbox"
                    checked={req.completado}
                    onChange={() => handleToggleRequirement(req.id)}
                  />
                  <span>{req.nombre}</span>
                </label>
              </div>
            ))}
            <hr className="divider-sidebar" />
            <h3 className="sidebar-subtitle">Estado de pago</h3>
            <div className="sidebar-list-item requirement-item">
              <label>
                <input
                  type="checkbox"
                  checked={currentReservation.pagoCompletado}
                  onChange={handleTogglePayment}
                />
                <span>Pago Completado</span>
              </label>
            </div>
          </div>
        </MyPanelLateralConfig>
      )}

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title="Confirmar eliminación"
        onAccept={confirmDelete}
        onCancel={handleCloseModal}
      >
        <h4>¿Estás seguro que quieres cancelar tu reserva  para el evento de {reservationToDelete?.evento}?</h4>
      </Modal>
    </>
  );
}