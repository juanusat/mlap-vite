import React, {useState, useEffect} from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyButtonShortAction from '../components/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ExpandableContainer from '../components/Contenedor-Desplegable';
import InputFotoPerfil from '../components/inputFotoPerfil';
import InputColorPicker from '../components/inputColorPicker';
import MyModalGreatSize from '../components/MyModalGreatSize';
import MyMapSelector from '../components/MyMapSelector';
import NoPermissionMessage from '../components/NoPermissionMessage';
import * as parishService from '../services/parishService';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import '../utils/Parroquia-Cuenta-Gestionar.css';
import '../utils/permissions.css';

const GestionCuenta = () => {
    const { hasPermission, isParishAdmin } = usePermissions();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [userInfo, setUserInfo] = useState({
        nombres: "",
        direccion: "",
        coordenadas: "",
        celular: "",
        email: "",
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

    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);

    const canReadInfo = isParishAdmin || hasPermission(PERMISSIONS.PARROQUIA_INFO_R);
    const canUpdateInfo = isParishAdmin || hasPermission(PERMISSIONS.PARROQUIA_INFO_U);
    const canReadCredentials = isParishAdmin || hasPermission(PERMISSIONS.PARROQUIA_DATOS_CUENTA_R);
    const canUpdateCredentials = isParishAdmin || hasPermission(PERMISSIONS.PARROQUIA_DATOS_CUENTA_U);

    const parseCoordinates = (coordString) => {
        if (!coordString) return [0, 0];
        const parts = coordString.split(',').map(s => parseFloat(s.trim()));
        return parts.length === 2 ? parts : [0, 0];
    };

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
                email: info.email || "",
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

    useEffect(() => {
        document.title = "MLAP | Gestionar cuenta parroquia";
        if (canReadInfo || canReadCredentials) {
            loadAccountData();
        }
    }, [canReadInfo, canReadCredentials]);

    if (!canReadInfo && !canReadCredentials) {
        return <NoPermissionMessage message="No tienes permisos para acceder a la gestión de cuenta de la parroquia" />;
    }

    const handleEditPersonal = () => {
        if (!canUpdateInfo) return;
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
                email: tempUserInfo.email,
                primary_color: tempUserInfo.colorPrimario,
                secondary_color: tempUserInfo.colorSecundario
            };

            // Pasar el archivo completo, no solo el nombre
            if (fotoPerfilData && fotoPerfilData.file) {
                updateData.profile_photo = fotoPerfilData.file;
            }
            if (fotoPortadaData && fotoPortadaData.file) {
                updateData.cover_photo = fotoPortadaData.file;
            }

            await parishService.updateParishAccountInfo(updateData);
            
            setIsEditingPersonal(false);
            setFotoPerfilData(null);
            setFotoPortadaData(null);
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
        if (!canUpdateCredentials) return;
        setIsEditingAccount(true);
        setTempUserInfo(userInfo);
        setConfirmPassword("");
        setCurrentPassword("");
        setPasswordError("");
    };

    const handleSaveAccount = async () => {
        // Validar que se ingresó la contraseña actual
        if (!currentPassword) {
            setPasswordError("Debes ingresar tu contraseña actual para realizar cambios.");
            return;
        }

        // Si hay nueva contraseña, validar que cumpla requisitos mínimos
        if (tempUserInfo.contraseña) {
            if (tempUserInfo.contraseña.length < 6) {
                setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
                return;
            }
            
            // Validar que las contraseñas coincidan
            if (tempUserInfo.contraseña !== confirmPassword) {
                setPasswordError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
                return;
            }
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
        
        // Si se está modificando la contraseña, validar con confirmPassword
        if (name === 'contraseña' && confirmPassword && value !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
        } else if (name === 'contraseña' && confirmPassword && value === confirmPassword) {
            setPasswordError("");
        }
    };

    // Handler específico para el campo de confirmar contraseña
    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        
        // Mostrar alerta si las contraseñas son diferentes y ambos campos tienen contenido
        if (tempUserInfo.contraseña && newConfirmPassword && tempUserInfo.contraseña !== newConfirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
        } else {
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

    // Funciones para el modal del mapa
    const handleOpenMapModal = () => {
        setShowMapModal(true);
        // Si ya hay coordenadas, parsearlas para el centro inicial
        if (tempUserInfo.coordenadas) {
            const coords = parseCoordinates(tempUserInfo.coordenadas);
            setSelectedCoordinates({ lat: coords[0], lng: coords[1] });
        }
    };

    const handleCloseMapModal = () => {
        setShowMapModal(false);
        setSelectedCoordinates(null);
    };

    const handleMapClick = (coordinates) => {
        setSelectedCoordinates(coordinates);
    };

    const handleConfirmLocation = () => {
        if (selectedCoordinates) {
            const coordinates = `${selectedCoordinates.lat}, ${selectedCoordinates.lng}`;
            setTempUserInfo(prevInfo => ({
                ...prevInfo,
                coordenadas: coordinates
            }));
            handleCloseMapModal();
        }
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de cuenta de parroquia</h2>

            {canReadInfo && (
            <ExpandableContainer
                title='Información de la parroquia'
                type='edit'
                showDeleteButton="no"
                isEditing={isEditingPersonal}
                onEdit={handleEditPersonal}
                onSave={handleSavePersonal}
                onCancel={handleCancelPersonal}
                editButtonClassName={!canUpdateInfo ? 'action-denied' : ''}
            >
                {isEditingPersonal ? (
                    <>
                        <TextInput label="Nombres" value={tempUserInfo.nombres} onChange={handleInputChange} name="nombres" />
                        <TextInput label="Dirección" value={tempUserInfo.direccion} onChange={handleInputChange} name="direccion" />
                        
                        <div className="coordinates-input-container">
                            <TextInput 
                                label="Coordenadas" 
                                value={tempUserInfo.coordenadas} 
                                onChange={handleInputChange} 
                                name="coordenadas"
                                placeholder="Use el botón para seleccionar ubicación"
                                disabled={true}
                            />
                            <button 
                                className="btn-select-location" 
                                type="button"
                                onClick={handleOpenMapModal}
                            >
                                <FaMapMarkedAlt /> Seleccionar ubicación
                            </button>
                        </div>
                        <p className="info-message" style={{ marginTop: '-10px', marginBottom: '10px', color: 'var(--color-n-500)', fontSize: '13px' }}>
                            ℹ️ Las coordenadas deben seleccionarse mediante el botón "Seleccionar ubicación"
                        </p>
                        
                        <TextInput label="Celular" value={tempUserInfo.celular} onChange={handleInputChange} name="celular" />
                        <TextInput 
                            label="Email" 
                            value={tempUserInfo.email} 
                            onChange={handleInputChange} 
                            name="email" 
                            type="email" 
                            placeholder="correo@ejemplo.com"
                        />
                        
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
                            <span className="info-label">Email:</span>
                            <span className="info-value">{userInfo.email}</span>
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
            )}

            {canReadCredentials && (
            <ExpandableContainer
                title='Datos de la cuenta'
                type='edit'
                showDeleteButton="no"
                isEditing={isEditingAccount}
                onEdit={handleEditAccount}
                onSave={handleSaveAccount}
                onCancel={handleCancelAccount}
                editButtonClassName={!canUpdateCredentials ? 'action-denied' : ''}
            >
                {isEditingAccount ? (
                    <>
                        <TextInput label="Usuario" value={tempUserInfo.usuario} onChange={handleInputChange} name="usuario" />
                        <TextInput 
                            label="Correo" 
                            value={tempUserInfo.correo} 
                            onChange={handleInputChange} 
                            name="correo"
                            disabled={true}
                        />
                        <p className="info-message" style={{ marginTop: '-10px', marginBottom: '10px', color: 'var(--color-n-500)', fontSize: '13px' }}>
                            ℹ️ El correo de la cuenta no puede ser modificado
                        </p>
                        <TextInput 
                            label="Contraseña actual" 
                            placeholder='Contraseña actual (requerida)' 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            value={currentPassword} 
                            name="contraseñaActual" 
                            type='password' 
                        />
                        <TextInput 
                            label="Nueva contraseña (opcional)" 
                            placeholder='Nueva contraseña (mínimo 6 caracteres)' 
                            onChange={handleInputChange} 
                            value={tempUserInfo.contraseña || ''} 
                            name="contraseña" 
                            type='password' 
                        />
                        <TextInput 
                            label="Confirmar nueva contraseña" 
                            placeholder='Confirmar nueva contraseña' 
                            onChange={handleConfirmPasswordChange} 
                            value={confirmPassword} 
                            name="confirmarContraseña" 
                            type='password' 
                        />
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
            )}

            {loading && <div className="loading-message">Cargando...</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Modal para seleccionar ubicación en el mapa */}
            <MyModalGreatSize
                open={showMapModal}
                title="Seleccionar Ubicación de la Parroquia"
                onClose={handleCloseMapModal}
            >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <MyMapSelector
                            onMapClick={handleMapClick}
                            selectedCoordinates={selectedCoordinates}
                            initialCenter={
                                tempUserInfo.coordenadas 
                                    ? parseCoordinates(tempUserInfo.coordenadas) 
                                    : [-6.77, -79.84]
                            }
                            initialZoom={13}
                        />
                    </div>
                    <div style={{ 
                        padding: '1rem 2rem', 
                        borderTop: '1px solid var(--color-n-50)', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--color-n-0)'
                    }}>
                        <div>
                            {selectedCoordinates ? (
                                <p style={{ margin: 0, fontSize: 'var(--font-size-body)' }}>
                                    <strong>Coordenadas seleccionadas:</strong>
                                    <br />
                                    Latitud: {selectedCoordinates.lat}, Longitud: {selectedCoordinates.lng}
                                </p>
                            ) : (
                                <p style={{ margin: 0, color: 'var(--color-n-500)' }}>
                                    Haz clic en cualquier punto del mapa para seleccionar la ubicación
                                </p>
                            )}
                        </div>
                        <button
                            className="btn-confirm-location"
                            onClick={handleConfirmLocation}
                            disabled={!selectedCoordinates}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: selectedCoordinates ? 'var(--color-a-350)' : 'var(--color-n-200)',
                                color: 'var(--color-n-0)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: selectedCoordinates ? 'pointer' : 'not-allowed',
                                fontWeight: 'bold',
                                fontSize: 'var(--font-size-body)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Confirmar ubicación
                        </button>
                    </div>
                </div>
            </MyModalGreatSize>
        </div>
    );
};

export default GestionCuenta;