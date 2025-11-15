import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdBook, MdListAlt, MdSchedule, MdBookmark, MdAssessment } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Actos.css';
import { useEffect, useMemo } from "react";
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';

export default function ActosLiturgicos() {
  useEffect(() => {
    document.title = "MLAP | Módulo actos litúrgicos";
  }, []);
  const location = useLocation();
  const isBasePath = location.pathname === '/man-actos-liturgicos';
  const { hasPermission } = usePermissions();
  
  const allOptions = [
    { 
      href: 'gestionar-actos',
      icon: <MdBookmark />, 
      label: 'Gestionar actos litúrgicos',
      permission: PERMISSIONS.ACTOS_LITURGICOS_ACTOS_R
    },
    { 
      href: 'gestionar-requisitos', 
      icon: <MdListAlt />, 
      label: 'Gestionar requisitos',
      permission: PERMISSIONS.ACTOS_LITURGICOS_REQ_R
    },
    { 
      href: 'gestionar-horarios', 
      icon: <MdSchedule />, 
      label: 'Gestionar horarios',
      permission: PERMISSIONS.ACTOS_LITURGICOS_HORA_R
    },
    { 
      href: 'gestionar-reservas',
      icon: <MdBook />, 
      label: 'Gestionar reservas',
      permission: PERMISSIONS.ACTOS_LITURGICOS_RESER_R
    },
    { 
      href: 'reporte01-a', 
      icon: <MdAssessment />,
      label: 'Reporte 01'
    },
    { 
      href: 'reporte02-a', 
      icon: <MdAssessment />,
      label: 'Reporte 02'
    },
    { 
      href: 'reporte03-a', 
      icon: <MdAssessment />,
      label: 'Reporte 03'
    },
  ];

  const options = useMemo(() => {
    return allOptions.filter(option => 
      !option.permission || hasPermission(option.permission)
    );
  }, [hasPermission]);
  
  return (
    <ScreenMan title="Módulo de actos litúrgicos" options={options}>
      <Outlet />
      {isBasePath && (
        <section className="modulo-container">
          <header className="modulo-header">
            <h1 className="modulo-title">Módulo de actos litúrgicos</h1>
            <p className="modulo-subtitle"> Un espacio diseñado para fortalecer la organización y solemnidad de tu
              comunidad.
            </p>
          </header>

          <article className="modulo-content">
            <p>
              El <strong>Módulo de actos litúrgicos</strong> reúne en un solo lugar
              todas las herramientas necesarias para planificar, registrar y dar
              seguimiento a ceremonias, sacramentos y celebraciones especiales.
              Nuestra propuesta ofrece un entorno confiable, ordenado y accesible,
              pensado para mantener la armonía y la tradición.
            </p>

            <p>
              Gracias a su enfoque integral, este módulo asegura una gestión clara,
              transparente y colaborativa, permitiendo mantener un registro histórico
              completo, optimizar la programación y garantizar la participación
              activa de toda la comunidad parroquial.
            </p>
          </article>
        </section>
      )}
    </ScreenMan>
  );
}
