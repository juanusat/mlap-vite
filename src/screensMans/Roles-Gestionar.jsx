import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Roles-Gestionar.css";

// Simulación de la base de datos de usuarios y roles
const initialUsers = Array.from({ length: 100 }, (_, i) => {
    const userRoles = [];
    if (i % 2 === 0) {
        userRoles.push("Editor", "Analista", "Desarrollador");
    }
    if (i % 3 === 0) {
        userRoles.push("Moderador", "Soporte");
    }
    if (i % 5 === 0) {
        userRoles.push("Gerente", "Contador", "Recursos Humanos");
    }
    if (i === 0) {
        for (let j = 1; j <= 20; j++) {
            userRoles.push(`Rol de prueba ${j}`);
        }
    }
    return {
        id: i + 1,
        username: `Usuario${i + 1}`,
        lastName: `Apellido${i + 1}`,
        email: `usuario${i + 1}@example.com`,
        isEnabled: true,
        roles: userRoles
    };
});

const allRoles = ["Admin", "Secretario", "Vicario", "Editor", "Analista", "Desarrollador", "Moderador", "Soporte", "Gerente", "Contador", "Recursos Humanos"];
const itemsPerPage = 4;

export default function RolesGestionar() {
    // 1. Estados que controlan la lógica de la aplicación
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // 2. Lógica para filtrar y ordenar usuarios
    const filteredAndSortedUsers = [...users]
        .filter(user =>
            Object.values(user).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            const aValue = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
            const bValue = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 3. Funciones de manejo de acciones
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleToggle = (userId) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user
            )
        );
    };

    const handleInviteUser = () => {
        setCurrentUser(null);
        setModalType('invite');
        setShowModal(true);
    };

    const handleViewRoles = (user) => {
        setCurrentUser(user);
        setShowSidebar(true);
    };

    const handleAddRole = (user) => {
        setCurrentUser(user);
        setModalType('addRole');
        setShowModal(true);
    };

    const handleDeleteUserConfirmation = (user) => {
        setCurrentUser(user);
        setModalType('deleteUser');
        setShowModal(true);
    };

    const handleDeleteRole = (roleToRemove) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === currentUser.id
                    ? { ...user, roles: user.roles.filter(role => role !== roleToRemove) }
                    : user
            )
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType(null);
        setCurrentUser(null);
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false);
        setCurrentUser(null);
    };

    const handleSave = (data) => {
        if (modalType === 'addRole') {
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === currentUser.id
                        ? { ...user, roles: [...user.roles, data.role] }
                        : user
                )
            );
        } else if (modalType === 'invite') {
            const newUser = {
                id: users.length + 1,
                username: data.email.split('@')[0],
                lastName: '',
                email: data.email,
                isEnabled: true,
                roles: []
            };
            setUsers(prevUsers => [...prevUsers, newUser]);
            setSearchTerm('');
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        if (modalType === 'deleteUser' && currentUser) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));
        }
        handleCloseModal();
    };

    // 4. Configuración de las columnas de la tabla
    const userColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id, onHeaderClick: handleSort },
        { key: 'username', header: 'Nombre', accessor: (row) => row.username, onHeaderClick: handleSort },
        { key: 'lastName', header: 'Apellidos', accessor: (row) => row.lastName, onHeaderClick: handleSort },
        { key: 'email', header: 'Correo', accessor: (row) => row.email, onHeaderClick: handleSort },
        {
            key: 'estado',
            header: 'Estado',
            accessor: (row) => (
                <ToggleSwitch
                    isEnabled={row.isEnabled}
                    onToggle={() => handleToggle(row.id)}
                />
            ),
        },
        {
            key: 'acciones', header: 'Acciones', accessor: (row) => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" title="Ver Roles" onClick={() => handleViewRoles(row)} />
                    <MyButtonShortAction type="add" title="Añadir Rol" onClick={() => handleAddRole(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar Usuario" onClick={() => handleDeleteUserConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    // 5. La interfaz de usuario (JSX)
    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Cuentas</h2>
            <div className={`app-container ${showSidebar ? 'sidebar-active' : ''}`}>
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyButtonShortAction type="add" onClick={handleInviteUser} title="Añadir usuario" />
                </div>
                <DynamicTable
                    columns={userColumns}
                    data={paginatedUsers}
                />
                <div className="pagination-controls">
                    <button id="prev-page" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Anterior</button>
                    <span id="page-info">Página {currentPage} de {totalPages || 1}</span>
                    <button id="next-page" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages}>Siguiente</button>
                </div>
            </div>

            {/* Barra lateral para mostrar los roles del usuario */}
            <aside className={`sidebar ${showSidebar ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h3>Roles de <span id="sidebar-username">{currentUser?.username}</span></h3>
                    <button className="close-sidebar" onClick={handleCloseSidebar}>&times;</button>
                </div>
                <div className="sidebar-body">
                    <ul id="sidebar-role-list" className="role-list">
                        {currentUser?.roles.length > 0 ? (
                            currentUser.roles.map((role, index) => (
                                <li key={index} className="role-item">
                                    <span className="role-name">{role}</span>
                                    <MyButtonShortAction type="delete" title="Eliminar Rol" onClick={() => handleDeleteRole(role)} />
                                </li>
                            ))
                        ) : (
                            <li style={{ textAlign: 'center', color: '#777' }}>Este usuario no tiene roles asignados.</li>
                        )}
                    </ul>
                </div>
            </aside>

            {/* Modal dinámico para todas las acciones */}
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={
                    modalType === 'invite' ? 'Invitar Usuarios' :
                        modalType === 'addRole' ? 'Añadir Rol' :
                            'Confirmar Eliminación'
                }
                isFullScreen={false}
            >
                {modalType === 'invite' && (
                    <InviteUserForm onSave={handleSave} onClose={handleCloseModal} />
                )}
                {modalType === 'addRole' && currentUser && (
                    <AddRoleForm
                        onSave={handleSave}
                        onClose={handleCloseModal}
                        availableRoles={allRoles.filter(r => !currentUser.roles.includes(r))}
                    />
                )}
                {modalType === 'deleteUser' && currentUser && (
                    <div>
                        <h4>¿Estás seguro de que deseas eliminar a este usuario permanentemente?</h4>
                        <div className="buttons-container">
                            <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={handleCloseModal} />
                            <MyButtonMediumIcon text="Eliminar" icon="MdDelete" onClick={handleDelete} />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

// ... (Los componentes de formulario son los mismos)
function InviteUserForm({ onSave, onClose }) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onSave({ email });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="invite-email">Correo Electrónico</label>
                <input
                    type="email"
                    id="invite-email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="button-group">
                <MyButtonMediumIcon text="Invitar" icon="MdMailOutline" type="submit" />
                <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={onClose} />
            </div>
        </form>
    );
}

function AddRoleForm({ onSave, onClose, availableRoles }) {
    const [selectedRole, setSelectedRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedRole) {
            onSave({ role: selectedRole });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="role-select">Selecciona un rol</label>
                <select
                    id="role-select"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    required
                >
                    <option value="">Selecciona un rol</option>
                    {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            <div className="button-group">
                <MyButtonMediumIcon text="Añadir" icon="MdAddCircle" type="submit" />
                <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={onClose} />
            </div>
        </form>
    );
}