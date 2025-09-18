// MyBarSearchGen.jsx
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom'; //  Importamos useNavigate
import './MyBarSearchGen.css';
import { MdOutlineSearch } from "react-icons/md";

const MyBarSearchGen = forwardRef((props, ref) => {
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
    if (searchTerm) {
      // Navegamos a la página de búsqueda y pasamos el término en la URL
      navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
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
        placeholder="Buscar parroquias" 
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