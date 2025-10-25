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
            capilla: 'Capilla1',
            bautismo: 93,
            matrimonio: 132,
            confirmacion: 112
        },
        {
            capilla: 'Capilla2',
            bautismo: 93,
            matrimonio: 132,
            confirmacion: 112
        },
        {
            capilla: 'Capilla3',
            bautismo: 93,
            matrimonio: 132,
            confirmacion: 112
        },
        {
            capilla: 'Cap4',
            bautismo: 93,
            matrimonio: 132,
            confirmacion: 112
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