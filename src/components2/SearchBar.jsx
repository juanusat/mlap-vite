// src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';
const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange(value); // Llama a la función del componente padre
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;