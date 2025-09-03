import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPendingActions, MdHistory } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function Reservas() {
  const options = [
    { href: 'pendientes', icon: <MdPendingActions />, label: 'Reservas pendientes' },
    { href: 'historial', icon: <MdHistory />, label: 'Historial de reservas' },
  ];

  return (
    <ScreenMan title="Módulo reserva" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
