import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSession from './hooks/useSession';
import Home from './Home';

export default function Dashboard() {
  React.useEffect(() => {
    document.title = "MLAP | Bienvenida";
  }, []);
  const navigate = useNavigate();
  const { sessionData, loading } = useSession(() => navigate('/acceso'));

  if (loading || !sessionData) {
    return (
      <div className="mlap-login-container">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  const { mode, parish, roles, userFullName } = sessionData;

  switch (mode) {
    case 'worker':
      return <WorkerDashboard parish={parish} roles={roles} userFullName={userFullName} />;
    case 'parishioner':
      return <ParishionerDashboard userFullName={userFullName} />;
    case 'diocese':
      return <DioceseDashboard userFullName={userFullName} />;
    default:
      return <Home />;
  }
}

function WorkerDashboard({ parish, roles, userFullName }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = async (roleId) => {
    const API_BASE = import.meta.env.SERVER_BACKEND_URL || '';
    
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