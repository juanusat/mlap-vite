import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
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
                date: item.date,
                count: parseInt(item.count)
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

    const getChartOption = () => {
        const dates = chartData.map(item => item.date);
        const counts = chartData.map(item => item.count);

        return {
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const param = params[0];
                    return `${param.axisValue}: ${param.value}`;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderColor: 'transparent',
                textStyle: {
                    color: '#000000ff',
                    fontSize: 11
                },
                padding: [5, 8],
                extraCssText: 'box-shadow: 0 2px 6px rgba(0,0,0,0.15); border-radius: 4px; max-width: 100px; max-height: 50px;'
            },
            grid: {
                left: '10%',
                right: '5%',
                bottom: '15%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: {
                    rotate: 45,
                    fontSize: 11,
                    color: '#666'
                },
                axisLine: {
                    lineStyle: {
                        color: '#000',
                        width: 2
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cantidad de reservas',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 13,
                    fontWeight: 'bold'
                },
                minInterval: 1,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#000',
                        width: 2
                    }
                },
                axisLabel: {
                    color: '#666'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#e0e0e0'
                    }
                }
            },
            series: [
                {
                    name: 'Reservas',
                    type: 'line',
                    data: counts,
                    smooth: false,
                    lineStyle: {
                        color: '#000',
                        width: 2
                    },
                    itemStyle: {
                        color: '#E53935',
                        borderColor: '#000',
                        borderWidth: 2
                    },
                    symbolSize: 10,
                    emphasis: {
                        itemStyle: {
                            color: '#C62828',
                            borderColor: '#000',
                            borderWidth: 3
                        },
                        symbolSize: 14
                    }
                }
            ]
        };
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
                            <ReactEcharts 
                                option={getChartOption()}
                                className="line-chart-echarts"
                            />
                        </div>
                    )}
                    
                </div>
            </div>
        </>
    );
}
