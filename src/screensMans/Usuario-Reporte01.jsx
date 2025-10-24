import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import "../utils/Usuario-Reporte01.css";

export default function Reporte01U() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Usuario";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Cambios en la cuenta</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
