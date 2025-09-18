import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../Home.css';
import MyBarSearchGen from '../components/MyBarSearchGen';
import ScreenMan from '../components/ScreenMan';
import MyButtonCenteredSides from '../components/MyButtonCenteredSides';


export default function BuscarParroquia() {
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  const scrollToSearch = () => {
    searchBarRef.current?.scrollAndFocus();
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
                MLAP es un sistema de gestión de eventos litúrgicos para la comunidad de la Parroquia de San Miguel Arcángel. Este proyecto ha sido creado para todas las personas creyentes y no creyentes para facilitarles el registro de algún acto litúrgico católico.<br /><br />
                No lo pienses más y empieza a explorar y a reservar en tu parroquia de tu región favorita.
              </p>
              <MyButtonCenteredSides>
                <button className="mlap-home-reserve-btn" onClick={scrollToSearch}>Reservar ahora</button>
              </MyButtonCenteredSides>
            </div>
          </div>
        </section>
        
      </div>
    </ScreenMan>
  );
}

