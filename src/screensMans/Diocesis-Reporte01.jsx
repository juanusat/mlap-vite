import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import "../utils/Diocesis-Reporte01.css";

export default function Reporte01A() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Diocesis";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: eventos generales mas usados en capillas</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
