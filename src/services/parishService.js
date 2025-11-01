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

export const getParishAccount = async () => {
  const response = await fetch(`${API_URL}/api/parish/account`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const updateParishAccountInfo = async (data) => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('address', data.address);
  formData.append('coordinates', data.coordinates);
  formData.append('phone', data.phone);
  formData.append('email', data.email || '');
  formData.append('primary_color', data.primary_color);
  formData.append('secondary_color', data.secondary_color);
  
  if (data.profile_photo) {
    formData.append('profile_photo', data.profile_photo);
    formData.append('profile_photo_name', data.profile_photo.name);
  }
  
  if (data.cover_photo) {
    formData.append('cover_photo', data.cover_photo);
    formData.append('cover_photo_name', data.cover_photo.name);
  }
  
  const response = await fetch(`${API_URL}/api/parish/account/info`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  return await handleResponse(response);
};

export const updateParishAccountCredentials = async (data) => {
  const response = await fetch(`${API_URL}/api/parish/account/credentials`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};
