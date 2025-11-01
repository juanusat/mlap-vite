const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const createChapel = async (data) => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('address', data.address);
  formData.append('coordinates', data.coordinates || '');
  formData.append('phone', data.phone || '');
  formData.append('email', data.email || '');
  
  if (data.profile_photo) {
    formData.append('profile_photo', data.profile_photo);
    formData.append('profile_photo_name', data.profile_photo.name);
  }
  
  if (data.cover_photo) {
    formData.append('cover_photo', data.cover_photo);
    formData.append('cover_photo_name', data.cover_photo.name);
  }
  
  const response = await fetch(`${API_URL}/api/chapels/create`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  return await handleResponse(response);
};

export const searchChapels = async (page = 1, limit = 100, query = '') => {
  const response = await fetch(`${API_URL}/api/chapels/search`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit, query }),
  });

  return await handleResponse(response);
};

export const getChapelById = async (id) => {
  const response = await fetch(`${API_URL}/api/chapels/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const updateChapel = async (id, data) => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('address', data.address);
  formData.append('coordinates', data.coordinates || '');
  formData.append('phone', data.phone || '');
  formData.append('email', data.email || '');
  
  if (data.profile_photo) {
    formData.append('profile_photo', data.profile_photo);
    formData.append('profile_photo_name', data.profile_photo.name);
  }
  
  if (data.cover_photo) {
    formData.append('cover_photo', data.cover_photo);
    formData.append('cover_photo_name', data.cover_photo.name);
  }
  
  const response = await fetch(`${API_URL}/api/chapels/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  return await handleResponse(response);
};

export const updateChapelStatus = async (id, active) => {
  const response = await fetch(`${API_URL}/api/chapels/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active }),
  });

  return await handleResponse(response);
};

export const deleteChapel = async (id) => {
  const response = await fetch(`${API_URL}/api/chapels/${id}/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};
