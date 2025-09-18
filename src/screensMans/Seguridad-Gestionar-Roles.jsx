import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import ToggleSwitch from '../components2/Toggle';
import Modal from '../components2/Modal';
import MatrixModal from '../components2/MatrixModal';
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css';

// Componentes de formulario extraídos del componente principal
const AddRolForm = ({ onSave }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, descripcion });
    };

    return (
        <form id="add-rol-form" onSubmit={handleSubmit}>
            <div className="Inputs-add">
                <label htmlFor="addNombre">Nombre de Rol</label>
                <input type="text" className="inputModal" id="addNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="addDescripcion">Descripción</label>
                <textarea className="inputModal" id="addDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
        </form>
    );
};

const EditRolForm = ({ onSave, rol }) => {
    const [nombre, setNombre] = useState(rol.Rol);
    const [descripcion, setDescripcion] = useState(rol.Descripcion);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: rol.ID, nombre, descripcion });
    };

    return (
        <form id="edit-rol-form" onSubmit={handleSubmit}>
            <div className="Inputs-edit">
                <label htmlFor="editNombre">Nuevo nombre de Rol</label>
                <input type="text" className="inputModal" id="editNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="editDescripcion">Nueva descripción</label>
                <textarea className="inputModal" id="editDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
        </form>
    );
};

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
            permissions[module.id] = {
                view: false,
                add: false,
                edit: false,
                delete: false
            };
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

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [roles, setRoles] = useState(generateMockData(100));
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [selectedRol, setSelectedRol] = useState(null);

    const handleOpenModal = (type, rolData = null) => {
        setModalType(type);
        if (type === 'permissions') {
            setSelectedRol(rolData);
            setShowMatrixModal(true);
        } else {
            setSelectedRol(rolData);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType(null);
        setSelectedRol(null);
    };

    const handleCloseMatrixModal = () => {
        setShowMatrixModal(false);
        setSelectedRol(null);
    };

    const onSaveAddRol = (newRolData) => {
        const newId = roles.length > 0 ? Math.max(...roles.map(rol => rol.ID)) + 1 : 1;
        const newRol = {
            ID: newId,
            Rol: newRolData.nombre,
            Descripcion: newRolData.descripcion,
            Estado: true,
            Permissions: generateMockPermissions(),
        };
        setRoles([...roles, newRol]);
        handleCloseModal();
    };

    const onSaveEditRol = (editedRolData) => {
        const updatedRoles = roles.map(rol =>
            rol.ID === editedRolData.id
                ? { ...rol, Rol: editedRolData.nombre, Descripcion: editedRolData.descripcion }
                : rol
        );
        setRoles(updatedRoles);
        handleCloseModal();
    };

    const onSaveDeleteRol = (rolId) => {
        const updatedRoles = roles.filter(rol => rol.ID !== rolId);
        setRoles(updatedRoles);
        handleCloseModal();
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

    const countActivePermissions = (permissions) => {
        let count = 0;
        if (!permissions) return 0;
        for (const moduleId in permissions) {
            for (const action in permissions[moduleId]) {
                if (permissions[moduleId][action]) {
                    count++;
                }
            }
        }
        return count;
    };
    
    const getModalProps = () => {
        switch (modalType) {
            case 'add':
                return {
                    title: 'Añadir nuevo rol',
                    content: <AddRolForm onSave={onSaveAddRol} />,
                    onAccept: () => document.getElementById('add-rol-form').requestSubmit(),
                    onCancel: handleCloseModal,
                };
            case 'view':
                return {
                    title: `Detalles del rol: ${selectedRol.Rol}`,
                    content: selectedRol && (
                        <div>
                            <p><strong>ID:</strong> {selectedRol.ID}</p>
                            <p><strong>Rol:</strong> {selectedRol.Rol}</p>
                            <p><strong>Descripción:</strong> {selectedRol.Descripcion}</p>
                        </div>
                    ),
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal,
                };
            case 'edit':
                return {
                    title: `Editar rol: ${selectedRol.Rol}`,
                    content: selectedRol && <EditRolForm onSave={onSaveEditRol} rol={selectedRol} />,
                    onAccept: () => document.getElementById('edit-rol-form').requestSubmit(),
                    onCancel: handleCloseModal,
                };
            case 'delete':
                return {
                    title: `Eliminar rol: ${selectedRol.ID}`,
                    content: <h4>¿Estás seguro de que deseas eliminar el rol con ID: {selectedRol.ID}?</h4>,
                    onAccept: () => onSaveDeleteRol(selectedRol.ID),
                    onCancel: handleCloseModal,
                };
            default:
                return { title: '', content: null, onAccept: null, onCancel: handleCloseModal };
        }
    };
    
    const modalProps = getModalProps();

    const filteredRoles = roles.filter(rol =>
        Object.values(rol).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
                    onToggle={() => setRoles(prevRoles =>
                        prevRoles.map(r => r.ID === row.ID ? { ...r, Estado: !r.Estado } : r)
                    )}
                />
            )
        },
        {
            key: 'Acciones',
            header: 'Acciones',
            accessor: rol => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" onClick={() => handleOpenModal('view', rol)} />
                    <MyButtonShortAction type="key" onClick={() => handleOpenModal('permissions', rol)} />
                    <MyButtonShortAction type="edit" onClick={() => handleOpenModal('edit', rol)} />
                    <MyButtonShortAction type="delete" onClick={() => handleOpenModal('delete', rol)} />
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
                        <MyButtonShortAction type="add" title="Añadir" onClick={() => handleOpenModal('add')} />
                    </MyGroupButtonsActions>
                </div>
                
                <DynamicTable
                    columns={columns}
                    data={filteredRoles}
                    gridColumnsLayout="90px 380px 1fr 140px 220px"
                    columnLeftAlignIndex={[2, 3]}
                />
            </div>

            {/* Modal para agregar/editar/eliminar roles */}
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