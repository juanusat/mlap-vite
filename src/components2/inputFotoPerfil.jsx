import React, { useState, useRef } from 'react';
import './inputFotoPerfil.css';

const InputFotoPerfil = ({ 
  value, 
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

  // Validar archivo
  const validateFile = (file) => {
    if (!file) return false;

    // Validar tipo de archivo
    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato no válido. Solo se permiten: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return false;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
      return false;
    }

    setError('');
    return true;
  };

  // Procesar archivo seleccionado
  const processFile = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPreview(result);
      
      // Llamar al callback onChange con el archivo y la preview
      if (onChange) {
        onChange({
          file: file,
          preview: result,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Manejar click en el área de upload
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Manejar drag events
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

  // Remover foto
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
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${preview ? 'has-image' : ''}`}
        onClick={handleClick}
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
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <div className="image-overlay">
              <button 
                type="button"
                className="remove-btn" 
                onClick={handleRemove}
                title="Eliminar foto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button 
                type="button"
                className="change-btn"
                title="Cambiar foto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="M21 15l-3.086-3.086a2 2 0 00-2.828 0L6 21"></path>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                <path d="M12 2a7 7 0 016.93 6h.55a2.5 2.5 0 010 5H13"></path>
                <path d="M8 21l4-7 4 7"></path>
                <path d="M8 21h8"></path>
              </svg>
            </div>
            <div className="upload-text">
              <p className="primary-text">{placeholder}</p>
              <p className="secondary-text">
                Arrastra una imagen aquí o haz click para seleccionar
              </p>
              <p className="format-text">
                Formatos: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 
                • Máximo: {(maxSize / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
          </div>
        )}
      </div>

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
