const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const getUserAccount = async () => {
  const response = await fetch(`${API_URL}/api/user/account`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener la cuenta');
  }

  return await response.json();
};

export const updatePersonalInfo = async (data) => {
  const formData = new FormData();
  
  formData.append('first_names', data.first_names);
  formData.append('paternal_surname', data.paternal_surname);
  if (data.maternal_surname) {
    formData.append('maternal_surname', data.maternal_surname);
  }
  formData.append('document', data.document);
  
  if (data.profile_photo) {
    formData.append('profile_photo', data.profile_photo);
    formData.append('profile_photo_name', data.profile_photo.name);
  }
  
  const response = await fetch(`${API_URL}/api/user/account/info`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar la información personal');
  }

  return await response.json();
};

export const updateCredentials = async (data) => {
  const response = await fetch(`${API_URL}/api/user/account/credentials`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar las credenciales');
  }

  return await response.json();
};
