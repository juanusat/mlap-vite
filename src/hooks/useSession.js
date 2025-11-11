import { useState, useEffect, useCallback, useRef } from 'react';
import { getSessionInfo, changeCurrentRole, changeParishContext } from '../utils/authAPI';
import { usePermissions } from '../contexts/PermissionsContext';

export const useSession = (onUnauthorized) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const onUnauthorizedRef = useRef(onUnauthorized);
  const { setPermissions } = usePermissions();

  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSessionInfo();
      setSessionData(data);
      
      console.log('\n=== FRONTEND: useSession - fetchSession ===');
      console.log('Datos de sesión recibidos:', data);
      console.log('¿Es administrador de parroquia?:', data?.is_parish_admin);
      console.log('Rol actual:', data?.current_role);
      
      // Cargar permisos en el contexto
      if (data?.permissions) {
        console.log(`✅ Permisos recibidos del backend: ${data.permissions.length}`);
        console.log('Primeros 10 permisos:', data.permissions.slice(0, 10));
        setPermissions(data.permissions);
      } else {
        console.log('⚠️ NO hay permisos en la respuesta - estableciendo array vacío');
        setPermissions([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error al obtener información de sesión:', err);
      if (err.message === 'UNAUTHORIZED') {
        if (onUnauthorizedRef.current) {
          onUnauthorizedRef.current();
        }
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setPermissions]);

  const changeRole = useCallback(async (roleId) => {
    try {
      await changeCurrentRole(roleId);
      fetchSession();
    } catch (err) {
      console.error('Error al cambiar rol:', err);
      if (err.message === 'UNAUTHORIZED' && onUnauthorizedRef.current) {
        onUnauthorizedRef.current();
      } else {
        setError(`Error al cambiar rol: ${err.message}`);
      }
      throw err;
    }
  }, [fetchSession]);

  const changeParish = useCallback(async (parishId) => {
    try {
      await changeParishContext(parishId);
      fetchSession();
    } catch (err) {
      console.error('Error al cambiar parroquia:', err);
      if (err.message === 'UNAUTHORIZED' && onUnauthorizedRef.current) {
        onUnauthorizedRef.current();
      } else {
        setError(`Error al cambiar parroquia: ${err.message}`);
      }
      throw err;
    }
  }, [fetchSession]);

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    sessionData,
    loading,
    error,
    refetch: fetchSession,
    changeRole,
    changeParish,
    clearError: () => setError(null),
  };
};

export default useSession;