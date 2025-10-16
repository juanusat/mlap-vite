import React from 'react';
import { Navigate } from 'react-router-dom';
import useSession from '../hooks/useSession';

export default function ProtectedRoute({ children }) {
  const { sessionData, loading } = useSession(() => {});

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

  return children;
}