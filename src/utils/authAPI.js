const API_BASE_URL = `${import.meta.env.VITE_API_BASE}/api`;
export const getSessionInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    if (response.status === 403) {
      throw new Error('FORBIDDEN_CONTEXT_NOT_SET');
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};


export const changeCurrentRole = async (roleId) => {
  const response = await fetch(`${API_BASE_URL}/auth/session/role`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roleId }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    if (response.status === 403) {
      throw new Error('FORBIDDEN_CONTEXT_NOT_SET');
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};


export const changeParishContext = async (parishId) => {
  const response = await fetch(`${API_BASE_URL}/auth/session/parish`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parishId }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};