import React, { useState } from 'react';
import MyButtonShortAction from '../components2/MyButtonShortAction';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import './ActosLiturgicos-Gestionar-Horarios.css';

export default function ActosLiturgicosHorarios() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('disponibilidad'); // disponibilidad o noDisponibilidad
  const [isEditing, setIsEditing] = useState(false);
  // Almacena los intervalos seleccionados por día
  // { 0: [[0, 2], [5, 7]], 1: [[1, 3]] } - Día 0 (lunes) tiene intervalo de 8-10am y 13-15pm, día 1 (martes) 9-11am
  const [selectedIntervals, setSelectedIntervals] = useState({});
  // Almacena la última versión guardada de los intervalos
  const [savedIntervals, setSavedIntervals] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [startRow, setStartRow] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  
  // Paginación
  const [disponibilidadPage, setDisponibilidadPage] = useState(0);
  const [noDisponibilidadPage, setNoDisponibilidadPage] = useState(0);
  const ITEMS_PER_PAGE = 4;
  
  const timeSlots = [
    '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', 
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', 
    '16:00 - 17:00', '17:00 - 18:00'
  ];
  
  const daysOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  
  // 9 excepciones para disponibilidad
  const exceptionsDisponibilidad = [
    { fecha: '17/08/2025', hora: '17:00 - 21:00' },
    { fecha: '18/08/2025', hora: '17:00 - 21:00' },
    { fecha: '19/08/2025', hora: '17:00 - 21:00' },
    { fecha: '20/08/2025', hora: '17:00 - 21:00' },
    { fecha: '21/08/2025', hora: '17:00 - 21:00' },
    { fecha: '22/08/2025', hora: '17:00 - 21:00' },
    { fecha: '23/08/2025', hora: '17:00 - 21:00' },
    { fecha: '24/08/2025', hora: '17:00 - 21:00' },
    { fecha: '25/08/2025', hora: '17:00 - 21:00' }
  ];
  
  // 3 excepciones para no disponibilidad
  const exceptionsNoDisponibilidad = [
    { fecha: '17/08/2025', hora: '17:00 - 21:00' },
    { fecha: '18/08/2025', hora: '17:00 - 21:00' },
    { fecha: '19/08/2025', hora: '17:00 - 21:00' }
  ];
  
  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const toggleEditing = () => {
    if (!isEditing) {
      // Al entrar en modo edición, copiamos los intervalos guardados a los seleccionados
      setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervals)));
      setIsEditing(true);
    } else {
      // Al salir de modo edición sin guardar, descartamos los cambios
      handleDiscard();
    }
  };
  
  // Función para verificar si una celda está dentro de algún intervalo seleccionado
  const isCellInInterval = (rowIndex, colIndex) => {
    if (!selectedIntervals[colIndex]) return false;
    
    return selectedIntervals[colIndex].some(interval => {
      return rowIndex >= interval[0] && rowIndex <= interval[1];
    });
  };
  
  // Inicia el proceso de arrastrar para crear un intervalo
  const handleCellMouseDown = (rowIndex, colIndex) => {
    if (!isEditing) return;
    
    setIsDragging(true);
    setStartRow(rowIndex);
    setCurrentDay(colIndex);
  };
  
  // Actualiza el final del intervalo mientras se arrastra
  const handleCellMouseEnter = (rowIndex, colIndex) => {
    if (!isDragging || !isEditing || colIndex !== currentDay) return;
    
    // No permitimos cambiar de día durante el arrastre
    const startInterval = Math.min(startRow, rowIndex);
    const endInterval = Math.max(startRow, rowIndex);
    
    // Vista previa temporal del intervalo mientras se arrastra
    document.querySelectorAll(`.day-cell[data-col="${currentDay}"]`).forEach((cell) => {
      const cellRowIndex = parseInt(cell.getAttribute('data-row'));
      if (cellRowIndex >= startInterval && cellRowIndex <= endInterval) {
        cell.classList.add('dragging');
      } else {
        cell.classList.remove('dragging');
      }
    });
  };
  
  // Finaliza la creación del intervalo
  const handleCellMouseUp = (rowIndex) => {
    if (!isDragging || !isEditing) return;
    
    const startInterval = Math.min(startRow, rowIndex);
    const endInterval = Math.max(startRow, rowIndex);
    
    // Elimina la clase de vista previa
    document.querySelectorAll('.day-cell.dragging').forEach((cell) => {
      cell.classList.remove('dragging');
    });
    
    // Guarda el intervalo en el estado
    setSelectedIntervals(prevIntervals => {
      const newIntervals = { ...prevIntervals };
      
      if (!newIntervals[currentDay]) {
        newIntervals[currentDay] = [];
      }
      
      // Verifica si hay superposiciones y fusiona intervalos si es necesario
      let newInterval = [startInterval, endInterval];
      let intervalsToRemove = [];
      
      newIntervals[currentDay].forEach((interval, index) => {
        // Si el nuevo intervalo se superpone con uno existente
        if ((newInterval[0] <= interval[1] && newInterval[1] >= interval[0]) || 
            (interval[0] <= newInterval[1] && interval[1] >= newInterval[0])) {
          // Fusiona los intervalos
          newInterval = [
            Math.min(newInterval[0], interval[0]),
            Math.max(newInterval[1], interval[1])
          ];
          intervalsToRemove.push(index);
        }
      });
      
      // Elimina los intervalos que se fusionaron
      const filteredIntervals = newIntervals[currentDay].filter((_, index) => 
        !intervalsToRemove.includes(index)
      );
      
      // Añade el nuevo intervalo fusionado
      newIntervals[currentDay] = [...filteredIntervals, newInterval];
      
      return newIntervals;
    });
    
    setIsDragging(false);
    setStartRow(null);
    setCurrentDay(null);
  };
  
  // Elimina un intervalo específico al hacer click en él
  const handleRemoveInterval = (dayIndex, rowIndex) => {
    if (!isEditing) return;
    
    setSelectedIntervals(prevIntervals => {
      const newIntervals = { ...prevIntervals };
      
      if (!newIntervals[dayIndex]) return newIntervals;
      
      // Encuentra el intervalo que contiene esta celda
      const intervalIndex = newIntervals[dayIndex].findIndex(
        interval => rowIndex >= interval[0] && rowIndex <= interval[1]
      );
      
      if (intervalIndex !== -1) {
        // Elimina el intervalo
        newIntervals[dayIndex] = [
          ...newIntervals[dayIndex].slice(0, intervalIndex),
          ...newIntervals[dayIndex].slice(intervalIndex + 1)
        ];
      }
      
      return newIntervals;
    });
  };
  
  const handleDiscard = () => {
    // Restauramos los intervalos guardados anteriormente, no borramos todo
    setSelectedIntervals(JSON.parse(JSON.stringify(savedIntervals)));
    setIsEditing(false); // Sale del modo de edición
  };
  
  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios en el servidor
    console.log('Guardando horarios', selectedIntervals);
    
    // Guardamos la versión actual como la versión confirmada
    setSavedIntervals(JSON.parse(JSON.stringify(selectedIntervals)));
    setIsEditing(false); // Sale del modo de edición después de guardar
  };
  
  // Función para verificar si una página tiene navegación anterior/siguiente
  const hasNextPage = (items, currentPage) => {
    return (currentPage + 1) * ITEMS_PER_PAGE < items.length;
  };
  
  const hasPrevPage = (currentPage) => {
    return currentPage > 0;
  };
  
  // Obtener los elementos para la página actual
  const getPaginatedItems = (items, currentPage) => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };
  
  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Gestionar Horario</h2>
        <div className='app-container'>
          <div className="horarios-container">
            <div className="horarios-header">
              <h3>Gestión de Horarios</h3>
              <hr />
            </div>
            
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
                          onClick={() => isSelected && handleRemoveInterval(colIndex, rowIndex)}
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
                    <MyButtonShortAction 
                      type="back" 
                      title="Página anterior" 
                      onClick={() => setDisponibilidadPage(prev => prev - 1)}
                      className={!hasPrevPage(disponibilidadPage) ? 'disabled-btn' : ''}
                    />
                    <MyButtonShortAction 
                      type="add" 
                      title="Agregar excepción de disponibilidad" 
                      onClick={() => handleOpenModal('disponibilidad')} 
                    />
                    <MyButtonShortAction 
                      type="next" 
                      title="Página siguiente" 
                      onClick={() => setDisponibilidadPage(prev => prev + 1)}
                      className={!hasNextPage(exceptionsDisponibilidad, disponibilidadPage) ? 'disabled-btn' : ''}
                    />
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
                  <h4>Excepciones - No Disponibilidad</h4>
                  <div className="exceptions-controls">
                    <MyButtonShortAction 
                      type="back" 
                      title="Página anterior" 
                      onClick={() => setNoDisponibilidadPage(prev => prev - 1)}
                      className={!hasPrevPage(noDisponibilidadPage) ? 'disabled-btn' : ''}
                    />
                    <MyButtonShortAction 
                      type="add" 
                      title="Agregar excepción de no disponibilidad" 
                      onClick={() => handleOpenModal('noDisponibilidad')} 
                    />
                    <MyButtonShortAction 
                      type="next" 
                      title="Página siguiente" 
                      onClick={() => setNoDisponibilidadPage(prev => prev + 1)}
                      className={!hasNextPage(exceptionsNoDisponibilidad, noDisponibilidadPage) ? 'disabled-btn' : ''}
                    />
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
          
          {/* Modal para agregar excepciones */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h3>{modalType === 'disponibilidad' ? 'Agregar Excepción - Disponibilidad' : 'Agregar Excepción - No Disponibilidad'}</h3>
                  <MyButtonShortAction type="close" onClick={handleCloseModal} title="Cerrar" />
                </div>
                <div className="modal-body">
                  <div className="modal-form">
                    <div className="form-group">
                      <label>Fecha</label>
                      <input type="text" className="date-input" placeholder="dd/MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>Hora</label>
                      <div className="time-range">
                        <input type="text" className="time-input" placeholder="HH:MM" />
                        <input type="text" className="time-input" placeholder="HH:MM" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Motivo</label>
                      <input type="text" className="reason-input" placeholder="Ingrese motivo" />
                    </div>
                    <div className="modal-actions">
                      <button className="modal-button accept-button">Aceptar</button>
                    </div>
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
