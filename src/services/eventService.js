const API_BASE_URL = import.meta.env.VITE_SERVER_BACKEND_URL || 'http://localhost:4204';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Priorizar el mensaje legible (message) sobre el código de error (error)
    if (data.message) {
      throw new Error(data.message);
    }
    if (data.error) {
      throw new Error(data.error);
    }
    throw new Error('Error en la operación');
  }
  
  return data;
};

export const createEvent = async (eventData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });
  return handleResponse(response);
};

export const listEvents = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit }),
  });
  return handleResponse(response);
};

export const searchEvents = async (query, page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ query, page, limit }),
  });
  return handleResponse(response);
};

export const getEventById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateEvent = async (id, eventData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });
  return handleResponse(response);
};

export const partialUpdateEvent = async (id, eventData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });
  return handleResponse(response);
};

export const updateEventStatus = async (id, active) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ active }),
  });
  return handleResponse(response);
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};
