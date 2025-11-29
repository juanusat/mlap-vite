import React from 'react';
import { MdClose } from "react-icons/md";
import NotificacionSimple from './NotificacionSimple';
import { formatNotificationDate } from '../utils/dateFormatter';
import { markAllAsRead } from '../services/notificationService';
import './NotificationModal.css';

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead }) {
  if (!isOpen) return null;

  const hasUnreadNotifications = notifications.some(notif => !notif.read);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Actualizar el estado del componente padre
      if (onMarkAllAsRead) {
        onMarkAllAsRead();
      }
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err);
      alert('Error al marcar las notificaciones como leídas. Intenta nuevamente.');
    }
  };

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
        
        {hasUnreadNotifications && (
          <div className="mark-all-read-container">
            <button 
              className="btn-mark-all-read"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
        
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
