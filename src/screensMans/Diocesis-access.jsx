import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdDomainVerification } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function Diocesis() {
  const options = [
    { href: 'gestionar-tipo-doc', icon: <MdDomainVerification />, label: 'Gestionar tipos documentos' },
    { href: 'gestionar-cuenta-parroquia', icon: <MdDomainVerification />, label: 'Gestionar parroquias' },
    { href: 'gestionar-eventos-generales', icon: <MdDomainVerification />, label: 'Gestionar eventos generales'},
    { href: 'gestionar-requisitos-generales', icon: <MdDomainVerification />, label: 'Gestionar requisitos generales'}
  ];

  return (
    <ScreenMan title="Diocesis" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
