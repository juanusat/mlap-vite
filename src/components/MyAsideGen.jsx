import React from 'react';
import '../App.css';
import { MdOutlineHome } from "react-icons/md";
import { MdChurch } from "react-icons/md";
import './MyAsideGen.css';
import MyAsideButton1 from './MyAsideButton1';

export default function MyAsideGen() {
  return (
    <aside className="screenman-aside py-2 px-2">
      <MyAsideButton1 href="/inicio" icon={<MdOutlineHome />}>Inicio</MyAsideButton1>
      <hr className='mt-2 mb-4' />
      <div className="titleModule mt-2 mb-1">Módulo seguridad</div>
      <nav className="mlap-home-sidebar-nav">
        <MyAsideButton1 href="#" icon={<MdChurch />}>Iglesia</MyAsideButton1>
      </nav>
    </aside>
  );
}