import React, { useState } from 'react';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MySchedule from '../components/MySchedule';
import '../components/MyButtonShortAction.css';
import "../utils/ActosLiturgicos-Reporte03.css";

export default function Reporte03A() {
    React.useEffect(() => {
        document.title = "MLAP | Reporte 03-Actos liturgicos";
    }, []);

    // Mes actual
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Datos de ejemplo para la ocupación (porcentaje de 0-100)
    // En producción, estos datos vendrían del backend
    const occupancyData = {
        0: { 0: 0, 1: 15, 2: 30, 3: 60, 4: 25, 5: 90, 6: 95, 7: 5, 8: 80, 9: 45 }, // Lun
        1: { 0: 20, 1: 55, 2: 70, 3: 40, 4: 80, 5: 35, 6: 50, 7: 10, 8: 65, 9: 88 }, // Mar
        2: { 0: 40, 1: 90, 2: 95, 3: 75, 4: 30, 5: 85, 6: 65, 7: 18, 8: 52, 9: 77 }, // Mie
        3: { 0: 95, 1: 70, 2: 50, 3: 85, 4: 40, 5: 60, 6: 30, 7: 22, 8: 48, 9: 92 }, // Jue
        4: { 0: 30, 1: 60, 2: 45, 3: 90, 4: 75, 5: 55, 6: 20, 7: 12, 8: 68, 9: 83 }, // Vie
        5: { 0: 75, 1: 40, 2: 85, 3: 95, 4: 50, 5: 90, 6: 70, 7: 28, 8: 100, 9: 58 }, // Sab
        6: { 0: 90, 1: 75, 2: 60, 3: 85, 4: 95, 5: 40, 6: 95, 7: 35, 8: 72, 9: 62 }  // Dom
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
                <h2 className='title-screen'>Reporte 03: Horarios con más/menos ocupación</h2>
                <div className='app-container'>
                    <div className="reporte03-container">
                        
                        {/* Navegación de mes */}
                        <div className="month-navigation">
                            <MyButtonShortAction
                                type="back"
                                title="Mes anterior"
                                onClick={() => navigateMonth(-1)}
                            />
                            <span className="month-info">
                                {getMonthYear()}
                            </span>
                            <MyButtonShortAction
                                type="next"
                                title="Mes siguiente"
                                onClick={() => navigateMonth(1)}
                            />
                        </div>

                        {/* Leyenda de ocupación - Mapa de calor */}
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

                        {/* Grilla de horarios - Mapa de calor */}
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
                    </div>
                </div>
            </div>
        </>
    );
}
