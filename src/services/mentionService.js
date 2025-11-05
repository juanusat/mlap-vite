const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Obtener lista de tipos de mención activos
 * @returns {Promise<Array>} Lista de tipos de mención
 */
export const listMentionTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mention-types`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener tipos de mención');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('[mentionService] Error al obtener tipos de mención:', error);
    throw error;
  }
};
