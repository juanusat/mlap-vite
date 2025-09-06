import React, { useState } from 'react';
import MyGroupButtonsActions from '../components2/MyGroupButtonsActions';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import '../utils/ActosLiturgicos-Gestionar.css';

const initialRoles = [
    { id: 1, eventName: 'Administrador', description: 'Rol con permisos completos', active: true, permissions: [] },
    { id: 2, eventName: 'Usuario', description: 'Rol con permisos básicos', active: true, permissions: [] },
    { id: 3, eventName: 'Invitado', description: 'Rol con acceso de solo lectura', active: false, permissions: [] },
    { id: 4, eventName: 'Editor', description: 'Rol con permisos de edición de contenido', active: true, permissions: [] },
    { id: 5, eventName: 'Moderador', description: 'Rol para moderar comentarios y contenido', active: false, permissions: [] },
    { id: 6, eventName: 'Analista', description: 'Rol para visualizar reportes y datos', active: true, permissions: [] },
    { id: 7, eventName: 'Desarrollador', description: 'Rol con acceso técnico y de desarrollo', active: true, permissions: [] },
    { id: 8, eventName: 'Diseñador', description: 'Rol con acceso para la gestión de UI/UX', active: true, permissions: [] },
    { id: 9, eventName: 'Contador', description: 'Rol para la gestión financiera', active: false, permissions: [] },
    { id: 10, eventName: 'Director', description: 'Rol con permisos de alto nivel y supervisión', active: true, permissions: [] },
];

const itemsPerPage = 4;

const RolesPage = () => {
    const [roles, setRoles] = useState(initialRoles);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        data: null,
    });
    const [roleToDelete, setRoleToDelete] = useState(null);

    // Lógica de paginación
    const filteredRoles = roles.filter(role =>
        role.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const paginatedRoles = filteredRoles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Funciones para manejar los modales
    const openAddModal = () => setModalState({ isOpen: true, type: 'add', data: null });
    const openEditModal = (role) => setModalState({ isOpen: true, type: 'edit', data: role });
    const showConfirmModal = (roleId) => {
        setRoleToDelete(roleId);
        setModalState({ isOpen: true, type: 'confirm', data: null });
    };
    const openPermissionsModal = (role) => setModalState({ isOpen: true, type: 'permissions', data: role });

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, data: null });
        setRoleToDelete(null);
    };

    // Lógica de acciones del modal
    const addRole = () => {
        const newRoleName = document.getElementById('role-name').value;
        const newRoleDescription = document.getElementById('role-description').value;

        if (newRoleName) {
            const newRole = {
                id: roles.length + 1,
                eventName: newRoleName,
                description: newRoleDescription,
                active: true,
                permissions: [],
            };
            setRoles([...roles, newRole]);
            closeModal();
        }
    };

    const editRole = () => {
        const editedRole = {
            ...modalState.data,
            eventName: document.getElementById('edit-role-name').value,
            description: document.getElementById('edit-role-description').value,
        };
        setRoles(roles.map(role => (role.id === editedRole.id ? editedRole : role)));
        closeModal();
    };

    const deleteRole = () => {
        setRoles(roles.filter(role => role.id !== roleToDelete));
        closeModal();
    };

    const toggleRoleStatus = (roleId) => {
        setRoles(roles.map(role =>
            role.id === roleId ? { ...role, active: !role.active } : role
        ));
    };

    // Renderizado del contenido del modal
    const renderModalContent = () => {
        switch (modalState.type) {
            case 'add':
                return (
                    <div>
                        <div className="modal-header">
                            <h3>Crear Rol</h3>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                        </div>
                        <div className="form-field">
                            <label htmlFor="role-name">Nombre del Rol</label>
                            <input type="text" id="role-name" placeholder="Ej: Administrador" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="role-description">Descripción del Rol</label>
                            <input type="text" id="role-description" placeholder="Ej: Rol con permisos completos" />
                        </div>
                        <div className="button-group">
                            <button className="btn-primary" onClick={addRole}>Crear</button>
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                );
            case 'edit':
                const currentRole = modalState.data;
                return (
                    <div>
                        <div className="modal-header">
                            <h3>Editar Rol</h3>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                        </div>
                        <div className="form-field">
                            <label htmlFor="edit-role-name">Nuevo Nombre</label>
                            <input type="text" id="edit-role-name" defaultValue={currentRole.eventName} />
                        </div>
                        <div className="form-field">
                            <label htmlFor="edit-role-description">Nueva Descripción</label>
                            <input type="text" id="edit-role-description" defaultValue={currentRole.description} />
                        </div>
                        <div className="button-group">
                            <button className="btn-primary" onClick={editRole}>Guardar</button>
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                );
            case 'confirm':
                return (
                    <div>
                        <div className="modal-header">
                            <h3>Confirmar Eliminación</h3>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                        </div>
                        <p>¿Estás seguro de que deseas eliminar este rol permanentemente?</p>
                        <div className="button-group">
                            <button className="btn-primary" onClick={deleteRole}>Sí, eliminar</button>
                            <button className="btn-secondary" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                );
            case 'permissions':
                const roleWithPermissions = modalState.data;
                return (
                    <div>
                        <div className="modal-header">
                            <h3 id="permissions-modal-title">Permisos para {roleWithPermissions.eventName}</h3>
                            <span className="close-btn" onClick={closeModal}>&times;</span>
                        </div>
                        <div className="search-container" style={{ marginTop: '1em' }}>
                            <input type="text" id="permissions-search" placeholder="Buscar módulo o permiso..." />
                        </div>
                        <div className="permissions-matrix-container">
                            <table className="permissions-matrix-table">
                                <thead>
                                    <tr>
                                        <th>Módulo</th>
                                        <th>Ver</th>
                                        <th>Añadir</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                        <th>Buscar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Módulo 1</td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                    </tr>
                                    <tr>
                                        <td>Módulo 2</td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                        <td><input type="checkbox" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Roles</h2>
            <div className="app-container">
                <div className="main-content">
                    <div className="container">
                        <div className="card">
                            <div className="section-header">
                                <h2>Gestión de Roles</h2>
                                <div className="icon-group">

                                    <MyGroupButtonsActions>
                                        <MyButtonShortAction
                                            type="add"
                                            onClick={() => openModal('addEvent')}
                                            title="Crear evento"
                                        />
                                    </MyGroupButtonsActions>
                                </div>
                            </div>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Buscar rol..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="pagination-controls">
                                <button id="prev-page" onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                                <span id="page-info">Página {currentPage} de {totalPages}</span>
                                <button id="next-page" onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    modalState.isOpen && (
                        <Modal
                            closeModal={closeModal}
                            isFullScreen={modalState.type === 'permissions'}
                        >
                            {renderModalContent()}
                        </Modal>
                    )
                }
            </div>
        </div>
    );
};

export default RolesPage;