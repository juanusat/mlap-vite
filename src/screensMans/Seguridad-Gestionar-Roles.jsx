import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import ToggleSwitch from '../components2/Toggle';
import Modal from '../components2/Modal';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css'; 

// --------------------- ESTRUCTURA DE PERMISOS GRANULAR ---------------------
// (La estructura PERMISSIONS_STRUCTURE es la misma que ya tienes)
const PERMISSIONS_STRUCTURE = {
    'ACTOS_LITURGICOS': { 
        name: 'Actos Litúrgicos', 
        submodules: {
            'ACTOS': {
                name: 'Gestionar actos litúrgicos',
                permissions: [
                    { id: 'C_ACTOS_LITURGICOS', name: 'Crear acto litúrgicos' },
                    { id: 'U_ESTADO_ACTOS_LITURGICOS', name: 'Actualizar estado acto litúrgicos' },
                    { id: 'R_ACTOS_LITURGICOS', name: 'Leer acto litúrgicos' },
                    { id: 'U_ACTOS_LITURGICOS', name: 'Actualizar acto litúrgicos' },
                    { id: 'D_ACTOS_LITURGICOS', name: 'Eliminar acto litúrgicos' },
                ]
            },
            'REQUISITOS': {
                name: 'Gestionar requisitos',
                permissions: [
                    { id: 'C_REQUISITOS', name: 'Crear requisitos' },
                    { id: 'U_ESTADO_REQUISITOS', name: 'Actualizar estado requisitos' },
                    { id: 'R_REQUISITOS', name: 'Leer requisitos' },
                    { id: 'U_REQUISITOS', name: 'Actualizar requisitos' },
                    { id: 'D_REQUISITOS', name: 'Eliminar requisitos' },
                ]
            },
            'HORARIOS': {
                name: 'Gestionar horarios',
                permissions: [
                    { id: 'C_HORARIO', name: 'Crear horario' },
                    { id: 'U_HORARIO', name: 'Actualizar horario' },
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
                    { id: 'R_RESERVAS_ACTOS', name: 'Leer reservas' },
                    { id: 'U_RESERVAS_ACTOS', name: 'Actualizar reservas' },
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
                    { id: 'D_RESERVA_PENDIENTE', name: 'Eliminar reserva' },
                ]
            },
            'HISTORIAL': {
                name: 'Historial de reservas',
                permissions: [
                    { id: 'R_RESERVA_HISTORIAL', name: 'Leer reserva' },
                ]
            },
            'RESERVAR': {
                name: 'Reservar evento',
                permissions: [
                    { id: 'C_RESERVA_EVENTO', name: 'Crear reserva' },
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
                    { id: 'C_ASOC_USUARIO', name: 'Crear asociacion usuario' },
                    { id: 'U_ESTADO_ASOC_USUARIO', name: 'Actualizar estado asociacion usuario' },
                    { id: 'R_ASOC_USUARIO', name: 'Leer asociacion usuario' },
                    { id: 'C_ROL_ASOC_USUARIO', name: 'Crear rol - asosiacion usuario' },
                    { id: 'D_ASOC_USUARIO', name: 'Eliminar asosiacion usuario' },
                ]
            },
            'ROLES': {
                name: 'Gestionar roles',
                permissions: [
                    { id: 'C_ROL', name: 'Crear rol' },
                    { id: 'U_ESTADO_ROL', name: 'Actualizar estado rol' },
                    { id: 'R_ROL', name: 'Leer rol' },
                    { id: 'U_ROL_PERMISOS', name: 'Actualizar rol - permisos' },
                    { id: 'U_ROL_DATA', name: 'Actualizar rol' },
                    { id: 'D_ROL', name: 'Eliminar rol' },
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
                    { id: 'R_INFO_PARROQUIA', name: 'Leer información de la parroquia' },
                    { id: 'U_INFO_PARROQUIA', name: 'Actualizar información de la parroquia' },
                    { id: 'R_DATOS_CUENTA', name: 'Leer Datos de la cuenta' },
                    { id: 'U_DATOS_CUENTA', name: 'Actualizar Datos de la cuenta' },
                ]
            },
            'CAPILLA': {
                name: 'Gestionar capilla',
                permissions: [
                    { id: 'C_CAPILLA', name: 'Crear capilla' },
                    { id: 'U_ESTADO_CAPILLA', name: 'Actualizar estado capilla' },
                    { id: 'R_CAPILLA', name: 'Leer capilla' },
                    { id: 'U_CAPILLA', name: 'Actualizar capilla' },
                    { id: 'D_CAPILLA', name: 'Eliminar capilla' },
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
    
    const generateMockPermissions = () => {
        return getAllPermissionIds();
    };

    const generateMockData = (count) => {
        const data = [];
        for (let i = 1; i <= count; i++) {
            const initialPermissions = generateMockPermissions();
            if (i === 1) {
                Object.keys(initialPermissions).forEach(key => initialPermissions[key] = true);
            }
            
            data.push({
                ID: i,
                Rol: `Rol de Ejemplo ${i}`,
                Descripcion: `Descripción del rol de ejemplo número ${i}.`,
                Estado: i % 2 === 0,
                Permissions: initialPermissions,
            });
        }
        return data;
    };

    // --------------------- ESTADOS ---------------------
    const [searchTerm, setSearchTerm] = useState('');
    const [roles, setRoles] = useState(generateMockData(20));

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentRol, setCurrentRol] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    
    const [permissionsForm, setPermissionsForm] = useState(generateMockPermissions());
    
    // NUEVO ESTADO: Rastrea qué módulos están colapsados. Inicialmente todos abiertos (false)
    const [collapsedModules, setCollapsedModules] = useState({});

    // --------------------- LÓGICA DE COLAPSO ---------------------
    const toggleModule = (moduleId) => {
        setCollapsedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // --------------------- LÓGICA DE PERMISOS ---------------------

    const loadPermissions = (rol) => {
        if (!rol) {
            setPermissionsForm(generateMockPermissions());
            return;
        }
        setPermissionsForm({ ...generateMockPermissions(), ...rol.Permissions });
        
        // Inicializa el estado de colapso: todos abiertos por defecto
        const initialCollapseState = Object.keys(PERMISSIONS_STRUCTURE).reduce((acc, moduleId) => {
            acc[moduleId] = false;
            return acc;
        }, {});
        setCollapsedModules(initialCollapseState);
    };

    const handleSavePermissions = () => {
        if (!currentRol) {
            handleCloseModal();
            return;
        }

        setRoles(prevRoles => prevRoles.map(rol => {
            if (rol.ID === currentRol.ID) {
                return {
                    ...rol,
                    Permissions: permissionsForm
                };
            }
            return rol;
        }));

        handleCloseModal();
    };


    // --------------------- HANDLERS FORM ---------------------
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
             setPermissionsForm(generateMockPermissions()); 
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRol(null);
        setModalType(null);
        setFormData({ nombre: '', descripcion: '' });
        setPermissionsForm(generateMockPermissions());
        setCollapsedModules({}); // Resetear el estado de colapso al cerrar
    };

    // --------------------- CRUD (Rol) ---------------------
    const handleSave = () => {
        // ... (código handleSave sin cambios) ...
        if (modalType === 'add') {
            const newRol = {
                ID: roles.length > 0 ? Math.max(...roles.map(r => r.ID)) + 1 : 1,
                Rol: formData.nombre,
                Descripcion: formData.descripcion,
                Estado: true,
                Permissions: generateMockPermissions(),
            };
            setRoles(prev => [...prev, newRol]);
        } else if (modalType === 'edit' && currentRol) {
            setRoles(prev =>
                prev.map(r =>
                    r.ID === currentRol.ID
                        ? { ...r, Rol: formData.nombre, Descripcion: formData.descripcion }
                        : r
                )
            );
        }
        handleCloseModal();
    };

    const confirmDelete = () => {
        // ... (código confirmDelete sin cambios) ...
        if (currentRol) {
            setRoles(prev => prev.filter(r => r.ID !== currentRol.ID));
            handleCloseModal();
        }
    };

    // --------------------- FILTRO ---------------------
    const filteredRoles = roles.filter(rol =>
        Object.values(rol).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
                        <div className='Inputs-add'>
                            <label className="inputModal" disabled>
                                ¿Deseas eliminar el rol con ID {currentRol.ID}?
                            </label>
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
                    onToggle={() =>
                        setRoles(prev =>
                            prev.map(r =>
                                r.ID === row.ID ? { ...r, Estado: !r.Estado } : r
                            )
                        )
                    }
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

    // --------------------- RENDER ---------------------
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

                <DynamicTable
                    columns={columns}
                    data={filteredRoles}
                    gridColumnsLayout="90px 380px 1fr 140px 220px"
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