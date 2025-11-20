const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const getReservationsByChapel = async (chapelName) => {
  const response = await fetch(`${API_URL}/api/reports/reservations-by-chapel?chapel_name=${encodeURIComponent(chapelName)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener reservas por capilla');
  }

  return await response.json();
};

export const getReservationsByDateRange = async (startDate, endDate) => {
  const response = await fetch(
    `${API_URL}/api/reports/reservations-by-date-range?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener reservas por rango de fechas');
  }

  return await response.json();
};

export const getOccupancyMap = async (chapelName, year, month) => {
  const response = await fetch(
    `${API_URL}/api/reports/occupancy-map?chapel_name=${encodeURIComponent(chapelName)}&year=${year}&month=${month}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener mapa de ocupación');
  }

  return await response.json();
};

export const getEventsByChapel = async (chapelName) => {
  const response = await fetch(`${API_URL}/api/reports/events-by-chapel?chapel_name=${encodeURIComponent(chapelName)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener eventos por capilla');
  }

  return await response.json();
};

export const getParishHierarchy = async () => {
  const response = await fetch(`${API_URL}/api/reports/parish-hierarchy`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener jerarquía de parroquias');
  }

  return await response.json();
};

export const getChapelEvents = async (parishName, chapelName) => {
  const response = await fetch(
    `${API_URL}/api/reports/chapel-events?parish_name=${encodeURIComponent(parishName)}&chapel_name=${encodeURIComponent(chapelName)}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener eventos de capilla');
  }

  return await response.json();
};

export const getCancelledReservations = async () => {
  const response = await fetch(`${API_URL}/api/reports/cancelled-reservations`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener reservas canceladas');
  }

  return await response.json();
};

export const getCompletedReservations = async () => {
  const response = await fetch(`${API_URL}/api/reports/completed-reservations`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener reservas completadas');
  }

  return await response.json();
};
