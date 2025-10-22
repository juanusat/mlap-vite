import React from 'react';
import { NavLink } from 'react-router-dom';
import './MyAsideButton1.css';

export default function MyAsideButton1({ href, icon, children, onClick }) {
  const handleClick = () => {
    // Si existe la función onClick (para cerrar el menú en móviles), ejecutarla
    if (onClick) {
      onClick();
    }
  };

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `mlap-home-sidebar-link ${isActive ? 'active' : ''}`
      }
      onClick={handleClick}
    >
      <span role="img" aria-label="icono">{icon}</span> {children}
    </NavLink>
  );
}
