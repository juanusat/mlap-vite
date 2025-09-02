import React from 'react';
import { NavLink } from 'react-router-dom';
import './MyAsideButton1.css';

export default function MyAsideButton1({ href, icon, children }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `mlap-home-sidebar-link ${isActive ? 'active' : ''}`
      }
    >
      <span role="img" aria-label="icono">{icon}</span> {children}
    </NavLink>
  );
}
