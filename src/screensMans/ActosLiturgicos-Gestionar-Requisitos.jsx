import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from "../components/MyPanelLateralConfig";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Requisitos.css";

// Datos de capillas reintroducidos para simulación
const chapelsOptions = [
  "Capilla Santa Ana",
  "Capilla San José Obrero",
  "Capilla Virgen del Carmen",
  "Capilla La Candelaria",
  "Capilla de San Antonio",
];

// Datos simulados (¡MODIFICADO para incluir Capilla!)
const initialEventsData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nombre: `Evento ${i + 1}`,
  descripcion: `Descripción del Evento ${i + 1}.`,
  // Se asigna una capilla aleatoria a cada evento
  capilla: chapelsOptions[Math.floor(Math.random() * chapelsOptions.length)],
}));

const initialRequirementsData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  eventoId: (i % 20) + 1,
  nombre: `Requisito ${i + 1}`,
  descripcion: `Descripción del Requisito ${i + 1}.`,
  estado: (i + 1) % 2 === 0 ? "Activo" : "Inactivo",
}));

export default function ActosLiturgicosRequisitos() {
  const [requirements, setRequirements] = useState(initialRequirementsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState(null);
  const [modalType, setModalType] = useState(null);

  const [events, setEvents] = useState(initialEventsData);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTermEvent, setSearchTermEvent] = useState("");

  const filteredRequirements = selectedEvent
    ? requirements.filter(
      (req) =>
        req.eventoId === selectedEvent.id &&
        (req.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  const filteredEvents = events.filter((event) =>
    Object.values(event).some((value) =>
      String(value).toLowerCase().includes(searchTermEvent.toLowerCase())
    )
  );

  const handleSelectEvent = () => setShowPanel(true);
  const handleClosePanel = () => setShowPanel(false);

  const handleAddRequirement = () => {
    if (!selectedEvent) {
      alert("Por favor, selecciona un evento primero.");
      return;
    }
    setCurrentRequirement(null);
    setModalType("add");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRequirement(null);
    setModalType(null);
  };

  const handleViewRequirement = (req) => {
    setCurrentRequirement(req);
    setModalType("view");
    setShowModal(true);
  };

  const handleEditRequirement = (req) => {
    setCurrentRequirement(req);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDeleteConfirmation = (req) => {
    setCurrentRequirement(req);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (currentRequirement) {
      setRequirements((prevReqs) =>
        prevReqs.filter((req) => req.id !== currentRequirement.id)
      );
      handleCloseModal();
    }
  };

  const handleSave = (reqData) => {
    if (modalType === "add") {
      const newReq = {
        ...reqData,
        id: requirements.length + 1,
        eventoId: selectedEvent.id,
        estado: "Activo",
        isNew: true,
      };
      setRequirements((prevReqs) => [...prevReqs, newReq]);
    } else if (modalType === "edit" && currentRequirement) {
      setRequirements((prevReqs) =>
        prevReqs.map((req) =>
          req.id === currentRequirement.id ? { ...req, ...reqData } : req
        )
      );
    }
    handleCloseModal();
  };

  const handleRowClickEvent = (event) => {
    setSelectedEvent(event);
    setShowPanel(false);
  };

  const handleToggle = (requirementId) => {
    setRequirements((prevRequirements) =>
      prevRequirements.map((req) =>
        req.id === requirementId
          ? { ...req, estado: req.estado === "Activo" ? "Inactivo" : "Activo" }
          : req
      )
    );
  };

  const getModalProps = () => {
    switch (modalType) {
      case "view":
        return {
          title: "Detalles del Requisito",
          content: (
            <RequisitoForm
              onSave={handleSave}
              req={currentRequirement}
              mode="view"
            />
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal,
        };
      case "edit":
        return {
          title: "Editar requisito",
          content: (
            <RequisitoForm
              onSave={handleSave}
              req={currentRequirement}
              mode="edit"
            />
          ),
          onAccept: () =>
            document.getElementById("requisito-form").requestSubmit(),
          onCancel: handleCloseModal,
        };
      case "delete":
        return {
          title: "Confirmar eliminación",
          content: <h3>¿Estás seguro que quieres eliminar este requisito?</h3>,
          onAccept: confirmDelete,
          onCancel: handleCloseModal,
        };
      case "add":
        return {
          title: "Añadir requisito",
          content: <RequisitoForm onSave={handleSave} mode="add" />,
          onAccept: () =>
            document.getElementById("requisito-form").requestSubmit(),
          onCancel: handleCloseModal,
        };
      default:
        return {
          title: "",
          content: null,
          onAccept: null,
          onCancel: handleCloseModal,
        };
    }
  };

  const modalProps = getModalProps();

  const requirementColumns = [
    { key: "id", header: "ID", accessor: (row) => row.id },
    { key: "nombre", header: "Nombre", accessor: (row) => row.nombre },
    { key: "descripcion", header: "Descripción", accessor: (row) => row.descripcion },
    {
      key: "estado",
      header: "Estado",
      accessor: (row) => (
        <ToggleSwitch
          isEnabled={row.estado === "Activo"}
          onToggle={() => handleToggle(row.id)}
        />
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction
            type="view"
            title="Ver"
            onClick={() => handleViewRequirement(row)}
          />
          <MyButtonShortAction
            type="edit"
            title="Editar"
            onClick={() => handleEditRequirement(row)}
          />
          <MyButtonShortAction
            type="delete"
            title="Eliminar"
            onClick={() => handleDeleteConfirmation(row)}
          />
        </MyGroupButtonsActions>
      ),
    },
  ];

  const TableEventsWithClick = ({ data }) => (
    <div className="table-container">
      <div className="table-body-div">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="table-row-div event-row"
            onClick={() => handleRowClickEvent(row)}
          >
            <div className="event-cell">
              <span className="event-id">{row.id}</span>
              <div className="event-info-display"> {/* Contenedor para nombre y capilla */}
                <span className="event-name">{row.nombre}</span>
                <div className="event-capilla-name">{row.capilla}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="content-module only-this">
        <h2 className="title-screen">Gestión de requisitos</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="texto-evento">
              <label>{selectedEvent ? selectedEvent.nombre : ""}</label>
            </div>
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <div className="right-container">
              <MyGroupButtonsActions>
                <MyButtonShortAction
                  type="select"
                  title="Seleccionar evento"
                  onClick={handleSelectEvent}
                />
                <MyButtonShortAction
                  type="add"
                  onClick={handleAddRequirement}
                  title="Añadir"
                />
              </MyGroupButtonsActions>
            </div>
          </div>
          {selectedEvent ? (
            <DynamicTable
              columns={requirementColumns}
              data={filteredRequirements}
              gridColumnsLayout="90px 380px 1fr 140px 220px"
              columnLeftAlignIndex={[2, 3]}
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
          title={modalProps.title}
          onAccept={modalProps.onAccept}
          onCancel={modalProps.onCancel}
        >
          {modalProps.content}
        </Modal>
      </div>

      {showPanel && (
        <MyPanelLateralConfig>
          <div className="panel-lateral-header">
            <h2>Seleccionar evento</h2>
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
          <TableEventsWithClick data={filteredEvents} />
        </MyPanelLateralConfig>
      )}
    </>
  );
}

function RequisitoForm({ onSave, req = {}, mode = "add" }) {
  // ... (RequisitoForm sin cambios, ya que solo maneja Nombre y Descripción del Requisito)
  const [nombre, setNombre] = useState(req.nombre || "");
  const [descripcion, setDescripcion] = useState(req.descripcion || "");
  const [estado] = useState(req.estado || "Activo");

  const isViewMode = mode === "view";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isViewMode) {
      onSave({ nombre, descripcion, estado });
    }
  };

  return (
    <form id="requisito-form" onSubmit={handleSubmit}>
      <div className="Inputs-add">
        <label htmlFor="nombre">Nombre del requisito</label>
        <input
          type="text"
          className="inputModal"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={isViewMode}
          required
        />
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          className="inputModal"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={isViewMode}
          required
        />
      </div>
    </form>
  );
}