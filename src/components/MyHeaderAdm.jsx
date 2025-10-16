import React, { useState } from 'react';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdNotificationsNone, MdClose, MdArrowForward, MdLogout } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';
import NotificacionSimple from './NotificacionSimple';
import useLogout from '../hooks/useLogout';
import useSession from '../hooks/useSession';

export default function MyHeaderAdm() {
  const logout = useLogout();
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  
  // Usar el hook personalizado para manejar la sesión
  const { sessionData, loading, error, refetch, changeRole, clearError } = useSession(logout);

  const handleRolSelect = async (rol) => {
    try {
      console.log(`Cambiando rol a: ${rol.name} en parroquia: ${sessionData?.parish?.name}`);
      await changeRole(rol.id);
      setPerfilModalOpen(false);
    } catch (error) {
      // El error ya se maneja en el hook useSession
      console.error('Error al cambiar rol:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Datos de ejemplo para las notificaciones
  const notificaciones = [
    { id: 1, mensaje: "Nueva solicitud de documento pendiente de revisión", fecha: "Hace 5 minutos" },
    { id: 2, mensaje: "Documento aprobado: DNI-001", fecha: "Hace 1 hora" },
    { id: 3, mensaje: "Actualización del sistema completada", fecha: "Hace 2 horas" },
    { id: 4, mensaje: "Nuevo usuario registrado en el sistema", fecha: "Hace 3 horas" },
    { id: 5, mensaje: "Mantenimiento programado para mañana", fecha: "Hace 4 horas" },
    { id: 6, mensaje: "Reporte mensual disponible", fecha: "Hace 5 horas" },
    { id: 7, mensaje: "Nueva política de documentación publicada", fecha: "Hace 6 horas" },
    { id: 8, mensaje: "Recordatorio: Reunión de equipo", fecha: "Hace 7 horas" },
    { id: 9, mensaje: "Actualización de permisos completada", fecha: "Hace 8 horas" },
    { id: 10, mensaje: "Backup del sistema realizado con éxito", fecha: "Hace 9 horas" },
  ];

  return (
    <>
      <header className="mlap-home-header py-1" style={{ background: 'var(--color-a-500)' }}>
        <div className="maxWCont">
          <div className="mlap-home-header-logo">
            <img src={logoWhite} alt="MLAP Logo" style={{ height: 36 }} />
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
                src={sessionData?.person?.profile_photo || "https://randomuser.me/api/portraits/women/44.jpg"} 
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
                    src={sessionData?.person?.profile_photo || "https://randomuser.me/api/portraits/women/44.jpg"} 
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
