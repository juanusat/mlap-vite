import React, {useState, useEffect} from 'react';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyButtonShortAction from '../components/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ExpandableContainer from '../components/Contenedor-Desplegable';
import InputFotoPerfil from '../components/inputFotoPerfil';
import InputColorPicker from '../components/inputColorPicker';
import * as parishService from '../services/parishService';
import '../utils/Parroquia-Cuenta-Gestionar.css';

const GestionCuenta = () => {
    useEffect(() => {
        document.title = "MLAP | Gestionar cuenta parroquia";
        loadAccountData();
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [userInfo, setUserInfo] = useState({
        nombres: "",
        direccion: "",
        coordenadas: "",
        celular: "",
        colorPrimario: "#b1b1b1", 
        colorSecundario: "#424242", 
        fotoPerfil: "", 
        fotoPortada: "", 
        usuario: "",
        correo: "",
        contraseña: ""
    });

    const [fotoPerfilData, setFotoPerfilData] = useState(null);
    const [fotoPortadaData, setFotoPortadaData] = useState(null);

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAccount, setIsEditingAccount] = useState(false);

    const [tempUserInfo, setTempUserInfo] = useState({});

    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const loadAccountData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await parishService.getParishAccount();
            const { info, credentials } = response.data;
            
            setUserInfo({
                nombres: info.name || "",
                direccion: info.address || "",
                coordenadas: info.coordinates || "",
                celular: info.phone || "",
                colorPrimario: info.primary_color || "#b1b1b1",
                colorSecundario: info.secondary_color || "#424242",
                fotoPerfil: info.profile_photo || "",
                fotoPortada: info.cover_photo || "",
                usuario: credentials.username || "",
                correo: credentials.email || "",
                contraseña: ""
            });
        } catch (err) {
            setError(err.message || 'Error al cargar los datos de la cuenta');
            console.error('Error al cargar cuenta:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPersonal = () => {
        setIsEditingPersonal(true);
        setTempUserInfo(userInfo);
        setFotoPerfilData(null);
        setFotoPortadaData(null);
    };

    const handleSavePersonal = async () => {
        try {
            setLoading(true);
            setError(null);

            const updateData = {
                name: tempUserInfo.nombres,
                address: tempUserInfo.direccion,
                coordinates: tempUserInfo.coordenadas,
                phone: tempUserInfo.celular,
                primary_color: tempUserInfo.colorPrimario,
                secondary_color: tempUserInfo.colorSecundario
            };

            if (fotoPerfilData && fotoPerfilData.name) {
                updateData.profile_photo = fotoPerfilData.name;
            }
            if (fotoPortadaData && fotoPortadaData.name) {
                updateData.cover_photo = fotoPortadaData.name;
            }

            await parishService.updateParishAccountInfo(updateData);
            
            setIsEditingPersonal(false);
            await loadAccountData();
            
        } catch (err) {
            setError(err.message || 'Error al actualizar la información');
            console.error('Error al guardar información personal:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelPersonal = () => {
        setIsEditingPersonal(false);
        setFotoPerfilData(null);
        setFotoPortadaData(null);
    };

    const handleEditAccount = () => {
        setIsEditingAccount(true);
        setTempUserInfo(userInfo);
        setConfirmPassword("");
        setCurrentPassword("");
        setPasswordError("");
    };

    const handleSaveAccount = async () => {
        if (tempUserInfo.contraseña && tempUserInfo.contraseña !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        if (!currentPassword) {
            setPasswordError("Debes ingresar tu contraseña actual para realizar cambios.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const updateData = {
                username: tempUserInfo.usuario,
                email: tempUserInfo.correo,
                current_password: currentPassword
            };

            if (tempUserInfo.contraseña) {
                updateData.new_password = tempUserInfo.contraseña;
            }

            await parishService.updateParishAccountCredentials(updateData);

            setIsEditingAccount(false);
            setPasswordError("");
            setCurrentPassword("");
            setConfirmPassword("");
            await loadAccountData();

        } catch (err) {
            setPasswordError(err.message || 'Error al actualizar las credenciales');
            console.error('Error al guardar credenciales:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAccount = () => {
        setIsEditingAccount(false);
        setPasswordError("");
        setCurrentPassword("");
        setConfirmPassword("");
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

    // Handlers para las fotos (modificados para usar la URL de la preview)
    const handleFotoPerfilChange = (data) => {
        setFotoPerfilData(data); // data.preview ahora contiene la URL para mostrar
    };

    const handleFotoPortadaChange = (data) => {
        setFotoPortadaData(data); // data.preview ahora contiene la URL para mostrar
    };

    // Handlers para los colores
    const handleColorPrimarioChange = (colorData) => {
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            colorPrimario: colorData.hex
        }));
        console.log("Color primario seleccionado:", colorData);
    };

    const handleColorSecundarioChange = (colorData) => {
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            colorSecundario: colorData.hex
        }));
        console.log("Color secundario seleccionado:", colorData);
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de cuenta de parroquia</h2>

            <ExpandableContainer
                title='Información de la parroquia'
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
                        <TextInput label="Dirección" value={tempUserInfo.direccion} onChange={handleInputChange} name="direccion" />
                        <TextInput label="Coordenadas" value={tempUserInfo.coordenadas} onChange={handleInputChange} name="coordenadas" />
                        <TextInput label="Celular" value={tempUserInfo.celular} onChange={handleInputChange} name="celular" />
                        
                        <div className="color-input-container">
                            <InputColorPicker 
                                label="Color primario"
                                value={tempUserInfo.colorPrimario}
                                onChange={handleColorPrimarioChange}
                                placeholder="Ej: #DC2626"
                            />
                        </div>
                        
                        <div className="color-input-container">
                            <InputColorPicker 
                                label="Color secundario"
                                value={tempUserInfo.colorSecundario}
                                onChange={handleColorSecundarioChange}
                                placeholder="Ej: #2563EB"
                            />
                        </div>
                        
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
                        
                        <div className="foto-input-container">
                            <label className="foto-label">Foto portada:</label>
                            <InputFotoPerfil 
                                onChange={handleFotoPortadaChange}
                                value={fotoPortadaData ? fotoPortadaData.preview : null} // Pasar la URL de la preview
                                placeholder="Subir foto de portada de la parroquia"
                                maxSize={10 * 1024 * 1024} // 10MB para portada
                                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="info-item">
                            <span className="info-label">Nombres de Parroquia:</span>
                            <span className="info-value">{userInfo.nombres}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Dirección:</span>
                            <span className="info-value">{userInfo.direccion}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Coordenadas:</span>
                            <span className="info-value">{userInfo.coordenadas}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Celular:</span>
                            <span className="info-value">{userInfo.celular}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Color primario:</span>
                            <span className="info-value color-display">
                                <span 
                                    className="color-sample" 
                                    style={{ backgroundColor: userInfo.colorPrimario }}
                                ></span>
                                {userInfo.colorPrimario}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Color secundario:</span>
                            <span className="info-value color-display">
                                <span 
                                    className="color-sample" 
                                    style={{ backgroundColor: userInfo.colorSecundario }}
                                ></span>
                                {userInfo.colorSecundario}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Foto perfil:</span>
                            <span className="info-value">{userInfo.fotoPerfil}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Foto portada:</span>
                            <span className="info-value">{userInfo.fotoPortada}</span>
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
                        <TextInput 
                            label="Contraseña actual" 
                            placeholder='Contraseña actual (requerida)' 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            value={currentPassword} 
                            name="contraseñaActual" 
                            type='password' 
                        />
                        <TextInput label="Usuario" value={tempUserInfo.usuario} onChange={handleInputChange} name="usuario" />
                        <TextInput label="Correo" value={tempUserInfo.correo} onChange={handleInputChange} name="correo" />
                        <TextInput label="Nueva contraseña (opcional)" placeholder='Nueva contraseña' onChange={handleInputChange} name="contraseña" type='password' />
                        <TextInput label="Confirmar nueva contraseña" placeholder='Confirmar nueva contraseña' onChange={handleConfirmPasswordChange} value={confirmPassword} name="confirmarContraseña" type='password' />
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
                                    ********
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </ExpandableContainer>

            {loading && <div className="loading-message">Cargando...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default GestionCuenta;