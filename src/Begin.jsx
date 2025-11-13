import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import './Begin.css';

export default function Begin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedParroquia, setSelectedParroquia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';

  const apiFetch = async (path, opts = {}) => {
    return fetch(`${API_BASE}${path}`, { credentials: 'include', ...opts });
  };

  const associationsFromState = location?.state?.associations || [];
  const userFullName = location?.state?.userFullName || null;
  const isDioceseUser = location?.state?.isDioceseUser || false;

  console.log('Begin - location.state:', location?.state);
  console.log('Begin - associationsFromState:', associationsFromState);
  console.log('Begin - userFullName:', userFullName);
  console.log('Begin - isDioceseUser:', isDioceseUser);

  const handleParishSelect = async (parish) => {
    setSelectedParroquia(parish);
    setError(null);
    setLoading(true);
    
    try {
      const resp = await apiFetch('/api/auth/select-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context_type: 'PARISH',
          parishId: parish.id 
        }),
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        setError(data?.message || data?.error || 'Error al seleccionar la parroquia');
        return;
      }

      const rolesResp = await apiFetch('/api/auth/roles');
      const rolesData = await rolesResp.json();
      
      if (!rolesResp.ok) {
        setError(rolesData?.message || rolesData?.error || 'Error al obtener los roles');
        return;
      }

      const roles = rolesData?.data || [];
      
      if (roles.length > 0) {
        const firstRoleId = roles[0].id;
        const selectRoleResp = await apiFetch('/api/auth/select-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleId: firstRoleId }),
        });
        
        if (!selectRoleResp.ok) {
          const selectRoleData = await selectRoleResp.json();
          setError(selectRoleData?.message || selectRoleData?.error || 'Error al seleccionar el rol');
          return;
        }

        const sessionResp = await apiFetch('/api/auth/session');
        const sessionData = await sessionResp.json();
        
        if (sessionResp.ok && sessionData.data?.permissions) {
          console.log('Permisos del rol activo:', sessionData.data.permissions);
        }
      }
      
      navigate('/inicio');
      
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleParishionerMode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const resp = await apiFetch('/api/auth/select-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context_type: 'PARISHIONER',
          parishId: null 
        }),
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        setError(data?.message || data?.error || 'Error al seleccionar modo feligrés');
        return;
      }
      
      navigate('/inicio', { state: { userFullName, mode: 'PARISHIONER' } });
      
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDioceseMode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const resp = await apiFetch('/api/auth/select-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context_type: 'DIOCESE'
        }),
      });
      
      const data = await resp.json();
      
      if (!resp.ok) {
        setError(data?.message || data?.error || 'Error al seleccionar modo diócesis');
        return;
      }
      
      navigate('/inicio', { state: { userFullName, mode: 'DIOCESE' } });
      
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mlap-login-container">
      <h3>Bienvenido a MLAP{userFullName ? `, ${userFullName}` : ''}</h3>
      <p>Por favor selecciona tu modo de acceso</p>
      
      {associationsFromState.length > 0 && (
        <div>
          <h4>Parroquias asociadas:</h4>
          <div className="parroquias-list">
            {associationsFromState.map((parish) => (
              <button
                key={`parish-${parish.id}`}
                className={`parroquia-button ${selectedParroquia?.id === parish.id ? 'selected' : ''}`}
                onClick={() => handleParishSelect(parish)}
                disabled={loading}
              >
                <strong>{parish.name}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4>Opciones de acceso:</h4>
        <div className="parroquias-list">
          <button 
            className="parroquia-button"
            onClick={handleParishionerMode}
            disabled={loading}
          >
            <strong>Entrar como feligrés</strong>
          </button>

          {isDioceseUser && (
            <button 
              className="parroquia-button"
              onClick={handleDioceseMode}
              disabled={loading}
            >
              <strong>Acceso diocesano</strong>
            </button>
          )}
        </div>
      </div>

      {loading && <div className="loading-message">Procesando selección...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}