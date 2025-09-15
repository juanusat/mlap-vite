import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPendingActions, MdHistory } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Reservas.css';

export default function MisReservas() {

  const location = useLocation();
  const isBasePath = location.pathname === '/man-misreservas';

  const options = [
    { href: 'reservar', icon: <MdPendingActions />, label: 'Reservar evento' },
  ];

  return (
    <ScreenMan title="Módulo Mis Reservas" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de Mis Reservas</h1>
          <p className="modulo-subtitle">
            Organización y control centralizado de las reservas de espacios y servicios parroquiales.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de Mis Reservas</strong> facilita la gestión de solicitudes
            para la utilización de espacios, recursos y servicios dentro de la
            parroquia. Desde la reserva de salones hasta la coordinación de equipos
            y actividades, este módulo asegura un proceso transparente y accesible.
          </p>
        </article>
      </section>
      )}</ScreenMan>
  );
}
