import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Home.css';
import MyBarSearchGen from './components/MyBarSearchGen';
import ScreenMan from './components/ScreenMan';
import MyModuleAccess from './components/MyModuleAccess';
import MyButtonCenteredSides from './components/MyButtonCenteredSides';
import useSession from './hooks/useSession';

import {
  MdChurch,
  MdOutlineAccountBox,
  MdSecurity,
  MdEventNote,
  MdDescription,
  MdDomainVerification,
  MdCalendarMonth
} from 'react-icons/md';

export default function Home() {
  const searchBarRef = useRef(null);
  const navigate = useNavigate();
  const { sessionData } = useSession(() => navigate('/acceso'));

  const scrollToSearch = () => {
    searchBarRef.current?.scrollAndFocus();
  };

  const handleModuleClick = (route) => {
    navigate(route);
  };

  const getAvailableModules = () => {
    if (!sessionData || !sessionData.context_type) return [];
    
    const mode = sessionData.context_type;
    
    switch (mode) {
      case 'DIOCESE':
        return [
          {
            icon: <MdDescription />,
            text: "Diócesis",
            route: "/man-diocesis"
          }
        ];
      
      case 'PARISHIONER':
        return [
          {
            icon: <MdCalendarMonth />,
            text: "Reservas",
            route: "/man-reservas"
          },
          {
            icon: <MdOutlineAccountBox />,
            text: "Usuario",
            route: "/man-usuario"
          }
        ];
      
      case 'PARISH':
        return [
          {
            icon: <MdEventNote />,
            text: "Actos litúrgicos",
            route: "/man-actos-liturgicos"
          },
          {
            icon: <MdSecurity />,
            text: "Seguridad",
            route: "/man-seguridad"
          },
          {
            icon: <MdChurch />,
            text: "Parroquia",
            route: "/man-parroquia"
          }
        ];
      
      default:
        return [];
    }
  };

  const availableModules = getAvailableModules();

  return (
    <ScreenMan>
      <div className="content-module">
        {sessionData?.context_type === 'PARISHIONER' && (
          <MyBarSearchGen ref={searchBarRef} mode="navigate" />
        )}
        <section className="mlap-home-welcome">
          <div className="mlap-home-welcome-img" />
          <div className="mlap-home-welcome-info">
            <picture className="mlap-home-welcome-info-picture">
              <img src="/src/assets/gestion-eventos.png" alt="gestión de eventos litúrgicos" />
            </picture>
            <div className="mlap-home-welcome-info-text">
              <h2 className='title-banner'>Bienvenido a MLAP</h2>
              <p>
                MLAP es un sistema de gestión de eventos litúrgicos desarollo por el equipo de software "La Orden Oscura". Este proyecto ha sido creado para todas las personas creyentes y no creyentes para facilitarles el registro de algún acto litúrgico católico.<br /><br />
                No lo pienses más y empieza a explorar y a reservar en tu parroquia de tu región favorita.
              </p>
              {sessionData?.context_type === 'PARISHIONER' && (
                <MyButtonCenteredSides>
                  <button className="mlap-home-reserve-btn" onClick={scrollToSearch}>Reservar ahora</button>
                </MyButtonCenteredSides>
              )}
            </div>
          </div>
        </section>
        <section className="mlap-home-modules">
          <h3>Módulos</h3>
          <div className="mlap-home-modules-list">
            {availableModules.length > 0 ? (
              availableModules.map((module, index) => (
                <MyModuleAccess
                  key={index}
                  icon={module.icon}
                  text={module.text}
                  onClick={() => handleModuleClick(module.route)}
                />
              ))
            ) : (
              <p>No hay módulos disponibles para tu nivel de acceso.</p>
            )}
          </div>
        </section>
      </div>
    </ScreenMan>
  );
}
