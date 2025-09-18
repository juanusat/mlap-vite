import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import "../utils/Estilos-Generales-1.css";
import "../utils/Seguridad-Cuentas-Gestionar.css";

// Definición de los 4 roles
const allRoles = ["Administrador", "Secretario", "Vicario", "Editor"];

// Simulación de la base de datos de usuarios (100 usuarios)
const initialUsers = Array.from({ length: 100 }, (_, i) => {
    // Asignación de un rol de forma cíclica
    const userRoles = [allRoles[i % allRoles.length]];
    return {
        id: i + 1,
        username: `Usuario${i + 1}`,
        lastName: `Apellido${i + 1}`,
        email: `usuario${i + 1}@example.com`,
        isEnabled: true,
        roles: userRoles,
    };
});

export default function CuentasGestionar() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const filteredUsers = users.filter((user) =>
        Object.values(user).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
        if (!currentUser) return;
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user =>
                user.id === currentUser.id
                    ? { ...user, roles: user.roles.filter(role => role !== roleToRemove) }
                    : user
            );
            const updatedCurrentUser = updatedUsers.find(user => user.id === currentUser.id);
            setCurrentUser(updatedCurrentUser);
            return updatedUsers;
        });
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
                roles: ['Secretario'],
            };
            setUsers(prevUsers => [...prevUsers, newUser]);
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        if (modalType === 'deleteUser' && currentUser) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));
        }
        handleCloseModal();
    };

    const getModalProps = () => {
        switch (modalType) {
            case 'invite':
                return {
                    title: 'Invitar usuarios',
                    content: <InviteUserForm onSave={handleSave} />,
                    onAccept: () => document.getElementById('invite-form').requestSubmit(),
                    onCancel: handleCloseModal
                };
            case 'addRole':
                return {
                    title: 'Añadir rol',
                    content: currentUser && (
                        <AddRoleForm
                            onSave={handleSave}
                            availableRoles={allRoles.filter(r => !currentUser.roles.includes(r))}
                        />
                    ),
                    onAccept: () => document.getElementById('add-role-form').requestSubmit(),
                    onCancel: handleCloseModal
                };
            case 'deleteUser':
                return {
                    title: 'Confirmar eliminación',
                    content: <h4>¿Estás seguro de que deseas eliminar a este usuario permanentemente?</h4>,
                    onAccept: handleDelete,
                    onCancel: handleCloseModal
                };
            default:
                return {
                    title: '',
                    content: null,
                    onAccept: null,
                    onCancel: handleCloseModal
                };
        }
    };

    const modalProps = getModalProps();

    const userColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id },
        { key: 'username', header: 'Nombre', accessor: (row) => row.username },
        { key: 'lastName', header: 'Apellidos', accessor: (row) => row.lastName },
        { key: 'email', header: 'Correo', accessor: (row) => row.email },
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
                    <MyButtonShortAction type="view" title="Ver roles" onClick={() => handleViewRoles(row)} />
                    <MyButtonShortAction type="add" title="Añadir rol" onClick={() => handleAddRole(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar usuario" onClick={() => handleDeleteUserConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gestión de cuentas</h2>
                <div className="app-container">
                    <div className="search-add">
                        <div className="center-container">
                            <SearchBar onSearchChange={setSearchTerm} />
                        </div>
                        <MyButtonShortAction type="add" onClick={handleInviteUser} title="Añadir usuario" />
                    </div>
                    <DynamicTable
                        columns={userColumns}
                        data={filteredUsers}
                        gridColumnsLayout="90px 350px 380px 1fr 140px 220px"
                        columnLeftAlignIndex={[2, 3, 4]}
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
            {showSidebar && currentUser && (
                <MyPanelLateralConfig>
                    <div className="panel-lateral-header">
                        <h2 className="sidebar-title">{`Roles de ${currentUser.username}`}</h2>
                        <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
                    </div>
                    <div className="sidebar-list">
                        {currentUser.roles.map((item) => (
                            <div key={`${currentUser.id}-${item}`} className="sidebar-list-item">
                                {item}
                                <MyButtonShortAction
                                    type="delete"
                                    title="Eliminar rol"
                                    onClick={() => handleDeleteRole(item)}
                                />
                            </div>
                        ))}
                    </div>
                </MyPanelLateralConfig>
            )}
        </>
    );
}

// ---------------------- Componentes de formulario ----------------------

function InviteUserForm({ onSave }) {
    const [email, setEmail] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ email });
    };
    return (
        <form id="invite-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="invite-email">Correo electrónico</label>
                <input
                    type="email"
                    className="inputModal"
                    id="invite-email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
        </form>
    );
}

function AddRoleForm({ onSave, availableRoles }) {
    const [selectedRole, setSelectedRole] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ role: selectedRole });
    };
    return (
        <form id="add-role-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="role-select">Selecciona un rol</label>
                <select
                    id="role-select"
                    className="inputModal"
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
        </form>
    );
}