import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { getEventsByChapel } from '../services/reportService';
import { searchChapels } from '../services/chapelService';
import "../utils/Parroquia-Reporte01.css";

export default function Reporte01P() {
    const [selectedChapel, setSelectedChapel] = useState(null);
    const [availableChapels, setAvailableChapels] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "MLAP | Reporte 01-Parroquia";
        loadAvailableChapels();
    }, []);

    useEffect(() => {
        if (selectedChapel) {
            fetchEventDataByChapel(selectedChapel);
        }
    }, [selectedChapel]);

    const loadAvailableChapels = async () => {
        try {
            const response = await searchChapels(1, 100, '');
            const chapels = response.data || [];
            setAvailableChapels(chapels);
            if (chapels.length > 0) {
                setSelectedChapel(chapels[0].name);
            }
        } catch (error) {
            console.error('Error al cargar capillas:', error);
        }
    };

    const fetchEventDataByChapel = async (chapelName) => {
        setIsLoading(true);
        try {
            const response = await getEventsByChapel(chapelName);
            const events = response.data.events || [];
            
            const colors = ['#F28B82', '#4FC3F7', '#66BB6A', '#BA68C8', '#FFD54F', '#FF8A65', '#81C784', '#CE93D8'];
            
            const transformedData = events.map((event, index) => ({
                name: event.event_name,
                value: parseInt(event.count),
                color: colors[index % colors.length]
            }));
            
            setEventData(transformedData);
        } catch (error) {
            console.error('Error al cargar datos de eventos:', error);
            setEventData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getChartOption = () => {
        return {
            title: {
                text: 'Eventos realizados',
                left: 'center',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params) => {
                    const data = params[0];
                    return `<strong>${data.name}</strong><br/>Cantidad: ${data.value}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: eventData.map(item => item.name),
                axisLabel: {
                    interval: 0,
                    rotate: 30,
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cantidad de reservas',
                nameTextStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: 'Reservas',
                    type: 'bar',
                    data: eventData.map(item => ({
                        value: item.value,
                        itemStyle: {
                            color: item.color
                        }
                    })),
                    barMaxWidth: 60,
                    label: {
                        show: true,
                        position: 'top',
                        fontSize: 11
                    }
                }
            ]
        };
    };
    
    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gráfico 1: Eventos generales realizados</h2>
                <div className='app-container'>
                    <div className="filter-controls">
                        <label htmlFor="chapel-select-events">Capilla:</label>
                        <select 
                            id="chapel-select-events"
                            value={selectedChapel || ''}
                            onChange={(e) => setSelectedChapel(e.target.value)}
                            disabled={isLoading}
                        >
                            {availableChapels.map(chapel => (
                                <option key={chapel.id} value={chapel.name}>
                                    {chapel.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isLoading && (
                        <div className="loading-message">
                            <p>Cargando datos...</p>
                        </div>
                    )}

                    {!isLoading && eventData.length === 0 && (
                        <div className="empty-message">
                            <p>No hay datos de eventos para esta capilla.</p>
                        </div>
                    )}

                    {!isLoading && eventData.length > 0 && (
                        <div className="chart-container">
                            <ReactECharts 
                                option={getChartOption()} 
                                style={{ height: '500px', width: '100%' }}
                                opts={{ renderer: 'canvas' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
