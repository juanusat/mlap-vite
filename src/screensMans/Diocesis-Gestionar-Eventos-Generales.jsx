import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Gestionar.css";

// Componente reutilizable para los formularios de eventos
const EventoForm = ({ formData, handleFormChange, isViewMode }) => {
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
    );
};

// Datos iniciales de ejemplo para eventos generales
const initialEventsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nombre: `Evento ${i + 1}`,
    descripcion: `Descripción detallada para el Evento ${i + 1}.`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Pendiente',
}));

export default function DiocesisEventosLiturgicos() {
    const [events, setEvents] = useState(initialEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
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
            descripcion: event.descripcion
        });
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalType('edit');
        setFormData({
            nombre: event.nombre,
            descripcion: event.descripcion
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
            descripcion: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
        setFormData({
            nombre: '',
            descripcion: ''
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
                estado: 'Activo'
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
        { key: 'descripcion', header: 'Descripción', accessor: (row) => row.descripcion },
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
                    title: 'Detalles del evento',
                    content: <EventoForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />,
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar evento',
                    content: <EventoForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: currentEvent && (
                        <div className='Inputs-add'>
                            <input type="text" className="inputModal" placeholder="¿Deseas eliminar el evento?" disabled />
                        </div>
                    ),
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir evento',
                    content: <EventoForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
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
            <h2 className='title-screen'>Gestión de eventos generales</h2>
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
