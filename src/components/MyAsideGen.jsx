import React from 'react';
import '../App.css';
import { MdOutlineHome } from "react-icons/md";
import './MyAsideGen.css';
import MyAsideButton1 from './MyAsideButton1';

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
          {options.map((option, index) => (
            <MyAsideButton1 
              key={index} 
              href={option.href} 
              icon={option.icon}
              onClick={onToggle}
            >
              {option.label}
            </MyAsideButton1>
          ))}
        </nav>
      </aside>
      
      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isOpen && (
        <div 
          className="aside-overlay" 
          onClick={onToggle}
        />
      )}
    </>
  );
}