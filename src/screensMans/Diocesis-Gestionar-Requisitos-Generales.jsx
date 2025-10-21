import React, { useState } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import MyPanelLateralConfig from "../components/MyPanelLateralConfig";
import '../utils/Estilos-Generales-1.css';
import "../utils/ActosLiturgicos-Requisitos.css";

// Componente reutilizable para el formulario de requisitos
const RequisitoForm = ({ formData, handleFormChange, isViewMode }) => {
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

// Datos iniciales de ejemplo para eventos y requisitos
const initialEventsData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    nombre: `Evento ${i + 1}`,
    descripcion: `Descripción del Evento ${i + 1}.`,
}));

const initialRequirementsData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    eventoId: (i % 20) + 1,
    nombre: `Requisito ${i + 1}`,
    descripcion: `Descripción del Requisito ${i + 1}.`,
    estado: (i + 1) % 2 === 0 ? 'Activo' : 'Inactivo',
}));

// Componente de tabla con capacidad de clic para eventos
const TableEventsWithClick = ({ data, handleRowClickEvent }) => {
    return (
        <div className="table-container">
            <div className="table-body-div">
                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="table-row-div event-row"
                        onClick={() => handleRowClickEvent(row)}
                    >
                        <div className="event-cell">
                            <span className="event-id">{row.id}</span>
                            <span className="event-name">{row.nombre}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente principal de gestión de requisitos
export default function DiocesisRequisitosGestionarSoloBarra() {
      React.useEffect(() => {
    document.title = "MLAP | Gestionar requisitos generales";
  }, []);
    
    const [requirements, setRequirements] = useState(initialRequirementsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentRequirement, setCurrentRequirement] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const [events, setEvents] = useState(initialEventsData);
    const [showPanel, setShowPanel] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTermEvent, setSearchTermEvent] = useState('');

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredRequirements = selectedEvent ?
        requirements.filter(req =>
            req.eventoId === selectedEvent.id &&
            (req.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const filteredEvents = events.filter(event =>
        Object.values(event).some(value =>
            String(value).toLowerCase().includes(searchTermEvent.toLowerCase())
        )
    );

    const handleSelectEvent = () => {
        setShowPanel(true);
    };

    const handleClosePanel = () => {
        setShowPanel(false);
    };

    const handleAddRequirement = () => {
        if (!selectedEvent) {
            setModalType('message');
            setShowModal(true);
            return;
        }
        setCurrentRequirement(null);
        setModalType('add');
        setFormData({ nombre: '', descripcion: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRequirement(null);
        setModalType(null);
        setFormData({ nombre: '', descripcion: '' });
    };

    const handleViewRequirement = (req) => {
        setCurrentRequirement(req);
        setModalType('view');
        setFormData({
            nombre: req.nombre,
            descripcion: req.descripcion
        });
        setShowModal(true);
    };

    const handleEditRequirement = (req) => {
        setCurrentRequirement(req);
        setModalType('edit');
        setFormData({
            nombre: req.nombre,
            descripcion: req.descripcion
        });
        setShowModal(true);
    };

    const handleDeleteConfirmation = (req) => {
        setCurrentRequirement(req);
        setModalType('delete');
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (currentRequirement) {
            setRequirements(prevReqs => prevReqs.filter(req => req.id !== currentRequirement.id));
            handleCloseModal();
        }
    };

    const handleSave = () => {
        if (modalType === 'add') {
            const newReq = {
                ...formData,
                id: requirements.length > 0 ? Math.max(...requirements.map(r => r.id)) + 1 : 1,
                eventoId: selectedEvent.id,
                estado: 'Activo'
            };
            setRequirements(prevReqs => [...prevReqs, newReq]);
        } else if (modalType === 'edit' && currentRequirement) {
            setRequirements(prevReqs =>
                prevReqs.map(req =>
                    req.id === currentRequirement.id ? { ...req, ...formData } : req
                )
            );
        }
        handleCloseModal();
    };

    const handleRowClickEvent = (event) => {
        setSelectedEvent(event);
        setShowPanel(false);
    };

    const handleToggle = (requirementId) => {
        setRequirements(prevRequirements =>
            prevRequirements.map(req =>
                req.id === requirementId
                    ? { ...req, estado: req.estado === 'Activo' ? 'Inactivo' : 'Activo' }
                    : req
            )
        );
    };

    const requirementColumns = [
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
                    <MyButtonShortAction type="view" title="Ver" onClick={() => handleViewRequirement(row)} />
                    <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEditRequirement(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    const getModalContentAndActions = () => {
        switch (modalType) {
            case 'view':
                return {
                    title: 'Detalles del requisito',
                    content: <RequisitoForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />,
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar requisito',
                    content: <RequisitoForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: currentRequirement && (
                        <div className="Inputs-add">
                            <input type="text" className="inputModal" placeholder="¿Deseas eliminar el requisito?" disabled />
                        </div>
                    ),
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir requisito',
                    content: <RequisitoForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'message':
                return {
                    title: 'Seleccionar evento',
                    content: <p>Por favor, selecciona un evento primero.</p>,
                    onAccept: handleCloseModal,
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
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gestión de requisitos generales</h2>
                <div className="app-container">
                    <div className="search-add">
                        <div className="texto-evento">
                            <label>{selectedEvent ? `Requisitos de: ${selectedEvent.nombre}` : ''}</label>
                        </div>
                        <div className="center-container">
                            <SearchBar onSearchChange={setSearchTerm} />
                        </div>
                        <div className="right-container">
                            <MyGroupButtonsActions>
                                <MyButtonShortAction type="select" title="Seleccionar evento" onClick={handleSelectEvent} />
                                <MyButtonShortAction type="add" onClick={handleAddRequirement} title="Añadir" />
                            </MyGroupButtonsActions>
                        </div>
                    </div>
                    {selectedEvent ? (
                        <DynamicTable
                            columns={requirementColumns}
                            data={filteredRequirements}
                            gridColumnsLayout="90px 380px 1fr 140px 220px"
                            columnLeftAlignIndex={[2, 3]}
                        />
                    ) : (
                        <div className="empty-state">
                            <p>Por favor, selecciona un evento para ver sus requisitos.</p>
                        </div>
                    )}
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

            {showPanel && (
                <>
                    <MyPanelLateralConfig>
                        <div className="panel-lateral-header">
                            <h2>Seleccionar evento</h2>
                            <MyButtonShortAction type="close" onClick={handleClosePanel} title="Cerrar" />
                        </div>
                        <br />
                        <div className="sidebar-search">
                            <SearchBar onSearchChange={setSearchTermEvent} />
                        </div>
                        <TableEventsWithClick data={filteredEvents} handleRowClickEvent={handleRowClickEvent} />
                    </MyPanelLateralConfig>
                </>
            )}
        </>
    );
}
