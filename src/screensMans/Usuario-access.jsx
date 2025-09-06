import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdPerson } from "react-icons/md";
import { Outlet } from 'react-router-dom';
import '../utils/Modulo-Usuario.css';

export default function Usuario() {
  const options = [
    { href: 'gestionar', icon: <MdPerson />, label: 'Gestionar Usuario' },
  ];

  return (
    <ScreenMan title="Módulo Usuario" options={options}>
      <Outlet />
      <section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de Usuario</h1>
          <p className="modulo-subtitle">
            Gestión centralizada de la información personal y administrativa de los usuarios.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de Usuario</strong> permite administrar de manera
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
    </ScreenMan>
  );
}
