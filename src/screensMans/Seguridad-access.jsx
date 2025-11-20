import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdAccountBox, MdRecentActors, MdDomainVerification, MdBarChart  } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import '../utils/Modulo-Seguridad.css';

export default function Seguridad() {
  React.useEffect(() => {
    document.title = "MLAP | Módulo seguridad";
  }, []);
  const location = useLocation();
  const isBasePath = location.pathname === '/man-seguridad';
  const { hasPermission, isParishAdmin } = usePermissions();

  const options = [
    {
      href: 'cuentas-gestionar',
      icon: <MdAccountBox />,
      label: 'Gestionar cuentas',
      show: isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ASOC_USER_R)
    },
    {
      href: 'roles-gestionar',
      icon: <MdRecentActors />,
      label: 'Gestionar roles',
      show: isParishAdmin || hasPermission(PERMISSIONS.SEGURIDAD_ROL_R)
    },
    {
      label: 'Informes',
      icon: <MdBarChart />,
      href: null,
      children: [
        {
          href: 'reporte01-s',
          icon: <MdDomainVerification />,
          label: 'Reporte 01'
        }
      ]
    },

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
