const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const searchChurches = async (query = '', page = 1, limit = 100) => {
  const response = await fetch(`${API_URL}/api/public/church/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, page, limit }),
  });

  return await handleResponse(response);
};

export const selectLocation = async (locationId, type) => {
  const response = await fetch(`${API_URL}/api/public/church/select-location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ location_id: locationId, type: type }),
  });

  return await handleResponse(response);
};

export const selectParish = async (parishId) => {
  const response = await fetch(`${API_URL}/api/public/church/select-parish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parish_id: parishId }),
  });

  return await handleResponse(response);
};

export const getChapelInfo = async (chapelId) => {
  const response = await fetch(`${API_URL}/api/public/church/${chapelId}/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const getChapelActs = async (chapelId) => {
  const response = await fetch(`${API_URL}/api/public/church/${chapelId}/acts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const getChapelProfile = async (chapelId) => {
  const response = await fetch(`${API_URL}/api/public/church/${chapelId}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};
