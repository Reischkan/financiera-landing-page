import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Módulos
export const getModulos = () => {
  return axios.get(`${API_URL}/modulos`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getModulos:', error.response?.data || error.message);
      throw error;
    });
};

export const getModulo = (id) => {
  return axios.get(`${API_URL}/modulos/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const createModulo = (data) => {
  return axios.post(`${API_URL}/modulos`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const updateModulo = (id, data) => {
  return axios.put(`${API_URL}/modulos/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteModulo = (id) => {
  return axios.delete(`${API_URL}/modulos/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteModulo:', error.response?.data || error.message);
      throw error;
    });
};

// Personas
export const getPersonas = () => {
  return axios.get(`${API_URL}/personas`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getPersonas:', error.response?.data || error.message);
      throw error;
    });
};

export const getPersona = (id) => {
  return axios.get(`${API_URL}/personas/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getPersona:', error.response?.data || error.message);
      throw error;
    });
};

export const createPersona = (data) => {
  return axios.post(`${API_URL}/personas`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createPersona:', error.response?.data || error.message);
      throw error;
    });
};

export const updatePersona = (id, data) => {
  return axios.put(`${API_URL}/personas/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updatePersona:', error.response?.data || error.message);
      throw error;
    });
};

export const deletePersona = (id) => {
  return axios.delete(`${API_URL}/personas/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deletePersona:', error.response?.data || error.message);
      throw error;
    });
};

// Referencias
export const getReferencias = () => {
  return axios.get(`${API_URL}/referencias`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getReferencias:', error.response?.data || error.message);
      throw error;
    });
};

