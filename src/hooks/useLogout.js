import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.SERVER_BACKEND_URL || '';

  const logout = async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (resp.ok) {
        navigate('/acceso');
      } else {
        console.error('Error al cerrar sesión');
        navigate('/acceso');
      }
    } catch (err) {
      console.error('Error de conexión al cerrar sesión:', err);
      navigate('/acceso');
    }
  };

  return logout;
}