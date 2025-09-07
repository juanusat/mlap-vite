import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MatrixModal from "../components2/MatrixModal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import '../utils/Seguridad-Roles-Gestionar.css';

// Genera los datos iniciales para la tabla de roles
const initialRoles = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    roleName: `Rol ${i + 1}`,
    description: `Descripción del Rol ${i + 1}.`,
    isActive: (i + 1) % 2 === 0 ? true : false,
    modules: [
        { id: 1, name: 'Actos Litúrgicos', isActive: true, permissions: [{ name: 'Ver Actos Litúrgicos', isActive: true }] },
        { id: 2, name: 'Usuarios', isActive: true, permissions: [{ name: 'Editar Usuarios', isActive: true }] }
    ]
}));

const predefinedModules = [
    {
        id: 1,
        name: 'Actos Litúrgicos',
        permissions: [
            'Ver Actos Litúrgicos',
            'Añadir Actos Litúrgicos',
            'Editar Actos Litúrgicos',
            'Eliminar Actos Litúrgicos',
            'Buscar Actos Litúrgicos'
        ]
    },
    {
        id: 2,
        name: 'Usuarios',
        permissions: [
            'Ver Usuarios',
            'Añadir Usuarios',
            'Editar Usuarios',
            'Eliminar Usuarios',
            'Buscar Usuarios'
        ]
    },
    {
        id: 3,
        name: 'Parroquia',
        permissions: [
            'Ver Parroquia',
            'Añadir Parroquia',
            'Editar Parroquia',
            'Eliminar Parroquia',
            'Buscar Parroquia'
        ]
    },
    {
        id: 4,
        name: 'Seguridad',
        permissions: [
            'Ver Seguridad',
            'Añadir Seguridad',
            'Editar Seguridad',
            'Eliminar Seguridad',
            'Buscar Seguridad'
        ]
    },
    {
        id: 5,
        name: 'Reservas',
        permissions: [
            'Ver Reservas',
            'Añadir Reservas',
            'Editar Reservas',
            'Eliminar Reservas',
            'Buscar Reservas'
        ]
    },
    {
        id: 6,
        name: 'Tipos documentos',
        permissions: [
            'Ver Tipos documentos',
            'Añadir Tipos documentos',
            'Editar Tipos documentos',
            'Eliminar Tipos documentos',
            'Buscar Tipos documentos'
        ]
    }
];

const permissionTypes = ['Ver', 'Añadir', 'Editar', 'Eliminar', 'Buscar'];

