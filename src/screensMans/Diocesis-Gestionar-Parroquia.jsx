import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Estilos-Generales-1.css";
import "../utils/Diocesis-Gestionar-Parroquia.css";

// Datos iniciales de ejemplo con usuario y clave
const initialEventsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nombre: `Parroquia ${i + 1}`,
    correo: `correo${i + 1}@parroquia.com`,
    usuario: `usuario${i + 1}`,
    clave: `clave${i + 1}`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Pendiente',
}));

export default function Parroquia() {
      React.useEffect(() => {
    document.title = "MLAP | Gestionar parroquias";
  }, []);
    const [events, setEvents] = useState(initialEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        usuario: '',
        clave: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredEvents = events.filter((event) =>
        Object.values(event).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleToggle = (eventId) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === eventId
                    ? { ...event, estado: event.estado === 'Activo' ? 'Pendiente' : 'Activo' }
                    : event
            )
        );
    };

    const handleView = (event) => {
        setCurrentEvent(event);
        setModalType('view');
        setFormData({
            nombre: event.nombre,
            correo: event.correo,
            usuario: event.usuario || '',
            clave: event.clave || ''
        });
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalType('edit');
        setFormData({
            nombre: event.nombre,
            correo: event.correo,
            usuario: event.usuario || '',
            clave: event.clave || ''
        });
        setShowModal(true);
    };

    const handleDeleteConfirmation = (event) => {
        setCurrentEvent(event);
        setModalType('delete');
        setShowModal(true);
    };

    const handleAddEvent = () => {
        setCurrentEvent(null);
        setModalType('add');
        setFormData({
            nombre: '',
            correo: '',
            usuario: '',
            clave: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
        setFormData({
            nombre: '',
            correo: '',
            usuario: '',
            clave: ''
        });
    };

    const confirmDelete = () => {
        if (currentEvent) {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== currentEvent.id));
            handleCloseModal();
        }
    };

    const handleSave = () => {
        if (modalType === 'add') {
            const newEvent = {
                ...formData,
                id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
                estado: 'Pendiente'
            };
            setEvents(prevEvents => [...prevEvents, newEvent]);
        } else if (modalType === 'edit' && currentEvent) {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === currentEvent.id ? { ...event, ...formData } : event
                )
            );
        }
        handleCloseModal();
    };

    const eventColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id },
        { key: 'nombre', header: 'Nombre', accessor: (row) => row.nombre },
        { key: 'correo', header: 'Correo', accessor: (row) => row.correo },
        {
            key: 'estado',
            header: 'Estado',
            accessor: (row) => (
                <ToggleSwitch
                    isEnabled={row.estado === 'Activo'}
                    onToggle={() => handleToggle(row.id)}
                />
            ),
        },
        {
            key: 'acciones', header: 'Acciones', accessor: (row) => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
                    <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    const getModalContentAndActions = () => {
        switch (modalType) {
            case 'view':
                return {
                    title: 'Detalles de la parroquia',
                    content: <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />,
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar parroquia',
                    content: <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: currentEvent && (
                        <div className='Inputs-add'>
                            <input type="text" className="inputModal" placeholder="¿Deseas eliminar la parroquia?" disabled />
                        </div>
                    ),
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir parroquia',
                    content: <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            default:
                return {
                    title: '',
                    content: null,
                    onAccept: null,
                    onCancel: null
                };
        }
    };

    const modalProps = getModalContentAndActions();

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de parroquias</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyGroupButtonsActions>
                        <MyButtonShortAction type="add" onClick={handleAddEvent} title="Añadir" />
                    </MyGroupButtonsActions>
                </div>
                <DynamicTable columns={eventColumns} data={filteredEvents}
                    gridColumnsLayout="90px 380px 1fr 140px 220px"
                    columnLeftAlignIndex={[2, 3]} />
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

// Componente reutilizable para los formularios de la parroquia
const ParroquiaForm = ({ formData, handleFormChange, isViewMode }) => {
    return (
        <div className="Inputs-add">
            <label htmlFor="nombre">Nombre:</label>
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
            <label htmlFor="correo">Correo:</label>
            <input
                type="text"
                className="inputModal"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
            <label htmlFor="usuario">Usuario:</label>
            <input
                type="text"
                className="inputModal"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
            <label htmlFor="clave">Clave:</label>
            <input
                type="password"
                className="inputModal"
                id="clave"
                name="clave"
                value={formData.clave}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
        </div>
    );
};
