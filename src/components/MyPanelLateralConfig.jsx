import React from "react";
import "./ScreenMan.css";
import "./MyPanelLateralConfig.css";

const MyPanelLateralConfig = ({ title, children }) => {
  return (
    <div className="panel-lateral-config">
      <h2 className="panel-lateral-title">{title}</h2>
      <div className="panel-lateral-content">
        {children}
      </div>
    </div>
  );
};

export default MyPanelLateralConfig;
