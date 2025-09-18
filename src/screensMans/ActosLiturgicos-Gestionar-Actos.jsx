import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import "../utils/Estilos-Generales-1.css";
import "../utils/ActosLiturgicos-Gestionar.css";

// Lista de capillas predefinidas
const chapelsOptions = [
    "Capilla Santa Ana",
    "Capilla San José Obrero",
    "Capilla Virgen del Carmen",
    "Capilla La Candelaria",
    "Capilla de San Antonio"
];

const initialEventsData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    nombre: `Evento ${i + 1}`,
    descripcion: `Descripción detallada para el Evento ${i + 1}.`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Pendiente',
    tipo: (i + 1) % 3 === 0 ? 'Comunitario' : 'Privado',
    personas: (i + 1) % 3 === 0 ? Math.floor(Math.random() * 50) + 10 : '-',
    capilla: chapelsOptions[Math.floor(Math.random() * chapelsOptions.length)]
}));

const eventsOptions = [
    { nombre: "Bautizo", descripcion: "Ceremonia para el sacramento del bautismo." },
    { nombre: "Primera comunión", descripcion: "Recibimiento del sacramento de la Eucaristía por primera vez." },
    { nombre: "Confirmación", descripcion: "Ceremonia para el sacramento de la confirmación." },
    { nombre: "Matrimonio", descripcion: "Celebración del sacramento del matrimonio." },
    { nombre: "Funeral", descripcion: "Misa en memoria de un difunto." },
    { nombre: "Misa dominical", descripcion: "Misa habitual del domingo." },
    { nombre: "Adoración Eucarística", descripcion: "Tiempo de oración y adoración al Santísimo Sacramento." },
    { nombre: "Vigilia de Oración", descripcion: "Noche de oración antes de una festividad o evento importante." },
    { nombre: "Retiro espiritual", descripcion: "Jornada de reflexión y crecimiento espiritual." },
    { nombre: "Catequesis", descripcion: "Clases de formación religiosa." },
    { nombre: "Confesión", descripcion: "Sacramento de la penitencia y la reconciliación." },
    { nombre: "Unción de los Enfermos", descripcion: "Sacramento para aquellos que se enfrentan a una enfermedad o ancianidad." }
];

