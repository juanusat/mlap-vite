import React from "react";
import MyHeaderAdm from "./MyHeaderAdm";
import MyAsideGen from "./MyAsideGen";
import MyPanelLateralConfig from "./MyPanelLateralConfig";
import "./ScreenMan.css";

const ScreenMan = ({ children, panelLateral, title, options }) => {
  return (
    <div className="screenman-container">
      <MyHeaderAdm />
      <div className="screenman-main">
        <MyAsideGen title={title} options={options} />
        <article className="screenman-article">
          <div className="content-module">
            {children}
          </div>
          {/* Panel lateral global, fuera del contenido principal */}
          {panelLateral}
        </article>
      </div>
    </div>
  );
}

export default ScreenMan;
