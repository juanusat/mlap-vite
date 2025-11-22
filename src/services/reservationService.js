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

export const createReservation = async (eventVariantId, eventDate, eventTime, beneficiaryFullName = null, mentions = []) => {
  const body = {
    event_variant_id: eventVariantId,
    event_date: eventDate,
    event_time: eventTime,
  };

  // Solo incluir beneficiary_full_name si se proporciona
  if (beneficiaryFullName && beneficiaryFullName.trim() !== '') {
    body.beneficiary_full_name = beneficiaryFullName.trim();
  }

  // Incluir menciones si se proporcionan y son válidas
  if (mentions && mentions.length > 0) {
    const validMentions = mentions.filter(
      m => m.mention_type_id && m.mention_name && m.mention_name.trim() !== ''
    ).map(m => ({
      mention_type_id: parseInt(m.mention_type_id),
      mention_name: m.mention_name.trim()
    }));
    
    if (validMentions.length > 0) {
      body.mentions = validMentions;
    }
  }

  const response = await fetch(`${API_URL}/api/client/reservation/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
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


// ===== Servicios para Gestión Administrativa de Reservas =====

export const listReservationsForManagement = async (page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/list`, {
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

export const searchReservationsForManagement = async (search, page = 1, limit = 10) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      search,
      page,
      limit,
    }),
  });

  return await handleResponse(response);
};

export const getReservationDetailsForManagement = async (reservationId) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

export const updateReservationStatus = async (reservationId, newStatus) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      new_status: newStatus,
    }),
  });

  return await handleResponse(response);
};

export const rejectReservation = async (reservationId) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}/reject`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

export const updateReservation = async (reservationId, updateData) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });

  return await handleResponse(response);
};

export const getReservationPayments = async (reservationId) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}/payments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return await handleResponse(response);
};

export const createPayment = async (reservationId, paymentData) => {
  const response = await fetch(`${API_URL}/api/acts/reservations/${reservationId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(paymentData),
  });

  return await handleResponse(response);
};
