import React, { useState, useEffect } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components/SearchBar";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

// Datos de usuarios y eventos
const initialUsers = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  nombre: `Usuario ${i + 1}`,
}));

// AHORA DEFINIDO FUERA: Opciones de capillas para la simulación
const chapelsOptions = [
  "Capilla Santa Ana",
  "Capilla San José Obrero",
  "Capilla Virgen del Carmen",
  "Capilla La Candelaria",
  "Capilla de San Antonio",
];

// ... (resto de eventsOptions, getRandomDate, initialRequirementsData sin cambios)

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

// Generación de datos iniciales con la propiedad 'capilla'
const initialReservationsData = Array.from({ length: 40 }, (_, i) => {
  const randomUser = initialUsers[Math.floor(Math.random() * initialUsers.length)];
  const randomEvent = eventsOptions[Math.floor(Math.random() * eventsOptions.length)];
  const randomAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  // Accede a la variable chapelsOptions definida arriba
  const randomChapel = chapelsOptions[Math.floor(Math.random() * chapelsOptions.length)];

  return {
    id: i + 1,
    evento: randomEvent.nombre,
    capilla: randomChapel,
    fecha: getRandomDate(),
    usuarioId: randomUser.id,
    usuarioNombre: randomUser.nombre,
    estado: 'Reservado',
    pagoCompletado: false,
    requisitos: initialRequirementsData.map(req => ({ ...req, completado: false })),
    monto: randomAmount,
  };
});

// -------------------------------------------------------------------------
// Componente principal (la lógica interna para la tabla sigue siendo la misma)
// -------------------------------------------------------------------------

