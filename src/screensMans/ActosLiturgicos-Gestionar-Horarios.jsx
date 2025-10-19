import React, { useState, useEffect } from 'react';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import Modal from '../components2/Modal';
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import '../utils/Estilos-Generales-1.css';
import './ActosLiturgicos-Gestionar-Horarios.css';

// Componente reutilizable para cada sección de excepciones
function ExcepcionesSection({
    title,
    exceptions,
    onAdd,
    onEdit,
    onDelete,
    ITEMS_PER_PAGE = 4
}) {
    const [activeTab, setActiveTab] = useState('futuras');
    const [page, setPage] = useState(0);

    // Filtrado por fecha
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        const fullYear = year.length === 2 ? '20' + year : year;
        return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
    };
    const isFuture = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parseDate(dateStr) >= today;
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
                    <MyButtonShortAction
                        type="add"
                        title={`Agregar ${title.toLowerCase()}`}
                        onClick={onAdd}
                    />
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
                                <MyButtonShortAction type="edit" title="Editar excepción" onClick={() => onEdit(exception)} />
                                <MyButtonShortAction type="delete" title="Eliminar excepción" onClick={() => onDelete(exception)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ActosLiturgicosHorarios() {
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
    // Capillas (mock data). Replace with backend fetch when available.
    const [capillas, setCapillas] = useState([
        {
            id: 1,
            nombre: 'Capilla San José',
            exceptionsDisponibilidad: [
                { fecha: '17/08/2025', hora: '12:00 - 14:00', motivo: 'Mantenimiento' }
            ],
            exceptionsNoDisponibilidad: [
                { fecha: '18/08/2025', hora: '16:00 - 17:00', motivo: 'Vacaciones' }
            ],
            savedIntervals: {}
        },
        {
            id: 2,
            nombre: 'Capilla Santa María',
            exceptionsDisponibilidad: [
                { fecha: '19/08/2025', hora: '12:00 - 14:00', motivo: 'Evento especial' }
            ],
            exceptionsNoDisponibilidad: [
                { fecha: '20/07/2025', hora: '12:00 - 14:00', motivo: 'Reunión de personal' }
            ],
            savedIntervals: {}
        },
        {
            id: 3,
            nombre: 'Capilla San Miguel',
            exceptionsDisponibilidad: [],
            exceptionsNoDisponibilidad: [],
            savedIntervals: {}
        }
    ]);

    const [selectedCapillaIndex, setSelectedCapillaIndex] = useState(0);
    const [showPanelLateral, setShowPanelLateral] = useState(false);

    // Estados por capilla (se sincronizan con `capillas[selectedCapillaIndex]`)
    const [exceptionsDisponibilidad, setExceptionsDisponibilidad] = useState(() => {
        return capillas[0]?.exceptionsDisponibilidad ? JSON.parse(JSON.stringify(capillas[0].exceptionsDisponibilidad)) : [];
    });
    const [exceptionsNoDisponibilidad, setExceptionsNoDisponibilidad] = useState(() => {
        return capillas[0]?.exceptionsNoDisponibilidad ? JSON.parse(JSON.stringify(capillas[0].exceptionsNoDisponibilidad)) : [];
    });

    // sincronizar al cambiar la capilla seleccionada
    useEffect(() => {
        const cap = capillas[selectedCapillaIndex];
        if (!cap) return;
        setExceptionsDisponibilidad(JSON.parse(JSON.stringify(cap.exceptionsDisponibilidad || [])));
        setExceptionsNoDisponibilidad(JSON.parse(JSON.stringify(cap.exceptionsNoDisponibilidad || [])));
        setSavedIntervals(JSON.parse(JSON.stringify(cap.savedIntervals || {})));
        setSelectedIntervals(JSON.parse(JSON.stringify(cap.savedIntervals || {})));
        setIsEditing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCapillaIndex]);

    // persistir cambios locales en el array `capillas`
    useEffect(() => {
        setCapillas(prev => {
            const next = [...prev];
            if (!next[selectedCapillaIndex]) return prev;
            next[selectedCapillaIndex] = {
                ...next[selectedCapillaIndex],
                exceptionsDisponibilidad: JSON.parse(JSON.stringify(exceptionsDisponibilidad)),
                exceptionsNoDisponibilidad: JSON.parse(JSON.stringify(exceptionsNoDisponibilidad)),
                savedIntervals: JSON.parse(JSON.stringify(savedIntervals || {}))
            };
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exceptionsDisponibilidad, exceptionsNoDisponibilidad, savedIntervals, selectedCapillaIndex]);

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalAction('add');
        setShowModal(true);
    };

    const handleEditException = (exception, type) => {
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

    const handleDeleteException = (exception, type) => {
        setModalType(type);
        setModalAction('delete');
        setSelectedException(exception);
        setSelectedExceptionType(type);
        setShowModal(true);
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
    };

    const handleAcceptModal = () => {
        if (modalAction === 'add') {
            const newException = { fecha, hora: `${horaInicio} - ${horaFin}`, motivo };
            if (modalType === 'disponibilidad') {
                setExceptionsDisponibilidad(prev => [newException, ...prev]);
            } else {
                setExceptionsNoDisponibilidad(prev => [newException, ...prev]);
            }
        } else if (modalAction === 'edit') {
            const updatedException = { fecha, hora: `${horaInicio} - ${horaFin}`, motivo };
            const setter = selectedExceptionType === 'disponibilidad' ? setExceptionsDisponibilidad : setExceptionsNoDisponibilidad;
            setter(prev => prev.map(ex => (ex === selectedException ? updatedException : ex)));
        } else if (modalAction === 'delete') {
            const setter = selectedExceptionType === 'disponibilidad' ? setExceptionsDisponibilidad : setExceptionsNoDisponibilidad;
            setter(prev => prev.filter(ex => ex !== selectedException));
        }
        handleCancelModal();
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
        return selectedIntervals[colIndex].some(interval => {
            return rowIndex >= interval[0] && rowIndex <= interval[1];
        });
    };

    const hasExceptionForCell = (rowIndex, colIndex) => {
        const currentDate = weekDates[colIndex];
        const dateStr = formatDate(currentDate);
        const timeSlot = timeSlots[rowIndex];
        const allExceptions = [...exceptionsNoDisponibilidad, ...exceptionsDisponibilidad];
        return allExceptions.some(exception => {
            if (exception.fecha !== dateStr) return false;
            const [startTime, endTime] = exception.hora.split(' - ');
            const [slotStart, slotEnd] = timeSlot.split(' - ');
            const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            const exceptionStart = parseTime(startTime);
            const exceptionEnd = parseTime(endTime);
            const slotStartMin = parseTime(slotStart);
            const slotEndMin = parseTime(slotEnd);
            return (exceptionStart < slotEndMin && exceptionEnd > slotStartMin);
        });
    };

    const getExceptionTypeForCell = (rowIndex, colIndex) => {
        const currentDate = weekDates[colIndex];
        const dateStr = formatDate(currentDate);
        const timeSlot = timeSlots[rowIndex];
        const hasDisponibilidadException = exceptionsDisponibilidad.some(exception => {
            if (exception.fecha !== dateStr) return false;
            const [startTime, endTime] = exception.hora.split(' - ');
            const [slotStart, slotEnd] = timeSlot.split(' - ');
            const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            const exceptionStart = parseTime(startTime);
            const exceptionEnd = parseTime(endTime);
            const slotStartMin = parseTime(slotStart);
            const slotEndMin = parseTime(slotEnd);
            return (exceptionStart < slotEndMin && exceptionEnd > slotStartMin);
        });
        if (hasDisponibilidadException) return 'disponibilidad';
        const hasNoDisponibilidadException = exceptionsNoDisponibilidad.some(exception => {
            if (exception.fecha !== dateStr) return false;
            const [startTime, endTime] = exception.hora.split(' - ');
            const [slotStart, slotEnd] = timeSlot.split(' - ');
            const parseTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            const exceptionStart = parseTime(startTime);
            const exceptionEnd = parseTime(endTime);
            const slotStartMin = parseTime(slotStart);
            const slotEndMin = parseTime(slotEnd);
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
                let newInterval = [startInterval, endInterval];
                let intervalsToRemove = [];
                newIntervals[currentDay].forEach((interval, index) => {
                    if ((newInterval[0] <= interval[1] && newInterval[1] >= interval[0]) ||
                        (interval[0] <= newInterval[1] && interval[1] >= newInterval[0])) {
                        newInterval = [
                            Math.min(newInterval[0], interval[0]),
                            Math.max(newInterval[1], interval[1])
                        ];
                        intervalsToRemove.push(index);
                    }
                });
                const filteredIntervals = newIntervals[currentDay].filter((_, index) =>
                    !intervalsToRemove.includes(index)
                );
                newIntervals[currentDay] = [...filteredIntervals, newInterval];
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
            const intervalIndex = newIntervals[dayIndex].findIndex(
                interval => rowIndex >= interval[0] && rowIndex <= interval[1]
            );
            if (intervalIndex !== -1) {
                newIntervals[dayIndex] = [
                    ...newIntervals[dayIndex].slice(0, intervalIndex),
                    ...newIntervals[dayIndex].slice(intervalIndex + 1)
                ];
            }
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
                newIntervals[colIndex] = newIntervals[colIndex].filter(interval =>
                    !(rowIndex >= interval[0] && rowIndex <= interval[1])
                );
            } else {
                let newInterval = [rowIndex, rowIndex];
                const filteredIntervals = newIntervals[colIndex].filter(interval => {
                    const overlaps = (newInterval[0] <= interval[1] && newInterval[1] >= interval[0]) ||
                        (interval[0] <= newInterval[1] && interval[1] >= newInterval[0]);
                    if (overlaps) {
                        newInterval = [
                            Math.min(newInterval[0], interval[0]),
                            Math.max(newInterval[1], interval[1])
                        ];
                    }
                    return !overlaps;
                });
                newIntervals[colIndex] = [...filteredIntervals, newInterval];
            }
            return newIntervals;
        });
    };

    const handleDiscard = () => {
        setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervals)));
        setIsEditing(false);
    };

    const handleSave = () => {
        setSavedIntervals(JSON.parse(JSON.stringify(selectedIntervals)));
        setIsEditing(false);
    };

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestionar horario - {capillas[selectedCapillaIndex].nombre}</h2>
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
                                    onClick={toggleEditing}
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

                        {/* Panel lateral: listado de capillas */}
                        {showPanelLateral && (
                            <MyPanelLateralConfig title="Capillas">
                                <div className="panel-config-actions">
                                    {capillas.map((cap, idx) => (
                                        <button
                                            key={cap.id}
                                            onClick={() => { setSelectedCapillaIndex(idx); setShowPanelLateral(false); }}
                                            className={`capilla-btn ${idx === selectedCapillaIndex ? 'active' : ''}`}
                                        >
                                            {cap.nombre}
                                        </button>
                                    ))}
                                </div>
                            </MyPanelLateralConfig>
                        )}

                        <div className="horarios-grid-container">
                                <div className="horarios-grid">
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
                                                const isSelected = isCellInInterval(rowIndex, colIndex);
                                                const hasException = hasExceptionForCell(rowIndex, colIndex);
                                                const exceptionType = getExceptionTypeForCell(rowIndex, colIndex);
                                                return (
                                                    <div
                                                        key={colIndex}
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
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="exceptions-container">
                                <ExcepcionesSection
                                    title="Excepciones - Disponibilidad"
                                    exceptions={exceptionsDisponibilidad}
                                    onAdd={() => handleOpenModal('disponibilidad')}
                                    onEdit={exception => handleEditException(exception, 'disponibilidad')}
                                    onDelete={exception => handleDeleteException(exception, 'disponibilidad')}
                                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                                />
                                <ExcepcionesSection
                                    title="Excepciones - No disponibilidad"
                                    exceptions={exceptionsNoDisponibilidad}
                                    onAdd={() => handleOpenModal('noDisponibilidad')}
                                    onEdit={exception => handleEditException(exception, 'noDisponibilidad')}
                                    onDelete={exception => handleDeleteException(exception, 'noDisponibilidad')}
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
                                    <p>¿Estás seguro de que quieres eliminar esta excepción?</p>
                                ) : (
                                    <form className='form-modal-horarios'>
                                        <div className="Inputs-add">
                                            <label htmlFor="fecha">Fecha</label>
                                            <input type="text" className="inputModal" id="fecha" value={fecha} onChange={e => setFecha(e.target.value)} placeholder="dd/MM/YY" required />
                                            <label>Hora</label>
                                            <div className="time-range">
                                                <input type="text" className="inputTime" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} placeholder="HH:MM" required />
                                                <input type="text" className="inputTime" value={horaFin} onChange={e => setHoraFin(e.target.value)} placeholder="HH:MM" required />
                                            </div>
                                            <label htmlFor="motivo">Motivo</label>
                                            <textarea type="textarea" className="inputModal" id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ingrese motivo" required />
                                        </div>
                                    </form>
                                )}
                            </Modal>
                    </div>
                </div>
            </div>
    );
}
