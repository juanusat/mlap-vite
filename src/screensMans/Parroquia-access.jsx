import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdAccountBalance, MdHomeFilled } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Parroquia.css';

export default function Parroquia() {
    React.useEffect(() => {
    document.title = "MLAP | Módulo parroquia";
  }, []);
  const location = useLocation();
  const isBasePath = location.pathname === '/man-parroquia';

  const options = [
    { href: 'gestionar-cuenta', icon: <MdAccountBalance />, label: 'Gestionar cuenta' },
    { href: 'gestionar-capilla', icon: <MdHomeFilled />, label: 'Gestionar capilla' },
    { href: 'reporte01-p', icon: <MdAccountBalance />, label: 'Reporte 01' },
  ];

  return (
    <ScreenMan title="Módulo Parroquia" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de parroquia</h1>
          <p className="modulo-subtitle">
            Administración centralizada de la información institucional de la parroquia.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de parroquia</strong> está diseñado para gestionar de
            manera integral los datos de cada parroquia, garantizando una
            administración ordenada y transparente. Desde la identificación
            institucional hasta los responsables y áreas de servicio, este módulo
            centraliza toda la información relevante.
          </p>

          <p>
            Su implementación permite mantener actualizados los registros
            parroquiales, fortalecer la comunicación con la comunidad y asegurar la
            correcta planificación de actividades y recursos. De este modo, se
            contribuye a una gestión más eficiente y orientada a las necesidades
            pastorales.
          </p>
        </article>
      </section>
      )}</ScreenMan>
  );
}