export default function Reservas() {
    React.useEffect(() => {
      document.title = "MLAP | Gestionar reservas";
    }, []);
  
  const [reservations, setReservations] = useState(initialReservationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [displayedReservations, setDisplayedReservations] = useState(initialReservationsData);

  useEffect(() => {
    const filteredData = reservations.filter((reservation) =>
      Object.values(reservation).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setDisplayedReservations(filteredData);
  }, [reservations, searchTerm]);

  const handleView = (reservation) => {
    setCurrentReservation(reservation);
    setModalType('view');
    setShowModal(true);
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

  const handleAccept = () => {
    if (currentReservation) {
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === currentReservation.id ? { ...res, estado: 'En progreso' } : res
        )
      );
      handleCloseModal();
    }
  };

  const handleReject = () => {
    if (currentReservation) {
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === currentReservation.id ? { ...res, estado: 'Rechazado' } : res
        )
      );
      handleCloseModal();
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

  const handleComplete = () => {
    if (currentReservation) {
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === currentReservation.id ? { ...res, estado: 'Completado' } : res
        )
      );
      handleCloseModal();
    }
  };

  const handleFulfill = () => {
    if (currentReservation) {
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === currentReservation.id ? { ...res, estado: 'Cumplido' } : res
        )
      );
      handleCloseModal();
    }
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

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentReservation(null);
    setModalType(null);
  };

  const reservationColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'usuarioNombre', header: 'Usuario', accessor: (row) => row.usuarioNombre },
    { key: 'evento', header: 'Evento', accessor: (row) => row.evento },
    // Columna Capilla (sin cambios)
    { key: 'capilla', header: 'Capilla', accessor: (row) => row.capilla },
    { key: 'fecha', header: 'Fecha', accessor: (row) => row.fecha },
    { key: 'monto', header: 'Monto', accessor: (row) => `$ ${row.monto.toFixed(2)}` },
    { key: 'estado', header: 'Estado', accessor: (row) => row.estado },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
          {row.estado !== 'Cumplido' && row.estado !== 'Rechazado' && (
            <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
          )}
          {row.estado === 'En progreso' && (
            <MyButtonShortAction type="key" title="Ver Requisitos" onClick={() => handleOpenSidebar(row)} />
          )}
          {(row.estado === 'En progreso' || row.estado === 'Completado') && (
            <MyButtonShortAction type="time" title="Reprogramar" onClick={() => handleTime(row)} />
          )}
          {(row.estado === 'Reservado' || row.estado === 'En progreso' || row.estado === 'Completado') && (
            <MyButtonShortAction type="block" title="Bloquear" onClick={() => handleBlock(row)} />
          )}
        </MyGroupButtonsActions>
      )
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case 'view':
        return {
          title: 'Detalles de la Reserva',
          content: currentReservation && (
            <div className="Inputs-add">
              <label>Evento</label>
              <input
                type="text"
                className="inputModal"
                id="nombre"
                value={currentReservation.evento}
                disabled
              />
              {/* Campo de Capilla en la vista del modal (sin cambios) */}
              <label>Capilla</label>
              <input
                type="text"
                className="inputModal"
                value={currentReservation.capilla}
                disabled
              />

              <label>Fecha</label>
              <input
                type="text"
                className="inputModal"
                id="nombre"
                value={currentReservation.fecha}
                disabled
              />
              <label>Usuario</label>
              <input
                type="text"
                className="inputModal"
                id="nombre"
                value={currentReservation.usuarioNombre}
                disabled
              />
              <label>Monto</label>
              <input
                type="text"
                className="inputModal"
                id="nombre"
                value={`$ ${currentReservation.monto.toFixed(2)}`}
                disabled
              />
              <label>Estado</label>
              <input
                type="text"
                className="inputModal"
                id="nombre"
                value={currentReservation.estado}
                disabled
              />
            </div>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        // ... (resto del switch sin cambios)
        if (currentReservation?.estado === 'Reservado') {
          return {
            title: 'Confirmar reserva',
            content: currentReservation && (
              <div>
                <h4>¿Desea confirmar la reserva #{currentReservation.id}?</h4>
                <p> <strong>Estado actual:</strong> {currentReservation.estado}</p>
              </div>
            ),
            onAccept: handleAccept,
            onCancel: handleCloseModal
          };
        } else if (currentReservation?.estado === 'En progreso') {
          return {
            title: 'Completar reserva',
            content: currentReservation && (
              <div>
                <h4>¿Desea completar la reserva #{currentReservation.id}?</h4>
                <p>Estado actual: <strong>{currentReservation.estado}</strong></p>
              </div>
            ),
            onAccept: handleComplete,
            onCancel: handleCloseModal
          };
        } else if (currentReservation?.estado === 'Completado') {
          return {
            title: 'Reserva cumplida',
            content: currentReservation && (
              <div>
                <h4>¿Desea marcar como cumplida la reserva #{currentReservation.id}?</h4>
                <p>Estado actual: <strong>{currentReservation.estado}</strong></p>
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
          content: currentReservation && (
            <div>
              <h4>¿Está seguro que desea rechazar la reserva #{currentReservation.id}?</h4>
              <p>Estado actual: <strong>{currentReservation.estado}</strong></p>
              <p>Esta acción cambiará el estado a "Rechazado".</p>
            </div>
          ),
          onAccept: handleReject,
          onCancel: handleCloseModal
        };
      case 'time':
        return {
          title: 'Reprogramar reserva',
          content: currentReservation && (
            <div className='form-modal-horarios'>
              <div className="Inputs-add">
                <label htmlFor="fecha">Fecha</label>
                <input type="date" className="input_date" id="fecha" required />
                <label htmlFor="hora">Hora</label>
                <input type="time" className="input_time" id="hora" required />
              </div>
            </div>
          ),
          onAccept: handleCloseModal,
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
      <div className="content-module only-this">
        <h2 className='title-screen'>Gestión de Reservas</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
          </div>
          <DynamicTable
            columns={reservationColumns}
            data={displayedReservations}
            gridColumnsLayout="90px 180px 230px auto 120px 100px 130px 240px"
            columnLeftAlignIndex={[2, 3, 4]}
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
    </>
  );
}