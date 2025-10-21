import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdAccountBox, MdRecentActors } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Seguridad.css';

export default function Seguridad() {
    React.useEffect(() => {
    document.title = "MLAP | Módulo seguridad";
  }, []);
  const location = useLocation();
  const isBasePath = location.pathname === '/man-seguridad';

  const options = [
    { href: 'cuentas-gestionar', icon: <MdAccountBox />, label: 'Gestionar cuentas' },
    { href: 'roles-gestionar', icon: <MdRecentActors />, label: 'Gestionar roles' },
  ];

  return (
    <ScreenMan title="Módulo de seguridad" options={options}>
      <Outlet />
      {isBasePath && (<section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de seguridad</h1>
          <p className="modulo-subtitle">
            Administración de roles y cuentas asociadas a cada parroquia,
            garantizando un control de accesos seguro y eficiente.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de seguridad</strong> proporciona herramientas para
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
