const API_URL = import.meta.env.VITE_SERVER_BACKEND_URL;

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Error en la operación';
    throw new Error(errorMessage);
  }
  
  return data;
};

export const getReservationFormInfo = async (eventVariantId) => {
  const response = await fetch(`${API_URL}/api/client/reservation/form/${eventVariantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

export const checkAvailability = async (eventVariantId, eventDate, eventTime) => {
  const response = await fetch(`${API_URL}/api/client/reservation/check-availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      event_variant_id: eventVariantId,
      event_date: eventDate,
      event_time: eventTime,
    }),
  });

  return await handleResponse(response);
};

export const createReservation = async (eventVariantId, eventDate, eventTime) => {
  const response = await fetch(`${API_URL}/api/client/reservation/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      event_variant_id: eventVariantId,
      event_date: eventDate,
      event_time: eventTime,
    }),
  });

  return await handleResponse(response);
};

export const getAvailableSlots = async (eventVariantId, startDate, endDate) => {
  const response = await fetch(`${API_URL}/api/client/reservation/available-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      event_variant_id: eventVariantId,
      start_date: startDate,
      end_date: endDate,
    }),
  });

  return await handleResponse(response);
};

export const getPendingReservations = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/client/reservation/pending/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      page,
      limit,
    }),
  });

  return await handleResponse(response);
};

export const searchPendingReservations = async (searchEventName, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/client/reservation/pending/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      search_event_name: searchEventName,
      page,
      limit,
    }),
  });

  return await handleResponse(response);
};

export const cancelReservation = async (reservationId) => {
  const response = await fetch(`${API_URL}/api/client/reservation/${reservationId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

export const getHistoryReservations = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/client/reservation/history/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      page,
      limit,
    }),
  });

  return await handleResponse(response);
};

export const searchHistoryReservations = async (searchEventName, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/client/reservation/history/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      search_event_name: searchEventName,
      page,
      limit,
    }),
  });

  return await handleResponse(response);
};

export const getReservationDetails = async (reservationId) => {
  const response = await fetch(`${API_URL}/api/client/reservation/${reservationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

