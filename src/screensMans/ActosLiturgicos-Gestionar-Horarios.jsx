import React, { useState } from 'react';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import Modal from '../components2/Modal';
import '../utils/Estilos-Generales-1.css';
import './ActosLiturgicos-Gestionar-Horarios.css';

export default function ActosLiturgicosHorarios() {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('disponibilidad'); // disponibilidad o noDisponibilidad
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIntervals, setSelectedIntervals] = useState({});
    const [savedIntervals, setSavedIntervals] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [startRow, setStartRow] = useState(null);
    const [currentDay, setCurrentDay] = useState(null);
    const [isMouseMoved, setIsMouseMoved] = useState(false);

    // Estados para el formulario de excepciones
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [motivo, setMotivo] = useState('');

    const [disponibilidadPage, setDisponibilidadPage] = useState(0);
    const [noDisponibilidadPage, setNoDisponibilidadPage] = useState(0);
    const ITEMS_PER_PAGE = 4;

    const timeSlots = [
        '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
        '16:00 - 17:00', '17:00 - 18:00'
    ];

    const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

    const [exceptionsDisponibilidad, setExceptionsDisponibilidad] = useState([
        { fecha: '17/08/2025', hora: '17:00 - 21:00' },
        { fecha: '18/08/2025', hora: '17:00 - 21:00' },
        { fecha: '19/08/2025', hora: '17:00 - 21:00' },
        { fecha: '20/08/2025', hora: '17:00 - 21:00' },
        { fecha: '21/08/2025', hora: '17:00 - 21:00' },
        { fecha: '22/08/2025', hora: '17:00 - 21:00' },
        { fecha: '23/08/2025', hora: '17:00 - 21:00' },
        { fecha: '24/08/2025', hora: '17:00 - 21:00' },
        { fecha: '25/08/2025', hora: '17:00 - 21:00' }
    ]);

    const [exceptionsNoDisponibilidad, setExceptionsNoDisponibilidad] = useState([
        { fecha: '17/08/2025', hora: '17:00 - 21:00' },
        { fecha: '18/08/2025', hora: '17:00 - 21:00' },
        { fecha: '19/08/2025', hora: '17:00 - 21:00' }
    ]);

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    // Renombrado para ser más explícito
    const handleCancelModal = () => {
        setShowModal(false);
        // Limpiar los estados del formulario al cerrar
        setFecha('');
        setHoraInicio('');
        setHoraFin('');
        setMotivo('');
    };

    // Nueva función para manejar el guardado desde el modal
    const handleAcceptModal = () => {
        const newException = { fecha, hora: `${horaInicio} - ${horaFin}`, motivo };
        if (modalType === 'disponibilidad') {
            setExceptionsDisponibilidad(prev => [...prev, newException]);
        } else {
            setExceptionsNoDisponibilidad(prev => [...prev, newException]);
        }
        handleCancelModal(); // Llama a la función de cancelación para limpiar y cerrar
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
        if (!isEditing || isMouseMoved) return; // Añadir esta condición

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
        console.log('Guardando horarios', selectedIntervals);
        setSavedIntervals(JSON.parse(JSON.stringify(selectedIntervals)));
        setIsEditing(false);
    };

    const hasNextPage = (items, currentPage) => (currentPage + 1) * ITEMS_PER_PAGE < items.length;
    const hasPrevPage = (currentPage) => currentPage > 0;
    const getPaginatedItems = (items, currentPage) => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gestionar horario</h2>
                <div className='app-container'>
                    <div className="horarios-container">
                        <div className="horarios-controls">
                            <div className="horarios-edit-control">
                                <MyButtonMediumIcon
                                    icon="MdAccept"
                                    text={isEditing ? "Finalizar edición" : "Editar"}
                                    onClick={toggleEditing}
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

                        <div className="horarios-grid-container">
                            <div className="horarios-grid">
                                <div className="grid-header">
                                    <div className="grid-cell header-cell"></div>
                                    {daysOfWeek.map((day, index) => (
                                        <div key={index} className="grid-cell header-cell">{day}</div>
                                    ))}
                                </div>

                                {timeSlots.map((timeSlot, rowIndex) => (
                                    <div key={rowIndex} className="grid-row">
                                        <div className="grid-cell time-cell">{timeSlot}</div>
                                        {daysOfWeek.map((_, colIndex) => {
                                            const isSelected = isCellInInterval(rowIndex, colIndex);
                                            return (
                                                <div
                                                    key={colIndex}
                                                    className={`grid-cell day-cell ${isSelected ? 'selected' : ''} ${isEditing ? 'editable' : ''}`}
                                                    data-row={rowIndex}
                                                    data-col={colIndex}
                                                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                                                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                                                    onMouseUp={() => handleCellMouseUp(rowIndex)}
                                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                                >
                                                    {isSelected && (
                                                        <div className="interval-marker"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="exceptions-container">
                            <div className="exceptions-section">
                                <div className="exceptions-header">
                                    <h4>Excepciones - Disponibilidad</h4>
                                    <div className="exceptions-controls">
                                        {hasPrevPage(disponibilidadPage) && (
                                            <MyButtonShortAction
                                                type="back"
                                                title="Página anterior"
                                                onClick={() => setDisponibilidadPage(prev => prev - 1)}
                                            />
                                        )}
                                        <MyButtonShortAction
                                            type="add"
                                            title="Agregar excepción de disponibilidad"
                                            onClick={() => handleOpenModal('disponibilidad')}
                                        />
                                        {hasNextPage(exceptionsDisponibilidad, disponibilidadPage) && (
                                            <MyButtonShortAction
                                                type="next"
                                                title="Página siguiente"
                                                onClick={() => setDisponibilidadPage(prev => prev + 1)}
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
                                    {getPaginatedItems(exceptionsDisponibilidad, disponibilidadPage).map((exception, index) => (
                                        <div key={index} className="exceptions-table-row">
                                            <div className="exception-cell">{exception.fecha}</div>
                                            <div className="exception-cell">{exception.hora}</div>
                                            <div className="exception-cell actions-cell">
                                                <div className="exception-actions">
                                                    <MyButtonShortAction type="edit" title="Editar excepción" />
                                                    <MyButtonShortAction type="delete" title="Eliminar excepción" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="exceptions-section">
                                <div className="exceptions-header">
                                    <h4>Excepciones - No disponibilidad</h4>
                                    <div className="exceptions-controls">
                                        {hasPrevPage(noDisponibilidadPage) && (
                                            <MyButtonShortAction
                                                type="back"
                                                title="Página anterior"
                                                onClick={() => setNoDisponibilidadPage(prev => prev - 1)}
                                            />
                                        )}
                                        <MyButtonShortAction
                                            type="add"
                                            title="Agregar excepción de no disponibilidad"
                                            onClick={() => handleOpenModal('noDisponibilidad')}
                                        />
                                        {hasNextPage(exceptionsNoDisponibilidad, noDisponibilidadPage) && (
                                            <MyButtonShortAction
                                                type="next"
                                                onClick={() => setNoDisponibilidadPage(prev => prev + 1)}
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
                                    {getPaginatedItems(exceptionsNoDisponibilidad, noDisponibilidadPage).map((exception, index) => (
                                        <div key={index} className="exceptions-table-row">
                                            <div className="exception-cell">{exception.fecha}</div>
                                            <div className="exception-cell">{exception.hora}</div>
                                            <div className="exception-cell actions-cell">
                                                <div className="exception-actions">
                                                    <MyButtonShortAction type="edit" title="Editar excepción" />
                                                    <MyButtonShortAction type="delete" title="Eliminar excepción" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal
                        show={showModal}
                        onClose={handleCancelModal}
                        title={modalType === 'disponibilidad' ? 'Agregar excepción - Disponibilidad' : 'Agregar excepción - No disponibilidad'}
                        onAccept={handleAcceptModal}
                        onCancel={handleCancelModal}
                    >
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
                    </Modal>
                </div>
            </div>
        </>
    );
}