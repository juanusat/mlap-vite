import React from 'react';
import GroupedBarChart from '../components/charts/GroupedBarChart';
import "../utils/ActosLiturgicos-Reporte01.css";

export default function Reporte01A() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 01-Actos Litúrgicos";
    }, []);

    // Datos de ejemplo de reservas por capilla
    const reservasData = [
        {
            capilla: 'Capilla Santa Ana',
            bautismo: 120,
            matrimonio: 55,
            confirmacion: 72
        },
        {
            capilla: 'Capilla Santa Clara',
            bautismo: 93,
            matrimonio: 170,
            confirmacion: 112
        },
        {
            capilla: 'Capilla Santa Cruz',
            bautismo: 88,
            matrimonio: 150,
            confirmacion: 120
        },
        {
            capilla: 'Capilla Santa Teresa',
            bautismo: 30,
            matrimonio: 42,
            confirmacion: 101
        }
    ];

    const capillas = reservasData.map(item => item.capilla);

    // Calcular totales
    const totalBautismos = reservasData.reduce((sum, item) => sum + item.bautismo, 0);
    const totalMatrimonios = reservasData.reduce((sum, item) => sum + item.matrimonio, 0);
    const totalConfirmaciones = reservasData.reduce((sum, item) => sum + item.confirmacion, 0);
    const totalReservas = totalBautismos + totalMatrimonios + totalConfirmaciones;

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 01: Reservas realizadas por capilla</h2>
                <div className='app-container'>
                    <div className="reporte01-container">
                        
                        {/* Contenedor principal con gráfico y resumen */}
                        <div className="chart-summary-wrapper">
                            
                            {/* Gráfico de barras agrupadas */}
                            <div className="chart-section">
                                <GroupedBarChart 
                                    data={reservasData}
                                    categories={capillas}
                                />
                            </div>

                            {/* Resumen de eventos y Leyenda */}
                            <div className="summary-section">
                                <h3 className="summary-title">Resumen por Evento</h3>
                                
                                <div className="summary-item">
                                    <div className="summary-indicator bautismo-indicator"></div>
                                    <div className="summary-content">
                                        <span className="summary-label">Bautismo</span>
                                        <span className="summary-value">{totalBautismos}</span>
                                    </div>
                                </div>

                                <div className="summary-item">
                                    <div className="summary-indicator matrimonio-indicator"></div>
                                    <div className="summary-content">
                                        <span className="summary-label">Matrimonio</span>
                                        <span className="summary-value">{totalMatrimonios}</span>
                                    </div>
                                </div>

                                <div className="summary-item">
                                    <div className="summary-indicator confirmacion-indicator"></div>
                                    <div className="summary-content">
                                        <span className="summary-label">Confirmación</span>
                                        <span className="summary-value">{totalConfirmaciones}</span>
                                    </div>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span className="total-label">Total de Reservas</span>
                                    <span className="total-value">{totalReservas}</span>
                                </div>

                                {/* Leyenda para el gráfico (ahora en el summary, como en el figma) */}
                                <div className="chart-legend-section">
                                    {/* El título se omite porque el Figma no lo tiene en esta sección de leyenda */}
                                    <div className="chart-legend-item">
                                        <div className="summary-indicator bautismo-indicator"></div>
                                        <span>Bautismo</span>
                                    </div>
                                    <div className="chart-legend-item">
                                        <div className="summary-indicator matrimonio-indicator"></div>
                                        <span>Matrimonio</span>
                                    </div>
                                    <div className="chart-legend-item">
                                        <div className="summary-indicator confirmacion-indicator"></div>
                                        <span>Confirmación</span>
                                    </div>
                                </div>
                            </div> {/* Fin summary-section */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}