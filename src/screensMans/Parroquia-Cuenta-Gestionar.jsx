import React, {useState} from 'react';
import MyGroupButtonsActions from '../components2/MyGroupButtonsActions';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import TextInput from '../components/formsUI/TextInput';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import ExpandableContainer from '../components2/Contenedor-Desplegable';
import InputFotoPerfil from '../components2/inputFotoPerfil';
import InputColorPicker from '../components2/inputColorPicker';
import '../utils/Parroquia-Cuenta-Gestionar.css';

const GestionCuenta = () => {
    // Estado para la información del usuario
    const [userInfo, setUserInfo] = useState({
        nombres: "Parroquia Nuestra Señora de la Consolación",
        direccion: "Algarrobos 222, Chiclayo 14008",
        coordenadas: "-6.781771909288489, -79.84091136201245",
        celular: "999888777",
        colorPrimario: "#DC2626", // Rojo
        colorSecundario: "#2563EB", // Azul
        fotoPerfil: "iglesia.jpg", // Aquí podrías poner una URL de imagen si tienes una
        fotoPortada: "iglesia_portada.jpg", // Aquí podrías poner una URL de imagen si tienes una
        usuario: "conso",
        correo: "consolacion@parroquia.com",
        contraseña: "password123"
    });

    // Estados para los datos de las fotos
    const [fotoPerfilData, setFotoPerfilData] = useState(null);
    const [fotoPortadaData, setFotoPortadaData] = useState(null);

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
        setTempUserInfo(userInfo);
        // Limpiar los datos de fotos al empezar a editar
        setFotoPerfilData(null);
        setFotoPortadaData(null);
    };

    const handleSavePersonal = () => {
        setIsEditingPersonal(false);
        // Actualizar userInfo con los datos de las fotos si están disponibles
        const updatedUserInfo = { ...tempUserInfo };
        if (fotoPerfilData) {
            updatedUserInfo.fotoPerfil = fotoPerfilData.name;
        }
        if (fotoPortadaData) {
            updatedUserInfo.fotoPortada = fotoPortadaData.name;
        }
        setUserInfo(updatedUserInfo);
        console.log("Datos personales guardados:", updatedUserInfo);
        console.log("Archivo foto perfil:", fotoPerfilData);
        console.log("Archivo foto portada:", fotoPortadaData);
        console.log("Color primario:", updatedUserInfo.colorPrimario);
        console.log("Color secundario:", updatedUserInfo.colorSecundario);
    };

    const handleCancelPersonal = () => {
        setIsEditingPersonal(false);
        // Limpiar los datos de fotos al cancelar
        setFotoPerfilData(null);
        setFotoPortadaData(null);
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

    // Handlers para las fotos
    const handleFotoPerfilChange = (data) => {
        setFotoPerfilData(data);
        // Actualizar también el tempUserInfo con el nombre del archivo
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            fotoPerfil: data ? data.name : ""
        }));
        console.log("Foto de perfil seleccionada:", data);
    };

    const handleFotoPortadaChange = (data) => {
        setFotoPortadaData(data);
        // Actualizar también el tempUserInfo con el nombre del archivo
        setTempUserInfo(prevInfo => ({
            ...prevInfo,
            fotoPortada: data ? data.name : ""
        }));
        console.log("Foto de portada seleccionada:", data);
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
            <h2 className='title-screen'>Gestión de Cuenta de Parroquia</h2>

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
                                label="Color Primario"
                                value={tempUserInfo.colorPrimario}
                                onChange={handleColorPrimarioChange}
                                placeholder="Ej: #DC2626"
                                presetColors={[
                                    '#DC2626', '#EF4444', '#F87171', '#FCA5A5',
                                    '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD',
                                    '#059669', '#10B981', '#34D399', '#6EE7B7',
                                    '#D97706', '#F59E0B', '#FBBF24', '#FDE047',
                                    '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
                                    '#BE185D', '#EC4899', '#F472B6', '#F9A8D4'
                                ]}
                            />
                        </div>
                        
                        <div className="color-input-container">
                            <InputColorPicker 
                                label="Color Secundario"
                                value={tempUserInfo.colorSecundario}
                                onChange={handleColorSecundarioChange}
                                placeholder="Ej: #2563EB"
                                presetColors={[
                                    '#DC2626', '#EF4444', '#F87171', '#FCA5A5',
                                    '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD',
                                    '#059669', '#10B981', '#34D399', '#6EE7B7',
                                    '#D97706', '#F59E0B', '#FBBF24', '#FDE047',
                                    '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
                                    '#BE185D', '#EC4899', '#F472B6', '#F9A8D4'
                                ]}
                            />
                        </div>
                        
                        <div className="foto-input-container">
                            <label className="foto-label">Foto Perfil:</label>
                            <InputFotoPerfil 
                                onChange={handleFotoPerfilChange}
                                placeholder="Subir foto de perfil de la parroquia"
                                maxSize={5 * 1024 * 1024} // 5MB
                                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                            />
                        </div>
                        
                        <div className="foto-input-container">
                            <label className="foto-label">Foto Portada:</label>
                            <InputFotoPerfil 
                                onChange={handleFotoPortadaChange}
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
                            <span className="info-label">Color Primario:</span>
                            <span className="info-value color-display">
                                <span 
                                    className="color-sample" 
                                    style={{ backgroundColor: userInfo.colorPrimario }}
                                ></span>
                                {userInfo.colorPrimario}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Color Secundario:</span>
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
                        <TextInput label="Nueva Contraseña" placeholder='Nueva contraseña' onChange={handleInputChange} name="contraseña" type='password' />
                        <TextInput label="Confirmar Contraseña" placeholder='Confirmar nueva contraseña' onChange={handleConfirmPasswordChange} value={confirmPassword} name="confirmarContraseña" type='password' />
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

