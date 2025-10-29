import React, { useState, useEffect } from 'react';
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import ToggleSwitch from '../components/Toggle';
import Modal from '../components/Modal';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import * as roleService from '../services/roleService';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css'; 

const PERMISSIONS_STRUCTURE = {
    'ACTOS_LITURGICOS': { 
        name: 'Actos Litúrgicos', 
        submodules: {
            'ACTOS': {
                name: 'Gestionar actos litúrgicos',
                permissions: [
                    { id: 'C_ACTOS_LITURGICOS_ACTOS', name: 'Crear acto litúrgicos' },
                    { id: 'U_ESTADO_ACTOS_LITURGICOS', name: 'Actualizar estado acto litúrgicos' },
                    { id: 'R_ACTOS_LITURGICOS_ACTOS', name: 'Leer acto litúrgicos' },
                    { id: 'U_ACTOS_LITURGICOS_ACTOS', name: 'Actualizar acto litúrgicos' },
                    { id: 'D_ACTOS_LITURGICOS_ACTOS', name: 'Eliminar acto litúrgicos' },
                ]
            },
            'REQUISITOS': {
                name: 'Gestionar requisitos',
                permissions: [
                    { id: 'C_ACTOS_LITURGICOS_REQ', name: 'Crear requisitos' },
                    { id: 'U_ESTADO_REQ_ACTOS_LIT', name: 'Actualizar estado requisitos' },
                    { id: 'R_ACTOS_LITURGICOS_REQ', name: 'Leer requisitos' },
                    { id: 'U_ACTOS_LITURGICOS_REQ', name: 'Actualizar requisitos' },
                    { id: 'D_ACTOS_LITURGICOS_REQ', name: 'Eliminar requisitos' },
                ]
            },
            'HORARIOS': {
                name: 'Gestionar horarios',
                permissions: [
                    { id: 'C_ACTOS_LITURGICOS_HORA', name: 'Crear horario' },
                    { id: 'U_ACTOS_LITURGICOS_HORA', name: 'Actualizar horario' },
                    { id: 'C_EXCEP_DISP', name: 'Crear Excepción - Disponibilidad' },
                    { id: 'U_EXCEP_DISP', name: 'Actualizar Excepción - Disponibilidad' },
                    { id: 'D_EXCEP_DISP', name: 'Eliminar Excepción - Disponibilidad' },
                    { id: 'C_EXCEP_NO_DISP', name: 'Crear Excepción NO - Disponibilidad' },
                    { id: 'U_EXCEP_NO_DISP', name: 'Actualizar Excepción NO - Disponibilidad' },
                    { id: 'D_EXCEP_NO_DISP', name: 'Eliminar Excepción NO - Disponibilidad' },
                ]
            },
            'RESERVAS': {
                name: 'Gestionar Reservas',
                permissions: [
                    { id: 'R_ACTOS_LITURGICOS_RESER', name: 'Leer reservas' },
                    { id: 'U_ACTOS_LITURGICOS_RESER', name: 'Actualizar reservas' },
                ]
            },
        }
    },
    'RESERVAS': { 
        name: 'Reservas',
        submodules: {
            'PENDIENTES': {
                name: 'Reservas pendientes',
                permissions: [
                    { id: 'D_RESERVAS_PEND', name: 'Eliminar reserva' },
                ]
            },
            'HISTORIAL': {
                name: 'Historial de reservas',
                permissions: [
                    { id: 'R_RESERVAS_HIST', name: 'Leer reserva' },
                ]
            },
            'RESERVAR': {
                name: 'Reservar evento',
                permissions: [
                    { id: 'C_RESERVAS_EVENTO', name: 'Crear reserva' },
                ]
            },
        }
    },
    'SEGURIDAD': {
        name: 'Seguridad',
        submodules: {
            'CUENTAS': {
                name: 'Gestionar cuentas',
                permissions: [
                    { id: 'C_SEGURIDAD_ASOC_USER', name: 'Crear asociacion usuario' },
                    { id: 'U_ESTADO_ASOC_USER', name: 'Actualizar estado asociacion usuario' },
                    { id: 'R_SEGURIDAD_ASOC_USER', name: 'Leer asociacion usuario' },
                    { id: 'C_ROL_ASOC_USER', name: 'Crear rol - asosiacion usuario' },
                    { id: 'D_SEGURIDAD_ASOC_USER', name: 'Eliminar asosiacion usuario' },
                ]
            },
            'ROLES': {
                name: 'Gestionar roles',
                permissions: [
                    { id: 'C_SEGURIDAD_ROL', name: 'Crear rol' },
                    { id: 'U_ESTADO_ROL', name: 'Actualizar estado rol' },
                    { id: 'R_SEGURIDAD_ROL', name: 'Leer rol' },
                    { id: 'U_SEGURIDAD_ROL_PERMS', name: 'Actualizar rol - permisos' },
                    { id: 'U_SEGURIDAD_ROL_DATA', name: 'Actualizar rol' },
                    { id: 'D_SEGURIDAD_ROL', name: 'Eliminar rol' },
                ]
            },
        }
    },
    'PARROQUIA': {
        name: 'Parroquia',
        submodules: {
            'CUENTA': {
                name: 'Gestionar cuenta',
                permissions: [
                    { id: 'R_PARROQUIA_INFO', name: 'Leer información de la parroquia' },
                    { id: 'U_PARROQUIA_INFO', name: 'Actualizar información de la parroquia' },
                    { id: 'R_PARROQUIA_DATOS_CUENTA', name: 'Leer Datos de la cuenta' },
                    { id: 'U_PARROQUIA_DATOS_CUENTA', name: 'Actualizar Datos de la cuenta' },
                ]
            },
            'CAPILLA': {
                name: 'Gestionar capilla',
                permissions: [
                    { id: 'C_PARROQUIA_CAPILLA', name: 'Crear capilla' },
                    { id: 'U_ESTADO_CAPILLA', name: 'Actualizar estado capilla' },
                    { id: 'R_PARROQUIA_CAPILLA', name: 'Leer capilla' },
                    { id: 'U_PARROQUIA_CAPILLA', name: 'Actualizar capilla' },
                    { id: 'D_PARROQUIA_CAPILLA', name: 'Eliminar capilla' },
                ]
            },
        }
    }
};

