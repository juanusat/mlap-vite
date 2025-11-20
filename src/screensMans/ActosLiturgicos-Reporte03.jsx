import React, { useState, useEffect } from 'react';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MySchedule from '../components/MySchedule';
import { getOccupancyMap } from '../services/reportService';
import { searchChapels } from '../services/chapelService';
import '../components/MyButtonShortAction.css';
import "../utils/ActosLiturgicos-Reporte03.css";

export default function Reporte03A() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedChapel, setSelectedChapel] = useState(null);
    const [availableChapels, setAvailableChapels] = useState([]);
    const [occupancyData, setOccupancyData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "MLAP | Reporte 03-Actos liturgicos";
        loadAvailableChapels();
    }, []);

    useEffect(() => {
        if (selectedChapel) {
            fetchOccupancyByChapel(selectedChapel);
        }
    }, [selectedChapel, currentMonth]);

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

    const fetchOccupancyByChapel = async (chapelName) => {
        setIsLoading(true);
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;
            const response = await getOccupancyMap(chapelName, year, month);
            
            const transformedData = {};
            const occupancyArray = response.data.occupancy || [];
            
            occupancyArray.forEach(slot => {
                const timeIndex = timeSlots.findIndex(t => t.startsWith(slot.time));
                if (timeIndex === -1) return;
                
                transformedData[0] = transformedData[0] || {};
                transformedData[1] = transformedData[1] || {};
                transformedData[2] = transformedData[2] || {};
                transformedData[3] = transformedData[3] || {};
                transformedData[4] = transformedData[4] || {};
                transformedData[5] = transformedData[5] || {};
                transformedData[6] = transformedData[6] || {};
                
                transformedData[0][timeIndex] = slot.monday || 0;
                transformedData[1][timeIndex] = slot.tuesday || 0;
                transformedData[2][timeIndex] = slot.wednesday || 0;
                transformedData[3][timeIndex] = slot.thursday || 0;
                transformedData[4][timeIndex] = slot.friday || 0;
                transformedData[5][timeIndex] = slot.saturday || 0;
                transformedData[6][timeIndex] = slot.sunday || 0;
            });
            
            setOccupancyData(transformedData);
        } catch (error) {
            console.error('Error al cargar datos de ocupación:', error);
            setOccupancyData({});
        } finally {
            setIsLoading(false);
        }
    };

    const timeSlots = [
        '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
        '16:00 - 17:00', '17:00 - 18:00'
    ];

    const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);
            return newDate;
        });
    };

    const getMonthYear = () => {
        return `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    };

    // Función para obtener el color del mapa de calor
    const getHeatmapColor = (percentage) => {
        if (percentage === 0) return '#FFFFFF'; // Blanco (0%)
        if (percentage <= 25) return '#A8E6CF'; // Verde claro (1-25%)
        if (percentage <= 50) return '#FFD93D'; // Amarillo (26-50%)
        if (percentage <= 75) return '#FF9A3C'; // Naranja (51-75%)
        return '#D32F2F'; // Rojo oscuro (76-100%)
    };

    // Función para obtener el color del texto según el fondo
    const getTextColor = (percentage) => {
        if (percentage <= 25) return '#2E7D32'; // Verde oscuro para fondos claros
        if (percentage <= 50) return '#F57C00'; // Naranja oscuro
        return '#FFFFFF'; // Blanco para fondos oscuros
    };

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Mapa 1: Horarios con más/menos ocupación</h2>
                <div className='app-container'>
                    <div className="reporte03-container">
                        
                        <div className="controls-row">
                            <div className="chapel-selector">
                                <label htmlFor="chapel-select-occupancy">Capilla:</label>
                                <select 
                                    id="chapel-select-occupancy"
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

                            <div className="month-navigation">
                                <MyButtonShortAction
                                    type="back"
                                    title="Mes anterior"
                                    onClick={() => navigateMonth(-1)}
                                    disabled={isLoading}
                                />
                                <span className="month-info">
                                    {getMonthYear()}
                                </span>
                                <MyButtonShortAction
                                    type="next"
                                    title="Mes siguiente"
                                    onClick={() => navigateMonth(1)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {isLoading && (
                            <div className="loading-message">
                                <p>Cargando datos de ocupación...</p>
                            </div>
                        )}

                        {!isLoading && (
                            <>
                                <div className='occupancy-legend'>
                                    <span className='legend-title'>Nivel de ocupación (Mapa de calor):</span>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-zero'></div>
                                        <span>0%</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-low'></div>
                                        <span>1-25%</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-medium-low'></div>
                                        <span>26-50%</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-medium-high'></div>
                                        <span>51-75%</span>
                                    </div>
                                    <div className='legend-item'>
                                        <div className='legend-color heatmap-high'></div>
                                        <span>76-100%</span>
                                    </div>
                                </div>

                                <MySchedule
                                    timeSlots={timeSlots}
                                    daysOfWeek={daysOfWeek}
                                    showDates={false}
                                    mode="heatmap"
                                    renderCell={(rowIndex, colIndex) => {
                                        const occupancy = occupancyData[colIndex]?.[rowIndex] || 0;
                                        const bgColor = getHeatmapColor(occupancy);
                                        const textColor = getTextColor(occupancy);
                                        
                                        return (
                                            <div
                                                className="grid-cell heatmap-cell"
                                                style={{ 
                                                    backgroundColor: bgColor,
                                                    color: textColor
                                                }}
                                                title={`Ocupación: ${occupancy}%`}
                                            >
                                                <span className="heatmap-percentage">{occupancy}%</span>
                                            </div>
                                        );
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
