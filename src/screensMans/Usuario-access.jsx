import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPerson } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Usuario.css';

export default function Usuario() {
  const location = useLocation();
  const isBasePath = location.pathname === '/man-usuario';

  const options = [
    { href: 'gestionar-cuenta', icon: <MdPerson />, label: 'Mi cuenta' },
  ];

  return (
    <ScreenMan title="Módulo Usuario" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de usuario</h1>
          <p className="modulo-subtitle">
            Gestión centralizada de la información personal y administrativa de los usuarios.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de usuario</strong> permite administrar de manera
            eficiente y segura los datos de cada miembro registrado en el sistema.
            Su diseño está orientado a garantizar la integridad, privacidad y
            disponibilidad de la información.
          </p>

          <p>
            Desde la actualización de datos personales hasta la gestión de
            credenciales de acceso, este módulo es clave para mantener un entorno
            confiable y adaptado a las necesidades de la organización. Además,
            facilita la segmentación y el seguimiento de perfiles, fortaleciendo la
            interacción y la comunicación.
          </p>
        </article>

      </section>
      )}</ScreenMan>
  );
}
