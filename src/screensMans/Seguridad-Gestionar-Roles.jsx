import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import ToggleSwitch from '../components2/Toggle';
import Modal from '../components2/Modal';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css';

const MODULE_STRUCTURE = {
    'liturgicalActs': { 
        name: 'Actos Litúrgicos', 
        submodules: [
            { id: 'acts', name: 'Gestionar actos litúrgicos' },
            { id: 'requirements', name: 'Gestionar requisitos' },
            { id: 'schedules', name: 'Gestionar horarios' },
            { id: 'reservations', name: 'Gestionar Reservas' },
        ]
    },
    'reservations': { 
        name: 'Reservas',
        submodules: [
            { id: 'pending', name: 'Reservas pendientes' },
            { id: 'history', name: 'Historial de reservas' },
            { id: 'bookevent', name: 'Reservar evento' },
        ]
    },
    'security': {
        name: 'Seguridad',
        submodules: [
            { id: 'accounts', name: 'Gestionar cuentas' },
            { id: 'roles', name: 'Gestionar roles' },
        ]
    },
    'parishes': {
        name: 'Parroquia',
        submodules: [
            { id: 'account', name: 'Gestionar cuenta' },
            { id: 'chapel', name: 'Gestionar capilla' },
        ]
    }
};

const PERMISSION_ACTIONS = [
    { key: 'add', label: 'Crear' },
    { key: 'view', label: 'Ver' },
    { key: 'edit', label: 'Editar' },
    { key: 'delete', label: 'Eliminar' }
];

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
    const modulesList = Object.keys(MODULE_STRUCTURE).map(key => ({ 
        id: key, 
        name: MODULE_STRUCTURE[key].name 
    }));

    const generateMockPermissions = () => {
        const permissions = {};
        Object.keys(MODULE_STRUCTURE).forEach(moduleId => {
            MODULE_STRUCTURE[moduleId].submodules.forEach(submodule => {
                permissions[`${moduleId}_${submodule.id}`] = { view: false, add: false, edit: false, delete: false };
            });
        });
        return permissions;
    };

    const generateMockData = (count) => {
        const data = [];
        for (let i = 1; i <= count; i++) {
            data.push({
                ID: i,
                Rol: `Rol de Ejemplo ${i}`,
                Descripcion: `Descripción del rol de ejemplo número ${i}.`,
                Estado: i % 2 === 0,
                Permissions: generateMockPermissions(),
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

    const [selectedModule, setSelectedModule] = useState('');
    const [selectedSubmodule, setSelectedSubmodule] = useState('');
    
    const [permissionsForm, setPermissionsForm] = useState({
        add: false,
        view: false,
        edit: false,
        delete: false,
    });


    // --------------------- HANDLERS FORM ---------------------
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setPermissionsForm(prev => ({ ...prev, [name]: checked }));
        }
        else if (name === 'selectedModule') {
            setSelectedModule(value);
            setSelectedSubmodule('');
            setPermissionsForm({ add: false, view: false, edit: false, delete: false });
        } else if (name === 'selectedSubmodule') {
            setSelectedSubmodule(value);
            setPermissionsForm({ add: false, view: false, edit: false, delete: false });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
            setSelectedModule('');
            setSelectedSubmodule('');
            setPermissionsForm({ add: false, view: false, edit: false, delete: false });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRol(null);
        setModalType(null);
        setFormData({ nombre: '', descripcion: '' });
        setSelectedModule(''); 
        setSelectedSubmodule('');
        setPermissionsForm({ add: false, view: false, edit: false, delete: false });
    };

    // --------------------- CRUD ---------------------
    const handleSave = () => {
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
        const submodules = selectedModule
            ? MODULE_STRUCTURE[selectedModule].submodules
            : [];
            
        const isPermissionsEnabled = selectedSubmodule !== '';

        return (
            <div className='Inputs-add'>
                <label htmlFor="selectedModule">Seleccione un módulo:</label>
                <select
                    id="selectedModule"
                    name="selectedModule"
                    className="inputModal"
                    value={selectedModule}
                    onChange={handleFormChange}
                    required
                >
                    <option value="">-- Seleccionar Módulo --</option>
                    {modulesList.map(module => (
                        <option key={module.id} value={module.id}>{module.name}</option>
                    ))}
                </select>

                <label htmlFor="selectedSubmodule">Seleccione un sub-módulo:</label>
                <select
                    id="selectedSubmodule"
                    name="selectedSubmodule"
                    className="inputModal"
                    value={selectedSubmodule}
                    onChange={handleFormChange}
                    disabled={!selectedModule}
                    required
                >
                    <option value="">-- Seleccionar Sub-módulo --</option>
                    {submodules.map(submodule => (
                        <option key={submodule.id} value={submodule.id}>{submodule.name}</option>
                    ))}
                </select>
                
                <div className="permissions-checkboxes">
                    {PERMISSION_ACTIONS.map(action => (
                        <div key={action.key} className="checkbox-container">
                            <input
                                type="checkbox"
                                id={action.key}
                                name={action.key}
                                checked={permissionsForm[action.key]}
                                onChange={handleFormChange}
                                disabled={!isPermissionsEnabled}
                            />
                            <label htmlFor={action.key}>{action.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };


    // --------------------- MODAL LOGIC ---------------------
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
                    onAccept: handleCloseModal,
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