export default function RolesGestionar() {
    // 1. Estados que controlan la lógica de la aplicación
    const [roles, setRoles] = useState(initialRoles);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const filteredRoles = roles.filter((role) =>
        Object.values(role).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedAndFilteredRoles = [...filteredRoles].sort((a, b) => {
        if (!sortKey) return 0;

        let aValue = a[sortKey];
        let bValue = b[sortKey];

        if (sortKey === 'id') {
            const result = aValue - bValue;
            return sortDirection === 'asc' ? result : -result;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ?
                aValue.localeCompare(bValue) :
                bValue.localeCompare(aValue);
        }

        return 0;
    });

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleToggle = (roleId) => {
        setRoles(prevRoles =>
            prevRoles.map(role =>
                role.id === roleId
                    ? { ...role, isActive: !role.isActive }
                    : role
            )
        );
    };

    // Función para ver los detalles del rol en el Modal genérico
    const handleViewDetails = (role) => {
        setCurrentRole(role);
        setModalType('view');
        setShowModal(true);
    };

    // Función para editar el rol en el Modal genérico
    const handleEdit = (role) => {
        setCurrentRole(role);
        setModalType('edit');
        setShowModal(true);
    };

    // Función para mostrar la confirmación de eliminación en el Modal genérico
    const handleDeleteConfirmation = (role) => {
        setCurrentRole(role);
        setModalType('delete');
        setShowModal(true);
    };

    // Función para añadir un nuevo rol en el Modal genérico
    const handleAddRole = () => {
        setCurrentRole(null);
        setModalType('add');
        setShowModal(true);
    };

    // Función que abre el MatrixModal para la gestión de permisos
    const handleOpenMatrixModal = (role) => {
        setCurrentRole(role);
        setShowMatrixModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRole(null);
        setModalType(null);
    };

    const handleCloseMatrixModal = () => {
        setShowMatrixModal(false);
        setCurrentRole(null);
    };

    const confirmDelete = () => {
        if (currentRole) {
            setRoles(prevRoles => prevRoles.filter(role => role.id !== currentRole.id));
            handleCloseModal();
        }
    };

    const handleSave = (roleData) => {
        if (modalType === 'add') {
            const newRole = {
                ...roleData,
                id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
                modules: []
            };
            setRoles(prevRoles => [...prevRoles, newRole]);
        } else if (modalType === 'edit' && currentRole) {
            setRoles(prevRoles =>
                prevRoles.map(role =>
                    role.id === currentRole.id ? { ...role, ...roleData } : role
                )
            );
        }
        handleCloseModal();
    };

    const handleTogglePermission = (roleId, moduleId, permissionName) => {
        setRoles(prevRoles =>
            prevRoles.map(role => {
                if (role.id !== roleId) return role;

                const updatedRole = { ...role };
                let moduleInRole = updatedRole.modules.find(m => m.id === moduleId);

                if (!moduleInRole) {
                    moduleInRole = {
                        id: moduleId,
                        name: predefinedModules.find(m => m.id === moduleId).name,
                        permissions: []
                    };
                    updatedRole.modules.push(moduleInRole);
                }

                const permIndex = moduleInRole.permissions.findIndex(p => p.name === permissionName);

                if (permIndex > -1) {
                    moduleInRole.permissions.splice(permIndex, 1);
                } else {
                    moduleInRole.permissions.push({ name: permissionName });
                }

                return updatedRole;
            })
        );
    };

    const roleColumns = [
        {
            key: 'id',
            header: 'ID',
            accessor: (row) => row.id,
            sortable: true,
            onSort: () => handleSort('id')
        },
        {
            key: 'roleName',
            header: 'Nombre',
            accessor: (row) => row.roleName,
            sortable: true,
            onSort: () => handleSort('roleName')
        },
        {
            key: 'description',
            header: 'Descripción',
            accessor: (row) => row.description,
            sortable: true,
            onSort: () => handleSort('description')
        },
        {
            key: 'isActive',
            header: 'Estado',
            accessor: (row) => (
                <ToggleSwitch
                    isEnabled={row.isActive}
                    onToggle={() => handleToggle(row.id)}
                />
            ),
        },
        {
            key: 'acciones', header: 'Acciones', accessor: (row) => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" title="Ver Detalles" onClick={() => handleViewDetails(row)} />
                    <MyButtonShortAction type="key" title="Gestionar Permisos" onClick={() => handleOpenMatrixModal(row)} />
                    <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Roles</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyButtonShortAction type="add" onClick={handleAddRole} title="Añadir" />
                </div>
                <DynamicTable columns={roleColumns} data={sortedAndFilteredRoles} />

            </div>
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={
                    modalType === 'edit' ? 'Editar Rol' :
                        modalType === 'delete' ? 'Confirmar Eliminación' :
                            modalType === 'view' ? 'Detalles del Rol' :
                                'Añadir Rol'
                }
            >
                {modalType === 'view' && currentRole && (
                    <div>
                        <h3>Detalles del Rol</h3>
                        <p><strong>ID:</strong> {currentRole.id}</p>
                        <p><strong>Nombre:</strong> {currentRole.roleName}</p>
                        <p><strong>Descripción:</strong> {currentRole.description}</p>
                        <p><strong>Estado:</strong> {currentRole.isActive ? 'Activo' : 'Inactivo'}</p>
                    </div>
                )}
                {modalType === 'edit' && currentRole && (
                    <EditRoleForm onSave={handleSave} onClose={handleCloseModal} role={currentRole} />
                )}
                {modalType === 'delete' && currentRole && (
                    <div>
                        <h4>¿Estás seguro que quieres eliminar este rol?</h4>
                        <p><strong>Rol:</strong> {currentRole.roleName}</p>
                        <div className="buttons-container">
                            <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={handleCloseModal} />
                            <MyButtonMediumIcon text="Eliminar" icon="MdAccept" onClick={confirmDelete} />
                        </div>
                    </div>
                )}
                {modalType === 'add' && (
                    <AddRoleForm onSave={handleSave} onClose={handleCloseModal} />
                )}
            </Modal>

            <MatrixModal
                isOpen={showMatrixModal}
                onClose={handleCloseMatrixModal}
                role={currentRole}
                predefinedModules={predefinedModules}
                onTogglePermission={handleTogglePermission}
            />
        </div>
    );
}

function AddRoleForm({ onSave, onClose }) {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ roleName, description, isActive: true });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario para Añadir</h3>
            <div className="Inputs-add">
                <label htmlFor="addRoleName">Nombre del rol</label>
                <input type="text" className="inputModal" id="addRoleName" value={roleName} onChange={e => setRoleName(e.target.value)} required />
                <label htmlFor="addDescription">Descripción</label>
                <textarea className="inputModal" id="addDescription" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
}

function EditRoleForm({ onSave, onClose, role }) {
    const [roleName, setRoleName] = useState(role.roleName);
    const [description, setDescription] = useState(role.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ roleName, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario de Edición</h3>
            <div className="Inputs-edit">
                <label htmlFor="editRoleName">Nuevo nombre del rol</label>
                <input type="text" className="inputModal" id="editRoleName" value={roleName} onChange={e => setRoleName(e.target.value)} required />
                <label htmlFor="editDescription">Nueva descripción</label>
                <textarea className="inputModal" id="editDescription" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
}
