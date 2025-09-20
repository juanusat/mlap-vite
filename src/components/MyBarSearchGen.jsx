// MyBarSearchGen.jsx
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom'; //  Importamos useNavigate
import './MyBarSearchGen.css';
import { MdOutlineSearch } from "react-icons/md";

const MyBarSearchGen = forwardRef((props, ref) => {
  const { 
    value = '', 
    onSearchChange, 
    placeholder = "Buscar parroquias y capillas",
    mode = "navigate" // "navigate" para navegación, "local" para búsqueda local
  } = props;
  
  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const navigate = useNavigate(); //  Inicializamos el hook

  React.useImperativeHandle(ref, () => ({
    scrollAndFocus: () => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }));

  const handleSearch = () => {
    const searchTerm = inputRef.current?.value;
    if (mode === "navigate" && searchTerm) {
      // Navegamos a la página de búsqueda y pasamos el término en la URL
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
    } else if (mode === "local" && onSearchChange) {
      // Llamamos a la función de búsqueda local
      onSearchChange(searchTerm);
    }
  };

  const handleInputChange = (event) => {
    if (mode === "local" && onSearchChange) {
      onSearchChange(event.target.value);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={containerRef} className="mlap-home-search">
      <input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder}
        value={mode === "local" ? value : undefined}
        onChange={mode === "local" ? handleInputChange : undefined}
        className="mlap-home-search-input" 
        onKeyPress={handleKeyPress} //  Agregamos el manejador de eventos de teclado
      />
      <button 
        className="mlap-home-search-btn" 
        aria-label="Buscar"
        onClick={handleSearch} //  Agregamos el manejador de eventos del clic
      >
        <MdOutlineSearch size={24} />
      </button>
    </div>
  );
});

export default MyBarSearchGen;