import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../components/UI';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';

const ForgotPassword = ({ onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showVerificationField, setShowVerificationField] = useState(false);
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

        if (!email || !email.includes('@')) {
            setMessage('Por favor, ingresa una dirección de correo electrónico válida.');
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessage('¡Correo enviado correctamente! Revisa tu bandeja de entrada.');
            setShowVerificationField(true);
        } catch (error) {
            setMessage('Error al enviar el correo. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (verificationCode === '123456') {
                setStep(2);
            } else {
                setMessage('Código de verificación incorrecto. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            setMessage('Error en la verificación. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
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

        try {
            setMessage('¡Contraseña restablecida correctamente!. Ahora inicia sesión...');
            setTimeout(() => {
                navigate('/inicio');
            }, 3000);
        } catch (error) {
            setMessage('No se pudo restablecer la contraseña. Intenta de nuevo.');
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (showVerificationField) {
                handleVerificationSubmit(e);
            } else {
                handleForgotPasswordSubmit(e);
            }
        } else if (step === 2) {
            handlePasswordResetSubmit(e);
        }
    };

    const buttonText = () => {
        if (isSubmitting) {
            return 'Cargando...';
        }
        if (step === 1) {
            return showVerificationField ? 'Verificar' : 'Enviar';
        }
        return 'Aceptar';
    };

    const buttonIcon = () => {
        if (isSubmitting) {
            return 'MdAutorenew';
        }
        if (step === 1) {
            return showVerificationField ? 'MdAccept' : 'MdMail';
        }
        return 'MdAccept';
    };

    return (
        <div className="forgot-password-modal-content">
            <h3 className="modal-title">¿Olvidaste tu contraseña?</h3>
            <p className="modal-description">
                {step === 1
                    ? 'Introduce tu correo electrónico para restablecerla.'
                    : 'Código verificado. Ahora ingresa tu nueva contraseña.'}
            </p>
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <InputField
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="mlap-input"
                            disabled={isSubmitting || showVerificationField}
                        />
                        {showVerificationField && (
                            <InputField
                                type="text"
                                placeholder="Ingresa el código de verificación"
                                value={verificationCode}
                                onChange={handleVerificationCodeChange}
                                required
                                disabled={isSubmitting}
                            />
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <InputField
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                            disabled={isSubmitting}
                        />
                        <InputField
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            disabled={isSubmitting}
                        />
                    </>
                )}

                {message && (
                    <p className={`modal-message ${message.includes('incorrecto') || message.includes('no coinciden') || message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}

                <div className="buttons-container">
                    <MyButtonMediumIcon
                        text="Cancelar"
                        icon="MdClose"
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <MyButtonMediumIcon
                        text={buttonText()}
                        icon={buttonIcon()}
                        type="submit"
                        disabled={isSubmitting}
                        classNameExtra={isSubmitting ? 'disabled-button' : ''}
                    />
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;