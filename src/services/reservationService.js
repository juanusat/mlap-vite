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
