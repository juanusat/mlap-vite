import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSession from '../hooks/useSession';

const getRequiredContextForRoute = (pathname) => {
  if (pathname.startsWith('/man-diocesis')) return ['DIOCESE'];
  if (pathname.startsWith('/man-reservas') || pathname.startsWith('/man-usuario')) return ['PARISHIONER', 'PARISH'];
  if (pathname.startsWith('/man-actos-liturgicos') || pathname.startsWith('/man-seguridad') || pathname.startsWith('/man-parroquia')) return ['PARISH'];
  return null;
};

export default function ProtectedRoute({ children }) {
  const { sessionData, loading } = useSession(() => {});
  const location = useLocation();

  if (loading) {
    return (
      <div className="mlap-login-container">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  if (!sessionData) {
    return <Navigate to="/acceso" replace />;
  }

  const requiredContext = getRequiredContextForRoute(location.pathname);
  
  if (requiredContext && sessionData.context_type) {
    const currentContext = sessionData.context_type;
    
    if (!requiredContext.includes(currentContext)) {
      return <Navigate to="/inicio" replace />;
    }
  }

  return children;
}