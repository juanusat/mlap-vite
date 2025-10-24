import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';

export default function Reporte02R() {
      React.useEffect(() => {
        document.title = "MLAP | Reservar evento";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 02: Cantidad de reservas completadas</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
