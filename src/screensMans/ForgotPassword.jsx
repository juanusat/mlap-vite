import React, { useState } from 'react';
import { InputField } from '../components/UI';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: New Password

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Simula una llamada a una API
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!email || !email.includes('@')) {
            setMessage('Por favor, ingresa una dirección de correo electrónico.');
        } else {
            setMessage('¡Correo enviado correctamente! Revisa tu bandeja de entrada e ingresa el código de verificación para restablecer la contraseña.');
            setStep(2);
        }
        setIsSubmitting(false);
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Simula la verificación del código
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (verificationCode === '123456') {
            setMessage('Código verificado correctamente. Ingresa tu nueva contraseña.');
            setStep(3);
        } else {
            setMessage('Código de verificación incorrecto. Por favor, intenta de nuevo.');
        }

        setIsSubmitting(false);
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setIsSubmitting(false);
            return;
        }

        // Simula el restablecimiento de contraseña
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Lógica para enviar la nueva contraseña a la API
        // ...

        setMessage('Contraseña restablecida correctamente.');
        setIsSubmitting(false);
        // Opcional: Cerrar el modal después de un tiempo
        // setTimeout(() => onClose(), 2000);
    };

    const handleSubmit = (e) => {
        if (step === 1) {
            handleForgotPasswordSubmit(e);
        } else if (step === 2) {
            handleVerificationSubmit(e);
        } else if (step === 3) {
            handlePasswordResetSubmit(e);
        }
    };

    const buttonText = () => {
        if (isSubmitting) {
            return 'Cargando...';
        }
        switch (step) {
            case 1:
                return 'Enviar';
            case 2:
                return 'Verificar';
            case 3:
                return 'Aceptar';
            default:
                return 'Enviar';
        }
    };

    return (
        <div className="forgot-password-modal-content">
            <h3 className="modal-title">¿Olvidaste tu contraseña?</h3>
            <p className="modal-description">
                {step === 1 && 'Introduce tu correo electrónico y te enviaremos un código de verificación.'}
                {step === 2 && 'Revisa tu bandeja de entrada e ingresa el código de verificación.'}
                {step === 3 && 'Ahora ingresa tu nueva contraseña.'}
            </p>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <InputField
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className="mlap-input"
                        disabled={isSubmitting}
                    />
                )}
                
                {step === 2 && (
                    <InputField
                        type="text"
                        placeholder="Ingresa el código de verificación"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        required
                    />
                )}

                {step === 3 && (
                    <>
                        <InputField
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                        />
                        <InputField
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </>
                )}

                {message && <p className={`modal-message ${message.includes('incorrecto') || message.includes('no coinciden') ? 'error' : ''}`}>{message}</p>}

                <div className="buttons-container">
                    <MyButtonMediumIcon
                        text="Cancelar"
                        icon="MdClose"
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <MyButtonMediumIcon
                        text={buttonText()}
                        icon={step === 1 ? 'MdMail' : step === 2 ? 'MdCheckCircle' : 'MdLockReset'}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        classNameExtra={isSubmitting ? 'disabled-button' : ''}
                    />
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;