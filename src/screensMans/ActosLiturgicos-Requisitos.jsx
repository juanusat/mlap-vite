import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import MyPanelLateralConfig from "../components/MyPanelLateralConfig";
import "../utils/ActosLiturgicos-Requisitos.css";

// Datos simulados (se mantienen igual)
const initialEventsData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nombre: `Evento ${i + 1}`,
  descripcion: `Descripción del Evento ${i + 1}.`,
}));

const initialRequirementsData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  eventoId: (i % 20) + 1,
  nombre: `Requisito ${i + 1}`,
  descripcion: `Descripción del Requisito ${i + 1}.`,
  estado: (i + 1) % 2 === 0 ? 'Activo' : 'Inactivo',
}));

export default function RequisitosGestionarSoloBarra() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requirements, setRequirements] = useState(initialRequirementsData);
  const [showModal, setShowModal] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [events, setEvents] = useState(initialEventsData);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTermEvent, setSearchTermEvent] = useState('');

  const handleSelectEvent = () => {
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
  };

  const handleAddRequirement = () => {
    if (!selectedEvent) {
      alert("Por favor, selecciona un evento primero.");
      return;
    }
    setCurrentRequirement(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRequirement(null);
    setModalType(null);
  };

  const handleSave = (reqData) => {
    const newReq = { ...reqData, id: requirements.length + 1, eventoId: selectedEvent.id };
    setRequirements(prevReqs => [...prevReqs, newReq]);
    handleCloseModal();
  };

  const handleRowClickEvent = (event) => {
    setSelectedEvent(event);
    setShowPanel(false);
  };

  const filteredEvents = events.filter(event =>
    Object.values(event).some(value =>
      String(value).toLowerCase().includes(searchTermEvent.toLowerCase())
    )
  );

  const filteredRequirements = selectedEvent ?
    requirements.filter(req => req.eventoId === selectedEvent.id)
    : [];

  const requirementColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'nombre', header: 'Nombre', accessor: (row) => row.nombre },
    { key: 'descripcion', header: 'Descripción', accessor: (row) => row.descripcion },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (row) => (
        <ToggleSwitch
          isEnabled={row.estado === 'Activo'}
        />
      ),
    },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" />
          <MyButtonShortAction type="edit" title="Editar" />
          <MyButtonShortAction type="delete" title="Eliminar" />
        </MyGroupButtonsActions>
      )
    },
  ];

  const eventColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'nombre', header: 'Nombre', accessor: (row) => row.nombre },
  ];

  // Aquí se mueve y modifica la tabla de eventos para que la fila sea clickable
  const TableEventsWithClick = ({ data, columns }) => {
    return (
      <div className="table-container">
        <table className="dynamic-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} onClick={() => handleRowClickEvent(row)}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Gestión de Requisitos</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <div className="right-container">
              <MyGroupButtonsActions>
                <MyButtonShortAction type="select" title="Seleccionar Evento" onClick={handleSelectEvent}/>
                <MyButtonShortAction type="add" onClick={handleAddRequirement} title="Añadir"/>
              </MyGroupButtonsActions>
            </div>
          </div>
          {selectedEvent ? (
            <DynamicTable
              columns={requirementColumns}
              data={filteredRequirements}
              gridColumnsLayout="auto auto auto 1fr auto auto auto"
            />
          ) : (
            <div className="empty-state">
              <p>Por favor, selecciona un evento para ver sus requisitos.</p>
            </div>
          )}
        </div>
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          title="Añadir Requisito"
        >
          <RequisitoForm onSave={handleSave} onClose={handleCloseModal} />
        </Modal>
      </div>

      {showPanel && (
        <>
          <MyPanelLateralConfig>
            <div className="panel-lateral-header">
              <h2>Seleccionar Evento</h2>
              <MyButtonShortAction
                type="close"
                onClick={handleClosePanel}
                title="Cerrar"
              />
            </div>
            <br />
            <div className="sidebar-search">
              <SearchBar onSearchChange={setSearchTermEvent} />
            </div>

            <TableEventsWithClick
              columns={eventColumns}
              data={filteredEvents}
            />
          </MyPanelLateralConfig>
        </>
      )}
    </>
  );
}

// Componente para el formulario de adición, basado en tu código
function RequisitoForm({ onSave, onClose, req = {} }) {
  const [nombre, setNombre] = useState(req.nombre || '');
  const [descripcion, setDescripcion] = useState(req.descripcion || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nombre, descripcion, estado: 'Pendiente' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Formulario para Añadir Requisito</h3>
      <div className="Inputs-add">
        <label htmlFor="addNombre">Nombre del Requisito</label>
        <input type="text" className="inputModal" id="addNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <label htmlFor="addDescripcion">Descripción</label>
        <textarea className="inputModal" id="addDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
      </div>
      <div className="buttons-container">
        <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
        <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
      </div>
    </form>
  );
}