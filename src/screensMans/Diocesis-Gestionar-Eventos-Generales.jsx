import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Gestionar.css";
import * as eventService from '../services/eventService';

// Componente reutilizable para los formularios de eventos
const EventoForm = ({ formData, handleFormChange, isViewMode }) => {
    const handleBlur = (e) => {
        const { name, value } = e.target;
        handleFormChange({ target: { name, value: value.trim() } });
    };

    return (
        <div className="Inputs-add">
            <label htmlFor="name">Nombre:</label>
            <input
                type="text"
                className="inputModal"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                onBlur={handleBlur}
                disabled={isViewMode}
                required
                pattern=".*\S+.*"
                title="El nombre no puede estar vacío o contener solo espacios"
            />
            <label htmlFor="description">Descripción:</label>
            <textarea
                className="inputModal"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                onBlur={handleBlur}
                disabled={isViewMode}
                required
                pattern=".*\S+.*"
                title="La descripción no puede estar vacía o contener solo espacios"
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
    React.useEffect(() => {
        document.title = "MLAP | Gestionar eventos generales";
    }, []);

    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await eventService.listEvents(1, 100);
            setEvents(response.data);
        } catch (err) {
            setError(err.message);
            if (err.message.includes('autenticación') || err.message.includes('sesión')) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else if (err.message.includes('permisos') || err.message.includes('autorizado')) {
                setError('No tienes permisos para acceder a esta sección.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredEvents = events.filter((event) =>
        Object.values(event).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleToggle = async (eventId) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        try {
            const newStatus = !event.active;
            await eventService.updateEventStatus(eventId, newStatus);
            setEvents(prevEvents =>
                prevEvents.map(e =>
                    e.id === eventId ? { ...e, active: newStatus } : e
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleView = (event) => {
        setCurrentEvent(event);
        setModalType('view');
        setFormData({
            name: event.name,
            description: event.description
        });
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalType('edit');
        setFormData({
            name: event.name,
            description: event.description
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
            name: '',
            description: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
        setFormData({
            name: '',
            description: ''
        });
    };

    const confirmDelete = async () => {
        if (!currentEvent) return;

        try {
            await eventService.deleteEvent(currentEvent.id);
            setEvents(prevEvents => prevEvents.filter(e => e.id !== currentEvent.id));
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        // Validar que los campos no estén vacíos o solo con espacios
        if (!formData.name || !formData.name.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }
        
        if (!formData.description || !formData.description.trim()) {
            setError('La descripción no puede estar vacía');
            return;
        }

        try {
            const cleanData = {
                name: formData.name.trim(),
                description: formData.description.trim()
            };

            if (modalType === 'add') {
                const response = await eventService.createEvent(cleanData);
                setEvents(prevEvents => [...prevEvents, response.data]);
            } else if (modalType === 'edit' && currentEvent) {
                const response = await eventService.updateEvent(currentEvent.id, cleanData);
                setEvents(prevEvents =>
                    prevEvents.map(e =>
                        e.id === currentEvent.id ? response.data : e
                    )
                );
            }
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const eventColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id },
        { key: 'name', header: 'Nombre', accessor: (row) => row.name },
        { key: 'description', header: 'Descripción', accessor: (row) => row.description },
        {
            key: 'active',
            header: 'Estado',
            accessor: (row) => (
                <ToggleSwitch
                    isEnabled={row.active}
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
                        <div >
                            <h4>¿Deseas eliminar el evento "{currentEvent.name}"?</h4>
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
            {error && (
                <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
                    {error}
                </div>
            )}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Cargando eventos...</div>
            ) : (
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
            )}
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
