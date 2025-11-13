import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdNotificationsNone, MdClose, MdArrowForward, MdLogout } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';
import NotificacionSimple from './NotificacionSimple';
import useLogout from '../hooks/useLogout';
import useSession from '../hooks/useSession';

const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export default function MyHeaderAdm({ onMenuToggle, isMenuOpen }) {
  const navigate = useNavigate();
  const logout = useLogout();
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  
  // Usar el hook personalizado para manejar la sesión
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
        if (sessionResult.data?.permissions) {
          console.log('Permisos del rol activo:', sessionResult.data.permissions);
        }
      }
      
      setPerfilModalOpen(false);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
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

  // Datos de ejemplo para las notificaciones
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, mensaje: "Nueva solicitud de documento pendiente de revisión", fecha: "Hace 5 minutos", leida: false },
    { id: 2, mensaje: "Documento aprobado: DNI-001", fecha: "Hace 1 hora", leida: false },
    { id: 3, mensaje: "Actualización del sistema completada", fecha: "Hace 2 horas", leida: true },
    { id: 4, mensaje: "Nuevo usuario registrado en el sistema", fecha: "Hace 3 horas", leida: false },
    { id: 5, mensaje: "Mantenimiento programado para mañana", fecha: "Hace 4 horas", leida: true },
    { id: 6, mensaje: "Reporte mensual disponible", fecha: "Hace 5 horas", leida: true },
    { id: 7, mensaje: "Nueva política de documentación publicada", fecha: "Hace 6 horas", leida: false },
    { id: 8, mensaje: "Recordatorio: Reunión de equipo", fecha: "Hace 7 horas", leida: true },
    { id: 9, mensaje: "Actualización de permisos completada", fecha: "Hace 8 horas", leida: true },
    { id: 10, mensaje: "Backup del sistema realizado con éxito", fecha: "Hace 9 horas", leida: true },
  ]);

  const handleMarcarLeida = (notifId) => {
    setNotificaciones(prev => 
      prev.map(notif => 
        notif.id === notifId ? { ...notif, leida: true } : notif
      )
    );
  };

  return (
    <>
      <header className="mlap-home-header py-1" style={{ background: 'var(--color-a-500)' }}>
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
              <img src={logoWhite} alt="MLAP Logo" style={{ height: 36 }} />
            </button>
          </div>
          <div className="mlap-home-header-bar" style={{ color: '#fff' }}>
            <div className="parroquia-actual">
              {loading ? (
                <span>Cargando...</span>
              ) : sessionData?.is_diocese_user ? (
                <>
                  <span>Diócesis</span>
                  <span className="rol-actual">Administrador Diocesano</span>
                </>
              ) : sessionData?.parish ? (
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
              className='btn-nb'
              aria-label="notificaciones"
              onClick={() => setNotificacionesModalOpen(true)}
            >
              <MdNotificationsNone />
            </button>
            <button
              role="button"
              className='btn-nb perfil-btn'
              aria-label="usuario"
              onClick={() => setPerfilModalOpen(true)}
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

      {notificacionesModalOpen && (
        <div className="modal-overlay">
          <div className="modal-notificaciones">
            <div className="modal-notificaciones-header">
              <h2>Notificaciones</h2>
              <button
                className="btn-nb"
                onClick={() => setNotificacionesModalOpen(false)}
                style={{ color: 'var(--color-n-900)' }}
              >
                <MdClose />
              </button>
            </div>
            <div className="notificaciones-lista">
              {notificaciones.map((notif) => (
                <NotificacionSimple
                  key={notif.id}
                  mensaje={notif.mensaje}
                  fecha={notif.fecha}
                  leida={notif.leida}
                  onMarcarLeida={() => handleMarcarLeida(notif.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {perfilModalOpen && (
        <div className="modal-overlay">
          <div className={`modal-perfil ${sessionData?.is_parish_admin || sessionData?.is_diocese_user ? 'parroco-mode' : ''}`}>
            <div className="modal-perfil-header">
              <h2>{sessionData?.is_parish_admin || sessionData?.is_diocese_user ? 'Perfil' : 'Cambiar rol'}</h2>
              <button
                className="btn-nb"
                onClick={() => {
                  setPerfilModalOpen(false);
                }}
                style={{ color: 'var(--color-n-900)' }}
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
                      <p>{sessionData?.is_diocese_user 
                          ? 'Diócesis' 
                          : sessionData?.parish?.name || 'Modo feligrés'}</p>
                      <p>Rol actual: {
                        sessionData.is_diocese_user
                          ? 'Administrador Diocesano'
                          : sessionData.is_parish_admin 
                            ? 'Párroco' 
                            : sessionData?.current_role?.name || 'Sin rol seleccionado'
                      }</p>
                    </div>
                  </div>
                </div>

                {!sessionData.is_parish_admin && !sessionData.is_diocese_user && (
                  <div className="selector-rol">
                    <h4>Seleccionar rol</h4>
                    {sessionData?.parish && sessionData?.available_roles ? (
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
