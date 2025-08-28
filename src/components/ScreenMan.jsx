import React from "react";
import MyHeaderAdm from "./MyHeaderAdm";
import MyAsideGen from "./MyAsideGen";
import "./ScreenMan.css";

const ScreenMan = ({ children }) => {
  return (
    <div className="screenman-container">
      <MyHeaderAdm />
      <div className="screenman-main">
        <aside className="screenman-aside">
          <MyAsideGen />
        </aside>
        <article className="screenman-article">
          {children}
        </article>
      </div>
    </div>
  );
};

export default ScreenMan;
