const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const listWorkers = async (parishId, page, limit) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/workers/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener los trabajadores');
  }

  return await response.json();
};

export const searchWorkers = async (parishId, page, limit, search) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/workers/search`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit, search }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al buscar trabajadores');
  }

  return await response.json();
};

export const inviteWorker = async (parishId, email) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/workers/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al invitar al trabajador');
  }

  return await response.json();
};

export const listWorkerRoles = async (associationId, page, limit) => {
  const response = await fetch(`${API_URL}/api/security/parish-workers/${associationId}/roles/list`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page, limit }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al obtener los roles');
  }

  return await response.json();
};

export const assignRole = async (associationId, roleId) => {
  const response = await fetch(`${API_URL}/api/security/parish-workers/${associationId}/roles/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role_id: roleId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al asignar el rol');
  }

  return await response.json();
};

export const revokeRole = async (userRoleId) => {
  const response = await fetch(`${API_URL}/api/parish/user-roles/${userRoleId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al revocar el rol');
  }

  return await response.json();
};

export const updateAssociationStatus = async (associationId, active) => {
  const response = await fetch(`${API_URL}/api/parish/associations/${associationId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al actualizar el estado de la asociación');
  }

  return await response.json();
};

export const deleteAssociation = async (associationId) => {
  const response = await fetch(`${API_URL}/api/parish/associations/${associationId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al eliminar la asociación');
  }

  return await response.json();
};
