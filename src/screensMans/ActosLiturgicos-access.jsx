import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdBook, MdListAlt, MdSchedule, MdBookmark, MdAssessment } from "react-icons/md";
import { Outlet } from 'react-router-dom';

export default function ActosLiturgicos() {
  const options = [
    { href: 'gestionar', label: 'Gestionar actos Litúrgicos' },
    { href: 'requisitos', label: 'Gestionar Requisitos' },
    { href: 'horarios', label: 'Gestionar Horarios' },
    { href: 'reservas', label: 'Gestionar Reservas' },
    { href: 'reportes', label: 'Reportes' },
  ];

  return (
    <ScreenMan title="Módulo de actos litúrgicos" options={options}>
      <Outlet />
    </ScreenMan>
  );
}
