import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Gestionar.css";

const chapelsOptions = [
  "Capilla Santa Ana",
  "Capilla San José Obrero",
  "Capilla Virgen del Carmen",
  "Capilla La Candelaria",
  "Capilla de San Antonio",
];

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
];

const initialEventsData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nombre: `Evento ${i + 1}`,
  descripcion: `Descripción detallada para el Evento ${i + 1}.`,
  estado: (i + 1) % 2 === 0 ? "Activo" : "Pendiente",
  tipo: (i + 1) % 3 === 0 ? "Comunitario" : "Privado",
  personas: (i + 1) % 3 === 0 ? Math.floor(Math.random() * 50) + 10 : "-",
  capilla: chapelsOptions[Math.floor(Math.random() * chapelsOptions.length)],
}));

export default function EventosLiturgicos() {
  const [events, setEvents] = useState(initialEventsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalType, setModalType] = useState(null);

  const filteredEvents = events.filter((event) =>
    Object.values(event).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleToggle = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, estado: event.estado === "Activo" ? "Pendiente" : "Activo" }
          : event
      )
    );
  };

  const openModal = (type, event = null) => {
    setModalType(type);
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEvent(null);
    setModalType(null);
  };

  const confirmDelete = () => {
    if (currentEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== currentEvent.id)
      );
      handleCloseModal();
    }
  };

  const handleSave = (eventData) => {
    if (modalType === "add") {
      const newEvent = { ...eventData, id: events.length + 1, estado: "Pendiente" };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } else if (modalType === "edit" && currentEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === currentEvent.id ? { ...event, ...eventData } : event
        )
      );
    }
    handleCloseModal();
  };

  const getModalContentAndActions = () => {
    switch (modalType) {
      case "view":
        return {
          title: "Detalles del evento",
          content: (
            <EventForm
              mode="view"
              initialData={currentEvent}
              onSave={handleSave}
              eventsOptions={eventsOptions}
              chapelsOptions={chapelsOptions}
            />
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal,
        };
      case "add":
        return {
          title: "Añadir evento",
          content: (
            <EventForm
              mode="add"
              onSave={handleSave}
              eventsOptions={eventsOptions}
              chapelsOptions={chapelsOptions}
            />
          ),
          onAccept: () => document.getElementById("event-form")?.requestSubmit(),
          onCancel: handleCloseModal,
        };
      case "edit":
        return {
          title: "Editar evento",
          content: (
            <EventForm
              mode="edit"
              initialData={currentEvent}
              onSave={handleSave}
              eventsOptions={eventsOptions}
              chapelsOptions={chapelsOptions}
            />
          ),
          onAccept: () => document.getElementById("event-form")?.requestSubmit(),
          onCancel: handleCloseModal,
        };
      case "delete":
        return {
          title: "Confirmar eliminación",
          content: <h3>¿Estás seguro que quieres eliminar este evento?</h3>,
          onAccept: confirmDelete,
          onCancel: handleCloseModal,
        };
      default:
        return { title: "", content: null, onAccept: null, onCancel: handleCloseModal };
    }
  };

  const modalProps = getModalContentAndActions();

  const eventColumns = [
    { key: "id", header: "ID", accessor: (row) => row.id },
    { key: "nombre", header: "Nombre", accessor: (row) => row.nombre },
    { key: "descripcion", header: "Descripción", accessor: (row) => row.descripcion },
    { key: "capilla", header: "Capilla", accessor: (row) => row.capilla },
    { key: "tipo", header: "Tipo", accessor: (row) => row.tipo },
    { key: "personas", header: "Personas", accessor: (row) => row.personas },
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
          <MyButtonShortAction type="view" title="Ver" onClick={() => openModal("view", row)} />
          <MyButtonShortAction type="edit" title="Editar" onClick={() => openModal("edit", row)} />
          <MyButtonShortAction type="delete" title="Eliminar" onClick={() => openModal("delete", row)} />
        </MyGroupButtonsActions>
      ),
    },
  ];

  return (
    <div className="content-module only-this">
      <h2 className="title-screen">Gestión de eventos</h2>
      <div className="app-container">
        <div className="search-add">
          <div className="center-container">
            <SearchBar onSearchChange={setSearchTerm} />
          </div>
          <MyGroupButtonsActions>
            <MyButtonShortAction type="add" onClick={() => openModal("add")} title="Añadir" />
          </MyGroupButtonsActions>
        </div>
        <DynamicTable
          columns={eventColumns}
          data={filteredEvents}
          gridColumnsLayout="90px 240px 1fr 250px 140px 140px 140px 220px"
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
  );
}

