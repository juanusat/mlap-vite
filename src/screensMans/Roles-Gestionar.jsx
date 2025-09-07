import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MatrixModal from "../components2/MatrixModal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import '../utils/Roles-Gestionar.css';

// Genera los datos iniciales para la tabla de roles
const initialRoles = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    roleName: `Rol ${i + 1}`,
    description: `Descripción del Rol ${i + 1}.`,
    isActive: (i + 1) % 2 === 0 ? true : false,
    modules: [
        { id: 1, name: 'Actos Litúrgicos', isActive: true, permissions: [{name: 'Ver Actos Litúrgicos', isActive: true}] },
        { id: 2, name: 'Usuarios', isActive: true, permissions: [{name: 'Editar Usuarios', isActive: true}] }
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
    const [permissionsSearch, setPermissionsSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // 2. Lógica para filtrar roles basándose en el término de búsqueda
    const filteredRoles = roles.filter((role) =>
        Object.values(role).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // 2.1. Lógica para ordenar los roles filtrados
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

    // 2.2. Función para manejar el ordenamiento
    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    // 3. Funciones de manejo de acciones
    const handleToggle = (roleId) => {
        setRoles(prevRoles =>
            prevRoles.map(role =>
                role.id === roleId
                    ? { ...role, isActive: !role.isActive }
                    : role
            )
        );
    };

    const handleView = (role) => {
        setCurrentRole(role);
        setModalType('view');
        setShowModal(true);
    };

    const handleEdit = (role) => {
        setCurrentRole(role);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDeleteConfirmation = (role) => {
        setCurrentRole(role);
        setModalType('delete');
        setShowModal(true);
    };

    const handleAddRole = () => {
        setCurrentRole(null);
        setModalType('add');
        setShowModal(true);
    };

    const handlePermissions = (role) => {
        setCurrentRole(role);
        setShowMatrixModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRole(null);
        setModalType(null);
        setPermissionsSearch('');
    };

    const handleCloseMatrixModal = () => {
        setShowMatrixModal(false);
        setCurrentRole(null);
    };

    // 4. Lógica de manipulación de datos (Añadir, Editar y Eliminar)
    
    // Función para eliminar un rol de la lista.
    const confirmDelete = () => {
        if (currentRole) {
            setRoles(prevRoles => prevRoles.filter(role => role.id !== currentRole.id));
            handleCloseModal();
        }
    };
    
    // Función para guardar o editar un rol.
    const handleSave = (roleData) => {
        if (modalType === 'add') {
            // Lógica para añadir un nuevo rol.
            const newRole = { 
                ...roleData, 
                id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
                modules: []
            };
            setRoles(prevRoles => [...prevRoles, newRole]);
        } else if (modalType === 'edit' && currentRole) {
            // Lógica para editar un rol existente.
            setRoles(prevRoles =>
                prevRoles.map(role =>
                    role.id === currentRole.id ? { ...role, ...roleData } : role
                )
            );
        }
        handleCloseModal();
    };

    // 5. Lógica para el manejo de permisos
    const togglePermission = (roleId, moduleId, permissionName) => {
        setRoles(prevRoles => 
            prevRoles.map(role => {
                if (role.id !== roleId) return role;
                
                const updatedRole = { ...role };
                let moduleInRole = updatedRole.modules.find(m => m.id === moduleId);

                if (!moduleInRole) {
                    // Si el módulo no existe en el rol, lo añade
                    moduleInRole = {
                        id: moduleId,
                        name: predefinedModules.find(m => m.id === moduleId).name,
                        isActive: true,
                        permissions: []
                    };
                    updatedRole.modules.push(moduleInRole);
                }
                
                // Busca el permiso dentro del módulo
                const permIndex = moduleInRole.permissions.findIndex(p => p.name === permissionName);
                
                if (permIndex > -1) {
                    // Si el permiso existe, lo elimina
                    moduleInRole.permissions.splice(permIndex, 1);
                } else {
                    // Si el permiso no existe, lo añade
                    moduleInRole.permissions.push({ name: permissionName, isActive: true });
                }
                
                return updatedRole;
            })
        );
    };

    // 6. Configuración de las columnas de la tabla
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
                    <MyButtonShortAction type="view" title="Ver Permisos" onClick={() => handlePermissions(row)} />
                    <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    // 7. La interfaz de usuario (JSX)
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

                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    title={
                        modalType === 'permissions' ? `Permisos de: ${currentRole?.roleName}` :
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

                {/* MatrixModal para permisos */}
                <MatrixModal 
                    isOpen={showMatrixModal}
                    onClose={handleCloseMatrixModal}
                    role={currentRole}
                    predefinedModules={predefinedModules}
                    onTogglePermission={togglePermission}
                />
            </div>
        </div>
    );
}

// Componente para agregar roles
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

// Componente para editar roles
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