export const getReferencia = (id) => {
  return axios.get(`${API_URL}/referencias/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const createReferencia = (data) => {
  return axios.post(`${API_URL}/referencias`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const updateReferencia = (id, data) => {
  return axios.put(`${API_URL}/referencias/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteReferencia = (id) => {
  return axios.delete(`${API_URL}/referencias/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteReferencia:', error.response?.data || error.message);
      throw error;
    });
};

// Asignaciones de Módulos
export const getAsignacionesModulo = () => {
  return axios.get(`${API_URL}/asignaciones-modulo`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionModulo = (id) => {
  return axios.get(`${API_URL}/asignaciones-modulo/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionesPorModulo = (idModulo) => {
  return axios.get(`${API_URL}/asignaciones-modulo/modulo/${idModulo}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesPorModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionesPorPersona = (idPersona) => {
  return axios.get(`${API_URL}/asignaciones-modulo/persona/${idPersona}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesPorPersona:', error.response?.data || error.message);
      throw error;
    });
};

export const createAsignacionModulo = (data) => {
  return axios.post(`${API_URL}/asignaciones-modulo`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createAsignacionModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const updateAsignacionModulo = (id, data) => {
  return axios.put(`${API_URL}/asignaciones-modulo/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateAsignacionModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const desasignarPersona = (id) => {
  return axios.put(`${API_URL}/asignaciones-modulo/${id}/desasignar`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en desasignarPersona:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteAsignacionModulo = (id) => {
  return axios.delete(`${API_URL}/asignaciones-modulo/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteAsignacionModulo:', error.response?.data || error.message);
      throw error;
    });
};

// Asignaciones de Referencias
export const getAsignacionesReferencia = () => {
  return axios.get(`${API_URL}/asignaciones-referencia`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionReferencia = (id) => {
  return axios.get(`${API_URL}/asignaciones-referencia/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionesReferenciaPorModulo = (idModulo) => {
  return axios.get(`${API_URL}/asignaciones-referencia/modulo/${idModulo}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesReferenciaPorModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getAsignacionesReferenciaPorReferencia = (idReferencia) => {
  return axios.get(`${API_URL}/asignaciones-referencia/referencia/${idReferencia}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getAsignacionesReferenciaPorReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const createAsignacionReferencia = (data) => {
  return axios.post(`${API_URL}/asignaciones-referencia`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createAsignacionReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const updateAsignacionReferencia = (id, data) => {
  return axios.put(`${API_URL}/asignaciones-referencia/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateAsignacionReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const completarAsignacionReferencia = (id) => {
  return axios.put(`${API_URL}/asignaciones-referencia/${id}/completar`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en completarAsignacionReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const actualizarAvanceReferencia = (id, minutosProducidos) => {
  return axios.put(`${API_URL}/asignaciones-referencia/${id}/avance`, { minutos_producidos: minutosProducidos })
    .then(response => response.data)
    .catch(error => {
      console.error('Error en actualizarAvanceReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteAsignacionReferencia = (id) => {
  return axios.delete(`${API_URL}/asignaciones-referencia/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteAsignacionReferencia:', error.response?.data || error.message);
      throw error;
    });
};

// Tallas de Referencia
export const getTallasReferencia = () => {
  return axios.get(`${API_URL}/tallas-referencia`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getTallasReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const getTallaReferencia = (id) => {
  return axios.get(`${API_URL}/tallas-referencia/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getTallaReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const getTallasPorReferencia = (idReferencia) => {
  return axios.get(`${API_URL}/tallas-referencia/referencia/${idReferencia}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getTallasPorReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const createTallaReferencia = (data) => {
  console.log('API createTallaReferencia - datos enviados:', data);
  return axios.post(`${API_URL}/tallas-referencia`, data)
    .catch(error => {
      console.error('Error en createTallaReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const updateTallaReferencia = (id, data) => {
  return axios.put(`${API_URL}/tallas-referencia/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateTallaReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteTallaReferencia = (id) => {
  return axios.delete(`${API_URL}/tallas-referencia/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteTallaReferencia:', error.response?.data || error.message);
      throw error;
    });
};

// Franjas Horarias
export const getFranjasHorarias = () => {
  return axios.get(`${API_URL}/franjas-horarias`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getFranjasHorarias:', error.response?.data || error.message);
      throw error;
    });
};

export const getFranjaHoraria = (id) => {
  return axios.get(`${API_URL}/franjas-horarias/${id}`)
    .catch(error => {
      console.error('Error en getFranjaHoraria:', error.response?.data || error.message);
      throw error;
    });
};

export const createFranjaHoraria = (data) => {
  console.log('API createFranjaHoraria - datos enviados:', data);
  return axios.post(`${API_URL}/franjas-horarias`, data)
    .catch(error => {
      console.error('Error en createFranjaHoraria:', error.response?.data || error.message);
      throw error;
    });
};

export const updateFranjaHoraria = (id, data) => {
  console.log('API updateFranjaHoraria - datos enviados:', data);
  return axios.put(`${API_URL}/franjas-horarias/${id}`, data)
    .catch(error => {
      console.error('Error en updateFranjaHoraria:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteFranjaHoraria = (id) => {
  return axios.delete(`${API_URL}/franjas-horarias/${id}`)
    .catch(error => {
      console.error('Error en deleteFranjaHoraria:', error.response?.data || error.message);
      throw error;
    });
};

export const actualizarEstadoFranjaHoraria = (id, estado) => {
  return axios.patch(`${API_URL}/franjas-horarias/${id}/estado`, { estado })
    .catch(error => {
      console.error('Error en actualizarEstadoFranjaHoraria:', error.response?.data || error.message);
      throw error;
    });
};

// Registros de Producción
export const getRegistrosProduccion = () => {
  return axios.get(`${API_URL}/registros-produccion`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosProduccion:', error.response?.data || error.message);
      throw error;
    });
};

export const getProduccionResumen = () => {
  return axios.get(`${API_URL}/registros-produccion/resumen`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getProduccionResumen:', error.response?.data || error.message);
      throw error;
    });
};

// Fix for the duplicate getResumenProduccion function 
export const getResumenProduccionPorFecha = (fechaInicio, fechaFin) => {
  return axios.get(`${API_URL}/registros-produccion/resumen`, {
    params: { fechaInicio, fechaFin }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getResumenProduccionPorFecha:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistroProduccion = (id) => {
  return axios.get(`${API_URL}/registros-produccion/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistroProduccion:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosPorFecha = (fecha) => {
  return axios.get(`${API_URL}/registros-produccion/fecha/${fecha}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosPorFecha:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosPorModulo = (idModulo) => {
  return axios.get(`${API_URL}/registros-produccion/modulo/${idModulo}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosPorModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosPorReferencia = (idReferencia) => {
  return axios.get(`${API_URL}/registros-produccion/referencia/${idReferencia}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosByReferencia:', error.response?.data || error.message);
      throw error;
    });
};

export const createRegistroProduccion = (data) => {
  console.log('API createRegistroProduccion - datos enviados:', data);
  return axios.post(`${API_URL}/registros-produccion`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en createRegistroProduccion:', error.response?.data || error.message);
      throw error;
    });
};

export const updateRegistroProduccion = (id, data) => {
  console.log('API updateRegistroProduccion - datos enviados:', data);
  return axios.put(`${API_URL}/registros-produccion/${id}`, data)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en updateRegistroProduccion:', error.response?.data || error.message);
      throw error;
    });
};

export const deleteRegistroProduccion = (id) => {
  return axios.delete(`${API_URL}/registros-produccion/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en deleteRegistroProduccion:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosByDateRange = (startDate, endDate) => {
  return axios.get(`${API_URL}/registros-produccion/fecha/rango?startDate=${startDate}&endDate=${endDate}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosByDateRange:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosByModulo = (idModulo) => {
  return axios.get(`${API_URL}/registros-produccion/modulo/${idModulo}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosByModulo:', error.response?.data || error.message);
      throw error;
    });
};

export const getRegistrosByReferencia = (idReferencia) => {
  return axios.get(`${API_URL}/registros-produccion/referencia/${idReferencia}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error en getRegistrosByReferencia:', error.response?.data || error.message);
      throw error;
    });
}; 