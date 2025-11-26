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
    const [step, setStep] = useState(1);
    const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';

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

        // Validar formato del correo
        const emailRegex = /^[a-zA-Z0-9._-]{4,50}@[a-zA-Z0-9-]{2,8}\.[a-zA-Z]{2,8}(\.[a-zA-Z]{2,8})?$/;
        if (!emailRegex.test(email.trim())) {
            setMessage('Por favor, ingresa una dirección de correo electrónico válida.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data?.message || 'Error al enviar el correo. Por favor, intenta de nuevo.');
                setIsSubmitting(false);
                return;
            }

            setMessage('¡Correo enviado correctamente! Revisa tu bandeja de entrada.');
            setShowVerificationField(true);
        } catch (error) {
            setMessage('No se pudo conectar con el servidor. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Validar que el código sea de 6 dígitos
        if (!/^\d{6}$/.test(verificationCode.trim())) {
            setMessage('El código debe ser de 6 dígitos.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/verify-reset-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    code: verificationCode.trim() 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data?.message || 'Código de verificación incorrecto o expirado.');
                setIsSubmitting(false);
                return;
            }

            setMessage('Código verificado correctamente.');
            setStep(2);
        } catch (error) {
            setMessage('No se pudo conectar con el servidor. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setIsSubmitting(false); 
            return;
        }

        // Validar longitud mínima
        if (newPassword.length < 8) {
            setMessage('La contraseña debe tener al menos 8 caracteres.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim(),
                    code: verificationCode.trim(),
                    newPassword,
                    confirmPassword 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data?.message || 'No se pudo restablecer la contraseña. Intenta de nuevo.');
                setIsSubmitting(false);
                return;
            }

            setMessage('¡Contraseña restablecida correctamente! Ahora inicia sesión...');
            setTimeout(() => {
                onClose();
                navigate('/inicio', { 
                    state: { message: 'Contraseña actualizada. Por favor, inicia sesión.' } 
                });
            }, 2000);
        } catch (error) {
            setMessage('No se pudo conectar con el servidor. Por favor, intenta de nuevo.');
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