import React, { useState, useEffect } from 'react';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyButtonShortAction from '../components/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import InputFotoPerfil from '../components/inputFotoPerfil';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ExpandableContainer from '../components/Contenedor-Desplegable';
import { getUserAccount, updatePersonalInfo, updateCredentials } from '../services/userService';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import '../utils/Usuario-Gestionar.css';

const GestionCuenta = () => {
    const logout = useLogout();
    const { refetch: refetchSession } = useSession(logout);
    
    useEffect(() => {
        document.title = "MLAP | Mi cuenta";
        loadUserData();
    }, []);

    const [userInfo, setUserInfo] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        documentoIdentidad: "",
        fotoPerfil: "",
        usuario: "",
        correo: "",
        contraseña: ""
    });

    const [fotoPerfilData, setFotoPerfilData] = useState(null);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);
    const [tempUserInfo, setTempUserInfo] = useState({});
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await getUserAccount();
            const data = response.data;
            
            setUserInfo({
                nombres: data.first_names,
                apellidoPaterno: data.paternal_surname,
                apellidoMaterno: data.maternal_surname || "",
                documentoIdentidad: data.document,
                fotoPerfil: data.profile_photo || "",
                usuario: data.username,
                correo: data.email,
                contraseña: "********"
            });
        } catch (err) {
            setError("Error al cargar los datos del usuario");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPersonal = () => {
        setIsEditingPersonal(true);
        setFotoPerfilData(null);
        setTempUserInfo(userInfo);
    };

    const handleSavePersonal = async () => {
        try {
            setLoading(true);
            setError("");
            
            const updateData = {
                first_names: tempUserInfo.nombres,
                paternal_surname: tempUserInfo.apellidoPaterno,
                maternal_surname: tempUserInfo.apellidoMaterno,
                document: tempUserInfo.documentoIdentidad,
            };
            
            if (fotoPerfilData && fotoPerfilData.file) {
                updateData.profile_photo = fotoPerfilData.file;
            }
            
            await updatePersonalInfo(updateData);
            
            setIsEditingPersonal(false);
            setFotoPerfilData(null);
            await loadUserData();
            
            // Actualizar la sesión para reflejar la nueva foto en el header
            if (refetchSession) {
                await refetchSession();
            }
        } catch (err) {
            setError(err.message || "Error al actualizar la información personal");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelPersonal = () => {
        setIsEditingPersonal(false);
        setFotoPerfilData(null);
        setError("");
    };

    const handleEditAccount = () => {
        setIsEditingAccount(true);
        setTempUserInfo(userInfo);
        setConfirmPassword("");
        setPasswordError("");
    };

    const handleSaveAccount = async () => {
        if (tempUserInfo.contraseña && tempUserInfo.contraseña !== "********" && tempUserInfo.contraseña !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            const updateData = {
                username: tempUserInfo.usuario,
                email: tempUserInfo.correo,
            };
            
            if (tempUserInfo.contraseña && tempUserInfo.contraseña !== "********") {
                updateData.new_password = tempUserInfo.contraseña;
            }
            
            await updateCredentials(updateData);
            
            setIsEditingAccount(false);
            setPasswordError("");
            await loadUserData();
        } catch (err) {
            setError(err.message || "Error al actualizar los datos de la cuenta");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAccount = () => {
        setIsEditingAccount(false);
        setPasswordError("");
        setError("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value === tempUserInfo.contraseña) {
            setPasswordError("");
        }
    };

    const handleFotoPerfilChange = (data) => {
        setFotoPerfilData(data);
    };

    if (loading && !userInfo.nombres) {
        return <div className="content-module only-this"><p>Cargando...</p></div>;
    }

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de cuenta</h2>

            {error && <div className="error-message">{error}</div>}

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
                                value={fotoPerfilData ? fotoPerfilData.preview : null}
                                placeholder="Subir foto de perfil de la parroquia"
                                maxSize={5 * 1024 * 1024}
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
                            <span className="info-value">{userInfo.fotoPerfil || "No asignada"}</span>
                        </div>
                    </>
                )}
            </ExpandableContainer>

            <ExpandableContainer
                title='Datos de la cuenta'
                type='edit'
                showDeleteButton="no"
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