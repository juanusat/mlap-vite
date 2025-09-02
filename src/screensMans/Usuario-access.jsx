import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPerson } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function Usuario() {
  const options = [
    { href: 'gestionar', icon: <MdPerson />, label: 'Gestionar Usuario' },
  ];

  return (
    <ScreenMan title="Módulo Usuario" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
