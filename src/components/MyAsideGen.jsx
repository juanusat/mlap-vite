// MyAsideGen.jsx (Modificado)
import React from 'react';
import '../App.css';
import { MdOutlineHome } from "react-icons/md";
import './MyAsideGen.css';
import MyAsideButton1 from './MyAsideButton1';
import AsideOption from './AsideOption'; // <-- IMPORTANTE: Importar el nuevo componente

export default function MyAsideGen({ title, options = [], isOpen, onToggle }) {
  return (
    <>
      <aside className={`screenman-aside py-2 px-2 ${isOpen ? 'open' : ''}`}>
        <MyAsideButton1 href="/inicio" icon={<MdOutlineHome />} onClick={onToggle}>
          Inicio
        </MyAsideButton1>
        <hr className='mt-2 mb-4' />
        <div className="titleModule mt-2 mb-1">{title}</div>
        <nav className="mlap-home-sidebar-nav">
          {/* USAMOS ASIDEOPTION PARA MANEJAR OPCIONES SIMPLES O GRUPOS */}
          {options.map((option, index) => (
            <AsideOption 
              key={option.href || option.label || index} // Usar label si no hay href (es un grupo)
              option={option} 
              onToggle={onToggle}
            />
          ))}
        </nav>
      </aside>
      {isOpen && (
        <div 
          className="aside-overlay" 
          onClick={onToggle}
        />
      )}
    </>
  );
}