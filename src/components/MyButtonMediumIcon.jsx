import React from "react";
import { MdAdd, MdClose, MdOutlineSaveAs } from "react-icons/md";
import "./MyButtonMediumIcon.css";

const ICONS = {
  MdAdd: <MdAdd />,
  MdClose: <MdClose />,
  MdOutlineSaveAs: <MdOutlineSaveAs />,
};

const MyButtonMediumIcon = ({ text, icon, ...props }) => {
  return (
    <button className="my-button-medium-icon" {...props}>
      {ICONS[icon]}
      <span className="my-button-medium-text">{text}</span>
    </button>
  );
};

export default MyButtonMediumIcon;
