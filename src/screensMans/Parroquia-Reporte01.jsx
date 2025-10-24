import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';

export default function Reporte01P() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Parroquia";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Eventos generales realizados</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
