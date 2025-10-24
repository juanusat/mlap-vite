import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import './Reservas-Reservar.css';

export default function Reporte02A() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 02-Actos liturgicos";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 02: Reservas por rango de fecha</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
