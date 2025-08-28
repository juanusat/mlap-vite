import React from 'react';
import logoWhite from './../assets/logo-mlap-white.svg';
import { MdAccountCircle } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import './MyHeaderAdm.css';
import '../App.css';

export default function MyHeaderAdm() {
  return (
    <header className="mlap-home-header" style={{ background: 'var(--color-a-500)' }}>
      <div className="maxWCont">
        <div className="mlap-home-header-logo">
          <img src={logoWhite} alt="MLAP Logo" style={{ height: 36 }} />
        </div>
        <div className="mlap-home-header-bar" style={{ color: '#fff' }}>
          <button role="button" aria-label="notificaciones"><MdNotificationsNone /></button>
          <button role="button" aria-label="usuario"><MdAccountCircle /></button>
        </div>
      </div>
    </header>
  );
}
