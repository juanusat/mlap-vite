import { useState, useEffect, useCallback, useRef } from 'react';
import { getSessionInfo, changeCurrentRole, changeParishContext } from '../utils/authAPI';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const useSession = (onUnauthorized) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const onUnauthorizedRef = useRef(onUnauthorized);
  const socketRef = useRef(null);

  useEffect(() => {
    onUnauthorizedRef.current = onUnauthorized;
  }, [onUnauthorized]);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSessionInfo();

      if (data.force_logout) {
        alert(data.logout_reason || 'Tu sesión ha sido cerrada por el administrador.');
        if (onUnauthorizedRef.current) {
          onUnauthorizedRef.current();
        }
        return;
      }

      setSessionData(data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener información de sesión:', err);
      if (err.message === 'UNAUTHORIZED') {
        if (onUnauthorizedRef.current) {
          onUnauthorizedRef.current();
        }
        return;
      }
      if (err.message === 'FORBIDDEN_CONTEXT_NOT_SET') {
        setError('FORBIDDEN_CONTEXT_NOT_SET');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (sessionData?.id) {
      if (!socketRef.current) {
        socketRef.current = io(API_URL, {
          withCredentials: true,
        });

        socketRef.current.on('connect', () => {
          console.log('Connected to WebSocket');
        });

        socketRef.current.on(`session_update_${sessionData.id}`, (data) => {
          console.log('Session update received:', data);
          fetchSession();
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [sessionData?.id, fetchSession]);

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