import React from 'react';
import usePermissions from '../hooks/usePermissions';

export const PermissionGuard = ({ 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions) 
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;
