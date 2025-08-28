import React from 'react';
import '../App.css';

export default function MyBarSearchGen() {
  return (
    <div className="mlap-home-search">
      <input type="text" placeholder="Buscar parroquia o evento" className="mlap-home-search-input" />
      <button className="mlap-home-search-btn" aria-label="Buscar">
        <span role="img" aria-label="buscar">🔍</span>
      </button>
    </div>
  );
}
