import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdDescription } from "react-icons/md";
import { Outlet, Link } from 'react-router-dom';

export default function TipoDocumento() {
  const options = [
    { href: 'gestionar', icon: <MdDescription />, label: 'Gestionar tipo documentos' },
  ];

  return (
    <ScreenMan title="Tipos documentos" options={options}>
      <Outlet />
    </ScreenMan>
  );
}