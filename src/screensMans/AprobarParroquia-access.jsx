import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdDomainVerification } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function AprobarParroquia() {
  const options = [
    { href: 'gestionar', icon: <MdDomainVerification />, label: 'Gestionar parroquitas' },
  ];

  return (
    <ScreenMan title="Aprobar parroquias" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
