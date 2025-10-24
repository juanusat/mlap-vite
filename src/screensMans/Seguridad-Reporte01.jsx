import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';

export default function Reporte01S() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Seguridad";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Frecuencia de roles asignados</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
