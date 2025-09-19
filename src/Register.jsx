import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import Modal from './components2/Modal';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    tipoDocumento: '',
    numeroDocumento: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'confirmarContrasena' || name === 'contrasena') {
      if (name === 'contrasena' && value !== formData.confirmarContrasena && formData.confirmarContrasena !== '') {
        setPasswordError('Las contrasenas no coinciden.');
      } else if (name === 'confirmarContrasena' && value !== formData.contrasena) {
        setPasswordError('Las contrasenas no coinciden.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    if (formData.contrasena !== formData.confirmarContrasena) {
      setPasswordError('Las contrasenas no coinciden. Por favor, verifícalas.');
      return;
    }
    setPasswordError('');
    console.log('Datos de registro:', formData);
    setShowSuccessModal(true);
  };

  const handleLoginRedirect = () => {
    navigate('/acceso');
  };

  

  return (
    <div className="mlap-login-container">
      <img src={logo} alt="MLAP Logo" className="mlap-login-logo" />
      <h2 className="mlap-login-subtitle">Crear cuenta</h2>
      <p className="mlap-login-info-text">Únete a la comunidad de MLAP</p>
      
      <form className="mlap-login-form" onSubmit={handleRegistrationSubmit}>
        <InputField
          name="nombres"
          type="text"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="apellidoPaterno"
          type="text"
          placeholder="Apellido paterno"
          value={formData.apellidoPaterno}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="apellidoMaterno"
          type="text"
          placeholder="Apellido materno"
          value={formData.apellidoMaterno}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleInputChange}
          required
        />

        <div className="mlap-document-container">
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleInputChange}
            className="mlap-select"
            required
          >
            <option value="TIPO DE DOCUMENTO">Tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="CE">C.E.</option>
            <option value="PASSPORT">Pasaporte</option>
          </select>
          
          <InputField
            name="numeroDocumento"
            type="text"
            placeholder="Número de documento"
            value={formData.numeroDocumento}
            onChange={handleInputChange}
            disabled={!formData.tipoDocumento}
            required
          />
        </div>
        
        <InputField
          name="usuario"
          type="text"
          placeholder="Usuario"
          value={formData.usuario}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="confirmarContrasena"
          type="password"
          placeholder="Confirmar contraseña"
          value={formData.confirmarContrasena}
          onChange={handleInputChange}
          required
        />
        
        {passwordError && (
          <p className="mlap-error-message">{passwordError}</p>
        )}

        <MainButton type="submit" onClick={e => {handleLoginRedirect();}}>Registrarse</MainButton>
      </form>
      
      <div className="mlap-login-links">
        <a
          href=""
          className="mlap-login-link"
          onClick={(e) => {
            e.preventDefault();
            handleLoginRedirect();
          }}
        >
          ¿Ya tienes una cuenta? Iniciar sesión
        </a>
      </div>
      
      

      
    </div>
  );
}
