import React from "react";
import "./ScreenMan.css";
import "./MyPanelLateralConfig.css";
import MyButtonShortAction from "./MyButtonShortAction";

const MyPanelLateralConfig = ({ title, onClose, children }) => {
  return (
    <div className="panel-lateral-config">
      <div className="panel-lateral-header">
        <h2 className="panel-lateral-title">{title}</h2>
        {onClose && (
          <div className="panel-lateral-close-btn">
            <MyButtonShortAction type="close" title="Cerrar" onClick={onClose} />
          </div>
        )}
      </div>
      <div className="panel-lateral-content">
        {children}
      </div>
    </div>
  );
};

export default MyPanelLateralConfig;
