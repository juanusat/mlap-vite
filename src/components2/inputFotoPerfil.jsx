import React, { useState, useRef, useEffect } from 'react';
import './inputFotoPerfil.css';

const InputFotoPerfil = ({ 
  value, // Ahora se usa como valor inicial de la vista previa
  onChange, 
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  placeholder = "Agregar foto de perfil",
  disabled = false,
  required = false
}) => {
  const [preview, setPreview] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Sincronizar el estado interno si el prop 'value' cambia desde el padre
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const validateFile = (file) => {
    // ... (El código de validación es el mismo)
    if (!file) return false;

    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato no válido. Solo se permiten: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return false;
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const processFile = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPreview(result);
      
      if (onChange) {
        onChange({
          file: file,
          preview: result, // ¡Pasamos la URL de la preview al padre!
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="input-foto-perfil">
      <div className="file-input-container">
        <div 
          className={`file-input-wrapper ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            disabled={disabled}
            required={required}
            className="file-input"
          />
          <button 
            type="button"
            className="file-select-button"
            onClick={handleClick}
            disabled={disabled}
          >
            Seleccionar archivo
          </button>
          <span className="file-name">
            {preview ? 'Archivo seleccionado' : 'Ningún archivo seleccionado'}
          </span>
        </div>
        
        {preview && (
          <div className="file-actions">
            <button 
              type="button"
              className="remove-file-btn" 
              onClick={handleRemove}
              title="Eliminar archivo"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="file-info">
        <small>
          Formatos permitidos: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 
          • Tamaño máximo: {(maxSize / (1024 * 1024)).toFixed(1)}MB
        </small>
      </div>

      {/* **AGREGAMOS ESTA SECCIÓN PARA LA VISTA PREVIA** */}
      {preview && (
        <div className="image-preview-container">
          <img src={preview} alt="Vista previa" className="image-preview" />
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputFotoPerfil;