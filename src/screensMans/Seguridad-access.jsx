import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdSecurity } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Seguridad.css';

export default function Seguridad() {
  const location = useLocation();
  const isBasePath = location.pathname === '/man-seguridad';

  const options = [
    { href: 'gestionar', icon: <MdSecurity />, label: 'Gestionar Roles' },
  ];

  return (
    <ScreenMan title="Módulo de seguridad" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de Seguridad</h1>
          <p className="modulo-subtitle">
            Administración de roles y cuentas asociadas a cada parroquia,
            garantizando un control de accesos seguro y eficiente.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de Seguridad</strong> proporciona herramientas para
            definir y gestionar los <strong>roles</strong> de cada parroquia, con
            el fin de asegurar que cada usuario tenga los permisos adecuados según
            sus responsabilidades.
          </p>

          <p>
            Además, permite la administración de las{" "}
            <strong>cuentas asociadas</strong> a la parroquia, manteniendo un
            control riguroso sobre los accesos al sistema y protegiendo la
            información sensible de la comunidad.
          </p>
        </article>
      </section>
      )}
    </ScreenMan>
  );
}
