const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

/**
 * Listar todos los tipos de menciones
 */
export const listMentionTypes = async (page = 1, limit = 100) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit }),
  });

  return await handleResponse(response);
};

/**
 * Crear un nuevo tipo de mención
 */
export const createMentionType = async (mentionTypeData) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(mentionTypeData),
  });

  return await handleResponse(response);
};

/**
 * Actualizar un tipo de mención existente
 */
export const updateMentionType = async (id, mentionTypeData) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(mentionTypeData),
  });

  return await handleResponse(response);
};

/**
 * Eliminar un tipo de mención
 */
export const deleteMentionType = async (id) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

/**
 * Actualizar el estado (activo/inactivo) de un tipo de mención
 */
export const updateMentionTypeStatus = async (id, active) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ active }),
  });

  return await handleResponse(response);
};

/**
 * Buscar tipos de menciones
 */
export const searchMentionTypes = async (searchTerm, page = 1, limit = 100) => {
  const response = await fetch(`${API_URL}/api/diocese/mention-types/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ search: searchTerm, page, limit }),
  });

  return await handleResponse(response);
};
