import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import Modal from './components2/Modal';
import ForgotPassword from './screensMans/ForgotPassword';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || '';

  const apiFetch = async (path, opts = {}) => {
    return fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await apiFetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        // backend may return message or error
        setError(data?.message || data?.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      // expected data.data.associations and data.data.user_name_full
      const associations = data?.data?.associations || [];
      const userFullName = data?.data?.user_name_full || null;

      // navigate to comenzar and pass associations (parishes) and user name
      navigate('/comenzar', { state: { associations, userFullName } });
    } catch (err) {
      console.error(err);
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
          placeholder="user@mlap.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <MainButton type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</MainButton>
      </form>
      {error && <div style={{ color: 'var(--danger, #c00)', marginTop: 8 }}>{error}</div>}
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
      <p className="mlap-login-info">
        Bienvenido. Este acceso está reservado únicamente para el personal de la Parroquia. Si desea solicitar un acto litúrgico o consultar información, por favor <b>diríjase a nuestro sitio web principal.</b>
      </p>

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