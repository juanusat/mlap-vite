import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import Modal from './components/Modal';
import ForgotPassword from './screensMans/ForgotPassword';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';

  React.useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const apiFetch = async (path, opts = {}) => {
    return fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Ingrese datos');
      return;
    }
    
    // Validar formato del correo: 4-50 caracteres + @ + 2-8 caracteres + . + 2-8 caracteres (+ . + 2-8 caracteres opcional)
    const emailRegex = /^[a-zA-Z0-9._-]{1,50}@[a-zA-Z0-9-]{2,8}\.[a-zA-Z]{2,8}(\.[a-zA-Z]{2,8})?$/;
    if (!emailRegex.test(email.trim())) {
      setError('El formato del correo no es válido');
      return;
    }
    
    setLoading(true);
    try {
      const resp = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      console.log('Login frontend - full response:', data);

      if (!resp.ok) {
        setError(data?.message || data?.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      const userInfo = data?.data?.user_info || {};
      const associations = data?.data?.parish_associations || [];
      const userFullName = userInfo?.full_name || null;
      const isDioceseUser = data?.data?.is_diocese_user || false;

      console.log('Login frontend - associations:', associations);
      console.log('Login frontend - userFullName:', userFullName);
      console.log('Login frontend - isDioceseUser:', isDioceseUser);

      navigate('/comenzar', {
        state: {
          associations,
          userFullName,
          isDioceseUser
        }
      });
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    navigate('/registro');
  };

  const handleOpenForgotPasswordModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="mlap-login-container">
      <img src={logo} alt="mlap Logo" className="mlap-login-logo" />
      <h2 className="mlap-login-subtitle">MLAP</h2>
      <form className="mlap-login-form" onSubmit={handleLoginSubmit}>
        <InputField
          type="text"
          placeholder="correo@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <MainButton type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</MainButton>
      </form>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="mlap-login-links">
        <a
          href=""
          className="mlap-login-link"
          onClick={(e) => {
            e.preventDefault();
            handleOpenForgotPasswordModal();
          }}
        >
          ¿Olvidaste tu contraseña?
        </a>
        <form className="mlap-login-form" onSubmit={handleRegisterSubmit}>
          <SecondaryButton>Crear cuenta</SecondaryButton>
        </form>

      </div>
      <hr className="mlap-login-divider" />

      <Modal
        show={isModalVisible}
        onClose={handleCloseModal}
        title="Restablecer contraseña"
      >
        <ForgotPassword onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}