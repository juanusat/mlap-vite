import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';

export default function ReservasReservar() {
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reservar evento</h2>
                <div className='app-container'>
                    <div className="reserva-form">
                        <div className="reserva-row">
                            <div className="reserva-label">Capilla / Parroquia</div>
                            <div className="reserva-value">Consolación</div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Evento</div>
                            <div className="reserva-value">Matrimonio individual</div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Selecciona fecha:</div>
                            <div className="reserva-value"><input type="date"
                                className="reserva-date-input"
                                defaultValue="2025-09-30"
                            />
                            </div>
                        </div>

                        <div className="reserva-row">
                            <div className="reserva-label">Selecciona hora:</div>
                            <div className="reserva-value"><input type="time"
                                className="reserva-time-input"
                                defaultValue="08:00"
                                step="3600"
                            />
                            </div>
                        </div>

                        <div className="reserva-actions">
                            <MyButtonMediumIcon
                                text="Cancelar"
                                icon="MdClose"
                                onClick={() => console.log('Reserva cancelada')}
                            />
                            <MyButtonMediumIcon
                                text="Aceptar"
                                icon="MdAccept"
                                onClick={() => console.log('Reserva aceptada')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
