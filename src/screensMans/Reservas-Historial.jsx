import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import "../utils/Estilos-Generales-1.css";
import "../utils/Reservas-Gestionar.css";

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
  const start = new Date(2024, 0, 1);
  const end = new Date(2024, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toLocaleDateString();
};

const initialRequirementsData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  nombre: `Requisito ${i + 1}`
}));

const initialReservationsData = Array.from({ length: 40 }, (_, i) => {
  const randomEvent = eventsOptions[Math.floor(Math.random() * eventsOptions.length)];
  const randomAmount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

  let estado;
  const randomStatus = Math.random();
  if (randomStatus < 0.6) {
    estado = "Finalizado";
  } else if (randomStatus < 0.8) {
    estado = "Rechazado";
  } else {
    estado = "Cancelado";
  }

  const requisitosCompletados = initialRequirementsData.map(req => ({
    ...req,
    // Todos los requisitos están completados si el estado es 'Finalizado'
    completado: estado === "Finalizado" ? true : Math.random() > 0.5,
  }));

  return {
    id: i + 1,
    evento: randomEvent.nombre,
    fecha: getRandomDate(),
    estado: estado,
    pagoCompletado: estado === "Finalizado" ? true : false,
    requisitos: requisitosCompletados,
    monto: randomAmount,
  };
});

export default function ReservasHistorial() {
    React.useEffect(() => {
      document.title = "MLAP | Historial de reservas";
    }, []);
  
  const [reservations, setReservations] = useState(initialReservationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [displayedReservations, setDisplayedReservations] = useState(initialReservationsData);

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
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
          </div>
          <DynamicTable
            columns={reservationColumns}
            data={displayedReservations}
            gridColumnsLayout="90px 1fr 170px 100px 140px 220px"
            columnLeftAlignIndex={[2]}
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
            <p><strong>Evento:</strong> {currentReservation.evento}</p>
            <p><strong>Fecha:</strong> {currentReservation.fecha}</p>
            <p><strong>Monto:</strong> $ {currentReservation.monto.toFixed(2)}</p>
            <p><strong>Estado:</strong> {currentReservation.estado}</p>
            <p><strong>Pago:</strong> {currentReservation.pagoCompletado ? "Completado" : "Pendiente"}</p>
            <hr className="divider-sidebar" />
            <h3 className="sidebar-subtitle">Requisitos</h3>
            {currentReservation.requisitos.map(req => (
              <div key={req.id} className="sidebar-list-item requirement-item">
                <label>
                  <input
                    type="checkbox"
                    checked={req.completado}
                    disabled
                  />
                  <span>{req.nombre}</span>
                </label>
              </div>
            ))}
          </div>
        </MyPanelLateralConfig>
      )}
    </>
  );
}