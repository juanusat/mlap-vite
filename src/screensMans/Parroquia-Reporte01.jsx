import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import "../utils/Parroquia-Reporte01.css";

export default function Reporte01P() {
      React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Parroquia";
      }, []);

    // Datos del gráfico
    const eventData = [
        { name: 'Bautismo', value: 95, color: '#F28B82' },
        { name: 'Confirmación', value: 133, color: '#4FC3F7' },
        { name: 'Matrimonio', value: 118, color: '#66BB6A' },
        { name: 'Primera comunión', value: 78, color: '#BA68C8' }
    ];

    const maxValue = Math.max(...eventData.map(item => item.value));
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Eventos generales realizados</h2>
                <div className='app-container'>
                    <div className="chart-container">
                        <div className="bar-chart">
                            <div className="chart-y-axis">
                                <div className="y-axis-label">140</div>
                                <div className="y-axis-label">120</div>
                                <div className="y-axis-label">100</div>
                                <div className="y-axis-label">80</div>
                                <div className="y-axis-label">60</div>
                                <div className="y-axis-label">40</div>
                                <div className="y-axis-label">20</div>
                            </div>
                            <div className="chart-content">
                                <div className="y-axis-title">Cantidad de reservas realizadas</div>
                                <div className="bars-container">
                                    {eventData.map((item, index) => (
                                        <div key={index} className="bar-wrapper">
                                            <div 
                                                className="bar" 
                                                style={{
                                                    height: `${(item.value / maxValue) * 100}%`,
                                                    backgroundColor: item.color
                                                }}
                                            >
                                                <div className="bar-tooltip">
                                                    <strong>{item.name}</strong>
                                                    <br />
                                                    Cantidad: {item.value}
                                                </div>
                                            </div>
                                            <div className="bar-label">{item.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
