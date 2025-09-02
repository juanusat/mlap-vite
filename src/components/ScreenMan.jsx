import React from "react";
import MyHeaderAdm from "./MyHeaderAdm";
import MyAsideGen from "./MyAsideGen";
import MyPanelLateralConfig from "./MyPanelLateralConfig";
import "./ScreenMan.css";

const ScreenMan = ({ children, title, options }) => {
  return (
    <div className="screenman-container">
      <MyHeaderAdm />
      <div className="screenman-main">
        <MyAsideGen title={title} options={options} />
        <article className="screenman-article">
          {children}
        </article>
      </div>
    </div>
  );
}

export default ScreenMan;
