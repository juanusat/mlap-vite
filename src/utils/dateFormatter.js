export const formatNotificationDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Ahora mismo';
  }
  
  if (diffMins < 60) {
    return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
  }
  
  if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  }
  
  if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  }

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleDateString('es-ES', options);
};