export default function EventosLiturgicos() {

    const [events, setEvents] = useState(initialEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);

    const [addEventSearchTerm, setAddEventSearchTerm] = useState('');
    const [eventType, setEventType] = useState('Privado');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [selectedChapel, setSelectedChapel] = useState('');

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
        setAddEventSearchTerm('');
        setEventType('Privado');
        setMaxAttendees('');
        setSelectedChapel('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
    };

    const confirmDelete = () => {
        if (currentEvent) {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== currentEvent.id));
            handleCloseModal();
        }
    };

    const handleSave = (eventData) => {
        if (modalType === 'add') {
            const newEvent = { ...eventData, id: events.length + 1, estado: 'Pendiente' };
            setEvents(prevEvents => [...prevEvents, newEvent]);
        } else if (modalType === 'edit' && currentEvent) {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === currentEvent.id ? { ...event, ...eventData } : event
                )
            );
        }
        handleCloseModal();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (modalType === 'add') {
            const selectedEvent = eventsOptions.find(event => event.nombre.toLowerCase() === addEventSearchTerm.toLowerCase());
            const chapelExists = chapelsOptions.includes(selectedChapel);
            
            if (selectedEvent && chapelExists) {
                const eventToSave = {
                    ...selectedEvent,
                    tipo: eventType,
                    personas: eventType === 'Comunitario' ? maxAttendees : '-',
                    capilla: selectedChapel
                };
                handleSave(eventToSave);
            } else {
                if (!selectedEvent) {
                    alert('Por favor, selecciona un evento válido de la lista.');
                } else if (!chapelExists) {
                    alert('Por favor, selecciona una capilla válida de la lista.');
                }
            }
        } else if (modalType === 'edit') {
            const form = document.getElementById('edit-event-form');
            if (form) {
                const nombre = form.querySelector('#editNombre').value;
                const descripcion = form.querySelector('#editDescripcion').value;
                handleSave({ nombre, descripcion });
            }
        }
    };

    const getModalContentAndActions = () => {
        switch (modalType) {
            case 'view':
                return {
                    title: 'Detalles del evento',
                    content: currentEvent && (
                        <div>
                            <p><strong>ID:</strong> {currentEvent.id}</p>
                            <p><strong>Nombre:</strong> {currentEvent.nombre}</p>
                            <p><strong>Descripción:</strong> {currentEvent.descripcion}</p>
                            <p><strong>Tipo:</strong> {currentEvent.tipo}</p>
                            <p><strong>Capilla:</strong> {currentEvent.capilla}</p>
                            {currentEvent.tipo === 'Comunitario' && <p><strong>Personas:</strong> {currentEvent.personas}</p>}
                        </div>
                    ),
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: <h3>¿Estás seguro que quieres eliminar este evento?</h3>,
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir evento',
                    content: (
                        <form id="add-event-form" onSubmit={handleFormSubmit}>
                            <div className="Inputs-add">
                                <label htmlFor="addNombre">Escoger evento</label>
                                <input
                                    list="eventos"
                                    className="inputModal"
                                    value={addEventSearchTerm}
                                    onChange={e => setAddEventSearchTerm(e.target.value)}
                                    placeholder="Buscar o seleccionar un evento..."
                                    required
                                />
                                <datalist id="eventos">
                                    {eventsOptions.filter(event => event.nombre.toLowerCase().includes(addEventSearchTerm.toLowerCase())).map((event, index) => <option key={index} value={event.nombre} />)}
                                </datalist>
                            </div>
                            <div className="Inputs-add">
                                <label htmlFor="chapel">Escoger capilla</label>
                                <input
                                    list="capillas"
                                    className="inputModal"
                                    id="chapel"
                                    value={selectedChapel}
                                    onChange={e => setSelectedChapel(e.target.value)}
                                    placeholder="Buscar o seleccionar una capilla..."
                                    required
                                />
                                <datalist id="capillas">
                                    {chapelsOptions.filter(chapel => chapel.toLowerCase().includes(selectedChapel.toLowerCase())).map((chapel, index) => <option key={index} value={chapel} />)}
                                </datalist>
                            </div>
                            <div className="Inputs-add">
                                <label>Tipo de Evento</label>
                                <div className="checkbox-group">
                                    <label>
                                        <input type="checkbox" checked={eventType === 'Privado'} onChange={() => setEventType('Privado')} /> Privado
                                    </label>
                                    <label>
                                        <input type="checkbox" checked={eventType === 'Comunitario'} onChange={() => setEventType('Comunitario')} /> Comunitario
                                    </label>
                                </div>
                                {eventType === 'Comunitario' && (
                                    <div style={{ marginTop: '10px' }}>
                                        <label htmlFor="maxAttendees">Número máximo de personas</label>
                                        <input type="number" id="maxAttendees" className="inputModal" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} required />
                                    </div>
                                )}
                            </div>
                        </form>
                    ),
                    onAccept: () => document.getElementById('add-event-form').requestSubmit(),
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

    const modalProps = getModalContentAndActions();

    const eventColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id },
        { key: 'nombre', header: 'Nombre', accessor: (row) => row.nombre },
        { key: 'descripcion', header: 'Descripción', accessor: (row) => row.descripcion },
        { key: 'capilla', header: 'Capilla', accessor: (row) => row.capilla },
        { key: 'tipo', header: 'Tipo', accessor: (row) => row.tipo },
        { key: 'personas', header: 'Personas', accessor: (row) => row.personas },
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
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de eventos</h2>
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
                    gridColumnsLayout="90px 240px 1fr 250px 140px 140px 140px 220px"
                    columnLeftAlignIndex={[2, 3,4]} />
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

function EditEventForm({ onSave, onClose, event }) {

    const [nombre, setNombre] = useState(event.nombre);
    const [descripcion, setDescripcion] = useState(event.descripcion);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, descripcion });
    };

    return (
        <form id="edit-event-form" onSubmit={handleSubmit}>
            <div className="Inputs-edit">
                <label htmlFor="editNombre">Nuevo nombre de evento</label>
                <input type="text" className="inputModal" id="editNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="editDescripcion">Nueva descripción</label>
                <textarea className="inputModal" id="editDescripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </div>
        </form>
    );
}