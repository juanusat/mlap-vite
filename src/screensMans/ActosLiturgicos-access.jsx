import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdBook, MdListAlt, MdSchedule, MdBookmark, MdAssessment } from "react-icons/md";
import { Outlet } from 'react-router-dom';
import '../utils/Modulo-Actos.css';

export default function ActosLiturgicos() {
  const options = [
    { href: 'gestionar', label: 'Gestionar actos Litúrgicos' },
    { href: 'requisitos', label: 'Gestionar Requisitos' },
    { href: 'horarios', label: 'Gestionar Horarios' },
    { href: 'reservas', label: 'Gestionar Reservas' },
    { href: 'reportes', label: 'Reportes' },
  ];
  return (
    <ScreenMan title="Módulo de actos litúrgicos" options={options}>
      <Outlet />
      <section className="modulo-container">
        <header className="modulo-header">
          <h1 className="modulo-title">Módulo de Actos Litúrgicos</h1>
          <p className="modulo-subtitle"> Un espacio diseñado para fortalecer la organización y solemnidad de tu
            comunidad.
          </p>
        </header>

        <article className="modulo-content">
          <p>
            El <strong>Módulo de Actos Litúrgicos</strong> reúne en un solo lugar
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
    </ScreenMan>
  );

}
