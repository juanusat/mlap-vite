import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdAccountBalance } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function Parroquia() {
  const options = [
    { href: 'gestionar', icon: <MdAccountBalance />, label: 'Gestionar Cuenta' },
  ];

  return (
    <ScreenMan title="Módulo Parroquia" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
