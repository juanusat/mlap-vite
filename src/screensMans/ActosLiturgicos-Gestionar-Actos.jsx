import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Gestionar.css";
import * as eventVariantService from "../services/eventVariantService";
import * as chapelService from "../services/chapelService";
import usePermissions from "../hooks/usePermissions";
import { PERMISSIONS } from "../utils/permissions";
import PermissionGuard from "../components/PermissionGuard";

export default function EventosLiturgicos() {
  useEffect(() => {
    document.title = "MLAP | Gestionar actos litúrgicos";
  }, []);
  
  const { hasPermission } = usePermissions();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventsOptions, setEventsOptions] = useState([]);
  const [chapelsOptions, setChapelsOptions] = useState([]);

  useEffect(() => {
    loadEventVariants();
    loadEventsBase();
    loadChapels();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchEventVariants();
      } else {
        loadEventVariants();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const loadEventVariants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventVariantService.listEventVariants(1, 100);
      const variants = response.data || [];
      
      const formattedEvents = variants.map(variant => ({
        id: variant.id,
        nombre: variant.name,
        descripcion: variant.description,
        estado: variant.active ? "Activo" : "Inactivo",
        tipo: variant.variant_type === "PRIVATE" ? "Privado" : "Comunitario",
        personas: variant.variant_type === "PRIVATE" ? "-" : variant.max_capacity,
        capilla: variant.chapel_name || "",
        chapel_id: variant.chapel_id,
        chapel_event_id: variant.chapel_event_id,
        event_id: variant.event_id,
        event_type: variant.variant_type,
        monto: variant.current_price || 0,
        duracion: variant.duration_minutes || 60,
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar variantes:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchEventVariants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventVariantService.searchEventVariants(searchTerm, 1, 100);
      const variants = response.data || [];
      
      const formattedEvents = variants.map(variant => ({
        id: variant.id,
        nombre: variant.name,
        descripcion: variant.description,
        estado: variant.active ? "Activo" : "Inactivo",
        tipo: variant.variant_type === "PRIVATE" ? "Privado" : "Comunitario",
        personas: variant.variant_type === "PRIVATE" ? "-" : variant.max_capacity,
        capilla: variant.chapel_name || "",
        chapel_id: variant.chapel_id,
        chapel_event_id: variant.chapel_event_id,
        event_id: variant.event_id,
        event_type: variant.variant_type,
        monto: variant.current_price || 0,
        duracion: variant.duration_minutes || 60,
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
      console.error("Error en búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEventsBase = async () => {
    try {
      const response = await eventVariantService.listEventsBase();
      console.log("Respuesta completa de eventos:", response);
      console.log("Data de eventos:", response.data);
      const eventsList = response.data || [];
      setEventsOptions(eventsList.map(e => ({ 
        id: e.id,
        nombre: e.name, 
        descripcion: e.description 
      })));
      console.log("Eventos opciones mapeadas:", eventsList);
    } catch (err) {
      console.error("Error al cargar eventos base:", err);
    }
  };

  const loadChapels = async () => {
    try {
      const response = await chapelService.searchChapels(1, 100, '');
      const chapelsList = response.data || [];
      setChapelsOptions(chapelsList.map(c => ({ 
        id: c.id, 
        name: c.name 
      })));
    } catch (err) {
      console.error("Error al cargar capillas:", err);
    }
  };

  const handleToggle = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    try {
      const newStatus = event.estado !== "Activo";
      await eventVariantService.partialUpdateEventVariant(eventId, { active: newStatus });
      
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === eventId
            ? { ...e, estado: newStatus ? "Activo" : "Inactivo" }
            : e
        )
      );
    } catch (err) {
      alert("Error al cambiar el estado: " + err.message);
    }
  };

  const filteredEvents = events;

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

  const confirmDelete = async () => {
    if (currentEvent) {
      try {
        await eventVariantService.deleteEventVariant(currentEvent.id);
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== currentEvent.id)
        );
        handleCloseModal();
      } catch (err) {
        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const handleSave = async (eventData) => {
    try {
      if (modalType === "add") {
        const variantData = {
          event_id: eventData.event_id,
          name: eventData.nombre,
          description: eventData.descripcion,
          chapel_id: eventData.chapel_id,
          event_type: eventData.tipo === "Privado" ? "PRIVATE" : "COMUNITY",
          current_price: parseFloat(eventData.monto) || 0,
        };
        
        if (eventData.tipo === "Comunitario" && eventData.personas) {
          variantData.max_capacity = parseInt(eventData.personas);
        }

        // Solo agregar duration_minutes si se proporciona un valor
        if (eventData.duracion && eventData.duracion !== '') {
          variantData.duration_minutes = parseInt(eventData.duracion);
        }

        await eventVariantService.createEventVariant(variantData);
        loadEventVariants();
      } else if (modalType === "edit" && currentEvent) {
        const variantData = {
          event_id: eventData.event_id,
          name: eventData.nombre,
          description: eventData.descripcion,
          chapel_id: eventData.chapel_id,
          event_type: eventData.tipo === "Privado" ? "PRIVATE" : "COMUNITY",
          current_price: parseFloat(eventData.monto) || 0,
        };
        
        if (eventData.tipo === "Comunitario" && eventData.personas) {
          variantData.max_capacity = parseInt(eventData.personas);
        }

        // Solo agregar duration_minutes si se proporciona un valor
        if (eventData.duracion && eventData.duracion !== '') {
          variantData.duration_minutes = parseInt(eventData.duracion);
        }

        await eventVariantService.updateEventVariant(currentEvent.id, variantData);
        loadEventVariants();
      }
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
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
          content: <h4>¿Estás seguro que quieres eliminar este evento?</h4>,
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
    { key: "personas", header: "Personas", accessor: (row) => row.personas },
    { key: "monto", header: "Monto (S/.)", accessor: (row) => `S/. ${parseFloat(row.monto || 0).toFixed(2)}` },
    {
      key: "estado",
      header: "Estado",
      accessor: (row) => (
        hasPermission(PERMISSIONS.ESTADO_ACTOS_LITURGICOS_U) ? (
          <ToggleSwitch
            isEnabled={row.estado === "Activo"}
            onToggle={() => handleToggle(row.id)}
          />
        ) : (
          <span>{row.estado}</span>
        )
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => openModal("view", row)} />
          <PermissionGuard permission={PERMISSIONS.ACTOS_LITURGICOS_ACTOS_U}>
            <MyButtonShortAction type="edit" title="Editar" onClick={() => openModal("edit", row)} />
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.ACTOS_LITURGICOS_ACTOS_D}>
            <MyButtonShortAction type="delete" title="Eliminar" onClick={() => openModal("delete", row)} />
          </PermissionGuard>
        </MyGroupButtonsActions>
      ),
    },
  ];

  return (
    <div className="content-module only-this">
      <h2 className="title-screen">Gestión de actos litúrgicos</h2>
      <div className="app-container">
        <div className="search-add">
          <div className="center-container">
            <SearchBar onSearchChange={setSearchTerm} />
          </div>
          <MyGroupButtonsActions>
            <PermissionGuard permission={PERMISSIONS.ACTOS_LITURGICOS_ACTOS_C}>
              <MyButtonShortAction type="add" onClick={() => openModal("add")} title="Añadir" />
            </PermissionGuard>
          </MyGroupButtonsActions>
        </div>
        
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        <DynamicTable
          columns={eventColumns}
          data={filteredEvents}
          gridColumnsLayout="90px 180px 1fr 200px 140px 130px 140px 220px"
          columnLeftAlignIndex={[2, 3]}
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
  
  const [nombre, setNombre] = useState(initialData.nombre || "");
  const [descripcion, setDescripcion] = useState(initialData.descripcion || "");
  const [capillaId, setCapillaId] = useState(initialData.chapel_id || "");
  const [capillaName, setCapillaName] = useState(initialData.capilla || "");
  const [eventId, setEventId] = useState(initialData.event_id || "");
  const defaultTipo = (initialData.personas === "-" || !initialData.tipo) ? "Privado" : "Comunitario";
  const [tipo, setTipo] = useState(initialData.tipo || defaultTipo);
  const [personas, setPersonas] = useState(initialData.personas === "-" ? "" : initialData.personas || "");
  const [monto, setMonto] = useState(initialData.monto || 0);
  const [duracion, setDuracion] = useState(initialData.duracion || "");
  const [eventSearch, setEventSearch] = useState("");

  const handleEventSearchChange = (value) => {
    const found = eventsOptions.find(e => e.id === parseInt(value));
    if (found) {
      setEventId(found.id);
      setNombre(found.nombre);
      setDescripcion(found.descripcion);
    }
  };

  const handleCapillaChange = (value) => {
    const found = chapelsOptions.find(c => c.id === parseInt(value));
    if (found) {
      setCapillaId(found.id);
      setCapillaName(found.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const normalizedPersonas = (tipo === "Privado") ? "-" : (personas || ""); 
    
    onSave({
      nombre,
      descripcion,
      capilla: capillaName,
      chapel_id: capillaId,
      event_id: eventId,
      tipo,
      personas: normalizedPersonas,
      monto,
      duracion
    });
  };

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      {/* Selector de Evento (Solo en modo Añadir) */}
      {mode === "add" && (
        <div className="Inputs-add">
          <label htmlFor="eventSelect">Escoger evento</label>
          <select
            id="eventSelect"
            className="inputModal"
            value={eventId}
            onChange={(e) => handleEventSearchChange(e.target.value)}
            disabled={isView}
            required
          >
            <option value="">Seleccione un evento...</option>
            {eventsOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nombre del Evento */}
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

      {/* Descripción */}
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

      {/* Monto */}
      <div className="Inputs-add">
        <label htmlFor="monto">Monto (S/.)</label>
        <input
          type="number"
          id="monto"
          className="inputModal"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          disabled={isView}
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Duración */}
      <div className="Inputs-add">
        <label htmlFor="duracion">Duración (minutos)</label>
        <input
          type="number"
          id="duracion"
          className="inputModal"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          disabled={isView}
          min="1"
          step="1"
          placeholder="60 (por defecto)"
        />
        <small style={{display: 'block', marginTop: '5px', color: '#666', fontSize: '0.85em'}}>
          Opcional: Si no se especifica, se usará 60 minutos por defecto
        </small>
      </div>

      {/* Capilla */}
      <div className="Inputs-add">
        <label htmlFor="capillaSelect">Capilla</label>
        <select
          id="capillaSelect"
          className="inputModal"
          value={capillaId}
          onChange={(e) => handleCapillaChange(e.target.value)}
          disabled={isView}
          required
        >
          <option value="">Seleccione una capilla...</option>
          {chapelsOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Evento (Radio Buttons) */}
      <div className="Inputs-add">
        <label>Tipo de Evento</label>
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="tipoEvento"
              checked={tipo === "Privado"}
              onChange={() => {
                  setTipo("Privado");
                  setPersonas(""); // Limpiar personas al cambiar a Privado
              }}
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

      {/* CAMPO DE PERSONAS CON LÓGICA CONDICIONAL */}
      {tipo === "Comunitario" && (
        <div className="Inputs-add">
          <label htmlFor="personas">Número de personas</label>
          <input
            type="number"
            id="personas"
            className="inputModal"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
            disabled={isView}
            required={!isView} // Requerir solo si no es vista y es Comunitario
          />
        </div>
      )}
      {/* FIN DEL CAMPO CONDICIONAL */}
    </form>
  );
}