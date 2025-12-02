import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from "../components/MyPanelLateralConfig";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Requisitos.css";
import * as eventVariantService from "../services/eventVariantService";
import * as chapelEventRequirementService from "../services/chapelEventRequirementService";
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import NoPermissionMessage from '../components/NoPermissionMessage';

export default function ActosLiturgicosRequisitos() {
  // Todos los hooks deben estar al inicio, antes de cualquier return condicional
  const { hasPermission } = usePermissions();
  const canRead = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REQ_R);
  const canCreate = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REQ_C);
  const canUpdate = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REQ_U);
  const canDelete = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_REQ_D);
  const canUpdateStatus = hasPermission(PERMISSIONS.ESTADO_REQ_ACTOS_LIT_U);

  const [requirements, setRequirements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [eventVariants, setEventVariants] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedEventVariant, setSelectedEventVariant] = useState(null);
  const [searchTermEvent, setSearchTermEvent] = useState("");

  React.useEffect(() => {
    document.title = "MLAP | Gestionar requisitos";
  }, []);

  useEffect(() => {
    loadEventVariants();
  }, []);

  useEffect(() => {
    if (selectedEventVariant) {
      loadRequirements();
    }
  }, [selectedEventVariant]);

  const loadEventVariants = async () => {
    try {
      setLoading(true);
      const response = await eventVariantService.listEventVariants(1, 100);
      console.log("Respuesta de event variants:", response);
      const variantsList = response.data || [];
      console.log("Variants list:", variantsList);
      setEventVariants(variantsList);
    } catch (err) {
      console.error("Error al cargar variantes de eventos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRequirements = async () => {
    if (!selectedEventVariant) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await chapelEventRequirementService.getRequirementsByEventVariant(selectedEventVariant.id);
      const requirementsList = response.data || [];
      setRequirements(requirementsList);
    } catch (err) {
      console.error("Error al cargar requisitos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequirements = requirements.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.description && req.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEventVariants = eventVariants.filter((event) =>
    event.name.toLowerCase().includes(searchTermEvent.toLowerCase()) ||
    event.chapel_name.toLowerCase().includes(searchTermEvent.toLowerCase())
  );

  console.log("Event variants:", eventVariants);
  console.log("Filtered event variants:", filteredEventVariants);

  const handleSelectEvent = () => setShowPanel(true);
  const handleClosePanel = () => setShowPanel(false);

  const handleAddRequirement = () => {
    if (!canCreate) {
      return;
    }
    if (!selectedEventVariant) {
      return;
    }
    setCurrentRequirement(null);
    setModalError(null);
    setModalType("add");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentRequirement(null);
    setModalType(null);
    setModalError(null);
  };

  const handleViewRequirement = (req) => {
    setCurrentRequirement(req);
    setModalError(null);
    setModalType("view");
    setShowModal(true);
  };

  const handleEditRequirement = (req) => {
    if (!canUpdate) {
      return;
    }
    if (!req.is_editable) {
      return;
    }
    setCurrentRequirement(req);
    setModalError(null);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDeleteConfirmation = (req) => {
    if (!canDelete) {
      return;
    }
    if (!req.is_editable) {
      return;
    }
    setCurrentRequirement(req);
    setModalError(null);
    setModalType("delete");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (currentRequirement && currentRequirement.is_editable) {
      try {
        await chapelEventRequirementService.deleteChapelEventRequirement(currentRequirement.id);
        await loadRequirements();
        handleCloseModal();
      } catch (err) {
        console.error("Error al eliminar requisito:", err);
        setModalError(err.message);
      }
    }
  };

  const handleSave = async (reqData) => {
    try {
      if (modalType === "add") {
        await chapelEventRequirementService.createChapelEventRequirement({
          chapel_event_id: selectedEventVariant.chapel_event_id,
          name: reqData.nombre,
          description: reqData.descripcion
        });
      } else if (modalType === "edit" && currentRequirement) {
        await chapelEventRequirementService.updateChapelEventRequirement(currentRequirement.id, {
          name: reqData.nombre,
          description: reqData.descripcion
        });
      }
      await loadRequirements();
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar requisito:", err);
      setModalError(err.message);
    }
  };

  const handleRowClickEvent = (event) => {
    setSelectedEventVariant(event);
    setShowPanel(false);
  };

  const handleToggle = async (requirementId, currentActive) => {
    if (!canUpdateStatus) {
      return;
    }
    const requirement = requirements.find(r => r.id === requirementId);
    if (!requirement || !requirement.is_editable) {
      return;
    }

    try {
      await chapelEventRequirementService.updateChapelEventRequirementStatus(requirementId, !currentActive);
      await loadRequirements();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // Verificar permisos después de que todos los hooks hayan sido llamados
  if (!canRead) {
    return <NoPermissionMessage />;
  }

  const getModalProps = () => {
    switch (modalType) {
      case "view":
        return {
          title: "Detalles del Requisito",
          content: (
            <>
              <RequisitoForm
                onSave={handleSave}
                setModalError={setModalError}
                req={currentRequirement}
                mode="view"
              />
              {modalError && <div className="error-message">{modalError}</div>}
            </>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal,
        };
      case "edit":
        return {
          title: "Editar requisito",
          content: (
            <>
              <RequisitoForm
                onSave={handleSave}
                setModalError={setModalError}
                req={currentRequirement}
                mode="edit"
              />
              {modalError && <div className="error-message">{modalError}</div>}
            </>
          ),
          onAccept: () =>
            document.getElementById("requisito-form").requestSubmit(),
          onCancel: handleCloseModal,
        };
      case "delete":
        return {
          title: "Confirmar eliminación",
          content: (
            <>
              <h4>¿Estás seguro que quieres eliminar este requisito?</h4>
              {modalError && <div className="error-message">{modalError}</div>}
            </>
          ),
          onAccept: confirmDelete,
          onCancel: handleCloseModal,
        };
      case "add":
        return {
          title: "Añadir requisito",
          content: (
            <>
              <RequisitoForm onSave={handleSave} setModalError={setModalError} mode="add" />
              {modalError && <div className="error-message">{modalError}</div>}
            </>
          ),
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
    { 
      key: "tipo", 
      header: "Tipo", 
      accessor: (row) => row.requirement_type === 'BASE' ? 'Base' : 'Adicional'
    },
    { key: "nombre", header: "Nombre", accessor: (row) => row.name },
    { key: "descripcion", header: "Descripción", accessor: (row) => row.description },
    {
      key: "estado",
      header: "Estado",
      accessor: (row) => (
        canUpdateStatus ? (
          <ToggleSwitch
            isEnabled={row.active}
            onToggle={() => handleToggle(row.id, row.active)}
            disabled={!row.is_editable}
          />
        ) : (
          <span>{row.active ? 'Activo' : 'Inactivo'}</span>
        )
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
          {canUpdate && (
            <MyButtonShortAction
              type="edit"
              title="Editar"
              onClick={() => handleEditRequirement(row)}
              disabled={!row.is_editable}
            />
          )}
          {canDelete && (
            <MyButtonShortAction
              type="delete"
              title="Eliminar"
              onClick={() => handleDeleteConfirmation(row)}
              disabled={!row.is_editable}
            />
          )}
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
              <div className="event-info-display">
                <span className="event-name">{row.name}</span>
                <div className="event-capilla-name">{row.chapel_name}</div>
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
              <label>{selectedEventVariant ? selectedEventVariant.name : ""}</label>
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
                {canCreate && (
                  <MyButtonShortAction
                    type="add"
                    onClick={handleAddRequirement}
                    title="Añadir"
                  />
                )}
              </MyGroupButtonsActions>
            </div>
          </div>
          
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          
          {selectedEventVariant ? (
            <DynamicTable
              columns={requirementColumns}
              data={filteredRequirements}
              gridColumnsLayout="auto 140px 280px 1fr 140px 220px"
              columnLeftAlignIndex={[2, 3, 4]}
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
        <MyPanelLateralConfig title="Seleccionar evento" onClose={handleClosePanel}>
          <div className="sidebar-search">
            <SearchBar onSearchChange={setSearchTermEvent} />
          </div>
          <TableEventsWithClick data={filteredEventVariants} />
        </MyPanelLateralConfig>
      )}
    </>
  );
}

function RequisitoForm({ onSave, setModalError, req = {}, mode = "add" }) {

  const [nombre, setNombre] = useState(req.name || "");
  const [descripcion, setDescripcion] = useState(req.description || "");
  const [estado] = useState(req.estado || "Activo");

  const isViewMode = mode === "view";

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre') {
      const onlyLetters = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
      setNombre(onlyLetters);
    } else if (name === 'descripcion') {
      setDescripcion(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isViewMode) {
      if (!nombre.trim() || !descripcion.trim()) {
        setModalError('Por favor, complete todos los campos');
        return;
      }
      
      onSave({ nombre: nombre.trim(), descripcion: descripcion.trim(), estado });
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
          name="nombre"
          value={nombre}
          onChange={handleFormChange}
          onBlur={(e) => setNombre(e.target.value.trim())}
          disabled={isViewMode}
          required
          pattern=".*\S+.*"
          title="El nombre no puede estar vacío o contener solo espacios. Solo se permiten letras"
        />
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          className="inputModal"
          id="descripcion"
          name="descripcion"
          value={descripcion}
          onChange={handleFormChange}
          onBlur={(e) => setDescripcion(e.target.value.trim())}
          disabled={isViewMode}
          required
          pattern=".*\S+.*"
          title="La descripción no puede estar vacía o contener solo espacios"
        />
      </div>
    </form>
  );
}