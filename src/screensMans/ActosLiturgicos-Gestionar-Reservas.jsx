import React, { useState, useEffect } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

// Datos de usuarios y eventos
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

// Generación de datos iniciales con usuarios aleatorios y eventos de la lista
const initialReservationsData = Array.from({ length: 40 }, (_, i) => {
  const randomUser = initialUsers[Math.floor(Math.random() * initialUsers.length)];
  const randomEvent = eventsOptions[Math.floor(Math.random() * eventsOptions.length)];
  // Asigna un monto aleatorio entre 100 y 500
  const randomAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
  return {
    id: i + 1,
    evento: randomEvent.nombre,
    fecha: getRandomDate(),
    usuarioId: randomUser.id,
    usuarioNombre: randomUser.nombre,
    estado: 'Reservado',
    pagoCompletado: false,
    requisitos: initialRequirementsData.map(req => ({ ...req, completado: false })),
    monto: randomAmount, // Nueva columna de monto
  };
});

export default function Reservas() {
  const [reservations, setReservations] = useState(initialReservationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [displayedReservations, setDisplayedReservations] = useState(initialReservationsData);

  useEffect(() => {
    let filteredData = reservations.filter((reservation) =>
      Object.values(reservation).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    console.log("Arreglo original (filtrado):", filteredData);

    if (sortColumn) {
      filteredData = [...filteredData].sort((a, b) => {
        let valueA, valueB;

        if (sortColumn === 'usuarioNombre') {
          valueA = parseInt(a.usuarioNombre.replace('Usuario ', ''), 10);
          valueB = parseInt(b.usuarioNombre.replace('Usuario ', ''), 10);
        } else {
          valueA = a[sortColumn];
          valueB = b[sortColumn];
        }

        if (valueA < valueB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });

      console.log("Arreglo ordenado por", sortColumn, "en dirección", sortDirection + ":", filteredData);
    }

    setDisplayedReservations(filteredData);

  }, [reservations, searchTerm, sortColumn, sortDirection]);

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

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const reservationColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id, sortable: true, sortKey: 'id' },
    { key: 'usuario', header: 'Usuario', accessor: (row) => row.usuarioNombre, sortable: true, sortKey: 'usuarioNombre' },
    { key: 'evento', header: 'Evento', accessor: (row) => row.evento, sortable: true, sortKey: 'evento' },
    { key: 'fecha', header: 'Fecha', accessor: (row) => row.fecha, sortable: true, sortKey: 'fecha' },
    { key: 'monto', header: 'Monto', accessor: (row) => `${row.monto.toFixed(2)}`, sortable: true, sortKey: 'monto' }, // Nueva columna
    { key: 'estado', header: 'Estado', accessor: (row) => row.estado, sortable: true, sortKey: 'estado' },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
          <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
          {row.estado === 'En progreso' && (
            <MyButtonShortAction type="key" title="Ver Requisitos" onClick={() => handleOpenSidebar(row)} />
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
            <div>
              <p><strong>ID de reserva:</strong> {currentReservation.id}</p>
              <p><strong>Evento:</strong> {currentReservation.evento}</p>
              <p><strong>Fecha:</strong> {currentReservation.fecha}</p>
              <p><strong>Usuario:</strong> {currentReservation.usuarioNombre}</p>
              <p><strong>Monto:</strong> ${currentReservation.monto.toFixed(2)}</p>
              <p><strong>Estado:</strong> {currentReservation.estado}</p>
            </div>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        if (currentReservation?.estado === 'Reservado') {
          return {
            title: 'Aceptar/Rechazar Reserva',
            content: currentReservation && (
              <div>
                <h4>Cambiar estado de la reserva #{currentReservation.id}</h4>
                <p>Estado actual: <strong>{currentReservation.estado}</strong></p>
              </div>
            ),
            onAccept: handleAccept,
            onCancel: handleReject
          };
        } else if (currentReservation?.estado === 'En progreso') {
          return {
            title: 'Completar Reserva',
            content: currentReservation && (
              <div>
                <h4>Confirmar finalización de la reserva #{currentReservation.id}</h4>
                <p>Estado actual: <strong>{currentReservation.estado}</strong></p>
              </div>
            ),
            onAccept: handleComplete,
            onCancel: handleCloseModal
          };
        }
        return {
          title: 'Editar estado de reserva',
          content: null,
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
            gridColumnsLayout="90px 300px auto 170px 100px 140px 220px"
            columnLeftAlignIndex={[2, 3]}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
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