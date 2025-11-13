import React from 'react';
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

  return <Home />;
}