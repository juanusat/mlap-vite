const API_BASE_URL = import.meta.env.VITE_SERVER_BACKEND_URL || 'http://localhost:4204';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

// Obtener todos los requisitos (base + adicionales) de un event_variant
export const getRequirementsByEventVariant = async (eventVariantId) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/events/variants/${eventVariantId}/requirements`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

// Crear requisito adicional
export const createChapelEventRequirement = async (requirementData) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/requirements/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requirementData),
  });
  return handleResponse(response);
};

// Obtener requisito por ID
export const getChapelEventRequirementById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/requirements/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

// Actualizar requisito
export const updateChapelEventRequirement = async (id, requirementData) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/requirements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requirementData),
  });
  return handleResponse(response);
};

// Actualizar estado del requisito
export const updateChapelEventRequirementStatus = async (id, active) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/requirements/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ active }),
  });
  return handleResponse(response);
};

// Eliminar requisito
export const deleteChapelEventRequirement = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/acts/requirements/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse(response);
};
