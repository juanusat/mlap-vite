import React, { useState } from 'react';
import MyGroupButtonsActions from '../components2/MyGroupButtonsActions';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
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
        usuario: "juanperez",
        correo: "juan.perez@ejemplo.com",
        contraseña: "password123"
    });

    // Estado para el modo de edición de cada sección
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);

    // Estado temporal para guardar los datos antes de confirmar la edición
    const [tempUserInfo, setTempUserInfo] = useState({});

    // Estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    // ----- Handlers para la Información Personal -----
    const handleEditPersonal = () => {
        setIsEditingPersonal(true);
        setTempUserInfo(userInfo);
    };

    const handleSavePersonal = () => {
        setIsEditingPersonal(false);
        setUserInfo(tempUserInfo);
        console.log("Datos personales guardados:", tempUserInfo);
    };

    const handleCancelPersonal = () => {
        setIsEditingPersonal(false);
    };
    
    // ----- Handlers para los Datos de la Cuenta -----
    const handleEditAccount = () => {
        setIsEditingAccount(true);
        setTempUserInfo(userInfo);
    };

    const handleSaveAccount = () => {
        setIsEditingAccount(false);
        setUserInfo(tempUserInfo);
        console.log("Datos de la cuenta guardados:", tempUserInfo);
    };

    const handleCancelAccount = () => {
        setIsEditingAccount(false);
    };

    // Handler para cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Cuenta</h2>

            <ExpandableContainer
                title='Información Personal'
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
                        <TextInput label="Apellido Paterno" value={tempUserInfo.apellidoPaterno} onChange={handleInputChange} name="apellidoPaterno" />
                        <TextInput label="Apellido Materno" value={tempUserInfo.apellidoMaterno} onChange={handleInputChange} name="apellidoMaterno" />
                        <TextInput label="Documento de Identidad" value={tempUserInfo.documentoIdentidad} onChange={handleInputChange} name="documentoIdentidad" />
                    </>
                ) : (
                    <>
                        <div className="info-item">
                            <span className="info-label">Nombres:</span>
                            <span className="info-value">{userInfo.nombres}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Apellido Paterno:</span>
                            <span className="info-value">{userInfo.apellidoPaterno}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Apellido Materno:</span>
                            <span className="info-value">{userInfo.apellidoMaterno}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Documento de Identidad:</span>
                            <span className="info-value">{userInfo.documentoIdentidad}</span>
                        </div>
                    </>
                )}
            </ExpandableContainer>

            <ExpandableContainer
                title='Datos de la Cuenta'
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
                        <TextInput label="Contraseña" value={tempUserInfo.contraseña} onChange={handleInputChange} name="contraseña" />
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
                                <MyButtonShortAction
                                    title={showPassword ? 'view' : 'view'}
                                    type='view'
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </ExpandableContainer>
        </div>
    );
};

export default GestionCuenta;