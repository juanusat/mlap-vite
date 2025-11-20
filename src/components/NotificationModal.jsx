import React from 'react';
import { MdClose } from "react-icons/md";
import NotificacionSimple from './NotificacionSimple';
import { formatNotificationDate } from '../utils/dateFormatter';
import './NotificationModal.css';

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAsRead }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-notificaciones">
        <div className="modal-notificaciones-header">
          <h2>Notificaciones</h2>
          <button
            className="btn-nb"
            onClick={onClose}
            style={{ color: 'var(--color-n-900)' }}
          >
            <MdClose />
          </button>
        </div>
        <div className="notificaciones-lista">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificacionSimple
                key={notif.id}
                mensaje={notif.title}
                body={notif.body}
                fecha={formatNotificationDate(notif.created_at)}
                leida={notif.read}
                onMarcarLeida={() => onMarkAsRead(notif.id)}
              />
            ))
          ) : (
            <div className="sin-notificaciones">
              <p>No tienes notificaciones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
