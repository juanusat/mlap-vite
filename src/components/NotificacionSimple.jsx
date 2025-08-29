import React from 'react';
import './NotificacionSimple.css';

export default function NotificacionSimple({ mensaje, fecha }) {
  return (
    <div className="notificacion-simple">
      <p className="notificacion-mensaje">{mensaje}</p>
      <span className="notificacion-fecha">{fecha}</span>
    </div>
  );
}
