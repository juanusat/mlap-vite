import React, { useState, useEffect } from 'react';
import { MdCheckCircleOutline, MdCheckCircle } from 'react-icons/md';
import './NotificacionSimple.css';

export default function NotificacionSimple({ mensaje, body, fecha, leida = false, onMarcarLeida }) {
  const [isLeida, setIsLeida] = useState(leida);
  const [isHovered, setIsHovered] = useState(false);

  // Actualizar el estado local cuando la prop leida cambie
  useEffect(() => {
    setIsLeida(leida);
  }, [leida]);

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
        {body && <p className="notificacion-body">{body}</p>}
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
