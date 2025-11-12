import { useMemo } from 'react';
import useSession from './useSession';

export const usePermissions = () => {
  const { sessionData } = useSession();

  const permissions = useMemo(() => {
    if (!sessionData) return [];
    return sessionData.permissions || [];
  }, [sessionData]);

  const hasPermission = (permission) => {
    if (!sessionData) return false;
    if (sessionData.is_parish_admin) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    if (!sessionData) return false;
    if (sessionData.is_parish_admin) return true;
    return permissionList.some(perm => permissions.includes(perm));
  };

  const hasAllPermissions = (permissionList) => {
    if (!sessionData) return false;
    if (sessionData.is_parish_admin) return true;
    return permissionList.every(perm => permissions.includes(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isParishAdmin: sessionData?.is_parish_admin || false
  };
};

export default usePermissions;
