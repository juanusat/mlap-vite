import React from 'react';
import '../App.css';

export default function MyAsideGen() {
  return (
    <aside className="mlap-home-sidebar">
      <nav className="mlap-home-sidebar-nav">
        <a href="#" className="mlap-home-sidebar-link">
          <span role="img" aria-label="inicio">🏠</span> Inicio
        </a>
        <a href="#" className="mlap-home-sidebar-link">
          <span role="img" aria-label="cuenta">👤</span> Cuenta
        </a>
      </nav>
    </aside>
  );
}
