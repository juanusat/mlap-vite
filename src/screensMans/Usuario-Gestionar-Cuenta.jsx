import React, { useState } from 'react';
import MyGroupButtonsActions from '../components2/MyGroupButtonsActions';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import InputFotoPerfil from '../components2/inputFotoPerfil';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ExpandableContainer from '../components2/Contenedor-Desplegable';
import '../utils/Usuario-Gestionar.css';

const GestionCuenta = () => {
    // Estado para la información del usuario
    const [userInfo, setUserInfo] = useState({
        nombres: "Juan",
        apellidoPaterno: "Pérez",
        apellidoMaterno: "García",
        documentoIdentidad: "12345678",
        fotoPerfil: "usuario.jpg",
        usuario: "juanperez",
        correo: "juan.perez@ejemplo.com",
        contraseña: "password123"
    });

    const [fotoPerfilData, setFotoPerfilData] = useState(null);

    // Estado para el modo de edición de cada sección
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);

    // Estado temporal para guardar los datos antes de confirmar la edición
    const [tempUserInfo, setTempUserInfo] = useState({});

    // Estado para la confirmación de la contraseña y el mensaje de error
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    // ----- Handlers para la Información Personal -----
    const handleEditPersonal = () => {
        setIsEditingPersonal(true);
        setFotoPerfilData(null);
        setTempUserInfo(userInfo);
    };

    const handleSavePersonal = () => {
        setIsEditingPersonal(false);
        setUserInfo(tempUserInfo);
        if (fotoPerfilData) {
            updatedUserInfo.fotoPerfil = fotoPerfilData.name;
        }
        console.log("Datos personales guardados:", tempUserInfo);
    };

    const handleCancelPersonal = () => {
        setIsEditingPersonal(false);
        setFotoPerfilData(null);
    };

    // ----- Handlers para los Datos de la Cuenta -----
    const handleEditAccount = () => {
        setIsEditingAccount(true);
        setTempUserInfo(userInfo);
        // Limpiar estados de error y confirmación al entrar en modo de edición
        setConfirmPassword("");
        setPasswordError("");
    };

    const handleSaveAccount = () => {
        // Verificar si las contraseñas coinciden solo si se está editando la contraseña
        if (tempUserInfo.contraseña && tempUserInfo.contraseña !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return; // Detener la ejecución de la función si hay un error
        }

        setIsEditingAccount(false);
        setUserInfo(tempUserInfo);
        setPasswordError(""); // Limpiar el mensaje de error al guardar con éxito
        console.log("Datos de la cuenta guardados:", tempUserInfo);
    };

    const handleCancelAccount = () => {
        setIsEditingAccount(false);
        setPasswordError(""); // Limpiar el mensaje de error al cancelar
    };

    // Handler para cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    // Handler específico para el campo de confirmar contraseña
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        // Opcional: Limpiar el error si las contraseñas coinciden mientras se escribe
        if (e.target.value === tempUserInfo.contraseña) {
            setPasswordError("");
        }
    };

    const handleFotoPerfilChange = (data) => {
        setFotoPerfilData(data); // data.preview ahora contiene la URL para mostrar
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de cuenta</h2>

            <ExpandableContainer
                title='Información personal'
                type='edit'
                showDeleteButton="no"
                isEditing={isEditingPersonal}
                onEdit={handleEditPersonal}
                onSave={handleSavePersonal}
                onCancel={handleCancelPersonal}
            >
                {isEditingPersonal ? (
                    <>
                        <TextInput label="Nombres" value={tempUserInfo.nombres} onChange={handleInputChange} name="nombres" />
                        <TextInput label="Apellido paterno" value={tempUserInfo.apellidoPaterno} onChange={handleInputChange} name="apellidoPaterno" />
                        <TextInput label="Apellido materno" value={tempUserInfo.apellidoMaterno} onChange={handleInputChange} name="apellidoMaterno" />
                        <TextInput label="Documento de Identidad" value={tempUserInfo.documentoIdentidad} onChange={handleInputChange} name="documentoIdentidad" />
                        <div className="foto-input-container">
                            <label className="foto-label">Foto perfil:</label>
                            <InputFotoPerfil
                                onChange={handleFotoPerfilChange}
                                value={fotoPerfilData ? fotoPerfilData.preview : null} // Pasar la URL de la preview
                                placeholder="Subir foto de perfil de la parroquia"
                                maxSize={5 * 1024 * 1024} // 5MB
                                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="info-item">
                            <span className="info-label">Nombres:</span>
                            <span className="info-value">{userInfo.nombres}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Apellido paterno:</span>
                            <span className="info-value">{userInfo.apellidoPaterno}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Apellido materno:</span>
                            <span className="info-value">{userInfo.apellidoMaterno}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Documento de identidad:</span>
                            <span className="info-value">{userInfo.documentoIdentidad}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Foto perfil:</span>
                            <span className="info-value">{userInfo.fotoPerfil}</span>
                        </div>
                    </>
                )}
            </ExpandableContainer>

            <ExpandableContainer
                title='Datos de la cuenta'
                type='edit'
                showDeleteButton="si"
                isEditing={isEditingAccount}
                onEdit={handleEditAccount}
                onSave={handleSaveAccount}
                onCancel={handleCancelAccount}
            >
                {isEditingAccount ? (
                    <>
                        <TextInput label="Usuario" value={tempUserInfo.usuario} onChange={handleInputChange} name="usuario" />
                        <TextInput label="Correo" value={tempUserInfo.correo} onChange={handleInputChange} name="correo" />
                        <TextInput label="Nueva contraseña" placeholder='Nueva contraseña' onChange={handleInputChange} name="contraseña" type='password' />
                        <TextInput label="Confirmar contraseña" placeholder='Confirmar nueva contraseña' onChange={handleConfirmPasswordChange} value={confirmPassword} name="confirmarContraseña" type='password' />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </>
                ) : (
                    <>
                        <div className="info-item">
                            <span className="info-label">Usuario:</span>
                            <span className="info-value">{userInfo.usuario}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Correo:</span>
                            <span className="info-value">{userInfo.correo}</span>
                        </div>
                        <div className="info-item password-row">
                            <span className="info-label">Contraseña:</span>
                            <div className="password-display">
                                <span className="info-value">
                                    {showPassword ? userInfo.contraseña : '********'}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </ExpandableContainer>
        </div>
    );
};

export default GestionCuenta;