import React, { useState, useEffect } from 'react';
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import ToggleSwitch from '../components/Toggle';
import Modal from '../components/Modal';
import NoPermissionMessage from '../components/NoPermissionMessage';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import * as roleService from '../services/roleService';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css';
import '../utils/permissions.css'; 

const PERMISSIONS_STRUCTURE = {
    'ACTOS_LITURGICOS': { 
        name: 'Actos Litúrgicos', 
        submodules: {
            'ACTOS': {
                name: 'Gestionar actos litúrgicos',
                permissions: [
                    { id: 'ACTOS_LITURGICOS_ACTOS_C', name: 'Crear acto litúrgicos' },
                    { id: 'ESTADO_ACTOS_LITURGICOS_U', name: 'Actualizar estado acto litúrgicos' },
                    { id: 'ACTOS_LITURGICOS_ACTOS_R', name: 'Leer acto litúrgicos' },
                    { id: 'ACTOS_LITURGICOS_ACTOS_U', name: 'Actualizar acto litúrgicos' },
                    { id: 'ACTOS_LITURGICOS_ACTOS_D', name: 'Eliminar acto litúrgicos' },
                ]
            },
            'REQUISITOS': {
                name: 'Gestionar requisitos',
                permissions: [
                    { id: 'ACTOS_LITURGICOS_REQ_C', name: 'Crear requisitos' },
                    { id: 'ESTADO_REQ_ACTOS_LIT_U', name: 'Actualizar estado requisitos' },
                    { id: 'ACTOS_LITURGICOS_REQ_R', name: 'Leer requisitos' },
                    { id: 'ACTOS_LITURGICOS_REQ_U', name: 'Actualizar requisitos' },
                    { id: 'ACTOS_LITURGICOS_REQ_D', name: 'Eliminar requisitos' },
                ]
            },
            'HORARIOS': {
                name: 'Gestionar horarios',
                permissions: [
                    { id: 'ACTOS_LITURGICOS_HORA_R', name: 'Leer horarios' },
                    { id: 'ACTOS_LITURGICOS_HORA_C', name: 'Crear horario' },
                    { id: 'ACTOS_LITURGICOS_HORA_U', name: 'Actualizar horario' },
                    { id: 'EXCEP_DISP_R', name: 'Leer excepciones - Disponibilidad' },
                    { id: 'EXCEP_DISP_C', name: 'Crear Excepción - Disponibilidad' },
                    { id: 'EXCEP_DISP_U', name: 'Actualizar Excepción - Disponibilidad' },
                    { id: 'EXCEP_DISP_D', name: 'Eliminar Excepción - Disponibilidad' },
                    { id: 'EXCEP_NO_DISP_R', name: 'Leer excepciones - NO Disponibilidad' },
                    { id: 'EXCEP_NO_DISP_C', name: 'Crear Excepción NO - Disponibilidad' },
                    { id: 'EXCEP_NO_DISP_U', name: 'Actualizar Excepción NO - Disponibilidad' },
                    { id: 'EXCEP_NO_DISP_D', name: 'Eliminar Excepción NO - Disponibilidad' },
                ]
            },
            'RESERVAS': {
                name: 'Gestionar Reservas',
                permissions: [
                    { id: 'ACTOS_LITURGICOS_RESER_R', name: 'Leer reservas' },
                    { id: 'ACTOS_LITURGICOS_RESER_U', name: 'Actualizar reservas' },
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
                    { id: 'SEGURIDAD_ASOC_USER_C', name: 'Crear asociacion usuario' },
                    { id: 'ESTADO_ASOC_USER_U', name: 'Actualizar estado asociacion usuario' },
                    { id: 'SEGURIDAD_ASOC_USER_R', name: 'Leer asociacion usuario' },
                    { id: 'ROL_ASOC_USER_C', name: 'Crear rol - asosiacion usuario' },
                    { id: 'SEGURIDAD_ASOC_USER_D', name: 'Eliminar asosiacion usuario' },
                ]
            },
            'ROLES': {
                name: 'Gestionar roles',
                permissions: [
                    { id: 'SEGURIDAD_ROL_C', name: 'Crear rol' },
                    { id: 'ESTADO_ROL_U', name: 'Actualizar estado rol' },
                    { id: 'SEGURIDAD_ROL_R', name: 'Leer rol' },
                    { id: 'SEGURIDAD_ROL_PERMS_U', name: 'Actualizar rol - permisos' },
                    { id: 'SEGURIDAD_ROL_DATA_U', name: 'Actualizar rol' },
                    { id: 'SEGURIDAD_ROL_D', name: 'Eliminar rol' },
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
                    { id: 'PARROQUIA_INFO_R', name: 'Leer información de la parroquia' },
                    { id: 'PARROQUIA_INFO_U', name: 'Actualizar información de la parroquia' },
                    { id: 'PARROQUIA_DATOS_CUENTA_R', name: 'Leer Datos de la cuenta' },
                    { id: 'PARROQUIA_DATOS_CUENTA_U', name: 'Actualizar Datos de la cuenta' },
                ]
            },
            'CAPILLA': {
                name: 'Gestionar capilla',
                permissions: [
                    { id: 'PARROQUIA_CAPILLA_C', name: 'Crear capilla' },
                    { id: 'ESTADO_CAPILLA_U', name: 'Actualizar estado capilla' },
                    { id: 'PARROQUIA_CAPILLA_R', name: 'Leer capilla' },
                    { id: 'PARROQUIA_CAPILLA_U', name: 'Actualizar capilla' },
                    { id: 'PARROQUIA_CAPILLA_D', name: 'Eliminar capilla' },
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
    const { hasPermission, isParishAdmin } = usePermissions();
    
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

    const canReadRoles = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_R);
    const canCreateRole = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_C);
    const canUpdateRole = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_DATA_U);
    const canUpdateStatus = isParishAdmin || hasPermission(PERMISSIONS.ESTADO_ROL_U);
    const canUpdatePermissions = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_PERMS_U);
    const canDeleteRole = isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_D);

    useEffect(() => {
        document.title = "MLAP | Gestionar roles";
    }, []);

    useEffect(() => {
        if (sessionData?.parish?.id && canReadRoles) {
            loadRoles();
        }
    }, [sessionData, currentPage, canReadRoles]);

    useEffect(() => {
        if (!sessionData?.parish?.id || !canReadRoles) return;
        
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                setCurrentPage(1);
            }
            loadRoles();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, canReadRoles]);

    // Si no tiene permiso, mostrar mensaje
    if (!canReadRoles) {
        return (
            <div className="content-module only-this">
                <h2 className='title-screen'>Gestión de roles</h2>
                <NoPermissionMessage message="No tienes permisos para listar roles. Contacta con el administrador de tu parroquia para obtener acceso." />
            </div>
        );
    }

    const loadRoles = async () => {
        if (!sessionData?.parish?.id || !canReadRoles) return;
        
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
            console.log('=== CARGA DE PERMISOS DESDE BD ===');
            console.log('Solicitando permisos para Rol ID:', rol.ID);
            
            const permissions = await roleService.getRolePermissions(sessionData.parish.id, rol.ID);
            
            console.log('✅ Permisos recibidos del backend (BD):', permissions.length);
            console.log('✅ Permisos activos (granted=true) en BD:', permissions.filter(p => p.granted).length);
            
            // Mostrar detalle de permisos activos
            const activePerms = permissions.filter(p => p.granted);
            if (activePerms.length > 0) {
                console.log('📋 Detalle de permisos activos en BD:');
                activePerms.forEach(perm => {
                    console.log(`   - ${perm.code}: ${perm.name}`);
                });
            } else {
                console.log('⚠️ No hay permisos activos en BD para este rol');
            }
            
            setAvailablePermissions(permissions);
            
            const permissionsMap = {};
            permissions.forEach(perm => {
                permissionsMap[perm.code] = perm.granted;
            });
            
            console.log('Mapa de permisos creado:', Object.keys(permissionsMap).length, 'permisos');
            
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
            
            console.log('=== GUARDADO DE PERMISOS ===');
            console.log('Estado del formulario completo:', permissionsForm);
            console.log('Permisos disponibles:', availablePermissions.length);
            
            // Crear array de permisos usando TODOS los permisos disponibles
            // y tomando el valor de granted desde permissionsForm (si existe) o false por defecto
            const permissions = availablePermissions.map(perm => ({
                permission_id: perm.permission_id,
                granted: permissionsForm[perm.code] || false
            }));

            console.log('Permisos a guardar (total):', permissions.length);
            console.log('Permisos a guardar con granted=true:', permissions.filter(p => p.granted).length);
            console.log('Primeros 10 permisos a guardar:', permissions.slice(0, 10));

            const result = await roleService.updateRolePermissions(sessionData.parish.id, currentRol.ID, permissions);
            console.log('Resultado del guardado:', result);
            
            alert('Permisos guardados exitosamente');
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
        if (action === 'add' && !canCreateRole) return;
        if (action === 'edit' && !canUpdateRole) return;
        if (action === 'delete' && !canDeleteRole) return;
        if (action === 'permissions' && !canUpdatePermissions) return;
        
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

        if (!formData.nombre || !formData.nombre.trim()) {
            alert('El nombre del rol es obligatorio');
            return;
        }

        if (!formData.descripcion || !formData.descripcion.trim()) {
            alert('La descripción del rol es obligatoria');
            return;
        }

        try {
            setLoading(true);
            if (modalType === 'add') {
                await roleService.createRole(sessionData.parish.id, formData.nombre.trim(), formData.descripcion.trim());
            } else if (modalType === 'edit' && currentRol) {
                await roleService.updateRole(sessionData.parish.id, currentRol.ID, formData.nombre.trim(), formData.descripcion.trim());
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
        if (!sessionData?.parish?.id || !canUpdateStatus) return;

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
                    disabled={!canUpdateStatus}
                />
            )
        },
        {
            key: 'Acciones',
            header: 'Acciones',
            accessor: rol => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" onClick={() => handleOpenModal(rol, 'view')} />
                    <MyButtonShortAction 
                        type="key" 
                        onClick={() => handleOpenModal(rol, 'permissions')} 
                        classNameCustom={!canUpdatePermissions ? 'action-denied' : ''}
                    />
                    <MyButtonShortAction 
                        type="edit" 
                        onClick={() => handleOpenModal(rol, 'edit')} 
                        classNameCustom={!canUpdateRole ? 'action-denied' : ''}
                    />
                    <MyButtonShortAction 
                        type="delete" 
                        onClick={() => handleOpenModal(rol, 'delete')} 
                        classNameCustom={!canDeleteRole ? 'action-denied' : ''}
                    />
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
                        <MyButtonShortAction 
                            type="add" 
                            title="Añadir" 
                            onClick={() => handleOpenModal(null, 'add')} 
                            classNameCustom={!canCreateRole ? 'action-denied' : ''}
                        />
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