const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const getNotifications = async (unread = false) => {
  const url = unread 
    ? `${API_URL}/api/notifications?unread=true` 
    : `${API_URL}/api/notifications`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener notificaciones');
  }

  return await response.json();
};

export const markAsRead = async (notificationId) => {
  const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al marcar notificación como leída');
  }

  return await response.json();
};

export const markAllAsRead = async () => {
  const response = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al marcar todas las notificaciones como leídas');
  }

  return await response.json();
};

export const deleteNotification = async (notificationId) => {
  const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al eliminar notificación');
  }

  return await response.json();
};

export const getUnreadCount = async () => {
  const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener contador de notificaciones');
  }

  return await response.json();
};
