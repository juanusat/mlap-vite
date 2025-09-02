import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './Home.css';
import MyBarSearchGen from './components/MyBarSearchGen';
import ScreenMan from './components/ScreenMan';
import MyModuleAccess from './components/MyModuleAccess';
import MyButtonCenteredSides from './components/MyButtonCenteredSides';

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

  const scrollToSearch = () => {
    searchBarRef.current?.scrollAndFocus();
  };

  const handleModuleClick = (route) => {
    navigate(route);
  };

  return (
    <ScreenMan>
      <div className="content-module">
        <MyBarSearchGen ref={searchBarRef} />
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
              <MyButtonCenteredSides>
                <button className="mlap-home-reserve-btn" onClick={scrollToSearch}>Reservar ahora</button>
              </MyButtonCenteredSides>
            </div>
          </div>
        </section>
        <section className="mlap-home-modules">
          <h3>Módulos</h3>
          <div className="mlap-home-modules-list">
            <MyModuleAccess
              icon={<MdEventNote />}
              text="Actos Litúrgicos"
              onClick={() => handleModuleClick('/man-actos-liturgicos')}
            />
            <MyModuleAccess
              icon={<MdOutlineAccountBox />}
              text="Usuario"
              onClick={() => handleModuleClick('/man-usuario')}
            />
            <MyModuleAccess
              icon={<MdChurch />}
              text="Parroquia"
              onClick={() => handleModuleClick('/man-parroquia')}
            />
            <MyModuleAccess
              icon={<MdSecurity />}
              text="Seguridad"
              onClick={() => handleModuleClick('/man-seguridad')}
            />
            <MyModuleAccess
              icon={<MdCalendarMonth />}
              text="Reservas"
              onClick={() => handleModuleClick('/man-reservas')}
            />
            <MyModuleAccess
              icon={<MdDescription />}
              text="Tipos Documentos"
              onClick={() => handleModuleClick('/man-tipos-documentos')}
            />
            <MyModuleAccess
              icon={<MdDomainVerification />}
              text="Aprobar Parroquia"
              onClick={() => handleModuleClick('/man-aprobar-parroquia')}
            />
          </div>
        </section>
      </div>
    </ScreenMan>
  );
}
