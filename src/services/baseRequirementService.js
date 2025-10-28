const API_BASE_URL = import.meta.env.VITE_SERVER_BACKEND_URL || 'http://localhost:4204';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    if (data.error) {
      throw new Error(data.error);
    }
    throw new Error('Error en la operación');
  }
  
  return data;
};

export const listEventsForSelect = async () => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/select`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createRequirement = async (eventId, requirementData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requirementData),
  });
  return handleResponse(response);
};

export const listRequirements = async (eventId, page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit }),
  });
  return handleResponse(response);
};

export const searchRequirements = async (eventId, query, page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ query, page, limit }),
  });
  return handleResponse(response);
};

export const getRequirementById = async (eventId, id) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateRequirement = async (eventId, id, requirementData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requirementData),
  });
  return handleResponse(response);
};

export const partialUpdateRequirement = async (eventId, id, requirementData) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requirementData),
  });
  return handleResponse(response);
};

export const updateRequirementStatus = async (eventId, id, active) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ active }),
  });
  return handleResponse(response);
};

export const deleteRequirement = async (eventId, id) => {
  const response = await fetch(`${API_BASE_URL}/api/diocese/events/${eventId}/requirements/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};
