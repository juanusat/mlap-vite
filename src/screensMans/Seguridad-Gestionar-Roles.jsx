import React, { useState } from 'react';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import ToggleSwitch from '../components2/Toggle';
import Modal from '../components2/Modal';
import MatrixModal from '../components2/MatrixModal'; // Importamos el nuevo componente
import "../utils/Estilos-Generales-1.css";
import '../utils/Seguridad-Roles-Gestionar.css';


const AddRolForm = ({ onSave, onClose }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, descripcion });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario para Añadir Rol</h3>
            <div className="Inputs-add">
                <label htmlFor="addNombre">Nombre de Rol</label>
                <input type="text" className="inputModal" id="addNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="addDescripcion">Descripción</label>
                <textarea className="inputModal" id="addDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
};

const EditRolForm = ({ onSave, onClose, rol }) => {
    const [nombre, setNombre] = useState(rol.Rol);
    const [descripcion, setDescripcion] = useState(rol.Descripcion);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ id: rol.ID, nombre, descripcion });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario de Edición de Rol</h3>
            <div className="Inputs-edit">
                <label htmlFor="editNombre">Nuevo nombre de Rol</label>
                <input type="text" className="inputModal" id="editNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="editDescripcion">Nueva descripción</label>
                <textarea className="inputModal" id="editDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
};


export default function RolesGestionar() {
    const modulesList = [
        { id: 'liturgicalActs', name: 'Actos Liturgicos' },
        { id: 'users', name: 'Usuario' },
        { id: 'parishes', name: 'Parroquia' },
        { id: 'security', name: 'Seguridad' },
        { id: 'reservations', name: 'Reservas' },
        { id: 'documentTypes', name: 'Tipo de Documentos' },
        { id: 'parishApproval', name: 'Aprobar Parroquia' }
    ];

    const columns = [
        { key: 'ID', header: 'ID', accessor: row => row.ID },
        { key: 'Rol', header: 'Rol', accessor: row => row.Rol },
        { key: 'Descripcion', header: 'Descripción', accessor: row => row.Descripcion },
        { key: 'Estado', header: 'Estado', accessor: row => row.Estado },
        { key: 'Acciones', header: 'Acciones', accessor: row => row.Acciones }
    ];

    const generateMockPermissions = () => {
        const permissions = {};
        modulesList.forEach(module => {
            permissions[module.id] = {
                view: false, // Todos los permisos inician en false
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
                Estado: <ToggleSwitch initialState={i % 2 === 0} />,
                Permissions: generateMockPermissions(),
                Acciones: null
            });
        }
        return data;
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

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: null });
    const [roles, setRoles] = useState(generateMockData(100));
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [selectedRol, setSelectedRol] = useState(null);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleOpenModal = (type, rolData = null) => {
        if (type === 'permissions') {
            console.log(`Permisos actuales para el rol "${rolData.Rol}": ${countActivePermissions(rolData.Permissions)} activos.`);
            setSelectedRol(rolData);
            setShowMatrixModal(true);
            return;
        }

        let title = '';
        let body = null;

        switch (type) {
            case 'add':
                title = 'Añadir Nuevo Rol';
                body = <AddRolForm onSave={onSaveAddRol} onClose={handleCloseModal} />;
                break;
            case 'view':
                title = `Detalles del Rol: ${rolData.Rol}`;
                body = (
                    <div>
                        <p>ID: {rolData.ID}</p>
                        <p>Rol: {rolData.Rol}</p>
                        <p>Descripción: {rolData.Descripcion}</p>
                    </div>
                );
                break;
            case 'edit':
                title = `Editar Rol: ${rolData.Rol}`;
                body = <EditRolForm onSave={onSaveEditRol} onClose={handleCloseModal} rol={rolData} />;
                break;
            case 'delete':
                title = `Eliminar Rol: ${rolData.ID}`;
                body = (
                    <div>
                        <p>¿Estás seguro de que deseas eliminar el rol con ID: {rolData.ID}?</p>
                        <div className="buttons-container">
                            <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={handleCloseModal} />
                            <MyButtonMediumIcon text="Eliminar" icon="MdDelete" onClick={() => onSaveDeleteRol(rolData.ID)} />
                        </div>
                    </div>
                );
                break;
            default:
                break;
        }
        setModalContent({ title, body });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
            Estado: 'Activo',
            Permissions: generateMockPermissions(),
            Acciones: null
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
        console.log(`Permisos actualizados para el rol ID ${rolId}: ${countActivePermissions(updatedPermissions)} activos. ¡Los cambios se guardaron!`);
        handleCloseMatrixModal();
    };

    const filteredRoles = roles.filter(rol => {
        const rolString = `${rol.Rol} ${rol.Descripcion} ${rol.ID}`.toLowerCase();
        return rolString.includes(searchTerm.toLowerCase());
    });

    const rolesWithActions = filteredRoles.map(rol => ({
        ...rol,
        key: rol.ID,
        Acciones: (
            <MyGroupButtonsActions >
                <MyButtonShortAction type="view" onClick={() => handleOpenModal('view', rol)} />
                <MyButtonShortAction type="key" onClick={() => handleOpenModal('permissions', rol)} />
                <MyButtonShortAction type="edit" onClick={() => handleOpenModal('edit', rol)} />
                <MyButtonShortAction type="delete" onClick={() => handleOpenModal('delete', rol)} />
            </MyGroupButtonsActions>
        ),
    }));

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Roles</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={handleSearch} />
                    </div>
                    <MyGroupButtonsActions>
                        <MyButtonShortAction type="add" title="Añadir" onClick={() => handleOpenModal('add')} />
                    </MyGroupButtonsActions>
                </div>
                
                <DynamicTable columns={columns} data={rolesWithActions} 
                gridColumnsLayout="90px 380px 1fr 140px 220px"
                columnLeftAlignIndex={[2,3]}/>
            </div>
            {/* Modal para agregar/editar/eliminar roles */}
            <Modal show={showModal} onClose={handleCloseModal} title={modalContent.title}>
                {modalContent.body}
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