const getAllPermissionIds = () => {
    const ids = {};
    Object.values(PERMISSIONS_STRUCTURE).forEach(module => {
        Object.values(module.submodules).forEach(submodule => {
            submodule.permissions.forEach(p => {
                ids[p.id] = false;
            });
        });
    });
    return ids;
};

// --------------------- FORMULARIO ---------------------
const RoleForm = ({ formData, handleFormChange, isViewMode }) => {
    return (
        <div>
            <div className="Inputs-add">
                <label htmlFor="nombre">Nombre de Rol:</label>
                <input
                    type="text"
                    className="inputModal"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    disabled={isViewMode}
                    required
                />
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    className="inputModal"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    disabled={isViewMode}
                    required
                />
            </div>
        </div>
    );
};

// --------------------- PRINCIPAL ---------------------
export default function RolesGestionar() {
    const logout = useLogout();
    const { sessionData } = useSession(logout);
    
    useEffect(() => {
        document.title = "MLAP | Gestionar roles";
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentRol, setCurrentRol] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    
    const [permissionsForm, setPermissionsForm] = useState({});
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [collapsedModules, setCollapsedModules] = useState({});

    useEffect(() => {
        if (sessionData?.parish?.id) {
            loadRoles();
        }
    }, [sessionData, currentPage]);

    const loadRoles = async () => {
        if (!sessionData?.parish?.id) return;
        
        try {
            setLoading(true);
            let data;
            if (searchTerm) {
                data = await roleService.searchRoles(sessionData.parish.id, currentPage, 10, searchTerm);
            } else {
                data = await roleService.listRoles(sessionData.parish.id, currentPage, 10);
            }
            
            setRoles(data.roles.map(role => ({
                ID: role.role_id,
                Rol: role.name,
                Descripcion: role.description,
                Estado: role.active
            })));
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!sessionData?.parish?.id) return;
        
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                setCurrentPage(1);
            }
            loadRoles();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const toggleModule = (moduleId) => {
        setCollapsedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const loadPermissions = async (rol) => {
        if (!rol || !sessionData?.parish?.id) {
            setPermissionsForm({});
            setAvailablePermissions([]);
            return;
        }

        try {
            setLoading(true);
            const permissions = await roleService.getRolePermissions(sessionData.parish.id, rol.ID);
            
            console.log('Permisos recibidos del backend:', permissions);
            
            setAvailablePermissions(permissions);
            
            const permissionsMap = {};
            permissions.forEach(perm => {
                permissionsMap[perm.code] = perm.granted;
            });
            
            console.log('Mapa de permisos:', permissionsMap);
            
            setPermissionsForm(permissionsMap);
            
            const initialCollapseState = Object.keys(PERMISSIONS_STRUCTURE).reduce((acc, moduleId) => {
                acc[moduleId] = false;
                return acc;
            }, {});
            setCollapsedModules(initialCollapseState);
        } catch (error) {
            console.error('Error al cargar permisos:', error);
            alert('Error al cargar permisos: ' + error.message);
            setPermissionsForm({});
            setAvailablePermissions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePermissions = async () => {
        if (!currentRol || !sessionData?.parish?.id) {
            handleCloseModal();
            return;
        }

        try {
            setLoading(true);
            
            const permissions = availablePermissions.map(perm => ({
                permission_id: perm.permission_id,
                granted: permissionsForm[perm.code] || false
            }));

            console.log('Permisos a guardar:', permissions);
            console.log('Estado del formulario:', permissionsForm);

            const result = await roleService.updateRolePermissions(sessionData.parish.id, currentRol.ID, permissions);
            console.log('Resultado del guardado:', result);
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar permisos:', error);
            alert('Error al guardar permisos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setPermissionsForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: e.target.value }));
        }
    };

    const handleOpenModal = (rol, action) => {
        setCurrentRol(rol);
        setModalType(action);

        if (rol) {
            setFormData({
                nombre: rol.Rol,
                descripcion: rol.Descripcion
            });
        } else {
            setFormData({ nombre: '', descripcion: '' });
        }

        if (action === 'permissions') {
            loadPermissions(rol);
        } else {
            setPermissionsForm({});
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRol(null);
        setModalType(null);
        setFormData({ nombre: '', descripcion: '' });
        setPermissionsForm({});
        setCollapsedModules({});
    };

    // --------------------- CRUD (Rol) ---------------------
    const handleSave = async () => {
        if (!sessionData?.parish?.id) return;

        try {
            setLoading(true);
            if (modalType === 'add') {
                await roleService.createRole(sessionData.parish.id, formData.nombre, formData.descripcion);
            } else if (modalType === 'edit' && currentRol) {
                await roleService.updateRole(sessionData.parish.id, currentRol.ID, formData.nombre, formData.descripcion);
            }
            handleCloseModal();
            await loadRoles();
        } catch (error) {
            console.error('Error al guardar rol:', error);
            alert('Error al guardar rol: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!currentRol || !sessionData?.parish?.id) return;

        try {
            setLoading(true);
            await roleService.deleteRole(sessionData.parish.id, currentRol.ID);
            handleCloseModal();
            await loadRoles();
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            alert('Error al eliminar rol: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (rolId, currentStatus) => {
        if (!sessionData?.parish?.id) return;

        try {
            setLoading(true);
            await roleService.updateRoleStatus(sessionData.parish.id, rolId, !currentStatus);
            await loadRoles();
        } catch (error) {
            console.error('Error al cambiar estado del rol:', error);
            alert('Error al cambiar estado: ' + error.message);
        } finally {
            setLoading(false);
        }
    };



    // --------------------- MODAL: CONTENIDO DE PERMISOS ---------------------
    const getPermissionsModalContent = () => {
        return (
            <div className='permissions-container-full'>
                {Object.keys(PERMISSIONS_STRUCTURE).map(moduleId => {
                    const module = PERMISSIONS_STRUCTURE[moduleId];
                    const isCollapsed = collapsedModules[moduleId];
                    
                    return (
                        <div key={moduleId} className="permission-module-group">
                            
                            {/* Título del Módulo con botón de colapso */}
                            <h3 
                                className="module-title collapsible-header" 
                                onClick={() => toggleModule(moduleId)}
                            >
                                <span className={`collapse-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                                    {isCollapsed ? '▶' : '▼'} 
                                </span>
                                {module.name}
                            </h3>
                            
                            {/* Contenido que se colapsa */}
                            {!isCollapsed && (
                                <div className="module-content">
                                    {Object.keys(module.submodules).map(submoduleId => {
                                        const submodule = module.submodules[submoduleId];
                                        return (
                                            <div key={submoduleId} className="permission-submodule-group">
                                                {/* Título del Submódulo */}
                                                <h4 className="submodule-title">{submodule.name}</h4>
                                                
                                                <div className="permissions-checkboxes">
                                                    {/* Iteración por Permisos Individuales */}
                                                    {submodule.permissions.map(permission => (
                                                        <div key={permission.id} className="checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                id={permission.id}
                                                                name={permission.id}
                                                                checked={permissionsForm[permission.id] || false}
                                                                onChange={handleFormChange}
                                                            />
                                                            <label htmlFor={permission.id}>{permission.name}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // --------------------- MODAL LOGIC ---------------------
    // ... (El resto de getModalContentAndActions y el render principal quedan igual) ...

    const getModalContentAndActions = () => {
        switch (modalType) {
            case 'view':
                return {
                    title: 'Detalles del rol',
                    content: <RoleForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />,
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar rol',
                    content: <RoleForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir rol',
                    content: <RoleForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Eliminar rol',
                    content: currentRol && (
                        <div>
                            <h4>
                                ¿Deseas eliminar el rol con ID {currentRol.ID}?
                            </h4>
                        </div>
                    ),
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'permissions':
                return {
                    title: `Permisos del rol: ${currentRol ? currentRol.Rol : 'N/A'}`,
                    content: getPermissionsModalContent(),
                    onAccept: handleSavePermissions, 
                    onCancel: handleCloseModal
                };
            default:
                return { title: '', content: null, onAccept: null, onCancel: handleCloseModal };
        }
    };

    const modalProps = getModalContentAndActions();
    
    const columns = [
        { key: 'ID', header: 'ID', accessor: row => row.ID },
        { key: 'Rol', header: 'Rol', accessor: row => row.Rol },
        { key: 'Descripcion', header: 'Descripción', accessor: row => row.Descripcion },
        {
            key: 'Estado',
            header: 'Estado',
            accessor: row => (
                <ToggleSwitch
                    isEnabled={row.Estado}
                    onToggle={() => handleToggle(row.ID, row.Estado)}
                />
            )
        },
        {
            key: 'Acciones',
            header: 'Acciones',
            accessor: rol => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" onClick={() => handleOpenModal(rol, 'view')} />
                    <MyButtonShortAction type="key" onClick={() => handleOpenModal(rol, 'permissions')} />
                    <MyButtonShortAction type="edit" onClick={() => handleOpenModal(rol, 'edit')} />
                    <MyButtonShortAction type="delete" onClick={() => handleOpenModal(rol, 'delete')} />
                </MyGroupButtonsActions>
            )
        }
    ];

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de roles</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyGroupButtonsActions>
                        <MyButtonShortAction type="add" title="Añadir" onClick={() => handleOpenModal(null, 'add')} />
                    </MyGroupButtonsActions>
                </div>

                {loading ? (
                    <p>Cargando roles...</p>
                ) : (
                    <DynamicTable
                        columns={columns}
                        data={roles}
                        gridColumnsLayout="90px 380px 1fr 140px 220px"
                        columnLeftAlignIndex={[2, 3]}
                    />
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
    );
}