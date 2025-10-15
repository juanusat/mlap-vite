import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdNotificationsNone, MdClose, MdArrowForward, MdLogout } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';
import NotificacionSimple from './NotificacionSimple';
const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function MyHeaderAdm() {
  const location = useLocation();
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [parroquiaSeleccionada, setParroquiaSeleccionada] = useState(null);
  const [rolActual, setRolActual] = useState("Administrador"); // Estado para manejar el rol actual

  // Obtener la parroquia seleccionada desde Begin.jsx
  useEffect(() => {
    if (location.state && location.state.parroquia) {
      setParroquiaSeleccionada(location.state.parroquia);
    }
  }, [location.state]);

  // Datos de ejemplo para el usuario
  const usuario = {
    nombre: "María García",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    roles: ["Administrador", "Secretario", "Párroco", "Diácono", "Coordinador"], // Roles disponibles para la parroquia seleccionada
  };

  const handleRolSelect = (rol) => {
    // Actualizar el rol actual
    setRolActual(rol);
    console.log(`Rol cambiado a: ${rol} en parroquia: ${parroquiaSeleccionada?.nombre}`);
    setPerfilModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Sesión cerrada exitosamente');
        window.location.href = '/acceso';
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de red al cerrar sesión:', error);
    }
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
              <span>{parroquiaSeleccionada ? parroquiaSeleccionada.nombre : 'Sin parroquia seleccionada'}</span>
              <span className="rol-actual">{rolActual}</span>
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
              <img src={usuario.foto} alt="Foto de perfil" className="perfil-foto" />
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
          <div className="modal-perfil">
            <div className="modal-perfil-header">
              <h2>Cambiar rol</h2>
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

            <div className="perfil-info">
              <img src={usuario.foto} alt="Foto de perfil" className="perfil-foto-grande" />
              <div className="perfil-datos">
                <h3>{usuario.nombre}</h3>
                <div className="perfil-datos-rol">
                  <p>{parroquiaSeleccionada ? parroquiaSeleccionada.nombre : 'No seleccionada'}</p>
                  <p>Rol actual: {rolActual}</p>
                </div>
              </div>
            </div>

            <div className="selector-rol">
              <h4>Seleccionar rol</h4>
              {parroquiaSeleccionada ? (
                <div className="lista-roles">
                  {usuario.roles.map((rol) => (
                    <button
                      key={rol}
                      className={`rol-item ${rol === rolActual ? 'rol-activo' : ''}`}
                      onClick={() => handleRolSelect(rol)}
                      disabled={rol === rolActual}
                    >
                      {rol}
                      {rol === rolActual && <span className="rol-badge">Actual</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="sin-parroquia">
                  <p>Por favor, selecciona una parroquia desde la página de inicio</p>
                </div>
              )}
            </div>

            <div className="perfil-footer">
              <button className="btn-logout" onClick={handleLogout}>
                <MdLogout />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
