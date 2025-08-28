import React from 'react';
import './App.css';
import MyHeaderAdm from './components/MyHeaderAdm';
import MyAsideGen from './components/MyAsideGen';
import MyBarSearchGen from './components/MyBarSearchGen';

export default function Home() {
  return (
    <div className="mlap-home-container">
      <MyHeaderAdm />
      <MyAsideGen />
      <main className="mlap-home-main">
        <MyBarSearchGen />
        <section className="mlap-home-welcome">
          <div className="mlap-home-welcome-img" />
          <div className="mlap-home-welcome-info">
            <h2>Bienvenido a MLAP</h2>
            <p>
              MLAP es un sistema de gestión de eventos litúrgicos desarollo por el equipo de software "La Orden Oscura". Este proyecto ha sido creado para todas las personas creyentes y no creyentes para facilitarles el registro de algún acto litúrgico católico.<br /><br />
              No lo pienses más y empieza a explorar y a reservar en tu parroquia de tu región favorita.
            </p>
            <button className="mlap-home-reserve-btn">Reservar ahora</button>
          </div>
        </section>
        <section className="mlap-home-modules">
          <h3>Modulos</h3>
          <div className="mlap-home-modules-list">
            <div className="mlap-home-module">
              <div className="mlap-home-module-icon" />
              <span>Actos Liturgicos</span>
            </div>
            <div className="mlap-home-module">
              <div className="mlap-home-module-icon" />
              <span>Usuario</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
