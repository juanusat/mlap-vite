import React, { useState } from 'react';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdNotificationsNone, MdClose, MdArrowForward, MdLogout } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';
import NotificacionSimple from './NotificacionSimple';

export default function MyHeaderAdm() {
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [selectedParroquia, setSelectedParroquia] = useState(null);

  // Datos de ejemplo para el usuario
  const usuario = {
    nombre: "María García",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    parroquiasRoles: [
      {
        id: 1,
        nombre: "Parroquia San Francisco de Asís",
        roles: ["Administrador", "Secretario"]
      },
      {
        id: 2,
        nombre: "Parroquia Santa Rosa de Lima",
        roles: ["Secretario"]
      },
      {
        id: 3,
        nombre: "Parroquia Nuestra Señora del Carmen",
        roles: ["Administrador"]
      }
    ],
    parroquiaActual: {
      id: 1,
      nombre: "Parroquia San Francisco de Asís",
      rolActual: "Administrador"
    }
  };

  const handleParroquiaSelect = (parroquia) => {
    setSelectedParroquia(parroquia);
  };

  const handleRolSelect = (rol) => {
    // Aquí iría la lógica para cambiar el rol
    setPerfilModalOpen(false);
    setSelectedParroquia(null);
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
              <span>{usuario.parroquiaActual.nombre}</span>
              <span className="rol-actual">{usuario.parroquiaActual.rolActual}</span>
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
              <h2>Cambiar Parroquia/Rol</h2>
              <button
                className="btn-nb"
                onClick={() => {
                  setPerfilModalOpen(false);
                  setSelectedParroquia(null);
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
                  <p>Actual: {usuario.parroquiaActual.nombre}</p>
                  <p>Rol: {usuario.parroquiaActual.rolActual}</p>
                </div>
              </div>
            </div>

            <div className="selector-parroquia-rol">
              {!selectedParroquia ? (
                <>
                  <h4>Seleccionar Parroquia</h4>
                  <div className="lista-parroquias">
                    {usuario.parroquiasRoles.map((parroquia) => (
                      <button
                        key={parroquia.id}
                        className="parroquia-item"
                        onClick={() => handleParroquiaSelect(parroquia)}
                      >
                        <span>{parroquia.nombre}</span>
                        <MdArrowForward />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h4>Seleccionar Rol en {selectedParroquia.nombre}</h4>
                  <div className="lista-roles">
                    {selectedParroquia.roles.map((rol) => (
                      <button
                        key={rol}
                        className="rol-item"
                        onClick={() => handleRolSelect(rol)}
                      >
                        {rol}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn-volver"
                    onClick={() => setSelectedParroquia(null)}
                  >
                    Volver a parroquias
                  </button>
                </>
              )}
            </div>

            <div className="perfil-footer">
              <button className="btn-logout">
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
