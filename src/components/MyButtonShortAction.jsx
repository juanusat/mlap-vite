import React from 'react';
import { MdDelete, MdCreate, MdRemoveRedEye, MdRefresh, MdAdd } from "react-icons/md";
import './MyButtonShortAction.css';

export default function MyButtonShortAction({ type, onClick, title }) {
  let icon, className;
  if (type === 'edit') {
    icon = <MdCreate />;
    className = 'btn-short-edit';
  } else if (type === 'delete') {
    icon = <MdDelete />;
    className = 'btn-short-delete';
  } else if (type === 'view') {
    icon = <MdRemoveRedEye />;
    className = 'btn-short-view';
  } else if (type === 'refresh') {
    icon = <MdRefresh />; 
    className = 'btn-short-refresh';
  } else if (type === 'add'){
    icon = <MdAdd />;
    className = 'btn-short-add';
  }else {
    icon = null;
    className = '';
  }
  return (
    <button className={`my-btn-short-action ${className}`} onClick={onClick} title={title}>
      {icon}
    </button>
  );
}
