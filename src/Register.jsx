import React, { useState, useEffect } from "react";
import { InputField, MainButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_names: '',
    paternal_surname: '',
    maternal_surname: '',
    email: '',
    document_type_id: '',
    document: '',
    username: '',
    password: '',
    confirmarContrasena: '',
  });

  const [documentTypes, setDocumentTypes] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';

  const apiFetch = async (path, opts = {}) => {
    return fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  };

  useEffect(() => {
    const mockDocumentTypes = [
      { id: 1, name: 'DNI' },
      { id: 2, name: 'C.E.' },
      { id: 3, name: 'Pasaporte' }
    ];
    setDocumentTypes(mockDocumentTypes);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'confirmarContrasena' || name === 'password') {
      if (name === 'password' && value !== formData.confirmarContrasena && formData.confirmarContrasena !== '') {
        setPasswordError('Las contraseñas no coinciden.');
      } else if (name === 'confirmarContrasena' && value !== formData.password) {
        setPasswordError('Las contraseñas no coinciden.');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    if (formData.password !== formData.confirmarContrasena) {
      setPasswordError('Las contraseñas no coinciden. Por favor, verifícalas.');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        first_names: formData.first_names,
        paternal_surname: formData.paternal_surname,
        maternal_surname: formData.maternal_surname,
        email: formData.email,
        document_type_id: parseInt(formData.document_type_id),
        document: formData.document,
        username: formData.username,
        password: formData.password,
      };

      const resp = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.message || data?.error || 'Error al crear la cuenta');
        return;
      }

      navigate('/acceso', { 
        state: { 
          message: 'Cuenta creada exitosamente. Puedes iniciar sesión.' 
        } 
      });

    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
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
          name="first_names"
          type="text"
          placeholder="Nombres"
          value={formData.first_names}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="paternal_surname"
          type="text"
          placeholder="Apellido paterno"
          value={formData.paternal_surname}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="maternal_surname"
          type="text"
          placeholder="Apellido materno"
          value={formData.maternal_surname}
          onChange={handleInputChange}
        />
        
        <InputField
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <div className="mlap-document-container">
          <select
            name="document_type_id"
            value={formData.document_type_id}
            onChange={handleInputChange}
            className="mlap-select"
            required
          >
            <option value="">Tipo de documento</option>
            {documentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          
          <InputField
            name="document"
            type="text"
            placeholder="Número de documento"
            value={formData.document}
            onChange={handleInputChange}
            disabled={!formData.document_type_id}
            required
          />
        </div>
        
        <InputField
          name="username"
          type="text"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
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
          <p className="error-message">{passwordError}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        <MainButton type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </MainButton>
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
