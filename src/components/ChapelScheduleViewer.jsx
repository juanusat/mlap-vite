import React, { useState, useEffect } from 'react';
import MySchedule from './MySchedule';
import MyButtonShortAction from './MyButtonShortAction';
import * as scheduleService from '../services/scheduleService';
import './ChapelScheduleViewer.css';

const ChapelScheduleViewer = ({ chapelId, parishId }) => {
  const [chapelSchedule, setChapelSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMondayOfCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(getMondayOfCurrentWeek());

  const getWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + (direction * 7));
      return newDate;
    });
  };

  const weekDates = getWeekDates(currentWeekStart);

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const loadChapelSchedule = async () => {
      if (!chapelId || !parishId) {
        setChapelSchedule(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const generalSchedulesResponse = await scheduleService.listGeneralSchedules(parishId, chapelId);
        
        const startDate = weekDates[0].toISOString().split('T')[0];
        const endDate = weekDates[6].toISOString().split('T')[0];
        
        const specificSchedulesResponse = await scheduleService.listSpecificSchedules(
          parishId, 
          chapelId, 
          1, 
          100, 
          { 
            date_range: {
              start: startDate,
              end: endDate
            }
          }
        );
        
        setChapelSchedule({
          general: generalSchedulesResponse?.data || [],
          specific: specificSchedulesResponse?.data || []
        });
      } catch (err) {
        setError(err.message || 'Error al cargar horario');
        setChapelSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    loadChapelSchedule();
  }, [chapelId, parishId, currentWeekStart]);

  const prepareScheduleData = () => {
    
    if (!chapelSchedule) {
      return null;
    }

    try {
      const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
      
      const timeSlots = [
        '6:00 - 7:00','7:00 - 8:00','8:00 - 9:00','9:00 - 10:00','10:00 - 11:00','11:00 - 12:00',
        '12:00 - 13:00','13:00 - 14:00','14:00 - 15:00','15:00 - 16:00','16:00 - 17:00','17:00 - 18:00',
        '18:00 - 19:00','19:00 - 20:00','20:00 - 21:00','21:00 - 22:00'
      ];

      const SLOT_START_HOUR = 6;

      // Matriz: [rowIndex (timeSlot)][colIndex (day)] => { available, exception }
      const scheduleMatrix = Array(timeSlots.length).fill(null).map(() => 
        Array(7).fill(null).map(() => ({ available: false, exception: null }))
      );

      // Procesar horarios generales - day_of_week es 0-6 (0=Lunes, 6=Domingo)
      if (chapelSchedule.general && Array.isArray(chapelSchedule.general)) {
        chapelSchedule.general.forEach(schedule => {
          const dayOfWeek = schedule.day_of_week; // 0=Lun, 1=Mar, ..., 6=Dom
          const startTime = schedule.start_time; // "HH:MM:SS"
          const endTime = schedule.end_time;

          const startHour = parseInt(startTime.split(':')[0]);
          const endHour = parseInt(endTime.split(':')[0]);

          // Marcar las celdas del horario general
          for (let hour = startHour; hour < endHour; hour++) {
            const rowIndex = hour - SLOT_START_HOUR;
            if (rowIndex >= 0 && rowIndex < timeSlots.length) {
              scheduleMatrix[rowIndex][dayOfWeek].available = true;
            }
          }
        });
      }

      // Procesar horarios específicos (excepciones) para la semana actual
      if (chapelSchedule.specific && Array.isArray(chapelSchedule.specific)) {
        chapelSchedule.specific.forEach(exception => {
          if (!exception.date || !exception.start_time || !exception.end_time) {
            return;
          }

          // exception.date es en formato "YYYY-MM-DD" o "YYYY-MM-DDTHH:MM:SS"
          const exceptionDateStr = exception.date.split('T')[0]; // "YYYY-MM-DD"
          
          // Encontrar qué día de la semana actual corresponde
          const dayIndex = weekDates.findIndex(weekDate => {
            const weekDateStr = weekDate.toISOString().split('T')[0];
            return weekDateStr === exceptionDateStr;
          });

          if (dayIndex === -1) {
            // Esta excepción no está en la semana actual
            return;
          }

          const startHour = parseInt(exception.start_time.split(':')[0]);
          const endHour = parseInt(exception.end_time.split(':')[0]);
          const exceptionType = exception.exception_type; // 'OPEN' o 'CLOSED'

          // Aplicar excepción
          for (let hour = startHour; hour < endHour; hour++) {
            const rowIndex = hour - SLOT_START_HOUR;
            if (rowIndex >= 0 && rowIndex < timeSlots.length) {
              scheduleMatrix[rowIndex][dayIndex].exception = exceptionType;
              // Si es una excepción OPEN, también marcamos como available
              if (exceptionType === 'OPEN') {
                scheduleMatrix[rowIndex][dayIndex].available = true;
              } else {
                // Si es CLOSED, removemos la disponibilidad
                scheduleMatrix[rowIndex][dayIndex].available = false;
              }
            }
          }
        });
      }

      const result = { timeSlots, daysOfWeek, scheduleMatrix };
      return result;
    } catch (err) {
      return null;
    }
  };

  const renderScheduleCell = (rowIndex, colIndex, scheduleData) => {
    try {
      if (!scheduleData || !scheduleData.scheduleMatrix || 
          !scheduleData.scheduleMatrix[rowIndex] || 
          !scheduleData.scheduleMatrix[rowIndex][colIndex]) {
        return (
          <div className="grid-cell day-cell"></div>
        );
      }

      const cell = scheduleData.scheduleMatrix[rowIndex][colIndex];
      
      const hasException = cell.exception !== null;
      const exceptionType = hasException 
        ? (cell.exception === 'OPEN' ? 'disponibilidad' : 'noDisponibilidad')
        : '';
      const isSelected = cell.available && !hasException;

      return (
        <div className={`grid-cell day-cell ${isSelected ? 'selected' : ''} ${hasException ? 'exception' : ''} ${exceptionType === 'disponibilidad' ? 'exception-disponibilidad' : ''} ${exceptionType === 'noDisponibilidad' ? 'exception-no-disponibilidad' : ''}`}>
          {isSelected && (
            <div className="interval-marker"></div>
          )}
          {hasException && (
            <div className={`exception-marker ${exceptionType === 'disponibilidad' ? 'exception-marker-disponibilidad' : 'exception-marker-no-disponibilidad'}`}></div>
          )}
        </div>
      );
    } catch (err) {
      return (
        <div className="grid-cell day-cell"></div>
      );
    }
  };

  const scheduleData = prepareScheduleData();

  return (
    <div className="chapel-schedule-viewer">
      <h3>Horario de la Capilla</h3>
      {loading ? (
        <div className="chapel-schedule-loading">
          Cargando horario...
        </div>
      ) : error ? (
        <div className="chapel-schedule-error">
          {error}
        </div>
      ) : scheduleData ? (
        <>
          <div className="chapel-week-navigation">
            <MyButtonShortAction
              type="back"
              title="Semana anterior"
              onClick={() => navigateWeek(-1)}
            />
            <span className="chapel-week-info">
              Semana del {formatDate(weekDates[0])} al {formatDate(weekDates[6])}
            </span>
            <MyButtonShortAction
              type="next"
              title="Semana siguiente"
              onClick={() => navigateWeek(1)}
            />
          </div>
          <div className="chapel-schedule-legend">
            <div className="chapel-legend-items">
              <div className="chapel-legend-item">
                <div className="chapel-legend-color color-hnormal"></div>
                <span>Normal</span>
              </div>
              <div className="chapel-legend-item">
                <div className="chapel-legend-color color-hdisponible"></div>
                <span>Ex. Disponible</span>
              </div>
              <div className="chapel-legend-item">
                <div className="chapel-legend-color color-hno-disponible"></div>
                <span>Ex. No Disponible</span>
              </div>
            </div>
          </div>
          <div className="chapel-schedule-grid-container">
            <MySchedule
              timeSlots={scheduleData.timeSlots}
              daysOfWeek={scheduleData.daysOfWeek}
              weekDates={weekDates}
              showDates={true}
              mode="schedule"
              renderCell={(rowIndex, colIndex) => renderScheduleCell(rowIndex, colIndex, scheduleData)}
            />
          </div>
        </>
      ) : (
        <div className="chapel-schedule-empty">
          No se pudo cargar el horario de la capilla
        </div>
      )}
    </div>
  );
};

export default ChapelScheduleViewer;
