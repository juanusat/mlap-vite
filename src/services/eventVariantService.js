const API_BASE_URL = import.meta.env.VITE_SERVER_BACKEND_URL || 'http://localhost:4204';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const listEventVariants = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit }),
  });
  return handleResponse(response);
};

export const searchEventVariants = async (search, page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ search, page, limit }),
  });
  return handleResponse(response);
};

export const getEventVariantById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const createEventVariant = async (variantData) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(variantData),
  });
  return handleResponse(response);
};

export const updateEventVariant = async (id, variantData) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(variantData),
  });
  return handleResponse(response);
};

export const partialUpdateEventVariant = async (id, variantData) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(variantData),
  });
  return handleResponse(response);
};

export const deleteEventVariant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

export const listEventsBase = async () => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/base/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};