/**
 * EventForm unificado para add / edit / view
 * - mode: "add" | "edit" | "view"
 * - initialData: objeto evento para edit/view
 * - onSave: función(eventData)
 * - eventsOptions, chapelsOptions: listas auxiliares
 */
function EventForm({ mode, initialData = {}, onSave, eventsOptions = [], chapelsOptions = [] }) {
  const isView = mode === "view";
  // valores iniciales (edit/view) o vacíos (add)
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [capilla, setCapilla] = useState(initialData.capilla || "");
  const [tipo, setTipo] = useState(initialData.tipo || "Privado");
  const [personas, setPersonas] = useState(initialData.personas === "-" ? "" : initialData.personas || "");
  const [eventSearch, setEventSearch] = useState("");

  const handleEventSearchChange = (value) => {
    setEventSearch(value);
    // si coincide con una opción, rellenar nombre/descripcion automáticamente (modo add)
    const found = eventsOptions.find(e => e.nombre.toLowerCase() === value.toLowerCase());
    if (found) {
      setNombre(found.nombre);
      setDescripcion(found.descripcion);
    } else {
      // no limpiar nombre/desc automáticamente si el usuario ya los editó en edit mode
      if (mode === "add") {
        setNombre(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalizar personas: dejar '-' si vacío y tipo no comunitario
    const normalizedPersonas = (tipo === "Comunitario") ? (personas || "") : (personas || "-");
    onSave({
      nombre,
      descripcion,
      capilla,
      tipo,
      personas: normalizedPersonas
    });
  };

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      {/* En "add" mostramos el buscador/datalist para escoger evento (como antes).
          En edit/view mostramos directamente el campo nombre (editable o disabled). */}
      {mode === "add" && (
        <div className="Inputs-add">
          <label>Escoger evento</label>
          <input
            list="eventos"
            className="inputModal"
            value={eventSearch}
            onChange={(e) => handleEventSearchChange(e.target.value)}
            placeholder="Buscar o seleccionar un evento..."
            disabled={isView}
            required
          />
          <datalist id="eventos">
            {eventsOptions.map((opt, idx) => <option key={idx} value={opt.nombre} />)}
          </datalist>
        </div>
      )}

      <div className="Inputs-add">
        <label htmlFor="nombre">Nombre del evento</label>
        <input
          type="text"
          className="inputModal"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={isView}
          required
        />
      </div>

      <div className="Inputs-add">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          className="inputModal"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={isView}
          required
        />
      </div>

      <div className="Inputs-add">
        <label htmlFor="capilla">Capilla</label>
        <input
          list="capillas"
          className="inputModal"
          id="capilla"
          value={capilla}
          onChange={(e) => setCapilla(e.target.value)}
          placeholder="Buscar o seleccionar una capilla..."
          disabled={isView}
          required
        />
        <datalist id="capillas">
          {chapelsOptions.map((c, idx) => <option key={idx} value={c} />)}
        </datalist>
      </div>

      <div className="Inputs-add">
        <label>Tipo de Evento</label>
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="tipoEvento"
              checked={tipo === "Privado"}
              onChange={() => setTipo("Privado")}
              disabled={isView}
            />{" "}
            Privado
          </label>
          <label>
            <input
              type="radio"
              name="tipoEvento"
              checked={tipo === "Comunitario"}
              onChange={() => setTipo("Comunitario")}
              disabled={isView}
            />{" "}
            Comunitario
          </label>
        </div>
      </div>

      <div className="Inputs-add">
        <label htmlFor="personas">Número de personas</label>
        <input
          type="number"
          id="personas"
          className="inputModal"
          value={personas}
          onChange={(e) => setPersonas(e.target.value)}
          disabled={isView}
          // requerir solo cuando es Comunitario y no estamos en view
          required={tipo === "Comunitario" && !isView}
        />
      </div>
    </form>
  );
}
