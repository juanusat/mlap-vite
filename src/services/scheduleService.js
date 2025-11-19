const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

// ====================================================================
// HORARIOS GENERALES
// ====================================================================

export const listGeneralSchedules = async (parishId, chapelId) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/general-schedules/list`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );

  return await handleResponse(response);
};

export const bulkUpdateGeneralSchedules = async (parishId, chapelId, schedules) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/general-schedules/bulk-update`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedules }),
    }
  );

  return await handleResponse(response);
};

// ====================================================================
// HORARIOS ESPECÍFICOS (EXCEPCIONES)
// ====================================================================

export const listSpecificSchedules = async (parishId, chapelId, page = 1, limit = 4, filters = {}) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/specific-schedules/list`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page, limit, filters }),
    }
  );

  return await handleResponse(response);
};

export const createSpecificSchedule = async (parishId, chapelId, scheduleData) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/specific-schedules/create`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    }
  );

  return await handleResponse(response);
};

export const updateSpecificSchedule = async (parishId, chapelId, scheduleId, scheduleData) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/specific-schedules/${scheduleId}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    }
  );

  return await handleResponse(response);
};

export const deleteSpecificSchedule = async (parishId, chapelId, scheduleId) => {
  const response = await fetch(
    `${API_URL}/api/parishes/${parishId}/chapels/${chapelId}/specific-schedules/${scheduleId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return await handleResponse(response);
};

export const publicListGeneralSchedules = async (parishId, chapelId) => {
  const response = await fetch(
    `${API_URL}/api/public/schedules/parishes/${parishId}/chapels/${chapelId}/general-schedules/list`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );

  return await handleResponse(response);
};

export const publicListSpecificSchedules = async (parishId, chapelId, page = 1, limit = 100, filters = {}) => {
  const response = await fetch(
    `${API_URL}/api/public/schedules/parishes/${parishId}/chapels/${chapelId}/specific-schedules/list`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page, limit, filters }),
    }
  );

  return await handleResponse(response);
};
