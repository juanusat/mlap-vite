import React, { useState } from 'react';
import { InputField, MainButton, SecondaryButton } from '../components/UI';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Simula una llamada a una API
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!email || !email.includes('@')) {
            setMessage('Por favor, ingresa una dirección de correo electrónico.');
            setIsSubmitting(false);
            return; 
        }else {
           setMessage('¡Correo enviado correctamente! Revisa tu bandeja de entrada para restablecer la contraseña.');
        }
    };

    return (
        <div className="forgot-password-modal-content">
            <h3 className="modal-title">¿Olvidaste tu contraseña?</h3>
            <p className="modal-description">
                Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} >
                <InputField
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className="mlap-input"
                />
                {message && <p className={`modal-message ${message.includes('enviado') ? '' : 'error'}`}>{message}</p>}

                <div className="buttons-container">
                    <MyButtonMediumIcon
                        text="Cancelar"
                        icon="MdClose"
                        onClick={onClose} disabled={isSubmitting}
                    />
                    <MyButtonMediumIcon
                        text={isSubmitting ? 'Enviando...' : 'Enviar'}
                        icon="MdMail"
                        onClick={handleForgotPasswordSubmit}
                        disabled={isSubmitting}
                        classNameExtra={isSubmitting ? 'disabled-button' : ''}
                    />
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;