import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Estilos-Generales-1.css";
import "../utils/Diocesis-Gestionar-Parroquia.css";

const initialEventsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nombre: `Parroquia ${i + 1}`,
    correo: `Correo${i + 1}@parroquia.com`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Pendiente',
}));

export default function Parroquia() {

    const [events, setEvents] = useState(initialEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [modalType, setModalType] = useState(null);


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

    const confirmDelete = () => {
        if (currentEvent) {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== currentEvent.id));
            handleCloseModal();
        }
    };

    const handleSave = (eventData) => {
        if (modalType === 'add') {
            // Lógica para añadir una nueva parroquia.
            const newEvent = { ...eventData, id: events.length + 1 };
            setEvents(prevEvents => [...prevEvents, newEvent]);
        } else if (modalType === 'edit' && currentEvent) {
            // Lógica para editar una parroquia existente.
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === currentEvent.id ? { ...event, ...eventData } : event
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

    // 6. La interfaz de usuario (JSX)
    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Parroquias</h2>
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
                    columnLeftAlignIndex={[2,3]}/>
            </div>
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={
                    modalType === 'view' ? 'Detalles de la parroquia' :
                        modalType === 'edit' ? 'Editar parroquia' :
                            modalType === 'delete' ? 'Confirmar Eliminación' :
                                'Añadir parroquia'
                }
            >
                {modalType === 'view' && currentEvent && (
                    <div>
                        <p><strong>ID:</strong> {currentEvent.id}</p>
                        <p><strong>Nombre:</strong> {currentEvent.nombre}</p>
                        <p><strong>Correo:</strong> {currentEvent.correo}</p>
                    </div>
                )}

                {modalType === 'edit' && currentEvent && (
                    <EditEventForm onSave={handleSave} onClose={handleCloseModal} event={currentEvent} />
                )}

                {modalType === 'delete' && currentEvent && (
                    <div>
                        <h4>¿Estás seguro que quieres eliminar esta parroquia?</h4>
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
    const [correo, setCorreo] = useState('');
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, correo,usuario, clave, estado: 'Pendiente' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario para añadir parroquia</h3>
            <div className="Inputs-add">
                <label htmlFor="addNombre">Nombre de Parroquia</label>
                <input type="text" className="inputModal" id="addNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="addCorreo">Correo</label>
                <input type="text" className="inputModal" id="addCorreo" value={correo} onChange={e => setCorreo(e.target.value)} required />
                <label htmlFor="addUsuario">Usuario</label>
                <input type="text" className="inputModal" id="addUsuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
                <label htmlFor="addClave">Clave</label>
                <input type="password" className="inputModal" id="addClave" value={clave} onChange={e => setClave(e.target.value)} required />
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
    const [correo, setCorreo] = useState(event.correo);
    const [usuario, setUsuario] = useState(event.usuario);
    const [clave, setClave] = useState(event.clave);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ nombre, correo });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario de Edición</h3>
            <div className="Inputs-edit">
                <label htmlFor="editNombre">Modificar nombre de parroquia</label>
                <input type="text" className="inputModal" id="editNombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <label htmlFor="editCorreo">Modificar correo</label>
                <input type="text" className="inputModal" id="editCorreo" value={correo} onChange={e => setCorreo(e.target.value)} required />
                <label htmlFor="editUsuario">Modificar usuario</label>
                <input type="text" className="inputModal" id="editUsuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
                <label htmlFor="editClave">Modificar clave</label>
                <input type="password" className="inputModal" id="editClave" value={clave} onChange={e => setClave(e.target.value)} required />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
}
