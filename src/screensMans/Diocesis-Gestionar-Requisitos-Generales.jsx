import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyPanelLateralConfig from "../components/MyPanelLateralConfig";
import '../utils/Estilos-Generales-1.css';
import "../utils/ActosLiturgicos-Requisitos.css";
import * as requirementService from '../services/baseRequirementService';

const RequisitoForm = ({ formData, handleFormChange, isViewMode }) => {
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
                            <span className="event-name">{row.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function DiocesisRequisitosGestionarSoloBarra() {
    React.useEffect(() => {
        document.title = "MLAP | Gestionar requisitos generales";
    }, []);
    
    const [requirements, setRequirements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentRequirement, setCurrentRequirement] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [events, setEvents] = useState([]);
    const [showPanel, setShowPanel] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTermEvent, setSearchTermEvent] = useState('');

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            loadRequirements();
        }
    }, [selectedEvent]);

    const loadEvents = async () => {
        try {
            const response = await requirementService.listEventsForSelect();
            setEvents(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadRequirements = async () => {
        if (!selectedEvent) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await requirementService.listRequirements(selectedEvent.id, 1, 100);
            setRequirements(response.data);
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

    const filteredRequirements = requirements.filter(req =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTermEvent.toLowerCase())
    );

    const handleSelectEvent = () => {
        setShowPanel(true);
    };

    const handleClosePanel = () => {
        setShowPanel(false);
    };

    const handleAddRequirement = () => {
        if (!selectedEvent) {
            setError('Por favor, selecciona un evento primero');
            return;
        }
        setCurrentRequirement(null);
        setModalType('add');
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentRequirement(null);
        setModalType(null);
        setFormData({ name: '', description: '' });
    };

    const handleViewRequirement = (req) => {
        setCurrentRequirement(req);
        setModalType('view');
        setFormData({
            name: req.name,
            description: req.description
        });
        setShowModal(true);
    };

    const handleEditRequirement = (req) => {
        setCurrentRequirement(req);
        setModalType('edit');
        setFormData({
            name: req.name,
            description: req.description
        });
        setShowModal(true);
    };

    const handleDeleteConfirmation = (req) => {
        setCurrentRequirement(req);
        setModalType('delete');
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!currentRequirement || !selectedEvent) return;

        try {
            await requirementService.deleteRequirement(selectedEvent.id, currentRequirement.id);
            setRequirements(prevReqs => prevReqs.filter(r => r.id !== currentRequirement.id));
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        if (!selectedEvent) return;

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
                const response = await requirementService.createRequirement(selectedEvent.id, cleanData);
                setRequirements(prevReqs => [...prevReqs, response.data]);
            } else if (modalType === 'edit' && currentRequirement) {
                const response = await requirementService.updateRequirement(selectedEvent.id, currentRequirement.id, cleanData);
                setRequirements(prevReqs =>
                    prevReqs.map(r =>
                        r.id === currentRequirement.id ? response.data : r
                    )
                );
            }
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRowClickEvent = (event) => {
        setSelectedEvent(event);
        setShowPanel(false);
    };

    const handleToggle = async (requirementId) => {
        if (!selectedEvent) return;
        
        const requirement = requirements.find(r => r.id === requirementId);
        if (!requirement) return;

        try {
            const newStatus = !requirement.active;
            await requirementService.updateRequirementStatus(selectedEvent.id, requirementId, newStatus);
            setRequirements(prevReqs =>
                prevReqs.map(r =>
                    r.id === requirementId ? { ...r, active: newStatus } : r
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const requirementColumns = [
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
                        <div>
                            <h4>¿Deseas eliminar el requisito "{currentRequirement.name}"?</h4>
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
                {error && (
                    <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}
                <div className="app-container">
                    <div className="search-add">
                        <div className="texto-evento">
                            <label>{selectedEvent ? `Requisitos de: ${selectedEvent.name}` : ''}</label>
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
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Cargando requisitos...</div>
                    ) : selectedEvent ? (
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
                <MyPanelLateralConfig title="Seleccionar evento" onClose={handleClosePanel}>
                    <div className="sidebar-search">
                        <SearchBar onSearchChange={setSearchTermEvent} />
                    </div>
                    <TableEventsWithClick data={filteredEvents} handleRowClickEvent={handleRowClickEvent} />
                </MyPanelLateralConfig>
            )}
        </>
    );
}
