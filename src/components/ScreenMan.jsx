import React, { useState, useEffect } from "react";
import MyHeaderAdm from "./MyHeaderAdm";
import MyAsideGen from "./MyAsideGen";
import MyPanelLateralConfig from "./MyPanelLateralConfig";
import "../utils/Estilos-Generales-1.css";
import "./ScreenMan.css";

const ScreenMan = ({ children, title, options }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [title, options]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="screenman-container">
      <MyHeaderAdm onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className="screenman-main">
        <MyAsideGen 
          title={title} 
          options={options} 
          isOpen={isMenuOpen} 
          onToggle={toggleMenu} 
        />
        <article className="screenman-article">
          {children}
        </article>
      </div>
    </div>
  );
}

export default ScreenMan;
