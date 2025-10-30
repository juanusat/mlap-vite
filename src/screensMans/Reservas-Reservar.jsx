import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';
import { 
    getReservationFormInfo, 
    checkAvailability, 
    createReservation 
} from '../services/reservationService';

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
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        return nextHour.toTimeString().slice(0, 5);
    };
    
    const [eventDate, setEventDate] = useState(getTomorrowDate());
    const [eventTime, setEventTime] = useState(getNextHour());
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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
        setEventTime(e.target.value);
        setAvailabilityMessage('');
        setIsAvailable(null);
    };

    const handleCheckAvailability = async () => {
        if (!eventDate || !eventTime) {
            setAvailabilityMessage('Por favor seleccione fecha y hora');
            setIsAvailable(false);
            return;
        }

        try {
            setIsChecking(true);
            setAvailabilityMessage('Verificando disponibilidad...');
            
            const response = await checkAvailability(eventId, eventDate, eventTime);
            
            setIsAvailable(response.data.available);
            setAvailabilityMessage(response.message);
            
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
                beneficiaryName || null
            );
            
            alert(response.data.confirmation_message);
            
            navigate('/man-reservas/pendientes');
            
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
                <div className='app-container'>
                    <div className="reserva-form">
                        <div className="reserva-row">
                            <div className="reserva-label">Capilla / Parroquia</div>
                            <div className="reserva-value">{formData.chapel_parish}</div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Evento</div>
                            <div className="reserva-value">{formData.event_name}</div>
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
                                    step="3600"
                                />
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
                </div>
            </div>
        </>
    );
}
