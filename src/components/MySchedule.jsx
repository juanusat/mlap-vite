import React from 'react';
import './MySchedule.css';

/**
 * Componente reutilizable de grilla de horarios
 * Puede usarse para gestión de horarios o reportes de ocupación
 * 
 * @param {Object} props
 * @param {Array<string>} props.timeSlots - Array de franjas horarias (ej: ['8:00 - 9:00', '9:00 - 10:00'])
 * @param {Array<string>} props.daysOfWeek - Array de nombres de días (ej: ['Lun', 'Mar', 'Mie'])
 * @param {Array<Date>} props.weekDates - Array de fechas para mostrar en el header (opcional)
 * @param {boolean} props.showDates - Si se muestran las fechas en el header (default: true)
 * @param {string} props.mode - 'schedule' para gestión de horarios, 'heatmap' para reporte (default: 'schedule')
 * @param {Function} props.renderCell - Función que renderiza cada celda: (rowIndex, colIndex) => JSX
 * @param {string} props.className - Clase adicional para el contenedor
 */
const MySchedule = ({ 
    timeSlots, 
    daysOfWeek, 
    weekDates = [],
    showDates = true,
    mode = 'schedule',
    renderCell,
    className = ''
}) => {
    return (
        <div className={`schedule-grid-container ${className}`}>
            <div className={`schedule-grid ${mode === 'heatmap' ? 'heatmap-mode' : 'schedule-mode'}`}>
                {/* Header */}
                <div className="grid-header table-schedule">
                    <div className="grid-cell header-cell"></div>
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="grid-cell header-cell">
                            <div className="day-name">{day}</div>
                            {showDates && weekDates[index] && (
                                <div className="day-date">
                                    {weekDates[index] instanceof Date 
                                        ? weekDates[index].getDate() 
                                        : weekDates[index]
                                    }
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Filas de horarios */}
                {timeSlots.map((timeSlot, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        <div className="grid-cell time-cell">{timeSlot}</div>
                        {daysOfWeek.map((_, colIndex) => (
                            <React.Fragment key={colIndex}>
                                {renderCell(rowIndex, colIndex)}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySchedule;
