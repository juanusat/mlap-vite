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
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
        
        // Validar el email en tiempo real
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
            if (value && !emailRegex.test(value)) {
                setEmailError('El correo no cumple formato');
            } else {
                setEmailError('');
            }
        }
        // Validar la clave
        if (name === 'password') {
            const rgxMay = /[A-Z]/;
            const rgxMin = /[a-z]/;
            const rgxSyb = /[\$%&/\(\)_\-\.\[\]]/;

            const rgxNum = /[0-9]/;
            const rgxLon = /.{8}/;
            if (value && !rgxMay.test(value) && !rgxMin.test(value) && !rgxSyb.test(value) && !rgxNum.test(value) && !rgxLon.test(value)) {
                if (!rgxMay.test(value)) {
                    setPasswordError('La clave debe contener al menos una letra mayúscula.');
                }
                if (!rgxMin.test(value)) {
                    setPasswordError('La clave debe contener al menos una letra minúscula.');
                }
                if (!rgxSyb.test(value)) {
                    setPasswordError('La clave debe contener al menos un símbolo especial.');
                }
                if (!rgxNum.test(value)) {
                    setPasswordError('La clave debe contener al menos un número.');
                }
                if (!rgxLon.test(value)) {
                    setPasswordError('La clave debe tener al menos 8 caracteres.');
                }
            } else {
                setPasswordError('');
            }
        }
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
        setModalError(null);
        setFormData({
            id: event.id,
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
        setModalError(null);
        setFormData({
            id: event.id,
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
        setModalError(null);
        setShowModal(true);
    };

    const handleAddEvent = () => {
        setCurrentEvent(null);
        setModalType('add');
        setModalError(null);
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
        setEmailError('');
        setPasswordError('');
        setModalError(null);
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
                setModalError(null);
                await parishService.deleteParish(currentEvent.id);
                await loadParishes();
                handleCloseModal();
            } catch (err) {
                if (err.message.includes('403') || err.message.includes('Prohibido')) {
                    setModalError('No tienes permisos para eliminar parroquias.');
                } else if (err.message.includes('401') || err.message.includes('autorizado')) {
                    setModalError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                } else {
                    setModalError(err.message);
                }
                console.error('Error al eliminar:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        // Validar que los campos no estén vacíos o solo con espacios
        if (!formData.name || !formData.name.trim()) {
            setModalError('El nombre no puede estar vacío');
            return;
        }
        
        if (!formData.username || !formData.username.trim()) {
            setModalError('El usuario no puede estar vacío');
            return;
        }

        // Validar el formato del email antes de guardar
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[[^\s@]+)?$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setEmailError('El correo no cumple formato');
            setModalError('El correo no cumple formato');
            return;
        }

        try {
            setLoading(true);
            setModalError(null);
            setEmailError('');
            
            
            const cleanData = {
                name: formData.name.trim(),
                email: formData.email,
                username: formData.username.trim(),
                password: formData.password
            };

            if (modalType === 'add') {
                await parishService.createParish(cleanData);
            } else if (modalType === 'edit' && currentEvent) {
                await parishService.updateParish(currentEvent.id, cleanData);
            }
            
            await loadParishes();
            handleCloseModal();
        } catch (err) {
            if (err.message.includes('403') || err.message.includes('Prohibido')) {
                setModalError('No tienes permisos para realizar esta operación.');
            } else if (err.message.includes('401') || err.message.includes('autorizado')) {
                setModalError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else {
                setModalError(err.message);
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
                    content: (
                        <>
                            <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} emailError={emailError} />
                            {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
                        </>
                    ),
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar parroquia',
                    content: (
                        <>
                            <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} emailError={emailError} passwordError={passwordError} />
                            {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
                        </>
                    ),
                    onAccept: handleSave,
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: currentEvent && (
                        <div>
                            <h4>¿Deseas eliminar permanentemente la parroquia "{currentEvent.name}"?</h4>
                            <p style={{ marginTop: '15px', color: '#dc3545', fontSize: '14px', fontWeight: 'bold' }}>
                                 Esta acción es irreversible y eliminará:
                            </p>
                            <ul style={{ marginTop: '10px', color: 'var(--color-n-600)', fontSize: '14px', paddingLeft: '20px' }}>
                                <li>La parroquia y todas sus capillas</li>
                                <li>Todos los roles y asociaciones</li>
                                <li>El usuario administrador de la parroquia</li>
                            </ul>
                            <p style={{ marginTop: '10px', color: 'var(--color-n-500)', fontSize: '13px' }}>
                                Solo se pueden eliminar parroquias sin reservas activas.
                            </p>
                            {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
                        </div>
                    ),
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir parroquia',
                    content: (
                        <>
                            <ParroquiaForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} emailError={emailError} passwordError={passwordError} />
                            {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
                        </>
                    ),
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
const ParroquiaForm = ({ formData, handleFormChange, isViewMode, emailError, passwordError }) => {
    // Determina si es modo edición (cuando existe formData.id)
    const isEditMode = formData.id && !isViewMode;

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'name' || name === 'username') {
            handleFormChange({ target: { name, value: value.trim() } });
        }
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
            <label htmlFor="email">Correo del párroco:</label>
            <input
                type="email"
                className="inputModal"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={isViewMode || isEditMode}
                required
                placeholder="ejemplo@dominio.com"
            />
            {emailError && <p className="error-message" style={{ marginTop: '-10px', marginBottom: '10px', color: 'red', fontSize: '14px' }}>{emailError}</p>}
            {isEditMode && (
                <p className="info-message" style={{ marginTop: '-10px', marginBottom: '10px', color: 'var(--color-n-500)', fontSize: '13px' }}>
                    ℹ️ El correo no puede ser modificado una vez creada la parroquia
                </p>
            )}
            <label htmlFor="username">Usuario del párroco:</label>
            <input
                type="text"
                className="inputModal"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                onBlur={handleBlur}
                disabled={isViewMode}
                required
                pattern=".*\S+.*"
                title="El usuario no puede estar vacío o contener solo espacios"
            />
            {!isViewMode && (
                <>
                    <label htmlFor="password">Clave{formData.id ? '' : ''}:</label>
                    <input
                        type="password"
                        className="inputModal"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        required={!formData.id}
                        placeholder={formData.id ? 'Dejar vacío para no cambiar' : 'Ingrese la contraseña'}
                    />
                    {passwordError && <p className="error-message" style={{ marginTop: '-10px', marginBottom: '10px', color: 'red', fontSize: '14px' }}>{passwordError}</p>}
                </>
            )}
        </div>
    );
};
