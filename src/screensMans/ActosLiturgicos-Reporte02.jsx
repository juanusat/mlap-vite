import React from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import '../components/MyButtonMediumIcon.css';
import DateInput from '../components/formsUI/DateInput';
import "../utils/ActosLiturgicos-Reporte02.css";

export default function Reporte02A() {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    // Datos de ejemplo para el gráfico de líneas
    const chartData = [
        { day: 1, value: 20 },
        { day: 2, value: 120 },
        { day: 3, value: 165 },
        { day: 4, value: 165 },
        { day: 5, value: 260 },
        { day: 6, value: 315 },
        { day: 7, value: 220 },
        { day: 8, value: 165 },
        { day: 9, value: 105 },
        { day: 10, value: 105 }
    ];

    // Calcular valores mínimo y máximo para escala
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = 0;
    const chartHeight = 450;

    // Generar valores del eje Y
    const yAxisValues = [];
    const step = 20;
    for (let i = minValue; i <= maxValue + 20; i += step) {
        yAxisValues.push(i);
    }
    yAxisValues.reverse();

    // Calcular posición Y de cada punto
    const calculateY = (value) => {
        const percentage = (value - minValue) / (maxValue - minValue);
        return chartHeight - (percentage * chartHeight);
    };

    // Generar path SVG para la línea
    const generatePath = () => {
        const xStep = 800 / (chartData.length - 1); // Ancho del área del gráfico dividido entre puntos
        return chartData.map((point, index) => {
            const x = index * xStep;
            const y = calculateY(point.value);
            return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
        }).join(' ');
    };

    React.useEffect(() => {
        document.title = "MLAP | Reporte 02-Actos liturgicos";
    }, []);
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 02: Reservas por rango de fecha</h2>
                <div className='app-container reporte02-container'>
                    
                    {/* Filtros de fecha */}
                    <div className="date-filters">
                        <div className="date-filter-group">
                            <span className="date-label">Desde</span>
                            <DateInput 
                                name="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Seleccione una fecha"
                            />
                        </div>
                        <div className="date-filter-group">
                            <span className="date-label">hasta</span>
                            <DateInput 
                                name="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Seleccione una fecha"
                            />
                        </div>
                    </div>

                    {/* Gráfico de líneas */}
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
                                {/* Línea del gráfico */}
                                <path
                                    d={generatePath()}
                                    fill="none"
                                    stroke="#000"
                                    strokeWidth="2"
                                />
                                
                                {/* Puntos en la línea */}
                                {chartData.map((point, index) => {
                                    const xStep = 800 / (chartData.length - 1);
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
                            
                            {/* Tooltips para cada punto */}
                            {chartData.map((point, index) => {
                                const xStep = 100 / (chartData.length - 1);
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
                                        Cantidad: {point.value}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="chart-x-axis">
                            <div className="x-axis-label">Días</div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}
