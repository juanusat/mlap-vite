import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSession from './hooks/useSession';
import Home from './Home';

export default function Dashboard() {
  React.useEffect(() => {
    document.title = "MLAP | Bienvenida";
  }, []);
  const navigate = useNavigate();
  const { sessionData, loading, error } = useSession(() => navigate('/acceso'));

  if (loading) {
    return (
      <div className="mlap-login-container">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  if (!sessionData || !sessionData.context_type) {
    navigate('/comenzar');
    return null;
  }

  if (error === 'FORBIDDEN_CONTEXT_NOT_SET') {
    navigate('/comenzar');
    return null;
  }

  const mode = sessionData.context_type;
  const parish = sessionData.parish;
  const roles = sessionData.available_roles || [];
  const userFullName = sessionData.person?.full_name;

  switch (mode) {
    case 'PARISH':
      return <WorkerDashboard parish={parish} roles={roles} userFullName={userFullName} />;
    case 'PARISHIONER':
      return <ParishionerDashboard userFullName={userFullName} />;
    case 'DIOCESE':
      return <DioceseDashboard userFullName={userFullName} />;
    default:
      navigate('/comenzar');
      return null;
  }
}

function WorkerDashboard({ parish, roles, userFullName }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = async (roleId) => {
    const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';
    
    try {
      const resp = await fetch(`${API_BASE}/api/auth/select-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleId }),
      });

      if (resp.ok) {
        setSelectedRole(roles.find(role => role.id === roleId));
      }
    } catch (err) {
      console.error('Error al seleccionar rol:', err);
    }
  };

  if (roles.length === 1) {
    if (!selectedRole) {
      handleRoleSelection(roles[0].id);
    }
  }

  if (roles.length > 1 && !selectedRole) {
    return (
      <div className="mlap-login-container">
        <h3>Selecciona tu rol</h3>
        <p>Parroquia: {parish.name}</p>
        <div className="parroquias-list">
          {roles.map((role) => (
            <button
              key={role.id}
              className="parroquia-button"
              onClick={() => handleRoleSelection(role.id)}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <Home />;
}

function ParishionerDashboard({ userFullName }) {
  return <Home />;
}

function DioceseDashboard({ userFullName }) {
  return <Home />;
}