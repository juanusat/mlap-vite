const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const createParish = async (data) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const listParishes = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit }),
  });

  return await handleResponse(response);
};

export const searchParishes = async (query, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/search`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, page, limit }),
  });

  return await handleResponse(response);
};

export const getParishById = async (id) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const updateParish = async (id, data) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const partialUpdateParish = async (id, data) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const updateParishStatus = async (id, active) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active }),
  });

  return await handleResponse(response);
};

export const deleteParish = async (id) => {
  const response = await fetch(`${API_URL}/api/diocese/parishes/${id}/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};
