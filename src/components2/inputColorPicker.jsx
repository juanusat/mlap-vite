import React, { useState, useRef, useEffect } from 'react';
import './inputColorPicker.css';

const InputColorPicker = ({ 
  value = '#000000',
  onChange,
  label = "Seleccionar color",
  disabled = false,
  showHexInput = true,
  placeholder = "Ingresa código hex..."
}) => {
  const [selectedColor, setSelectedColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);
  const [isValidHex, setIsValidHex] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorInputRef = useRef(null);
  const containerRef = useRef(null);

  // Actualizar estado cuando cambie el prop value
  useEffect(() => {
    setSelectedColor(value);
    setHexInput(value);
  }, [value]);

  // Validar código hexadecimal
  const isValidHexColor = (hex) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
  };

  // Manejar cambio en el input de color nativo
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    setHexInput(newColor);
    setIsValidHex(true);
    
    if (onChange) {
      onChange({
        hex: newColor,
        rgb: hexToRgb(newColor),
        name: getColorName(newColor)
      });
    }
  };

  // Manejar cambio en el input de texto hex
  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setHexInput(value);
    
    if (isValidHexColor(value)) {
      setIsValidHex(true);
      setSelectedColor(value);
      
      if (onChange) {
        onChange({
          hex: value,
          rgb: hexToRgb(value),
          name: getColorName(value)
        });
      }
    } else {
      setIsValidHex(false);
    }
  };

  // Manejar selección de color preset
  const handlePresetColorSelect = (color) => {
    setSelectedColor(color);
    setHexInput(color);
    setIsValidHex(true);
    
    if (onChange) {
      onChange({
        hex: color,
        rgb: hexToRgb(color),
        name: getColorName(color)
      });
    }
  };

  // Convertir hex a RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Obtener nombre descriptivo del color (básico)
  const getColorName = (hex) => {
    const colorNames = {
      '#FF0000': 'Rojo',
      '#00FF00': 'Verde',
      '#0000FF': 'Azul',
      '#FFFF00': 'Amarillo',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cian',
      '#000000': 'Negro',
      '#FFFFFF': 'Blanco',
      '#800000': 'Rojo Oscuro',
      '#008000': 'Verde Oscuro',
      '#000080': 'Azul Oscuro',
      '#FFA500': 'Naranja',
      '#FFC0CB': 'Rosa',
      '#A52A2A': 'Marrón',
      '#808080': 'Gris'
    };
    
    return colorNames[hex.toUpperCase()] || hex.toUpperCase();
  };

  // Manejar click en el botón del color picker
  const handleColorPickerClick = () => {
    if (!disabled) {
      colorInputRef.current?.click();
    }
  };

  // Obtener luminosidad del color para determinar el color del texto
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  // Determinar si usar texto claro u oscuro
  const getTextColor = (bgColor) => {
    return getLuminance(bgColor) > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="input-color-picker" ref={containerRef}>
      {label && <label className="color-picker-label">{label}</label>}
      
      <div className="color-picker-container" htmlFor="color-picker">
        {/* Input de color nativo (oculto) */}
        <input
          ref={colorInputRef}
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        {/* Visualización del color seleccionado */}
        <div className="color-display-container">
          <button
            type="button"
            className={`color-display-button ${disabled ? 'disabled' : ''}`}
            style={{ backgroundColor: selectedColor }}
            onClick={handleColorPickerClick}
            disabled={disabled}
            title={`Color seleccionado: ${getColorName(selectedColor)}`}
          >
            <span style={{ color: getTextColor(selectedColor) }}>
              {selectedColor}
            </span>
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default InputColorPicker;
