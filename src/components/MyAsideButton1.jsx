import React from 'react';
import './MyAsideButton1.css'

export default function MyAsideButton1({ href, icon, children }) {
  return (
    <a href={href} className="mlap-home-sidebar-link">
      <span role="img" aria-label="icono">{icon}</span> {children}
    </a>
  );
}
