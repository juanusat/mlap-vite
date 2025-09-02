import React from 'react';
import '../App.css';
import { MdOutlineHome } from "react-icons/md";
import './MyAsideGen.css';
import MyAsideButton1 from './MyAsideButton1';

export default function MyAsideGen({ title, options = [] }) {
  return (
    <aside className="screenman-aside py-2 px-2">
      <MyAsideButton1 href="/inicio" icon={<MdOutlineHome />}>Inicio</MyAsideButton1>
      <hr className='mt-2 mb-4' />
      <div className="titleModule mt-2 mb-1">{title}</div>
      <nav className="mlap-home-sidebar-nav">
        {options.map((option, index) => (
          <MyAsideButton1 key={index} href={option.href} icon={option.icon}>
            {option.label}
          </MyAsideButton1>
        ))}
      </nav>
    </aside>
  );
}