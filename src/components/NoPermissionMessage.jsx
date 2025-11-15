import React from 'react';
import { MdLock } from 'react-icons/md';
import './NoPermissionMessage.css';

export default function NoPermissionMessage({ message = "No tienes permisos para acceder a esta sección" }) {
  return (
    <div className="no-permission-container">
      <MdLock className="no-permission-icon" />
      <h3 className="no-permission-title">Acceso restringido</h3>
      <p className="no-permission-message">
        {message}
      </p>
      <p className="no-permission-help">
        Si crees que deberías tener acceso, contacta con el administrador de tu parroquia.
      </p>
    </div>
  );
}
