import React from "react";
import { MdAdd, MdClose, MdOutlineSaveAs, MdCheck,  MdMailOutline  } from "react-icons/md";
import "./MyButtonMediumIcon.css";

const ICONS = {
  MdAdd: <MdAdd />,
  MdClose: <MdClose />,
  MdOutlineSaveAs: <MdOutlineSaveAs />,
  MdAccept : <MdCheck />,
  MdMail : < MdMailOutline  />
};

const ICON_COLORS = {
  MdAdd: "blue",
  MdClose: "red",
  MdOutlineSaveAs: "green",
};

const MyButtonMediumIcon = ({ text, icon, ...props }) => {
  const dataColor = ICON_COLORS[icon] || "blue";
  
  return (
    <button className="my-button-medium-icon" data-color={dataColor} {...props}>
      {ICONS[icon]}
      <span className="my-button-medium-text">{text}</span>
    </button>
  );
};

export default MyButtonMediumIcon;
