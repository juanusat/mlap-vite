import React, { useState } from 'react';
import MyButtonShortAction from '../components/MyButtonShortAction';
import '../components/MyButtonShortAction.css';
import "../utils/ActosLiturgicos-Reporte03.css";

export default function Reporte03A() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 03-Actos liturgicos";
    }, []);

    // Semana actual
    const getMondayOfCurrentWeek = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const [currentWeekStart, setCurrentWeekStart] = useState(getMondayOfCurrentWeek());

    // Datos de ejemplo para la ocupación (porcentaje de 0-100)
    // En producción, estos datos vendrían del backend
    const occupancyData = {
        0: { 0: 85, 1: 45, 2: 30, 3: 60, 4: 25, 5: 90, 6: 95 }, // Lun
        1: { 0: 20, 1: 55, 2: 70, 3: 40, 4: 80, 5: 35, 6: 50 }, // Mar
        2: { 0: 40, 1: 90, 2: 95, 3: 75, 4: 30, 5: 85, 6: 65 }, // Mie
        3: { 0: 95, 1: 70, 2: 50, 3: 85, 4: 40, 5: 60, 6: 30 }, // Jue
        4: { 0: 30, 1: 60, 2: 45, 3: 90, 4: 75, 5: 55, 6: 20 }, // Vie
        5: { 0: 75, 1: 40, 2: 85, 3: 95, 4: 50, 5: 90, 6: 70 }, // Sab
        6: { 0: 90, 1: 75, 2: 60, 3: 85, 4: 95, 5: 40, 6: 95 }  // Dom
    };

    const timeSlots = [
        '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
        '16:00 - 17:00', '17:00 - 18:00'
    ];

    const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    const getWeekDates = (startDate) => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const formatDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const navigateWeek = (direction) => {
        setCurrentWeekStart(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction * 7));
            return newDate;
        });
    };

    const weekDates = getWeekDates(currentWeekStart);

    // Función para determinar el nivel de ocupación
    const getOccupancyLevel = (percentage) => {
        if (percentage >= 80) return 'high';
        if (percentage >= 50) return 'medium';
        if (percentage >= 20) return 'low';
        return 'very-low';
    };

    // Función para obtener el color según ocupación
    const getOccupancyColor = (percentage) => {
        if (percentage >= 80) return '#66BB6A'; // Verde (alta ocupación)
        if (percentage >= 50) return '#4FC3F7'; // Azul (media ocupación)
        if (percentage >= 20) return '#FFB74D'; // Naranja (baja ocupación)
        return '#E0E0E0'; // Gris (muy baja ocupación)
    };

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Reporte 03: Horarios con más/menos ocupación</h2>
                <div className='app-container'>
                    <div className="reporte03-container">
                        
                        {/* Navegación de semana */}
                        <div className="week-navigation">
                            <MyButtonShortAction
                                type="back"
                                title="Semana anterior"
                                onClick={() => navigateWeek(-1)}
                            />
                            <span className="week-info">
                                Semana del {formatDate(weekDates[0])} al {formatDate(weekDates[6])}
                            </span>
                            <MyButtonShortAction
                                type="next"
                                title="Semana siguiente"
                                onClick={() => navigateWeek(1)}
                            />
                        </div>

                        {/* Leyenda de ocupación */}
                        <div className='occupancy-legend'>
                            <span className='legend-title'>Nivel de ocupación:</span>
                            <div className='legend-item'>
                                <div className='legend-color very-low'></div>
                                <span>Muy baja (&lt;20%)</span>
                            </div>
                            <div className='legend-item'>
                                <div className='legend-color low'></div>
                                <span>Baja (20-49%)</span>
                            </div>
                            <div className='legend-item'>
                                <div className='legend-color medium'></div>
                                <span>Media (50-79%)</span>
                            </div>
                            <div className='legend-item'>
                                <div className='legend-color high'></div>
                                <span>Alta (≥80%)</span>
                            </div>
                        </div>

                        {/* Grilla de horarios */}
                        <div className="occupancy-grid-container">
                            <div className="occupancy-grid">
                                <div className="grid-header">
                                    <div className="grid-cell header-cell"></div>
                                    {daysOfWeek.map((day, index) => (
                                        <div key={index} className="grid-cell header-cell">
                                            <div className="day-name">{day}</div>
                                            <div className="day-date">{weekDates[index].getDate()}</div>
                                        </div>
                                    ))}
                                </div>
                                {timeSlots.map((timeSlot, rowIndex) => (
                                    <div key={rowIndex} className="grid-row">
                                        <div className="grid-cell time-cell">{timeSlot}</div>
                                        {daysOfWeek.map((_, colIndex) => {
                                            const occupancy = occupancyData[colIndex]?.[rowIndex] || 0;
                                            const level = getOccupancyLevel(occupancy);
                                            const color = getOccupancyColor(occupancy);
                                            
                                            return (
                                                <div
                                                    key={colIndex}
                                                    className={`grid-cell occupancy-cell occupancy-${level}`}
                                                    data-occupancy={occupancy}
                                                    title={`Ocupación: ${occupancy}%`}
                                                >
                                                    <div 
                                                        className="occupancy-bar"
                                                        style={{ 
                                                            height: `${occupancy}%`,
                                                            backgroundColor: color
                                                        }}
                                                    >
                                                        <span className="occupancy-percentage">{occupancy}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
