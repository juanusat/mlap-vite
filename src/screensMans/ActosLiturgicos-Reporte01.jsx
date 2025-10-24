import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import "../utils/ActosLiturgicos-Reporte01.css";

export default function Reporte01A() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Actos liturgicos";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: eventos realizados por capilla</h2>
                <div className='app-container'>
                     
                </div>
            </div>
        </>
    );
}
