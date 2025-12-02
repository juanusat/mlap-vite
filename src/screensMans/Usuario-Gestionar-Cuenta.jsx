import React, { useState, useEffect } from 'react';

import TextInput from '../components/formsUI/TextInput';
import SelectInput from '../components/formsUI/SelectInput';
import InputFotoPerfil from '../components/inputFotoPerfil';
import ExpandableContainer from '../components/Contenedor-Desplegable';
import { getUserAccount, updatePersonalInfo, updateCredentials, getDocumentTypes } from '../services/userService';
import useSession from '../hooks/useSession';
import useLogout from '../hooks/useLogout';
import '../utils/Usuario-Gestionar.css';

const GestionCuenta = () => {
    const logout = useLogout();
    const { refetch: refetchSession } = useSession(logout);
    
    useEffect(() => {
        document.title = "MLAP | Mi cuenta";
        loadUserData();
        loadDocumentTypes();
    }, []);

    const [userInfo, setUserInfo] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        documentoIdentidad: "",
        tipoDocumentoId: "",
        tipoDocumentoNombre: "",
        fotoPerfil: "",
        usuario: "",
        correo: "",
        contraseña: ""
    });

    const [documentTypes, setDocumentTypes] = useState([]);
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
                tipoDocumentoId: data.document_type_id || "",
                tipoDocumentoNombre: data.document_type_name || "No especificado",
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

    const loadDocumentTypes = async () => {
        try {
            const response = await getDocumentTypes();
            setDocumentTypes(response.data || []);
        } catch (err) {
            console.error("Error al cargar tipos de documento:", err);
        }
    };

    const handleEditPersonal = () => {
        setIsEditingPersonal(true);
        setFotoPerfilData(null);
        setTempUserInfo(userInfo);
    };

    const handleSavePersonal = async () => {
        if (!tempUserInfo.tipoDocumentoId || tempUserInfo.tipoDocumentoId === '') {
            setError("Debe seleccionar un tipo de documento");
            return;
        }

        // Validar que nombres y apellidos no contengan números
        const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        
        if (!namePattern.test(tempUserInfo.nombres.trim())) {
            setError("Los nombres solo deben contener letras y espacios");
            return;
        }
        
        if (!namePattern.test(tempUserInfo.apellidoPaterno.trim())) {
            setError("El apellido paterno solo debe contener letras y espacios");
            return;
        }
        
        if (tempUserInfo.apellidoMaterno && tempUserInfo.apellidoMaterno.trim() && !namePattern.test(tempUserInfo.apellidoMaterno.trim())) {
            setError("El apellido materno solo debe contener letras y espacios");
            return;
        }

        try {
            setLoading(true);
            setError("");
            
            const updateData = {
                first_names: tempUserInfo.nombres,
                paternal_surname: tempUserInfo.apellidoPaterno,
                maternal_surname: tempUserInfo.apellidoMaterno,
                document: tempUserInfo.documentoIdentidad,
                document_type_id: tempUserInfo.tipoDocumentoId,
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
        
        // Validar campos de nombres y apellidos en tiempo real
        if (name === 'nombres' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
            if (!namePattern.test(value)) {
                return; // No permitir la entrada si contiene números o caracteres especiales
            }
        }
        
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
                        <SelectInput 
                            label="Tipo de documento" 
                            name="tipoDocumentoId"
                            value={tempUserInfo.tipoDocumentoId} 
                            onChange={(e) => setTempUserInfo(prev => ({...prev, tipoDocumentoId: e.target.value}))}
                            required={true}
                            options={[
                                { value: '', label: 'Seleccione un tipo' },
                                ...documentTypes.map(type => ({ value: type.id, label: type.name }))
                            ]}
                        />
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
                            <span className="info-label">Tipo de documento:</span>
                            <span className="info-value">{userInfo.tipoDocumentoNombre}</span>
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