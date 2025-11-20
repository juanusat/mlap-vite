import React, { useState, useEffect } from 'react';
import DateInput from '../components/formsUI/DateInput';
import { getReservationsByDateRange } from '../services/reportService';
import "../utils/ActosLiturgicos-Reporte02.css";

export default function Reporte02A() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "MLAP | Reporte 02-Actos liturgicos";
    }, []);

    const loadData = async () => {
        if (!startDate || !endDate) {
            alert('Por favor seleccione ambas fechas');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        }

        setIsLoading(true);
        try {
            const response = await getReservationsByDateRange(startDate, endDate);
            const transformedData = response.data.daily_reservations.map(item => ({
                day: parseInt(item.day_number),
                value: parseInt(item.count),
                date: item.date
            }));
            setChartData(transformedData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            alert(`Error al cargar datos: ${error.message}`);
            setChartData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;
    const minValue = 0;
    const chartHeight = 450;

    const yAxisValues = [];
    const step = maxValue > 0 ? Math.ceil(maxValue / 10) : 20;
    for (let i = minValue; i <= maxValue + step; i += step) {
        yAxisValues.push(i);
    }
    yAxisValues.reverse();

    const calculateY = (value) => {
        if (maxValue === minValue) return chartHeight / 2;
        const percentage = (value - minValue) / (maxValue - minValue);
        return chartHeight - (percentage * chartHeight);
    };

    const generatePath = () => {
        if (chartData.length === 0) return '';
        const xStep = 800 / (chartData.length - 1 || 1);
        return chartData.map((point, index) => {
            const x = index * xStep;
            const y = calculateY(point.value);
            return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    };
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gráfico 2: Reservas por rango de fecha</h2>
                <div className='app-container reporte02-container'>
                    
                    <div className="date-filters">
                        <div className="date-filter-group">
                            <span className="date-label">Desde</span>
                            <DateInput 
                                name="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Seleccione una fecha"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="date-filter-group">
                            <span className="date-label">hasta</span>
                            <DateInput 
                                name="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Seleccione una fecha"
                                disabled={isLoading}
                            />
                        </div>
                        <button 
                            className="load-data-btn"
                            onClick={loadData}
                            disabled={isLoading || !startDate || !endDate}
                        >
                            {isLoading ? 'Cargando...' : 'Generar Gráfico'}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="loading-message">
                            <p>Cargando datos...</p>
                        </div>
                    )}

                    {!isLoading && chartData.length === 0 && (
                        <div className="empty-message">
                            <p>Seleccione un rango de fechas y haga clic en "Generar Gráfico" para ver los datos.</p>
                        </div>
                    )}

                    {!isLoading && chartData.length > 0 && (
                        <div className="line-chart-container">
                            <div className="chart-y-axis">
                                <div className="y-axis-title">Cantidad de reservas</div>
                                {yAxisValues.map((value, index) => (
                                    <div key={index} className="y-axis-value">{value}</div>
                                ))}
                            </div>
                            
                            <div className="line-chart-area">
                                <svg 
                                    className="line-chart-svg" 
                                    viewBox="0 0 800 450" 
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d={generatePath()}
                                        fill="none"
                                        stroke="#000"
                                        strokeWidth="2"
                                    />
                                    
                                    {chartData.map((point, index) => {
                                        const xStep = 800 / (chartData.length - 1 || 1);
                                        const x = index * xStep;
                                        const y = calculateY(point.value);
                                        return (
                                            <g key={index}>
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r="8"
                                                    fill="#E53935"
                                                    stroke="#000"
                                                    strokeWidth="2"
                                                    className="chart-point"
                                                    data-value={point.value}
                                                    data-day={point.day}
                                                />
                                            </g>
                                        );
                                    })}
                                </svg>
                                
                                {chartData.map((point, index) => {
                                    const xStep = 100 / (chartData.length - 1 || 1);
                                    const xPercent = index * xStep;
                                    const yPercent = (calculateY(point.value) / chartHeight) * 100;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            className="point-tooltip"
                                            style={{
                                                left: `${xPercent}%`,
                                                top: `${yPercent}%`
                                            }}
                                        >
                                            <strong>Día {point.day}</strong>
                                            <br />
                                            {point.date}
                                            <br />
                                            Cantidad: {point.value}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="chart-x-axis">
                                <div className="x-axis-label">Días</div>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </>
    );
}
