import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdDomainVerification, MdBarChart } from "react-icons/md";
import { href, Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Actos.css'; 

export default function Diocesis() {
  React.useEffect(() => {
    document.title = "MLAP | Módulo diócesis";
  }, []);
  const location = useLocation();
  const isBasePath = location.pathname === '/man-diocesis';

  const options = [
    { href: 'gestionar-tipo-doc', icon: <MdDomainVerification />, label: 'Gestionar tipos documentos' },
    { href: 'gestionar-tipo-menciones', icon: <MdDomainVerification />, label: 'Gestionar tipos menciones' },
    { href: 'gestionar-cuenta-parroquia', icon: <MdDomainVerification />, label: 'Gestionar parroquias' },
    { href: 'gestionar-eventos-generales', icon: <MdDomainVerification />, label: 'Gestionar eventos generales' },
    { href: 'gestionar-requisitos-generales', icon: <MdDomainVerification />, label: 'Gestionar requisitos generales' },
    {
      label: 'Informes',
      icon: <MdBarChart />,
      href: null,
      children: [
        {
          href: 'reporte01-d',
          icon: <MdDomainVerification />,
          label: 'Reporte 01'
        }
      ]
    }
  ];

  return (
    <ScreenMan title="Diócesis" options={options}>
      <Outlet />
      {isBasePath && (
        <section className="modulo-container">
          <header className="modulo-header">
            <h1 className="modulo-title">Módulo de diócesis</h1>
            <p className="modulo-subtitle">
              Un espacio diseñado para la gestión integral de documentos, parroquias y eventos a nivel diocesano.
            </p>
          </header>

          <article className="modulo-content">
            <p>
              El <strong>Módulo de diócesis</strong> concentra las herramientas necesarias para administrar los
              aspectos clave de la vida eclesial: desde el registro y control de documentos hasta la gestión
              de parroquias, requisitos y eventos generales que fortalecen la comunión en toda la diócesis.
            </p>

            <p>
              Con este módulo se busca garantizar una organización transparente, ordenada y accesible, que
              facilite la coordinación entre las diferentes parroquias y entidades de la diócesis, promoviendo
              la unidad y una gestión más eficiente de los recursos y actividades.
            </p>
          </article>
        </section>
      )}
    </ScreenMan>
  );
}
