import React, { forwardRef } from 'react';
import './MyBarSearchGen.css';
import { MdOutlineSearch } from "react-icons/md";

const MyBarSearchGen = forwardRef((props, ref) => {
  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useImperativeHandle(ref, () => ({
    scrollAndFocus: () => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }));

  return (
    <div ref={containerRef} className="mlap-home-search">
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Buscar parroquia o evento" 
        className="mlap-home-search-input" 
      />
      <button className="mlap-home-search-btn" aria-label="Buscar">
        <MdOutlineSearch size={24} />
      </button>
    </div>
  );
});

export default MyBarSearchGen;
