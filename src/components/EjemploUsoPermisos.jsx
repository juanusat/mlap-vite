import React from 'react';
import usePermissions from '../hooks/usePermissions';
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/permissions';

export default function EjemploUsoPermisos() {
  const { hasPermission, hasAnyPermission, isParishAdmin } = usePermissions();

  const handleCrearActo = () => {
    if (!hasPermission(PERMISSIONS.ACTOS_LITURGICOS_ACTOS_C)) {
      alert('No tienes permiso para crear actos litúrgicos');
      return;
    }
  };

  const handleActualizar = () => {
    if (!hasAnyPermission([
      PERMISSIONS.ACTOS_LITURGICOS_ACTOS_U,
      PERMISSIONS.ESTADO_ACTOS_LITURGICOS_U
    ])) {
      alert('No tienes permiso para actualizar');
      return;
    }
  };

  return (
    <div>
      <PermissionGuard permission={PERMISSIONS.ACTOS_LITURGICOS_ACTOS_C}>
        <button onClick={handleCrearActo}>Crear Acto</button>
      </PermissionGuard>

      <PermissionGuard 
        permissions={[
          PERMISSIONS.ACTOS_LITURGICOS_ACTOS_U,
          PERMISSIONS.ESTADO_ACTOS_LITURGICOS_U
        ]}
      >
        <button onClick={handleActualizar}>Actualizar</button>
      </PermissionGuard>

      <PermissionGuard 
        permission={PERMISSIONS.ACTOS_LITURGICOS_ACTOS_D}
        fallback={<span>No tienes permisos para eliminar</span>}
      >
        <button>Eliminar</button>
      </PermissionGuard>

      {isParishAdmin && (
        <div>Eres administrador de la parroquia</div>
      )}
    </div>
  );
}
