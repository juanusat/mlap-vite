import React, { useState } from 'react';
import './Contenedor-Desplegable.css';
import MyButtonShortAction from './MyButtonShortAction';
import MyGroupButtonsActions from './MyGroupButtonsActions';
import MyButtonMediumIcon from './MyButtonMediumIcon';

const ExpandableContainer = ({ title, children, type, showDeleteButton, isEditing, onEdit, onSave, onCancel }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="expandable-container">
            <div className="expandable-header">
                <h2 className="expandable-title">{title}</h2>
                <MyGroupButtonsActions>
                    <MyButtonShortAction 
                        type='view' 
                        title='Ver' 
                        onClick={toggleExpand} 
                        className={`expandable-icon ${isExpanded ? 'expanded' : ''}`} 
                    />
                    <MyButtonShortAction type={type} title='Editar' onClick={onEdit} />
                    {showDeleteButton === 'si' && <MyButtonShortAction type='delete' title='Eliminar' />}
                </MyGroupButtonsActions>
            </div>
            {isExpanded && (
                <div className="expandable-content">
                    {children}
                    {isEditing && (
                        <div className="action-buttons-container">
                            <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={onCancel} />
                            <MyButtonMediumIcon icon='MdOutlineSaveAs' text='Guardar' onClick={onSave} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExpandableContainer;