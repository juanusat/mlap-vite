import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdNotificationsNone, MdClose, MdArrowForward, MdLogout } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';
import NotificationModal from './NotificationModal';
import useLogout from '../hooks/useLogout';
import useSession from '../hooks/useSession';
import * as notificationService from '../services/notificationService';
import { getUnreadCount } from '../services/notificationService';

const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export default function MyHeaderAdm({ onMenuToggle, isMenuOpen }) {
  const navigate = useNavigate();
  const logout = useLogout();
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  const { sessionData, loading, error, refetch, changeRole, clearError } = useSession(logout);

  const handleRolSelect = async (rol) => {
    try {
      console.log(`Cambiando rol a: ${rol.name} en parroquia: ${sessionData?.parish?.name}`);
      await changeRole(rol.id);

      await refetch();

      const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';
      const sessionResp = await fetch(`${API_BASE}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
      });

      if (sessionResp.ok) {
        const sessionResult = await sessionResp.json();

        if (sessionResult.data?.force_logout) {
          alert(sessionResult.data.logout_reason || 'Tu sesión ha sido cerrada por el administrador.');
          logout();
          return;
        }

        if (sessionResult.data?.permissions) {
          console.log('Permisos del rol activo:', sessionResult.data.permissions);
        }
      }

      setPerfilModalOpen(false);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };

  const handleOpenPerfilModal = async () => {
    setPerfilModalOpen(true);

    try {
      const API_BASE = import.meta.env.VITE_SERVER_BACKEND_URL || '';
      const sessionResp = await fetch(`${API_BASE}/api/auth/session`, {
        method: 'GET',
        credentials: 'include',
      });

      if (sessionResp.ok) {
        const sessionResult = await sessionResp.json();

        if (sessionResult.data?.force_logout) {
          alert(sessionResult.data.logout_reason || 'Tu sesión ha sido cerrada por el administrador.');
          logout();
          return;
        }

        if (sessionResult.data?.permissions) {
          const permisos = (sessionResult.data.is_diocese_user || sessionResult.data.is_parish_admin)
            ? ['ALL']
            : Array.isArray(sessionResult.data.permissions)
              ? sessionResult.data.permissions
              : [sessionResult.data.permissions];

          console.log('Permisos activos:', permisos);
        }
      }
    } catch (error) {
      console.error('Error al recargar permisos:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getProfilePhotoUrl = (photoFilename, personData) => {
    // Si no hay foto, generar avatar con iniciales
    if (!photoFilename) {
      const name = personData?.full_name || 'Usuario';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=200`;
    }
    // Si es una URL completa, usarla directamente
    if (photoFilename.startsWith('http://') || photoFilename.startsWith('https://')) {
      return photoFilename;
    }
    // Si es un nombre de archivo, construir la URL completa
    return `${API_URL}/api/static/uploads/${photoFilename}`;
  };

  useEffect(() => {
    if (notificacionesModalOpen) {
      fetchNotifications();
    }
  }, [notificacionesModalOpen]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCount();
        if (response && response.data) {
          setUnreadCount(response.data.unread_count);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isPollingEnabled) {
      fetchUnreadCount();
      const pollingInterval = parseInt(import.meta.env.VITE_NOTIFICATION_POLLING_INTERVAL) || 5000;
      const intervalId = setInterval(fetchUnreadCount, pollingInterval);
      return () => clearInterval(intervalId);
    }
  }, [isPollingEnabled]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err);
    }
  };

  return (
    <>
      <header className="mlap-home-header py-1">
        <div className="maxWCont">
          <div className="mlap-home-header-logo">
            {/* Botón hamburguesa para móvil */}
            <button
              className="aside-hamburger-btn"
              onClick={onMenuToggle}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
            <button
              className="btn-nb logo-btn"
              onClick={() => navigate('/inicio')}
              aria-label="Ir a inicio"
            >
              <img src={logoWhite} alt="MLAP Logo" />
            </button>
          </div>
          <div className="mlap-home-header-bar">
            <div className="parroquia-actual">
              {loading ? (
                <span>Cargando...</span>
              ) : sessionData?.context_type === 'DIOCESE' ? (
                <>
                  <span>Diócesis</span>
                  <span className="rol-actual">Administrador Diocesano</span>
                </>
              ) : sessionData?.context_type === 'PARISH' && sessionData?.parish ? (
                <>
                  <span>{sessionData.parish.name}</span>
                  <span className="rol-actual">
                    {sessionData.is_parish_admin
                      ? 'Párroco'
                      : sessionData.current_role
                        ? sessionData.current_role.name
                        : 'Sin rol seleccionado'
                    }
                  </span>
                </>
              ) : (
                <span>Modo feligrés</span>
              )}
            </div>
            <button
              role="button"
              className='btn-nb notif-btn'
              aria-label="notificaciones"
              onClick={(e) => {
                if (e.altKey) {
                  setIsPollingEnabled(prev => {
                    const newState = !prev;
                    console.log(`Polling de notificaciones ${newState ? 'activado' : 'desactivado'}`);
                    return newState;
                  });
                } else {
                  setNotificacionesModalOpen(true);
                }
              }}
            >
              <MdNotificationsNone />
              {unreadCount > 0 && (
                <span className="notif-badge">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              role="button"
              className='btn-nb perfil-btn'
              aria-label="usuario"
              onClick={handleOpenPerfilModal}
            >
              <img
                src={getProfilePhotoUrl(sessionData?.person?.profile_photo, sessionData?.person)}
                alt="Foto de perfil"
                className="perfil-foto"
              />
            </button>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={notificacionesModalOpen}
        onClose={() => setNotificacionesModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      {perfilModalOpen && (
        <div className="modal-overlay">
          <div className={`modal-perfil ${sessionData?.is_parish_admin || sessionData?.context_type === 'DIOCESE' ? 'parroco-mode' : ''}`}>
            <div className="modal-perfil-header">
              <h2>{sessionData?.is_parish_admin || sessionData?.context_type === 'DIOCESE' ? 'Perfil' : 'Cambiar rol'}</h2>
              <button
                className="btn-nb"
                onClick={() => {
                  setPerfilModalOpen(false);
                }}
              >
                <MdClose />
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Cargando información de la sesión...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>Error al cargar la información: {error}</p>
                <button onClick={refetch} className="btn-retry">
                  Reintentar
                </button>
              </div>
            ) : sessionData ? (
              <>
                <div className="perfil-info">
                  <img
                    src={getProfilePhotoUrl(sessionData?.person?.profile_photo, sessionData?.person)}
                    alt="Foto de perfil"
                    className="perfil-foto-grande"
                  />
                  <div className="perfil-datos">
                    <h3>{sessionData?.person?.full_name || 'Usuario'}</h3>
                    <div className="perfil-datos-rol">
                      <p>{sessionData?.context_type === 'DIOCESE'
                        ? 'Diócesis'
                        : sessionData?.context_type === 'PARISH' && sessionData?.parish
                          ? sessionData.parish.name
                          : 'Modo feligrés'}</p>
                      <p>Rol actual: {
                        sessionData.context_type === 'DIOCESE'
                          ? 'Administrador Diocesano'
                          : sessionData.is_parish_admin
                            ? 'Párroco'
                            : sessionData?.current_role?.name || 'Sin rol seleccionado'
                      }</p>
                    </div>
                  </div>
                </div>

                {!sessionData.is_parish_admin && sessionData.context_type !== 'DIOCESE' && (
                  <div className="selector-rol">
                    <h4>Seleccionar rol</h4>
                    {sessionData?.context_type === 'PARISH' && sessionData?.available_roles ? (
                      <div className="lista-roles">
                        {sessionData.available_roles.map((rol) => (
                          <button
                            key={rol.id}
                            className={`rol-item ${rol.id === sessionData.current_role?.id ? 'rol-activo' : ''}`}
                            onClick={() => handleRolSelect(rol)}
                            disabled={rol.id === sessionData.current_role?.id}
                          >
                            {rol.name}
                            {rol.id === sessionData.current_role?.id && <span className="rol-badge">Actual</span>}
                          </button>
                        ))}
                      </div>
                    ) : sessionData?.parish === null ? (
                      <div className="sin-parroquia">
                        <p>Estás en modo feligrés. No hay roles disponibles.</p>
                      </div>
                    ) : (
                      <div className="sin-parroquia">
                        <p>Por favor, selecciona una parroquia desde la página de inicio</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="perfil-footer">
                  <button className="btn-logout" onClick={handleLogout}>
                    <MdLogout />
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
