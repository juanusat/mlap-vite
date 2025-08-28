import React from 'react';
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="mlap-login-container">
      <img src={logo} alt="mlap Logo" className="mlap-login-logo" />
      <h2 className="mlap-login-subtitle">MLAP</h2>
      <form className="mlap-login-form" onSubmit={handleSubmit}>
        <InputField type="text" placeholder="user@mlap.com" />
        <InputField type="password" placeholder="password" />
        <MainButton type="submit">Iniciar sesión</MainButton>
      </form>
      <div className="mlap-login-links">
        <a href="#" className="mlap-login-link">¿Olvidaste tu contraseña?</a>
        <SecondaryButton>Crear Cuenta</SecondaryButton>
      </div>
      <hr className="mlap-login-divider" />
      <p className="mlap-login-info">
        Bienvenido. Este acceso está reservado únicamente para el personal de la Parroquia. Si desea solicitar un acto litúrgico o consultar información, por favor <b>diríjase a nuestro sitio web principal.</b>
      </p>
    </div>
  );
}
