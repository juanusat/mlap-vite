import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import ToggleSwitch from '../components2/Toggle';
import Modal from '../components2/Modal';
import MatrixModal from '../components2/MatrixModal';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css';

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
    const modulesList = [
        { id: 'liturgicalActs', name: 'Actos liturgicos' },
        { id: 'users', name: 'Usuario' },
        { id: 'parishes', name: 'Parroquia' },
        { id: 'security', name: 'Seguridad' },
        { id: 'reservations', name: 'Reservas' },
        { id: 'documentTypes', name: 'Tipo de Documentos' },
        { id: 'parishApproval', name: 'Aprobar parroquia' }
    ];

    const generateMockPermissions = () => {
        const permissions = {};
        modulesList.forEach(module => {
            permissions[module.id] = { view: false, add: false, edit: false, delete: false };
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

    // Para MatrixModal
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [selectedRol, setSelectedRol] = useState(null);

    // --------------------- HANDLERS FORM ---------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            setSelectedRol(rol);
            setShowMatrixModal(true);
        } else {
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRol(null);
        setModalType(null);
        setFormData({ nombre: '', descripcion: '' });
    };

    const handleCloseMatrixModal = () => {
        setShowMatrixModal(false);
        setSelectedRol(null);
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

    const onSavePermissions = (rolId, updatedPermissions) => {
        const updatedRoles = roles.map(rol =>
            rol.ID === rolId
                ? { ...rol, Permissions: updatedPermissions }
                : rol
        );
        setRoles(updatedRoles);
        handleCloseMatrixModal();
    };

    // --------------------- FILTRO ---------------------
    const filteredRoles = roles.filter(rol =>
        Object.values(rol).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // --------------------- COLUMNAS ---------------------
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

    // --------------------- MODAL ---------------------
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
            default:
                return { title: '', content: null, onAccept: null, onCancel: handleCloseModal };
        }
    };

    const modalProps = getModalContentAndActions();

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

            {showMatrixModal && selectedRol && (
                <div className='matrix-cont'>
                    <div className='cont'>
                        <MatrixModal
                            title={`Permisos de: ${selectedRol.Rol}`}
                            modules={modulesList}
                            permissions={selectedRol.Permissions}
                            onSave={(updatedPermissions) => onSavePermissions(selectedRol.ID, updatedPermissions)}
                            onClose={handleCloseMatrixModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
