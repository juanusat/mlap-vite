import React from 'react';
import '../App.css';
import { MdOutlineHome } from "react-icons/md";
import { MdChurch } from "react-icons/md";


export default function MyAsideGen() {
  return (
    <aside className="mlap-home-sidebar">
      <nav className="mlap-home-sidebar-nav">
        <a href="#" className="mlap-home-sidebar-link">
          <span role="img" aria-label="inicio"><MdOutlineHome /></span> Inicio
        </a>
        <a href="#" className="mlap-home-sidebar-link">
          <span role="img" aria-label="iglesia"><MdChurch /></span> Iglesia
        </a>
      </nav>
    </aside>
  );
}
