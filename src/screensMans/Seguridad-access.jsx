import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdSecurity } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function Seguridad() {
  const options = [
    { href: 'gestionar', icon: <MdSecurity />, label: 'Gestionar Roles' },
  ];

  return (
    <ScreenMan title="Módulo de seguridad" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
