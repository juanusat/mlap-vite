import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import "../utils/ActosLiturgicos-Reporte03.css";

export default function Reporte03A() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 03-Actos liturgicos";
      }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 03: Horarios con más/menos ocupación</h2>
                <div className='app-container'>
                    
                </div>
            </div>
        </>
    );
}
