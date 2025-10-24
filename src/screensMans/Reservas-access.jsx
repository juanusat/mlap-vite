import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPendingActions, MdHistory } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Reservas.css';

export default function Reservas() {
    React.useEffect(() => {
      document.title = "MLAP | Módulo reservas";
    }, []);

  const location = useLocation();
  const isBasePath = location.pathname === '/man-reservas';

  const options = [
    { href: 'pendientes', icon: <MdPendingActions />, label: 'Reservas pendientes' },
    { href: 'historial', icon: <MdHistory />, label: 'Historial de reservas' },
    { href: 'reservar', icon: <MdPendingActions />, label: 'Reservar evento' },
    { href: 'reporte01-r', icon: <MdPendingActions />, label: 'Reporte 01' },
    { href: 'reporte02-r', icon: <MdPendingActions />, label: 'Reporte 02' },

  ];

  return (
    <ScreenMan title="Módulo reserva" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de reservas</h1>
          <p className="modulo-subtitle">
            Organización y control centralizado de las reservas de espacios y servicios parroquiales.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de reservas</strong> facilita la gestión de solicitudes
            para la utilización de espacios, recursos y servicios dentro de la
            parroquia. Desde la reserva de salones hasta la coordinación de equipos
            y actividades, este módulo asegura un proceso transparente y accesible.
          </p>

          <p>
            Su implementación contribuye a evitar conflictos de horarios, optimizar
            el uso de los recursos parroquiales y garantizar que cada solicitud sea
            atendida de manera ordenada y eficiente.
          </p>
        </article>
      </section>
      )}</ScreenMan>
  );
}
