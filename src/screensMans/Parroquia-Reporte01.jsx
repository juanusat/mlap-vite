import React, { useState, useEffect } from 'react';
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

    const maxValue = eventData.length > 0 ? Math.max(...eventData.map(item => item.value)) : 140;
    
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
                            <div className="bar-chart">
                                <div className="chart-y-axis">
                                    <div className="y-axis-label">{maxValue}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.857)}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.714)}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.571)}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.428)}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.285)}</div>
                                    <div className="y-axis-label">{Math.round(maxValue * 0.142)}</div>
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
                    )}
                </div>
            </div>
        </>
    );
}
