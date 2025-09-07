import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/ActosLiturgicos-Gestionar.css";

// Genera los datos iniciales para la tabla.
const initialEventsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nombre: `Evento ${i + 1}`,
    descripcion: `Descripción detallada para el Evento ${i + 1}.`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Pendiente',
}));

export default function EventosLiturgicos() {
    // 1. Estados que controlan la lógica de la aplicación
    const [events, setEvents] = useState(initialEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);

    // 2. Lógica para filtrar eventos basándose en el término de búsqueda
    const filteredEvents = events.filter((event) =>
        Object.values(event).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // 3. Funciones de manejo de acciones
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
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalType('edit');
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
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
    };

    // 4. Lógica de manipulación de datos (Añadir, Editar y Eliminar)
    
    // Función para eliminar un evento de la lista.
    const confirmDelete = () => {
        if (currentEvent) {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== currentEvent.id));
            handleCloseModal();
        }
    };
    
    // Función para guardar o editar un evento.
    const handleSave = (eventData) => {
        if (modalType === 'add') {
            // Lógica para añadir un nuevo evento.
            const newEvent = { ...eventData, id: events.length + 1 };
            setEvents(prevEvents => [...prevEvents, newEvent]);
        } else if (modalType === 'edit' && currentEvent) {
            // Lógica para editar un evento existente.
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === currentEvent.id ? { ...event, ...eventData } : event
                )
            );
        }
        handleCloseModal();
    };
    
    // 5. Configuración de las columnas de la tabla
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

    // 6. La interfaz de usuario (JSX)
    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Eventos</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyButtonShortAction type="add" onClick={handleAddEvent} title="Añadir" />
                </div>
                <DynamicTable columns={eventColumns} data={filteredEvents} />
            </div>
                <Modal
                    show={showModal}
                    onClose={handleCloseModal}
                    title={
                        modalType === 'view' ? 'Detalles del Evento' :
                        modalType === 'edit' ? 'Editar Evento' :
                        modalType === 'delete' ? 'Confirmar Eliminación' :
                        'Añadir Evento'
                    }
                >
                    {modalType === 'view' && currentEvent && (
                        <div>
                            <h3>Detalles del Evento</h3>
                            <p><strong>ID:</strong> {currentEvent.id}</p>
                            <p><strong>Nombre:</strong> {currentEvent.nombre}</p>
                            <p><strong>Descripción:</strong> {currentEvent.descripcion}</p>
                        </div>
                    )}

                    {modalType === 'edit' && currentEvent && (
                        <EditEventForm onSave={handleSave} onClose={handleCloseModal} event={currentEvent} />
                    )}

                    {modalType === 'delete' && currentEvent && (
                        <div>
                            <h4>¿Estás seguro que quieres eliminar este evento?</h4>
                            <div className="buttons-container">
                                <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={handleCloseModal} />
                                <MyButtonMediumIcon text="Eliminar" icon="MdAccept" onClick={confirmDelete} />
                            </div>
                        </div>
                    )}

                    {modalType === 'add' && (
                        <AddEventForm onSave={handleSave} onClose={handleCloseModal} />
                    )}
                </Modal>
        </div>
    );
}

// Estos son los nuevos componentes que debes crear para los formularios

function AddEventForm({ onSave, onClose }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, descripcion, estado: 'Pendiente' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario para Añadir</h3>
            <div className="Inputs-add">
                <label htmlFor="addNombre">Nombre de evento</label>
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
}

function EditEventForm({ onSave, onClose, event }) {
    const [nombre, setNombre] = useState(event.nombre);
    const [descripcion, setDescripcion] = useState(event.descripcion);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, descripcion });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario de Edición</h3>
            <div className="Inputs-edit">
                <label htmlFor="editNombre">Nuevo nombre de evento</label>
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
}