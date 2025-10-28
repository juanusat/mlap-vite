import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Estilos-Generales-1.css";
import "../utils/Diocesis-Gestionar-Parroquia.css";
import * as parishService from '../services/parishService';

export default function Parroquia() {
  useEffect(() => {
    document.title = "MLAP | Gestionar parroquias";
    loadParishes();
  }, []);

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const loadParishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await parishService.listParishes(1, 100);
      setEvents(response.data);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para acceder a esta funcionalidad. Requiere acceso de nivel diócesis.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
      console.error('Error al cargar parroquias:', err);
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

    const handleToggle = async (eventId, currentStatus) => {
        try {
            setLoading(true);
            setError(null);
            await parishService.updateParishStatus(eventId, !currentStatus);
            await loadParishes();
        } catch (err) {
            if (err.message.includes('403') || err.message.includes('Prohibido')) {
                setError('No tienes permisos para cambiar el estado de parroquias.');
            } else if (err.message.includes('401') || err.message.includes('autorizado')) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else {
                setError(err.message);
            }
            console.error('Error al cambiar estado:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (event) => {
        setCurrentEvent(event);
        setModalType('view');
        setFormData({
            name: event.name,
            email: event.email,
            username: event.username || '',
            password: ''
        });
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
        setModalType('edit');
        setFormData({
            name: event.name,
            email: event.email,
            username: event.username || '',
            password: ''
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
            email: '',
            username: '',
            password: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
        setModalType(null);
        setFormData({
            name: '',
            email: '',
            username: '',
            password: ''
        });
    };

    const confirmDelete = async () => {
        if (currentEvent) {
            try {
                setLoading(true);
                setError(null);
                await parishService.deleteParish(currentEvent.id);
                await loadParishes();
                handleCloseModal();
            } catch (err) {
                if (err.message.includes('403') || err.message.includes('Prohibido')) {
                    setError('No tienes permisos para eliminar parroquias.');
                } else if (err.message.includes('401') || err.message.includes('autorizado')) {
                    setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                } else {
                    setError(err.message);
                }
                console.error('Error al eliminar:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (modalType === 'add') {
                await parishService.createParish(formData);
            } else if (modalType === 'edit' && currentEvent) {
                await parishService.updateParish(currentEvent.id, formData);
            }
            
            await loadParishes();
            handleCloseModal();
        } catch (err) {
            if (err.message.includes('403') || err.message.includes('Prohibido')) {
                setError('No tienes permisos para realizar esta operación.');
            } else if (err.message.includes('401') || err.message.includes('autorizado')) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else {
                setError(err.message);
            }
            console.error('Error al guardar:', err);
        } finally {
            setLoading(false);
        }
    };

    const eventColumns = [
        { key: 'id', header: 'ID', accessor: (row) => row.id },
        { key: 'name', header: 'Nombre', accessor: (row) => row.name },
        { key: 'email', header: 'Correo', accessor: (row) => row.email },
        {
            key: 'active',
            header: 'Estado',
            accessor: (row) => (
                <ToggleSwitch
                    isEnabled={row.active}
                    onToggle={() => handleToggle(row.id, row.active)}
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
                        <div >
                            <h4>¿Deseas eliminar la parroquia "{currentEvent.name}"?</h4>
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
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Cargando...</div>}
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
            <label htmlFor="name">Nombre:</label>
            <input
                type="text"
                className="inputModal"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
            <label htmlFor="email">Correo:</label>
            <input
                type="email"
                className="inputModal"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
            <label htmlFor="username">Usuario:</label>
            <input
                type="text"
                className="inputModal"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                disabled={isViewMode}
                required
            />
            {!isViewMode && (
                <>
                    <label htmlFor="password">Clave:</label>
                    <input
                        type="password"
                        className="inputModal"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        required={!formData.id}
                    />
                </>
            )}
        </div>
    );
};
