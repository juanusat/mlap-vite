import React, { useState } from "react";
import { InputField, MainButton, SecondaryButton } from './components/UI';
import logo from './assets/logo-mlap-color.svg';
import './App.css';
import './colors.css';
import './Begin.css';
import Modal from './components2/Modal';
import ForgotPassword from './screensMans/ForgotPassword';
import { useNavigate, useLocation } from 'react-router-dom';
import Home from './components/MyHeaderAdm.jsx';

export default function Begin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedParroquia, setSelectedParroquia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || '';

  const apiFetch = async (path, opts = {}) => {
    return fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  };

  // Try to get associations from navigation state (passed from Login)
  const associationsFromState = location?.state?.associations || null;
  const userFullName = location?.state?.userFullName || null;

  // Lista de parroquias: prefer associations from server, fallback to static list
  const parroquias = associationsFromState && associationsFromState.length > 0
    ? associationsFromState.map(a => ({ id: a.id, nombre: a.name }))
    : [
      { id: 1, nombre: "Parroquia San Miguel Arcángel" },
      { id: 2, nombre: "Parroquia Nuestra Señora de Guadalupe" },
      { id: 3, nombre: "Parroquia San José" },
    ];


  const handleParroquiaSelect = (parroquia) => {
    setSelectedParroquia(parroquia);
    setError(null);
    // Call API to select parish (backend will set cookie with parishId)
    (async () => {
      setLoading(true);
      try {
        const resp = await apiFetch('/api/account/select-parish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parishId: parroquia.id }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          setError(data?.message || data?.error || 'Error al seleccionar la parroquia');
          setLoading(false);
          return;
        }

        // Backend returns roles in data.data.roles
        const roles = data?.data?.roles || [];
        // Navigate to main page with selected parish and roles
        navigate('/inicio', { state: { parish: parroquia, roles, userFullName } });
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="mlap-login-container">
      <h3>Bienvenido a MLAP{userFullName ? `, ${userFullName}` : ''}</h3>
      <p>Por favor selecciona la parroquia a la que deseas acceder</p>
      
      {/* Lista de botones de parroquias */}
      <div className="parroquias-list">
        {parroquias.map((parroquia) => (
          <button
            key={parroquia.id}
            className={`parroquia-button ${selectedParroquia?.id === parroquia.id ? 'selected' : ''}`}
            onClick={() => handleParroquiaSelect(parroquia)}
          >
            {parroquia.nombre}
          </button>
        ))}
      </div>
      {loading && <div style={{ marginTop: 8 }}>Procesando selección...</div>}
      {error && <div style={{ color: 'var(--danger, #c00)', marginTop: 8 }}>{error}</div>}

      
    </div>
    
  );
}