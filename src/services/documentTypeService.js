const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const createDocumentType = async (data) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const listDocumentTypes = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit }),
  });

  return await handleResponse(response);
};

export const searchDocumentTypes = async (query, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/search`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, page, limit }),
  });

  return await handleResponse(response);
};

export const getDocumentTypeById = async (id) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};

export const updateDocumentType = async (id, data) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const partialUpdateDocumentType = async (id, data) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(response);
};

export const updateDocumentTypeStatus = async (id, active) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active }),
  });

  return await handleResponse(response);
};

export const deleteDocumentType = async (id) => {
  const response = await fetch(`${API_URL}/api/diocese/document-types/${id}/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await handleResponse(response);
};
