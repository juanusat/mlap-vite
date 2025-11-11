import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import usePermission from '../hooks/usePermission';
import * as parishWorkerService from '../services/parishWorkerService';
import "../utils/Estilos-Generales-1.css";
import "../utils/Seguridad-Cuentas-Gestionar.css";

export default function CuentasGestionar() {
  const hasPermission = usePermission();

  useEffect(() => {
    document.title = "MLAP | Gestionar cuentas";
  }, []);

  const logout = useLogout();
  const { sessionData, loading: sessionLoading } = useSession(logout);
  
  const [workers, setWorkers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [workerRoles, setWorkerRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [addRoleOptions, setAddRoleOptions] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    role_id: ''
  });

  const parishId = sessionData?.parish?.id;

  useEffect(() => {
    if (parishId) {
      loadWorkers();
      loadAvailableRoles();
    }
  }, [parishId, currentPage]);

  const loadWorkers = async () => {
    if (!parishId) return;
    
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (searchTerm) {
        response = await parishWorkerService.searchWorkers(parishId, currentPage, 10, searchTerm);
      } else {
        response = await parishWorkerService.listWorkers(parishId, currentPage, 10);
      }
      
      setWorkers(response.data.workers);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError(err.message || 'Error al cargar trabajadores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRoles = async () => {
    if (!parishId) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BACKEND_URL}/api/parish/${parishId}/roles`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableRoles(data.data || []);
      }
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        loadWorkers();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      loadWorkers();
    }
  }, [searchTerm]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (worker, action) => {
    setCurrentWorker(worker);
    setModalType(action);

    if (action === "invite") {
      setFormData({ email: '', role_id: '' });
      setAddRoleOptions([]);
    } else if (action === "addRole" && worker) {
      setFormData({ email: worker.email, role_id: '' });

      // Cargar roles ya asignados al usuario y filtrar las opciones disponibles
      try {
        setLoading(true);
        const resp = await parishWorkerService.listWorkerRoles(worker.association_id, 1, 200);
        const assigned = resp.data?.active_roles || [];
        const assignedIds = new Set(
          assigned.map(ar => ar.role_id || ar.id || (ar.role && ar.role.id)).filter(Boolean)
        );

        const filtered = availableRoles.filter(r => !assignedIds.has(r.id));
        setAddRoleOptions(filtered);
      } catch (err) {
        console.error('Error al cargar roles asignados:', err);
        // Si falla, mostrar todas las opciones por defecto
        setAddRoleOptions(availableRoles);
      } finally {
        setLoading(false);
      }
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentWorker(null);
    setModalType(null);
    setModalError('');
    setFormData({ email: '', role_id: '' });
  };

  const handleViewRoles = async (worker) => {
    setCurrentWorker(worker);
    setShowSidebar(true);
    
    try {
      const response = await parishWorkerService.listWorkerRoles(worker.association_id, 1, 50);
      setWorkerRoles(response.data.active_roles || []);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      setWorkerRoles([]);
    }
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentWorker(null);
    setWorkerRoles([]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setModalError('');
      
      if (modalType === "invite") {
        await parishWorkerService.inviteWorker(parishId, formData.email);
        await loadWorkers();
        handleCloseModal();
      } else if (modalType === "addRole" && currentWorker) {
        await parishWorkerService.assignRole(currentWorker.association_id, formData.role_id);
        await loadWorkers();
        handleCloseModal();
      }
    } catch (err) {
      setModalError(err.message || 'Error al realizar la operación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!currentWorker) return;
    
    try {
      setLoading(true);
      await parishWorkerService.deleteAssociation(currentWorker.association_id);
      await loadWorkers();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al eliminar la asociación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (userRoleId) => {
    try {
      setLoading(true);
      await parishWorkerService.revokeRole(userRoleId);
      
      const response = await parishWorkerService.listWorkerRoles(currentWorker.association_id, 1, 50);
      setWorkerRoles(response.data.active_roles || []);
    } catch (err) {
      setError(err.message || 'Error al revocar el rol');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (worker) => {
    try {
      setLoading(true);
      await parishWorkerService.updateAssociationStatus(worker.association_id, !worker.active);
      await loadWorkers();
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'association_id', header: 'ID', accessor: (w) => w.association_id },
    { key: 'first_names', header: 'Nombre', accessor: (w) => w.first_names },
    { key: 'paternal_surname', header: 'Apellidos', accessor: (w) => w.paternal_surname },
    { key: 'email', header: 'Correo', accessor: (w) => w.email },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (w) => (
        <ToggleSwitch
          isEnabled={w.active}
          onToggle={() => handleToggle(w)}
          disabled={!hasPermission('ESTADO_SEGURIDAD_ASOC_USER_U')}
        />
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      accessor: (w) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction 
            type="view" 
            title="Ver roles" 
            onClick={() => handleViewRoles(w)} 
            disabled={!hasPermission('SEGURIDAD_ASOC_USER_R')}
          />
          <MyButtonShortAction 
            type="file" 
            title="Añadir rol" 
            onClick={() => handleOpenModal(w, "addRole")} 
            disabled={!hasPermission('SEGURIDAD_ASOC_USER_U')}
          />
          <MyButtonShortAction 
            type="delete" 
            title="Eliminar usuario" 
            onClick={() => handleOpenModal(w, "delete")} 
            disabled={!hasPermission('SEGURIDAD_ASOC_USER_D')}
          />
        </MyGroupButtonsActions>
      ),
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case "invite":
        return {
          title: "Invitar usuario",
          content: <UserForm formData={formData} handleFormChange={handleFormChange} mode="invite" error={modalError} />,
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case "addRole":
        return {
          title: "Añadir rol",
          content: (
            <UserForm
              formData={formData}
              handleFormChange={handleFormChange}
              mode="addRole"
              availableRoles={addRoleOptions}
              error={modalError}
            />
          ),
          onAccept: addRoleOptions && addRoleOptions.length ? handleSave : null,
          onCancel: handleCloseModal
        };
      case "delete":
        return {
          title: "Eliminar usuario",
          content: <h4>¿Deseas eliminar este usuario vinculado?</h4>,
          onAccept: confirmDelete,
          onCancel: handleCloseModal
        };
      default:
        return { title: "", content: null, onAccept: null, onCancel: handleCloseModal };
    }
  };

  const modalProps = getModalContentAndActions();

  if (sessionLoading || loading) {
    return <div className="content-module only-this"><p>Cargando...</p></div>;
  }

  if (!parishId) {
    return <div className="content-module only-this"><p>No se ha seleccionado una parroquia</p></div>;
  }

  return (
    <>
      <div className="content-module only-this">
        <h2 className="title-screen">Gestión de cuentas</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <MyButtonShortAction 
              type="add" 
              onClick={() => handleOpenModal(null, "invite")} 
              title="Añadir usuario" 
              disabled={!hasPermission('SEGURIDAD_ASOC_USER_C')}
            />
          </div>
          <DynamicTable
            columns={columns}
            data={workers}
            gridColumnsLayout="70px 350px 380px 1fr 140px 220px"
            columnLeftAlignIndex={[2, 3, 4]}
          />
        </div>
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

      {showSidebar && currentWorker && (
        <MyPanelLateralConfig title={`Roles de ${currentWorker.first_names}`}>
          <div className="panel-lateral-close-btn">
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
          </div>
          <div className="sidebar-list">
            {workerRoles.map((role) => (
              <div key={role.user_role_id} className="sidebar-list-item">
                {role.role_name}
                <MyButtonShortAction 
                  type="delete" 
                  title="Eliminar rol" 
                  onClick={() => handleDeleteRole(role.user_role_id)} 
                  disabled={!hasPermission('SEGURIDAD_ASOC_USER_D')}
                />
              </div>
            ))}
          </div>
        </MyPanelLateralConfig>
      )}
    </>
  );
}

const UserForm = ({ formData, handleFormChange, mode, availableRoles = [], error = '' }) => {
  return (
    <div className="Inputs-add">
      {mode === "invite" && (
        <>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            className="inputModal"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </>
      )}

      {mode === "addRole" && (
        <>
          <label htmlFor="role_id">Selecciona un rol:</label>
          {availableRoles.length > 0 ? (
            <select
              id="role_id"
              name="role_id"
              className="inputModal"
              value={formData.role_id}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccione un rol</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ marginTop: '8px' }}>No hay roles disponibles para asignar.</p>
          )}
        </>
      )}
      
      {error && <p className="error-message" style={{ marginTop: '10px', color: 'red', fontSize: '14px' }}>{error}</p>}
    </div>
  );
};
