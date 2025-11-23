import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ChapelScheduleViewer from '../components/ChapelScheduleViewer';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';
import { 
    getReservationFormInfo, 
    checkAvailability, 
    createReservation 
} from '../services/reservationService';

const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export default function ReservasReservar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const eventId = searchParams.get('eventId');
    
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };
    
    const getNextHour = () => {
        const now = new Date();
        let nextHour = now.getHours() + 1;
        
        // Asegurar que la hora esté entre 6 y 22
        if (nextHour < 6) {
            nextHour = 6;
        } else if (nextHour > 22) {
            nextHour = 6;
        }
        
        return `${String(nextHour).padStart(2, '0')}:00`;
    };
    
    const [eventDate, setEventDate] = useState(getTomorrowDate());
    const [eventTime, setEventTime] = useState(getNextHour());
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // Estados para menciones
    const [mentionTypes, setMentionTypes] = useState([]);
    const [mentions, setMentions] = useState([{ mention_type_id: '', mention_name: '' }]);
    const [showMentions, setShowMentions] = useState(false);

    useEffect(() => {
        document.title = "MLAP | Reservar evento";
        
        if (eventId) {
            loadFormInfo();
        } else {
            setLoading(false);
        }
    }, [eventId]);

    const loadFormInfo = async () => {
        try {
            setLoading(true);
            const response = await getReservationFormInfo(eventId);
            setFormData(response.data);
            
            // Verificar si el evento es una Misa para mostrar menciones
            const isMass = response.data.event_name && 
                          response.data.event_name.toLowerCase().includes('misa');
            setShowMentions(isMass);
            
            // Si es Misa, cargar los tipos de mención
            if (isMass) {
                try {
                    const mentionResponse = await fetch(`${API_URL}/api/mention-types`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (mentionResponse.ok) {
                        const mentionData = await mentionResponse.json();
                        setMentionTypes(mentionData.data || []);
                    } else {
                        console.error('Error al cargar tipos de mención');
                    }
                } catch (mentionErr) {
                    console.error('Error al cargar tipos de mención:', mentionErr);
                }
            }
            
            setError(null);
        } catch (err) {
            console.error('Error al cargar información del formulario:', err);
            setError(err.message || 'Error al cargar la información del evento');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setEventDate(e.target.value);
        setAvailabilityMessage('');
        setIsAvailable(null);
    };

    const handleTimeChange = (e) => {
        const selectedTime = e.target.value;
        const [hours] = selectedTime.split(':').map(Number);
        
        // Validar que la hora esté entre 6 y 22
        if (hours < 6 || hours > 22) {
            setAvailabilityMessage('La hora debe estar entre las 06:00 y las 22:00');
            setIsAvailable(false);
            return;
        }
        
        setEventTime(selectedTime);
        setAvailabilityMessage('');
        setIsAvailable(null);
    };

    const handleCheckAvailability = async () => {
        if (!eventDate || !eventTime) {
            setAvailabilityMessage('Por favor seleccione fecha y hora');
            setIsAvailable(false);
            return;
        }

        // Validar rango de hora (6:00 - 22:00)
        const [hours] = eventTime.split(':').map(Number);
        if (hours < 6 || hours > 22) {
            setAvailabilityMessage('La hora debe estar entre las 06:00 y las 22:00');
            setIsAvailable(false);
            return;
        }

        try {
            setIsChecking(true);
            setAvailabilityMessage('Verificando disponibilidad...');
            
            const response = await checkAvailability(eventId, eventDate, eventTime);
            
            setIsAvailable(response.data.available);
            
            // Priorizar el mensaje de reason sobre message
            const messageToShow = response.data.reason || response.message;
            setAvailabilityMessage(messageToShow);
            
        } catch (err) {
            console.error('Error al verificar disponibilidad:', err);
            setAvailabilityMessage(err.message || 'Error al verificar disponibilidad');
            setIsAvailable(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        if (eventDate && eventTime) {
            const timeoutId = setTimeout(() => {
                handleCheckAvailability();
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [eventDate, eventTime]);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleAddMention = () => {
        setMentions([...mentions, { mention_type_id: '', mention_name: '' }]);
    };

    const handleRemoveMention = (index) => {
        if (mentions.length > 1) {
            const newMentions = mentions.filter((_, i) => i !== index);
            setMentions(newMentions);
        }
    };

    const handleMentionTypeChange = (index, value) => {
        const newMentions = [...mentions];
        newMentions[index].mention_type_id = value;
        setMentions(newMentions);
    };

    const handleMentionNameChange = (index, value) => {
        const newMentions = [...mentions];
        newMentions[index].mention_name = value;
        setMentions(newMentions);
    };

    const handleSubmit = async () => {
        if (!isAvailable) {
            setAvailabilityMessage('El horario seleccionado no está disponible');
            return;
        }

        try {
            setIsCreating(true);
            const response = await createReservation(
                eventId, 
                eventDate, 
                eventTime, 
                beneficiaryName || null,
                showMentions ? mentions : []
            );
            
            alert(response.data.confirmation_message);
            
            navigate('/man-reservas/pendientes', { replace: true });
            
        } catch (err) {
            console.error('Error al crear reserva:', err);
            
            if (err.message.includes('autenticado') || err.message.includes('401')) {
                alert('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
                navigate('/login', { state: { returnUrl: window.location.pathname + window.location.search } });
            } else {
                alert(err.message || 'Error al crear la reserva');
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleScheduleCellClick = (dateStr, timeStr) => {
        setEventDate(dateStr);
        setEventTime(timeStr);
        
        setAvailabilityMessage('');
        setIsAvailable(null);
    };

    if (loading) {
        return (
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container'>
                    <div className="reserva-loading">
                        Cargando información del evento...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container'>
                    <div className="reserva-error-message">
                        {error}
                    </div>
                    <div className="reserva-button-container">
                        <MyButtonMediumIcon
                            text="Regresar a inicio"
                            icon="MdArrowBack"
                            onClick={() => navigate('/inicio')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (!eventId) {
        return (
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container'>
                    <div className="reserva-info-message">
                        <p>
                            Para realizar una reserva, primero debe buscar la parroquia deseada desde la pantalla de inicio 
                            y seleccionar el evento que desea reservar desde la página de la parroquia.
                        </p>
                    </div>
                    <div className="reserva-button-container">
                        <MyButtonMediumIcon
                            text="Regresar a inicio"
                            icon="MdArrowBack"
                            onClick={() => navigate('/inicio')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container'>
                    <div className="reserva-loading">
                        No se encontró información del evento
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container-reserva'>
                    <div className="reserva-form" >
                        <div className="reserva-row">
                            <div className="reserva-label">Capilla / Parroquia</div>
                            <div className="reserva-value">{formData.chapel_parish} - {formData.chapel_name}</div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Evento</div>
                            <div className="reserva-value">{formData.event_name}</div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Duración</div>
                            <div className="reserva-value">
                                {formData.duration_minutes} minutos
                            </div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Nombre del beneficiario:</div>
                            <div className="reserva-value">
                                <input 
                                    type="text"
                                    className="reserva-text-input"
                                    value={beneficiaryName}
                                    onChange={(e) => setBeneficiaryName(e.target.value)}
                                    placeholder="Dejar vacío para usar tu nombre"
                                    maxLength={120}
                                />
                                <small style={{display: 'block', marginTop: '5px', color: '#666', fontSize: '0.85em'}}>
                                    Opcional: Si la reserva es para otra persona, ingresa su nombre completo
                                </small>
                            </div>
                        </div>

                        {showMentions && (
                            <div className="reserva-mentions-section">
                                <div className="reserva-label" style={{marginBottom: '10px', fontWeight: 'bold'}}>
                                    Menciones de la Misa:
                                </div>
                                {mentions.map((mention, index) => (
                                    <div key={index} className="reserva-mention-item" style={{
                                        marginBottom: '15px', 
                                        padding: '15px', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '8px',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        <div className="reserva-row" style={{marginBottom: '10px'}}>
                                            <div className="reserva-label" style={{fontSize: '0.9em'}}>
                                                Tipo de mención:
                                            </div>
                                            <div className="reserva-value">
                                                <select
                                                    className="reserva-select-input"
                                                    value={mention.mention_type_id}
                                                    onChange={(e) => handleMentionTypeChange(index, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        fontSize: '1em'
                                                    }}
                                                >
                                                    <option value="">Seleccione un tipo</option>
                                                    {mentionTypes.map(type => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="reserva-row">
                                            <div className="reserva-label" style={{fontSize: '0.9em'}}>
                                                Nombre de la persona:
                                            </div>
                                            <div className="reserva-value">
                                                <input
                                                    type="text"
                                                    className="reserva-text-input"
                                                    value={mention.mention_name}
                                                    onChange={(e) => handleMentionNameChange(index, e.target.value)}
                                                    placeholder="Ej: Juan Pérez"
                                                    maxLength={120}
                                                    style={{width: '100%'}}
                                                />
                                            </div>
                                        </div>
                                        {mentions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMention(index)}
                                                style={{
                                                    marginTop: '10px',
                                                    padding: '5px 15px',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85em'
                                                }}
                                            >
                                                Eliminar mención
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddMention}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.95em',
                                        marginBottom: '15px'
                                    }}
                                >
                                    + Agregar otra mención
                                </button>
                            </div>
                        )}

                        <div className="reserva-row">
                            <div className="reserva-label">Selecciona fecha:</div>
                            <div className="reserva-value">
                                <input 
                                    type="date"
                                    className="reserva-date-input"
                                    value={eventDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Selecciona hora:</div>
                            <div className="reserva-value">
                                <input 
                                    type="time"
                                    className="reserva-time-input"
                                    value={eventTime}
                                    onChange={handleTimeChange}
                                    min="06:00"
                                    max="22:00"
                                    step="3600"
                                />
                                <small style={{display: 'block', marginTop: '5px', color: '#666', fontSize: '0.85em'}}>
                                    Horario disponible: 06:00 - 22:00
                                </small>
                            </div>
                        </div>

                        {availabilityMessage && (
                            <div className={`reserva-availability-message ${isAvailable ? 'available' : 'not-available'}`}>
                                {availabilityMessage}
                            </div>
                        )}

                        <div className="reserva-actions">
                            <MyButtonMediumIcon
                                text="Cancelar"
                                icon="MdClose"
                                onClick={handleCancel}
                                disabled={isCreating}
                            />
                            <MyButtonMediumIcon
                                text={isCreating ? "Reservando..." : "Aceptar"}
                                icon="MdCheck"
                                onClick={handleSubmit}
                                disabled={!isAvailable || isChecking || isCreating}
                            />
                        </div>
                    </div>
                    
                    {formData?.chapel_id && formData?.parish_id && (
                        <ChapelScheduleViewer 
                            chapelId={formData.chapel_id} 
                            parishId={formData.parish_id}
                            enableCellClick={true}
                            onCellClick={handleScheduleCellClick}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
