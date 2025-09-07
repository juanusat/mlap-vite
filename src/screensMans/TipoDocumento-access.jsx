import React from 'react';
import ScreenMan from '../components/ScreenMan';
import { MdDescription } from "react-icons/md";
import { Outlet, useLocation } from 'react-router-dom';
import '../utils/Modulo-Doc.css';

export default function TipoDocumento() {

  const location = useLocation();
  const isBasePath = location.pathname === '/man-tipos-documentos';

  const options = [
    { href: 'gestionar', icon: <MdDescription />, label: 'Gestionar tipo documentos' },
  ];

  return (
    <ScreenMan title="Tipos documentos" options={options}>
      <Outlet />
      {isBasePath && (<div className="modulo-container">
        <h1 className="modulo-title">Módulo de Documentos</h1>
        <div className="modulo-content">
          <p>
            En este módulo se gestionan los documentos relacionados con las
            actividades de la parroquia y del sistema en general.
            Permite organizar, almacenar y consultar archivos importantes.
          </p>
          <ul>
            <li>Registro de documentos oficiales</li>
            <li>Gestión de certificados y actas</li>
            <li>Archivos administrativos</li>
            <li>Historial de documentos subidos</li>
            <li>Categorización y organización por tipo</li>
          </ul>
        </div>
      </div>
      )}</ScreenMan>
  );
}