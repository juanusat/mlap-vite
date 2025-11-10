import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSession from '../hooks/useSession';
import usePermissions from '../hooks/usePermissions';
import { PERMISSION_GROUPS } from '../utils/permissions';

const getRequiredContextForRoute = (pathname) => {
  if (pathname.startsWith('/man-diocesis')) return ['DIOCESE'];
  if (pathname.startsWith('/man-reservas') || pathname.startsWith('/man-usuario')) return ['PARISHIONER', 'PARISH'];
  if (pathname.startsWith('/man-actos-liturgicos') || pathname.startsWith('/man-seguridad') || pathname.startsWith('/man-parroquia')) return ['PARISH'];
  return null;
};

const getRequiredPermissionsForRoute = (pathname) => {
  if (pathname.includes('gestionar-actos')) return PERMISSION_GROUPS.ACTOS_LITURGICOS_ACTOS;
  if (pathname.includes('gestionar-requisitos') && pathname.includes('actos-liturgicos')) return PERMISSION_GROUPS.ACTOS_LITURGICOS_REQUISITOS;
  if (pathname.includes('gestionar-horarios')) return PERMISSION_GROUPS.ACTOS_LITURGICOS_HORARIOS;
  if (pathname.includes('gestionar-reservas')) return PERMISSION_GROUPS.ACTOS_LITURGICOS_RESERVAS;
  
  if (pathname.includes('cuentas-gestionar')) return PERMISSION_GROUPS.SEGURIDAD_CUENTAS;
  if (pathname.includes('roles-gestionar')) return PERMISSION_GROUPS.SEGURIDAD_ROLES;
  
  if (pathname.includes('gestionar-cuenta') && pathname.includes('parroquia')) return PERMISSION_GROUPS.PARROQUIA_INFO;
  if (pathname.includes('gestionar-capilla')) return PERMISSION_GROUPS.PARROQUIA_CAPILLA;
  
  return null;
};

export default function ProtectedRoute({ children }) {
  const { sessionData, loading } = useSession(() => {});
  const { hasAnyPermission, isParishAdmin } = usePermissions();
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

  if (sessionData.context_type === 'PARISH') {
    const requiredPermissions = getRequiredPermissionsForRoute(location.pathname);
    
    if (requiredPermissions && !isParishAdmin) {
      const hasAccess = hasAnyPermission(requiredPermissions);
      
      if (!hasAccess) {
        return <Navigate to="/inicio" replace />;
      }
    }
  }

  return children;
}