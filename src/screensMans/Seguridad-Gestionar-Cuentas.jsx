import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import NoPermissionMessage from '../components/NoPermissionMessage';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import * as parishWorkerService from '../services/parishWorkerService';
import "../utils/Estilos-Generales-1.css";
import "../utils/Seguridad-Cuentas-Gestionar.css";
import '../utils/permissions.css';

export default function CuentasGestionar() {
  const logout = useLogout();
  const { sessionData, loading: sessionLoading } = useSession(logout);
  const { hasPermission, isParishAdmin } = usePermissions();
  
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
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [workerRoles, setWorkerRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [addRoleOptions, setAddRoleOptions] = useState([]);

  const [formData, setFormData] = useState({
    email: '',
    role_id: ''
  });

  const parishId = sessionData?.parish?.id;
  
  const canReadWorkers = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ASOC_USER_R);
  const canCreateWorker = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ASOC_USER_C);
  const canUpdateStatus = isParishAdmin || hasPermission(PERMISSIONS.ESTADO_ASOC_USER_U);
  const canAddRole = isParishAdmin || hasPermission(PERMISSIONS.ROL_ASOC_USER_C);
  const canDeleteWorker = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ASOC_USER_D);

  useEffect(() => {
    document.title = "MLAP | Gestionar cuentas";
  }, []);

  useEffect(() => {
    if (parishId && canReadWorkers) {
      loadWorkers();
      loadAvailableRoles();
    }
  }, [parishId, currentPage, canReadWorkers]);

  useEffect(() => {
    if (!canReadWorkers) return;
    
    if (searchTerm) {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        loadWorkers();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      loadWorkers();
    }
  }, [searchTerm, canReadWorkers]);

  const loadWorkers = async () => {
    if (!parishId || !canReadWorkers) return;
    
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
    if (!parishId || !canReadWorkers) return;
    
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

  // Si no tiene permiso, mostrar mensaje
  if (!canReadWorkers) {
    return (
      <div className="content-module only-this">
        <h2 className='title-screen'>Gestión de cuentas</h2>
        <NoPermissionMessage message="No tienes permisos para listar cuentas de usuarios. Contacta con el administrador de tu parroquia para obtener acceso." />
      </div>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = async (worker, action) => {
    if (action === "invite" && !canCreateWorker) return;
    if (action === "addRole" && !canAddRole) return;
    if (action === "delete" && !canDeleteWorker) return;
    
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
    setEmailError('');
    setRoleError('');
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
      setEmailError('');
      setRoleError('');
      
      if (modalType === "invite") {
        if (!formData.email || !formData.email.trim()) {
          setEmailError('El correo electrónico es obligatorio');
          setLoading(false);
          return;
        }
        
        // Validar formato del correo: 4-50 caracteres + @ + 2-8 caracteres + . + 2-8 caracteres (+ . + 2-8 caracteres opcional)
        const emailRegex = /^[a-zA-Z0-9._-]{1,50}@[a-zA-Z0-9-]{2,8}\.[a-zA-Z]{2,8}(\.[a-zA-Z]{2,8})?$/;
        if (!emailRegex.test(formData.email.trim())) {
          setEmailError('El formato del correo no es válido');
          setLoading(false);
          return;
        }
        
        await parishWorkerService.inviteWorker(parishId, formData.email.trim());
        await loadWorkers();
        handleCloseModal();
      } else if (modalType === "addRole" && currentWorker) {
        if (!formData.role_id || !formData.role_id.toString().trim()) {
          setRoleError('Debe seleccionar un rol');
          setLoading(false);
          return;
        }
        
        await parishWorkerService.assignRole(currentWorker.association_id, formData.role_id);
        await loadWorkers();
        handleCloseModal();
      }
    } catch (err) {
      if (modalType === "invite") {
        setEmailError(err.message || 'Error al realizar la operación');
      } else if (modalType === "addRole") {
        setRoleError(err.message || 'Error al realizar la operación');
      }
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
    if (!canUpdateStatus) return;
    
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
          disabled={!canUpdateStatus || w.is_parish_admin}
        />
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      accessor: (w) => {
        if (w.is_parish_admin) {
          return (
            <MyGroupButtonsActions>
              <span style={{ color: 'var(--color-n-500)', fontSize: '0.9em', fontStyle: 'italic' }}>
                Párroco
              </span>
            </MyGroupButtonsActions>
          );
        }
        
        return (
          <MyGroupButtonsActions>
            <MyButtonShortAction type="view" title="Ver roles" onClick={() => handleViewRoles(w)} />
            <MyButtonShortAction 
              type="file" 
              title="Añadir rol" 
              onClick={() => handleOpenModal(w, "addRole")} 
              classNameCustom={!canAddRole ? 'action-denied' : ''}
            />
            <MyButtonShortAction 
              type="delete" 
              title="Eliminar usuario" 
              onClick={() => handleOpenModal(w, "delete")} 
              classNameCustom={!canDeleteWorker ? 'action-denied' : ''}
            />
          </MyGroupButtonsActions>
        );
      },
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case "invite":
        return {
          title: "Invitar usuario",
          content: <UserForm formData={formData} handleFormChange={handleFormChange} mode="invite" emailError={emailError} />,
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
              roleError={roleError}
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
              classNameCustom={!canCreateWorker ? 'action-denied' : ''}
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
        <MyPanelLateralConfig title={`Roles de ${currentWorker.first_names}`} onClose={handleCloseSidebar}>
          <div className="sidebar-list">
            {workerRoles.map((role) => (
              <div key={role.user_role_id} className="sidebar-list-item">
                {role.role_name}
                <MyButtonShortAction 
                  type="delete" 
                  title="Eliminar rol" 
                  onClick={() => handleDeleteRole(role.user_role_id)} 
                  classNameCustom={!canDeleteWorker ? 'action-denied' : ''}
                />
              </div>
            ))}
          </div>
        </MyPanelLateralConfig>
      )}
    </>
  );
}

const UserForm = ({ formData, handleFormChange, mode, availableRoles = [], emailError = '', roleError = '' }) => {
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
          {emailError && <p className="error-message" style={{ marginTop: '5px', marginBottom: '10px', color: 'red', fontSize: '14px' }}>{emailError}</p>}
        </>
      )}

      {mode === "addRole" && (
        <>
          <label htmlFor="role_id">Selecciona un rol:</label>
          {availableRoles.length > 0 ? (
            <>
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
              {roleError && <p className="error-message" style={{ marginTop: '5px', marginBottom: '10px', color: 'red', fontSize: '14px' }}>{roleError}</p>}
            </>
          ) : (
            <p style={{ marginTop: '8px' }}>No hay roles disponibles para asignar.</p>
          )}
        </>
      )}
    </div>
  );
};
