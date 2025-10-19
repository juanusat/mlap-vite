import React, { useState } from 'react';
import { MdCheckCircleOutline, MdCheckCircle } from 'react-icons/md';
import './NotificacionSimple.css';

export default function NotificacionSimple({ mensaje, fecha, leida = false, onMarcarLeida }) {
  const [isLeida, setIsLeida] = useState(leida);
  const [isHovered, setIsHovered] = useState(false);

  const handleMarcarLeida = () => {
    if (!isLeida) {
      setIsLeida(true);
      if (onMarcarLeida) {
        onMarcarLeida();
      }
    }
  };

  return (
    <div className={`notificacion-simple ${isLeida ? 'leida' : 'no-leida'}`}>
      <div className="notificacion-contenido">
        <p className="notificacion-mensaje">{mensaje}</p>
        <span className="notificacion-fecha">{fecha}</span>
      </div>
      {!isLeida && (
        <button 
          className="notificacion-btn-marcar-leida"
          onClick={handleMarcarLeida}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          title="Marcar como leída"
        >
          {isHovered ? <MdCheckCircle /> : <MdCheckCircleOutline />}
        </button>
      )}
    </div>
  );
}
