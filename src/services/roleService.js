const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

export const listRoles = async (parishId, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const searchRoles = async (parishId, page = 1, limit = 10, search = '') => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ page, limit, search })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const createRole = async (parishId, name, description) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, description })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const getRoleById = async (parishId, roleId) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const updateRole = async (parishId, roleId, name, description) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, description })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const updateRoleStatus = async (parishId, roleId, active) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ active })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const deleteRole = async (parishId, roleId) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const getRolePermissions = async (parishId, roleId) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

export const updateRolePermissions = async (parishId, roleId, permissions) => {
  const response = await fetch(`${API_URL}/api/parish/${parishId}/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ permissions })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};
