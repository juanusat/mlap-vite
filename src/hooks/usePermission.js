import { usePermissions } from '../contexts/PermissionsContext';

/**
 * Hook personalizado para verificar permisos del usuario
 * @returns {Function} hasPermission - Función que verifica si el usuario tiene un permiso específico
 */
export default function usePermission() {
  const { hasPermission } = usePermissions();
  return hasPermission;
}
