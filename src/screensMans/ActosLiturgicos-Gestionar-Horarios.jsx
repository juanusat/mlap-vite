import React, { useState, useEffect } from 'react';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import Modal from '../components/Modal';
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import MySchedule from '../components/MySchedule';
import SearchBar from '../components/SearchBar';
import * as scheduleService from '../services/scheduleService';
import * as chapelService from '../services/chapelService';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';
import NoPermissionMessage from '../components/NoPermissionMessage';
import '../utils/Estilos-Generales-1.css';
import './ActosLiturgicos-Gestionar-Horarios.css';

// Componente reutilizable para cada sección de excepciones
function ExcepcionesSection({
    title,
    exceptions,
    onAdd,
    onEdit,
    onDelete,
    canCreate,
    canUpdate,
    canDelete,
    ITEMS_PER_PAGE = 4
}) {
    const [activeTab, setActiveTab] = useState('futuras');
    const [page, setPage] = useState(0);
    const [, forceUpdate] = useState();

    // Forzar actualización a medianoche para mover excepciones de futuras a pasadas
    useEffect(() => {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        const timeout = setTimeout(() => {
            forceUpdate({}); // Forzar re-render
            // Configurar intervalo diario
            const interval = setInterval(() => {
                forceUpdate({});
            }, 24 * 60 * 60 * 1000); // 24 horas
            
            return () => clearInterval(interval);
        }, msUntilMidnight);
        
        return () => clearTimeout(timeout);
    }, []);

    // Filtrado por fecha
    const parseDate = (dateStr) => {
        // dateStr viene en formato DD/MM/YYYY
        const [day, month, year] = dateStr.split('/');
        const fullYear = year.length === 2 ? '20' + year : year;
        // Crear fecha en hora local (no UTC)
        return new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
    };
    const isFuture = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exceptionDate = parseDate(dateStr);
        return exceptionDate >= today;
    };
    const filterExceptions = (exceptions, tab) => {
        return exceptions.filter(ex => tab === 'futuras' ? isFuture(ex.fecha) : !isFuture(ex.fecha));
    };

    const filtered = filterExceptions(exceptions, activeTab);
    const hasNextPage = (currentPage) => (currentPage + 1) * ITEMS_PER_PAGE < filtered.length;
    const hasPrevPage = (currentPage) => currentPage > 0;
    const getPaginatedItems = (currentPage) => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    // Reset paginación al cambiar de pestaña
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(0);
    };

    return (
        <div className="exceptions-section">
            <div className="exceptions-header">
                <h4>{title}</h4>
                <div className="exceptions-tabs">
                    <button
                        className={activeTab === 'futuras' ? 'active' : ''}
                        onClick={() => handleTabChange('futuras')}
                    >
                        Próximas
                    </button>
                    <button
                        className={activeTab === 'pasadas' ? 'active' : ''}
                        onClick={() => handleTabChange('pasadas')}
                    >
                        Pasadas
                    </button>
                </div>
                <div className="exceptions-controls">
                    {hasPrevPage(page) && (
                        <MyButtonShortAction
                            type="back"
                            title="Página anterior"
                            onClick={() => setPage(prev => prev - 1)}
                        />
                    )}
                    {canCreate && (
                        <MyButtonShortAction
                            type="add"
                            title={`Agregar ${title.toLowerCase()}`}
                            onClick={onAdd}
                        />
                    )}
                    {hasNextPage(page) && (
                        <MyButtonShortAction
                            type="next"
                            title="Página siguiente"
                            onClick={() => setPage(prev => prev + 1)}
                        />
                    )}
                </div>
            </div>
            <div className="exceptions-table">
                <div className="exceptions-table-header">
                    <div className="exception-cell">Fecha</div>
                    <div className="exception-cell">Hora</div>
                    <div className="exception-cell actions-cell"></div>
                </div>
                {getPaginatedItems(page).map((exception, index) => (
                    <div key={index} className="exceptions-table-row">
                        <div className="exception-cell">{exception.fecha}</div>
                        <div className="exception-cell">{exception.hora}</div>
                        <div className="exception-cell actions-cell">
                            <div className="exception-actions">
                                {canUpdate && (
                                    <MyButtonShortAction type="edit" title="Editar excepción" onClick={() => onEdit(exception)} />
                                )}
                                {canDelete && (
                                    <MyButtonShortAction type="delete" title="Eliminar excepción" onClick={() => onDelete(exception)} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ActosLiturgicosHorarios() {
      React.useEffect(() => {
        document.title = "MLAP | Gestionar Horarios";
        loadCapillas();
    }, []);

    const { hasPermission } = usePermissions();
    const canCreateSchedule = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_HORA_C);
    const canUpdateSchedule = hasPermission(PERMISSIONS.ACTOS_LITURGICOS_HORA_U);
    const canCreateDispException = hasPermission(PERMISSIONS.EXCEP_DISP_C);
    const canUpdateDispException = hasPermission(PERMISSIONS.EXCEP_DISP_U);
    const canDeleteDispException = hasPermission(PERMISSIONS.EXCEP_DISP_D);
    const canCreateNoDispException = hasPermission(PERMISSIONS.EXCEP_NO_DISP_C);
    const canUpdateNoDispException = hasPermission(PERMISSIONS.EXCEP_NO_DISP_U);
    const canDeleteNoDispException = hasPermission(PERMISSIONS.EXCEP_NO_DISP_D);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parishId, setParishId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('disponibilidad');
    const [modalAction, setModalAction] = useState('add');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIntervals, setSelectedIntervals] = useState({});
    const [savedIntervals, setSavedIntervals] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [startRow, setStartRow] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [isMouseMoved, setIsMouseMoved] = useState(false);
    const [modalError, setModalError] = useState('');

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

    // Formulario excepciones
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [motivo, setMotivo] = useState('');
    const [selectedException, setSelectedException] = useState(null);
    const [selectedExceptionType, setSelectedExceptionType] = useState(null);

    const ITEMS_PER_PAGE = 4;

    // Franja horaria desde 06:00 hasta 22:00 (última franja 21:00 - 22:00)
    const timeSlots = [
        '6:00 - 7:00','7:00 - 8:00','8:00 - 9:00','9:00 - 10:00','10:00 - 11:00','11:00 - 12:00',
        '12:00 - 13:00','13:00 - 14:00','14:00 - 15:00','15:00 - 16:00','16:00 - 17:00','17:00 - 18:00',
        '18:00 - 19:00','19:00 - 20:00','20:00 - 21:00','21:00 - 22:00'
    ];

    // Configuración de la grilla horaria
    const SLOT_START_HOUR = 6; // hora inicial (6:00)
    const SLOT_COUNT = timeSlots.length; // número de franjas

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
    
    // Capillas - se cargarán desde el backend
    const [capillas, setCapillas] = useState([]);

    // Cargar capillas desde el backend
    const loadCapillas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await chapelService.searchChapels(1, 100, '');
            const capillasData = response.data.map(chapel => ({
                id: chapel.id,
                nombre: chapel.name,
                direccion: chapel.address,
                exceptionsDisponibilidad: [],
                exceptionsNoDisponibilidad: [],
                savedIntervals: {}
            }));
            setCapillas(capillasData);
            // NO cargar automáticamente la primera capilla
        } catch (err) {
            setError(err.message || 'Error al cargar las capillas');
        } finally {
            setLoading(false);
        }
    };

    // Cargar horarios de una capilla específica
    const loadSchedulesForChapel = async (chapelId) => {
        if (!chapelId) return;
        
        try {
            setLoading(true);
            const parishIdTemp = 1; // El backend lo valida del JWT
            
            // Cargar horarios generales
            const generalResponse = await scheduleService.listGeneralSchedules(parishIdTemp, chapelId);
            const generalSchedules = generalResponse.data || [];
            
            // Convertir horarios generales a intervalos guardados
            const savedIntervalsData = {};
            generalSchedules.forEach(schedule => {
                const dayKey = schedule.day_of_week;
                if (!savedIntervalsData[dayKey]) {
                    savedIntervalsData[dayKey] = [];
                }
                
                const startHour = parseInt(schedule.start_time.split(':')[0]);
                const endHour = parseInt(schedule.end_time.split(':')[0]);
                const startRow = startHour - SLOT_START_HOUR;
                const endRow = endHour - SLOT_START_HOUR;

                for (let row = startRow; row < endRow; row++) {
                    if (row >= 0 && row < SLOT_COUNT) {
                        savedIntervalsData[dayKey].push(row);
                    }
                }
            });
            
            setSavedIntervals(savedIntervalsData);
            setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervalsData)));
            
            // Cargar excepciones de disponibilidad
            const dispResponse = await scheduleService.listSpecificSchedules(
                parishIdTemp, chapelId, 1, 100, { exception_type: 'OPEN' }
            );
            const dispExceptions = (dispResponse.data || []).map(ex => {
                const fechaFormateada = formatDateFromDB(ex.date);
                const horaFormateada = ex.start_time && ex.end_time 
                    ? `${ex.start_time.substring(0, 5)} - ${ex.end_time.substring(0, 5)}` 
                    : '';
                return {
                    id: ex.id,
                    fecha: fechaFormateada,
                    hora: horaFormateada,
                    motivo: ex.reason || '',
                    startTime: ex.start_time ? ex.start_time.substring(0, 5) : null,
                    endTime: ex.end_time ? ex.end_time.substring(0, 5) : null
                };
            });
            setExceptionsDisponibilidad(dispExceptions);
            
            // Cargar excepciones de no disponibilidad
            const noDispResponse = await scheduleService.listSpecificSchedules(
                parishIdTemp, chapelId, 1, 100, { exception_type: 'CLOSED' }
            );
            const noDispExceptions = (noDispResponse.data || []).map(ex => {
                const fechaFormateada = formatDateFromDB(ex.date);
                const horaFormateada = ex.start_time && ex.end_time 
                    ? `${ex.start_time.substring(0, 5)} - ${ex.end_time.substring(0, 5)}` 
                    : '';
                return {
                    id: ex.id,
                    fecha: fechaFormateada,
                    hora: horaFormateada,
                    motivo: ex.reason || '',
                    startTime: ex.start_time ? ex.start_time.substring(0, 5) : null,
                    endTime: ex.end_time ? ex.end_time.substring(0, 5) : null
                };
            });
            setExceptionsNoDisponibilidad(noDispExceptions);
            
        } catch (err) {
            setError(err.message || 'Error al cargar los horarios');
        } finally {
            setLoading(false);
        }
    };

    const formatDateFromDB = (dateStr) => {
        // dateStr viene en formato YYYY-MM-DD o puede ser un objeto Date
        if (dateStr instanceof Date) {
            const day = dateStr.getDate().toString().padStart(2, '0');
            const month = (dateStr.getMonth() + 1).toString().padStart(2, '0');
            const year = dateStr.getFullYear();
            return `${day}/${month}/${year}`;
        }
        
        // Si es string, asumimos formato YYYY-MM-DD
        const [year, month, day] = dateStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    };

    const formatDateToDB = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        let fullYear = year;
        if (year.length === 2) {
            fullYear = '20' + year;
        }
        return `${fullYear}-${month}-${day}`;
    };

    // Validaciones para fecha y hora en el modal
    const validateDateFormat = (dateStr) => {
        // Acepta dd/MM/YY o dd/MM/YYYY
        if (!/^\d{2}\/\d{2}\/\d{2,4}$/.test(dateStr)) return false;
        const [day, month, year] = dateStr.split('/');
        const fullYear = year.length === 2 ? '20' + year : year;
        const d = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
        return d && d.getFullYear() === parseInt(fullYear) && (d.getMonth() + 1) === parseInt(month) && d.getDate() === parseInt(day);
    };

    const validateTimeFormat = (timeStr) => {
        // Acepta H:00 o HH:00, minutos deben ser "00"
        if (!/^([0-1]?\d|2[0-3]):00$/.test(timeStr)) return false;
        // además verificar que esté dentro del rango permitido (06:00 - 22:00)
        const hour = parseInt(timeStr.split(':')[0]);
        return hour >= SLOT_START_HOUR && hour <= (SLOT_START_HOUR + SLOT_COUNT);
    };

    const [selectedCapillaIndex, setSelectedCapillaIndex] = useState(null);
    const [showPanelLateral, setShowPanelLateral] = useState(false);
    const [searchTermCapilla, setSearchTermCapilla] = useState('');

    // Estados por capilla
    const [exceptionsDisponibilidad, setExceptionsDisponibilidad] = useState([]);
    const [exceptionsNoDisponibilidad, setExceptionsNoDisponibilidad] = useState([]);

    // sincronizar al cambiar la capilla seleccionada
    useEffect(() => {
        if (selectedCapillaIndex === null) return;
        const cap = capillas[selectedCapillaIndex];
        if (!cap) return;
        loadSchedulesForChapel(cap.id);
        setIsEditing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCapillaIndex]);

    // persistir cambios locales eliminado - ya no necesitamos sincronizar localmente

    const handleOpenModal = (type) => {
        if (selectedCapillaIndex === null || !capillas[selectedCapillaIndex]) {
            alert('Por favor, selecciona una capilla primero.');
            return;
        }
        const canCreate = type === 'disponibilidad' ? canCreateDispException : canCreateNoDispException;
        if (!canCreate) {
            alert('No tienes permisos para crear esta excepción.');
            return;
        }
        setModalType(type);
        setModalAction('add');
        setModalError('');
        setShowModal(true);
    };

    const handleEditException = (exception, type) => {
        const canEdit = type === 'disponibilidad' ? canUpdateDispException : canUpdateNoDispException;
        if (!canEdit) {
            alert('No tienes permisos para editar esta excepción.');
            return;
        }
        setModalType(type);
        setModalAction('edit');
        setFecha(exception.fecha);
        const [start, end] = exception.hora.split(' - ');
        setHoraInicio(start);
        setHoraFin(end);
        setMotivo(exception.motivo);
        setSelectedException(exception);
        setSelectedExceptionType(type);
        setShowModal(true);
    };

    const handleDeleteException = async (exception, type) => {
        const canDel = type === 'disponibilidad' ? canDeleteDispException : canDeleteNoDispException;
        if (!canDel) {
            alert('No tienes permisos para eliminar esta excepción.');
            return;
        }
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta excepción?')) {
            return;
        }
        
        try {
            setLoading(true);
            const parishIdTemp = 1;
            const chapelId = capillas[selectedCapillaIndex]?.id;
            
            await scheduleService.deleteSpecificSchedule(parishIdTemp, chapelId, exception.id);
            
            // Recargar excepciones
            await loadSchedulesForChapel(chapelId);
        } catch (err) {
            setError(err.message || 'Error al eliminar la excepción');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelModal = () => {
        setShowModal(false);
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        setMotivo('');
        setSelectedException(null);
        setSelectedExceptionType(null);
        setModalAction('add');
        setModalError('');
    };

    const handleAcceptModal = async () => {
        // Validaciones antes de enviar
        if (modalAction !== 'delete') {
            // Validar que todos los campos estén completos
            if (!fecha || fecha.trim() === '') {
                setModalError('La fecha es obligatoria.');
                return;
            }

            if (!horaInicio || horaInicio.trim() === '') {
                setModalError('La hora de inicio es obligatoria.');
                return;
            }

            if (!horaFin || horaFin.trim() === '') {
                setModalError('La hora de fin es obligatoria.');
                return;
            }

            if (!motivo || motivo.trim() === '') {
                setModalError('El motivo es obligatorio.');
                return;
            }

            // Fecha válida
            if (!validateDateFormat(fecha)) {
                setModalError('Fecha inválida. Usa el formato dd/MM/YY o dd/MM/YYYY.');
                return;
            }

            // Horas válidas
            if (!validateTimeFormat(horaInicio) || !validateTimeFormat(horaFin)) {
                setModalError('Formato de hora inválido. Usa HH:00 (ej: 10:00, 20:00).');
                return;
            }

            const startHour = parseInt(horaInicio.split(':')[0]);
            const endHour = parseInt(horaFin.split(':')[0]);
            if (!(startHour < endHour)) {
                setModalError('La hora de inicio debe ser menor a la hora de fin.');
                return;
            }
            if (startHour < SLOT_START_HOUR || endHour > SLOT_START_HOUR + SLOT_COUNT) {
                setModalError(`Las horas deben estar entre ${SLOT_START_HOUR}:00 y ${SLOT_START_HOUR + SLOT_COUNT}:00`);
                return;
            }
        }

        try {
            setLoading(true);
            const parishIdTemp = 1;
            const chapelId = capillas[selectedCapillaIndex]?.id;
            
            const scheduleData = {
                date: formatDateToDB(fecha),
                start_time: horaInicio,
                end_time: horaFin,
                exception_type: modalType === 'disponibilidad' ? 'OPEN' : 'CLOSED',
                reason: motivo
            };
            
            if (modalAction === 'add') {
                await scheduleService.createSpecificSchedule(parishIdTemp, chapelId, scheduleData);
            } else if (modalAction === 'edit') {
                await scheduleService.updateSpecificSchedule(
                    parishIdTemp,
                    chapelId,
                    selectedException.id,
                    scheduleData
                );
            }
            
            // Recargar excepciones
            await loadSchedulesForChapel(chapelId);
            handleCancelModal();
        } catch (err) {
            setModalError(err.message || 'Error al guardar la excepción');
        } finally {
            setLoading(false);
        }
    };

    const toggleEditing = () => {
        if (!isEditing) {
            setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervals)));
            setIsEditing(true);
        } else {
            handleDiscard();
        }
    };

    const isCellInInterval = (rowIndex, colIndex) => {
        if (!selectedIntervals[colIndex]) return false;
        return selectedIntervals[colIndex].includes(rowIndex);
    };

    const hasExceptionForCell = (rowIndex, colIndex) => {
        const currentDate = weekDates[colIndex];
        const dateStr = formatDate(currentDate);
        const timeSlot = timeSlots[rowIndex];
        const allExceptions = [...exceptionsNoDisponibilidad, ...exceptionsDisponibilidad];
        
        // Debug logs
        if (rowIndex === 0 && colIndex === 0 && allExceptions.length > 0) {
            if (allExceptions.length > 0) {
            }
        }
        
        return allExceptions.some(exception => {
            // Comparar fecha
            if (exception.fecha !== dateStr) return false;
            
            // Si no tiene horario definido, no se puede comparar con celdas específicas
            if (!exception.startTime || !exception.endTime) return false;
            
            // Parsear tiempos
            const [slotStart, slotEnd] = timeSlot.split(' - ');
            
            const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            
            const exceptionStart = parseTime(exception.startTime);
            const exceptionEnd = parseTime(exception.endTime);
            const slotStartMin = parseTime(slotStart);
            const slotEndMin = parseTime(slotEnd);
            
            // Verificar si hay solapamiento
            const overlaps = (exceptionStart < slotEndMin && exceptionEnd > slotStartMin);
            
            if (overlaps && rowIndex === 0 && colIndex === 0) {
                console.log('  ✅ OVERLAP FOUND:', {
                    exceptionStart,
                    exceptionEnd,
                    slotStartMin,
                    slotEndMin
                });
            }
            
            return overlaps;
        });
    };

    const getExceptionTypeForCell = (rowIndex, colIndex) => {
        const currentDate = weekDates[colIndex];
        const dateStr = formatDate(currentDate);
        const timeSlot = timeSlots[rowIndex];
        
        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };
        
        const [slotStart, slotEnd] = timeSlot.split(' - ');
        const slotStartMin = parseTime(slotStart);
        const slotEndMin = parseTime(slotEnd);
        
        // Verificar disponibilidad (OPEN)
        const hasDisponibilidadException = exceptionsDisponibilidad.some(exception => {
            if (exception.fecha !== dateStr) return false;
            if (!exception.startTime || !exception.endTime) return false;
            
            const exceptionStart = parseTime(exception.startTime);
            const exceptionEnd = parseTime(exception.endTime);
            
            return (exceptionStart < slotEndMin && exceptionEnd > slotStartMin);
        });
        
        if (hasDisponibilidadException) return 'disponibilidad';
        
        // Verificar no disponibilidad (CLOSED)
        const hasNoDisponibilidadException = exceptionsNoDisponibilidad.some(exception => {
            if (exception.fecha !== dateStr) return false;
            if (!exception.startTime || !exception.endTime) return false;
            
            const exceptionStart = parseTime(exception.startTime);
            const exceptionEnd = parseTime(exception.endTime);
            
            return (exceptionStart < slotEndMin && exceptionEnd > slotStartMin);
        });
        
        if (hasNoDisponibilidadException) return 'noDisponibilidad';
        
        return null;
    };

    const handleCellMouseDown = (rowIndex, colIndex) => {
        if (!isEditing) return;
        setIsMouseMoved(false);
        setIsDragging(true);
        setStartRow(rowIndex);
        setCurrentDay(colIndex);
    };

    const handleCellMouseEnter = (rowIndex, colIndex) => {
        if (!isDragging || !isEditing || colIndex !== currentDay) return;
        setIsMouseMoved(true);
        const startInterval = Math.min(startRow, rowIndex);
        const endInterval = Math.max(startRow, rowIndex);
        document.querySelectorAll(`.day-cell[data-col="${currentDay}"]`).forEach((cell) => {
            const cellRowIndex = parseInt(cell.getAttribute('data-row'));
            if (cellRowIndex >= startInterval && cellRowIndex <= endInterval) {
                cell.classList.add('dragging');
            } else {
                cell.classList.remove('dragging');
            }
        });
    };

    const handleCellMouseUp = (rowIndex) => {
        if (!isDragging || !isEditing) return;
        document.querySelectorAll('.day-cell.dragging').forEach((cell) => {
            cell.classList.remove('dragging');
        });
        if (isMouseMoved) {
            const startInterval = Math.min(startRow, rowIndex);
            const endInterval = Math.max(startRow, rowIndex);
            setSelectedIntervals(prevIntervals => {
                const newIntervals = { ...prevIntervals };
                if (!newIntervals[currentDay]) {
                    newIntervals[currentDay] = [];
                }
                // Agregar todos los índices del rango
                for (let i = startInterval; i <= endInterval; i++) {
                    if (!newIntervals[currentDay].includes(i)) {
                        newIntervals[currentDay].push(i);
                    }
                }
                // Ordenar los índices
                newIntervals[currentDay].sort((a, b) => a - b);
                return newIntervals;
            });
        }
        setIsDragging(false);
        setStartRow(null);
        setCurrentDay(null);
    };

    const handleRemoveInterval = (dayIndex, rowIndex) => {
        if (!isEditing) return;
        setSelectedIntervals(prevIntervals => {
            const newIntervals = { ...prevIntervals };
            if (!newIntervals[dayIndex]) return newIntervals;
            // Remover el índice específico
            newIntervals[dayIndex] = newIntervals[dayIndex].filter(idx => idx !== rowIndex);
            return newIntervals;
        });
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (!isEditing || isMouseMoved) return;
        setSelectedIntervals(prevIntervals => {
            const newIntervals = { ...prevIntervals };
            if (!newIntervals[colIndex]) {
                newIntervals[colIndex] = [];
            }
            const isSelected = isCellInInterval(rowIndex, colIndex);
            if (isSelected) {
                // Remover el índice
                newIntervals[colIndex] = newIntervals[colIndex].filter(idx => idx !== rowIndex);
            } else {
                // Agregar el índice
                newIntervals[colIndex].push(rowIndex);
                // Ordenar
                newIntervals[colIndex].sort((a, b) => a - b);
            }
            return newIntervals;
        });
    };

    const handleDiscard = () => {
        setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervals)));
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const parishIdTemp = 1;
            const chapelId = capillas[selectedCapillaIndex]?.id;
            
            // Convertir selectedIntervals a formato de API
            const schedules = [];
            Object.keys(selectedIntervals).forEach(dayKey => {
                const dayOfWeek = parseInt(dayKey);
                const intervals = selectedIntervals[dayKey];
                
                // Agrupar filas consecutivas en intervalos
                const sortedRows = [...new Set(intervals)].sort((a, b) => a - b);
                let currentStart = null;
                let currentEnd = null;
                
                sortedRows.forEach((row, index) => {
                    if (currentStart === null) {
                        currentStart = row;
                        currentEnd = row;
                    } else if (row === currentEnd + 1) {
                        currentEnd = row;
                    } else {
                        // Guardar intervalo anterior
                        const startHour = parseInt(currentStart) + SLOT_START_HOUR;
                        const endHour = parseInt(currentEnd) + SLOT_START_HOUR + 1; // +1 porque el end_time es exclusivo
                        schedules.push({
                            day_of_week: dayOfWeek,
                            start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
                            end_time: `${endHour.toString().padStart(2, '0')}:00:00`
                        });
                        
                        // Iniciar nuevo intervalo
                        currentStart = row;
                        currentEnd = row;
                    }
                });
                
                // Guardar último intervalo
                if (currentStart !== null) {
                    const startHour = parseInt(currentStart) + SLOT_START_HOUR;
                    const endHour = parseInt(currentEnd) + SLOT_START_HOUR + 1;
                    schedules.push({
                        day_of_week: dayOfWeek,
                        start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
                        end_time: `${endHour.toString().padStart(2, '0')}:00:00`
                    });
                }
            });
            
            await scheduleService.bulkUpdateGeneralSchedules(parishIdTemp, chapelId, schedules);
            setSavedIntervals(JSON.parse(JSON.stringify(selectedIntervals)));
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Error al guardar los horarios');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>
                    Gestionar horario {selectedCapillaIndex !== null && capillas[selectedCapillaIndex] 
                        ? `- ${capillas[selectedCapillaIndex].nombre}` 
                        : ''}
                </h2>
                {error && <div className="error-message" style={{display: 'none', padding: '1rem', margin: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px'}}>{error}</div>}
                {loading && <div className="loading-message" style={{padding: '1rem', margin: '1rem', textAlign: 'center'}}>Cargando...</div>}
            
            {selectedCapillaIndex === null ? (
                <div className="app-container">
                    <div style={{textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666'}}>
                        <p>Por favor, selecciona una capilla para gestionar sus horarios.</p>
                        <br />
                        <MyButtonMediumIcon
                            icon="MdOutlineTouchApp"
                            text="Seleccionar Capilla"
                            onClick={() => setShowPanelLateral(true)}
                            classNameExtra="horarios-btn"
                        />
                    </div>
                </div>
            ) : (
            <div className='app-container'>
                    <div className="horarios-container">
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

                        <div className="horarios-controls">
                            <div className="horarios-edit-control">
                                <MyButtonMediumIcon
                                    icon="MdCreate"
                                    text={isEditing ? "Finalizar edición" : "Editar"}
                                    onClick={() => {
                                        if (capillas.length === 0 || !capillas[selectedCapillaIndex]) {
                                            alert('Por favor, selecciona una capilla primero.');
                                            return;
                                        }
                                        toggleEditing();
                                    }}
                                    classNameExtra="horarios-btn"
                                />
                            </div>

                           
                            <div className='Leyenda'>
                                <div className='color-hnormal'></div>
                                <span>Normal: </span>
                                <div className='color-hdisponible'></div>
                                <span>Ex. Disponible: </span>
                                <div className='color-hno-disponible'></div>
                                <span>Ex. No Disponible: </span>
                            </div>

                             <div className="capillas-button-container">
                                <MyButtonMediumIcon
                                    icon="MdOutlineTouchApp"
                                    text="Capillas"
                                    onClick={() => setShowPanelLateral(prev => !prev)}
                                    classNameExtra="horarios-btn"
                                />
                            </div>

                            {isEditing && (
                                <div className="horarios-actions">
                                    <MyButtonMediumIcon
                                        icon="MdClose"
                                        text="Cancelar"
                                        onClick={handleDiscard}
                                        classNameExtra="horarios-btn"
                                    />
                                    <MyButtonMediumIcon
                                        icon="MdOutlineSaveAs"
                                        text="Guardar"
                                        onClick={handleSave}
                                        classNameExtra="horarios-btn"
                                    />
                                </div>
                            )}
                        </div>

                        <MySchedule
                            timeSlots={timeSlots}
                            daysOfWeek={daysOfWeek}
                            weekDates={weekDates}
                            showDates={true}
                            mode="schedule"
                            renderCell={(rowIndex, colIndex) => {
                                const isSelected = isCellInInterval(rowIndex, colIndex);
                                const hasException = hasExceptionForCell(rowIndex, colIndex);
                                const exceptionType = getExceptionTypeForCell(rowIndex, colIndex);
                                
                                return (
                                    <div
                                        className={`grid-cell day-cell ${isSelected ? 'selected' : ''} ${hasException ? 'exception' : ''} ${exceptionType === 'disponibilidad' ? 'exception-disponibilidad' : ''} ${exceptionType === 'noDisponibilidad' ? 'exception-no-disponibilidad' : ''} ${isEditing ? 'editable' : ''}`}
                                        data-row={rowIndex}
                                        data-col={colIndex}
                                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                                        onMouseUp={() => handleCellMouseUp(rowIndex)}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                    >
                                        {isSelected && !hasException && (
                                            <div className="interval-marker"></div>
                                        )}
                                        {hasException && (
                                            <div className={`exception-marker ${exceptionType === 'disponibilidad' ? 'exception-marker-disponibilidad' : 'exception-marker-no-disponibilidad'}`}></div>
                                        )}
                                    </div>
                                );
                            }}
                        />

                            <div className="exceptions-container">
                                <ExcepcionesSection
                                    title="Excepciones - Disponibilidad"
                                    exceptions={exceptionsDisponibilidad}
                                    onAdd={() => handleOpenModal('disponibilidad')}
                                    onEdit={exception => handleEditException(exception, 'disponibilidad')}
                                    onDelete={exception => handleDeleteException(exception, 'disponibilidad')}
                                    canCreate={canCreateDispException}
                                    canUpdate={canUpdateDispException}
                                    canDelete={canDeleteDispException}
                                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                />
                                <ExcepcionesSection
                                    title="Excepciones - No disponibilidad"
                                    exceptions={exceptionsNoDisponibilidad}
                                    onAdd={() => handleOpenModal('noDisponibilidad')}
                                    onEdit={exception => handleEditException(exception, 'noDisponibilidad')}
                                    onDelete={exception => handleDeleteException(exception, 'noDisponibilidad')}
                                    canCreate={canCreateNoDispException}
                                    canUpdate={canUpdateNoDispException}
                                    canDelete={canDeleteNoDispException}
                                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                />
                            </div>

                            <Modal
                                show={showModal}
                                onClose={handleCancelModal}
                                title={
                                    modalAction === 'add' ? `Agregar excepción - ${modalType === 'disponibilidad' ? 'Disponibilidad' : 'No disponibilidad'}`
                                        : modalAction === 'edit' ? `Editar excepción - ${modalType === 'disponibilidad' ? 'Disponibilidad' : 'No disponibilidad'}`
                                            : 'Confirmar eliminación'
                                }
                                onAccept={handleAcceptModal}
                                onCancel={handleCancelModal}
                            >
                                {modalAction === 'delete' ? (
                                    <h4>¿Estás seguro de que quieres eliminar esta excepción?</h4>
                                ) : (
                                    <form className='form-modal-horarios'>
                                        <div className="Inputs-add">
                                            <label htmlFor="fecha">Fecha <span style={{color: 'red'}}>*</span></label>
                                            <input type="text" className="inputModal" id="fecha" value={fecha} onChange={e => setFecha(e.target.value.replace(/[^0-9/]/g, ''))} placeholder="dd/MM/YYYY" required />
                                            <label>Hora <span style={{color: 'red'}}>*</span></label>
                                            <div className="time-range">
                                                <input type="text" className="inputTime" value={horaInicio} onChange={e => { setHoraInicio(e.target.value.replace(/[^0-9:]/g, '')); setModalError(''); }} placeholder="HH:MM" required />
                                                <input type="text" className="inputTime" value={horaFin} onChange={e => { setHoraFin(e.target.value.replace(/[^0-9:]/g, '')); setModalError(''); }} placeholder="HH:MM" required />
                                            </div>
                                            {modalError && (
                                                <p className="error-message" style={{ width: '100%', boxSizing: 'border-box', marginTop: '8px', color: 'red' }}>
                                                    {modalError}
                                                </p>
                                            )}
                                            <label htmlFor="motivo">Motivo <span style={{color: 'red'}}>*</span></label>
                                            <textarea type="textarea" className="inputModal" id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} onBlur={e => setMotivo(e.target.value.trim())} placeholder="Ingrese motivo" required pattern=".*\S+.*" title="El motivo no puede estar vacío o contener solo espacios" />
                                        </div>
                                    </form>
                                )}
                            </Modal>
                    </div>
                </div>
            )}
        </div>
            
        {/* Panel lateral: listado de capillas */}
        {showPanelLateral && (
            <MyPanelLateralConfig title="Seleccionar capilla" onClose={() => setShowPanelLateral(false)}>
                <div className="sidebar-search">
                    <SearchBar onSearchChange={setSearchTermCapilla} />
                </div>
                <div className="table-container">
                    <div className="table-body-div">
                        {capillas
                            .filter(cap => 
                                cap.nombre.toLowerCase().includes(searchTermCapilla.toLowerCase()) ||
                                (cap.direccion && cap.direccion.toLowerCase().includes(searchTermCapilla.toLowerCase()))
                            )
                            .map((cap, idx) => (
                            <div
                                key={cap.id}
                                className="table-row-div event-row"
                                onClick={() => { 
                                    const originalIndex = capillas.findIndex(c => c.id === cap.id);
                                    setSelectedCapillaIndex(originalIndex); 
                                    setShowPanelLateral(false); 
                                }}
                            >
                                <div className="event-cell">
                                    <span className="event-id">{cap.id}</span>
                                    <div className="event-info-display">
                                        <span className="event-name">{cap.nombre}</span>
                                        <div className="event-capilla-name">{cap.direccion || ''}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </MyPanelLateralConfig>
        )}
        </>
    );
}
