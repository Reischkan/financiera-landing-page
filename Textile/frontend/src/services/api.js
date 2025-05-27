import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Función utilitaria para manejar errores de la API de manera consistente
const handleApiError = (error, functionName) => {
  // Registra el error en la consola para depuración
  console.error(`Error en ${functionName}:`, error);
  
  // Manejo específico según el tipo de error
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    console.error('Error de respuesta:', error.response.data);
    console.error('Código HTTP:', error.response.status);
    return Promise.reject({
      message: error.response.data?.message || `Error del servidor: ${error.response.status}`,
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    console.error('Error de conexión:', error.request);
    return Promise.reject({
      message: 'No se pudo conectar con el servidor. Verifique su conexión a internet.',
      type: 'networkError'
    });
  } else {
    // Algo ocurrió durante la configuración de la petición
    console.error('Error:', error.message);
    return Promise.reject({
      message: error.message || 'Ocurrió un error inesperado',
      type: 'unknownError'
    });
  }
};

// Función segura para manejar respuestas
const processResponse = (response, functionName) => {
  try {
    // Verificar si la respuesta tiene la propiedad data
    if (response && response.data !== undefined) {
      const responseData = response.data;
      
      // Verificar si la respuesta tiene el formato { success, data, message }
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        if (!responseData.success) {
          console.error(`${functionName}: Error en la respuesta del servidor`, responseData.message);
          throw new Error(responseData.message || 'Error en la operación');
        }
        return responseData.data || responseData;
      }
      
      return responseData;
    }
    
    console.warn(`${functionName}: Respuesta inesperada`, response);
    throw new Error('Formato de respuesta no válido del servidor');
  } catch (error) {
    console.error(`Error procesando respuesta en ${functionName}:`, error);
    return []; // Valor predeterminado seguro en caso de error
  }
};

// Módulos
export const getModulos = () => {
  return axios.get(`${API_URL}/modulos`)
    .then(response => processResponse(response, 'getModulos'))
    .catch(error => handleApiError(error, 'getModulos'));
};

export const getModulo = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de módulo no válido' });
  }
  
  return axios.get(`${API_URL}/modulos/${id}`)
    .then(response => processResponse(response, 'getModulo'))
    .catch(error => handleApiError(error, 'getModulo'));
};

export const createModulo = (data) => {
  if (!data || !data.nombre) {
    return Promise.reject({ message: 'Datos de módulo incompletos' });
  }
  
  return axios.post(`${API_URL}/modulos`, data)
    .then(response => processResponse(response, 'createModulo'))
    .catch(error => handleApiError(error, 'createModulo'));
};

export const updateModulo = (id, data) => {
  if (!id) {
    return Promise.reject({ message: 'ID de módulo no válido' });
  }
  
  if (!data || !data.nombre) {
    return Promise.reject({ message: 'Datos de módulo incompletos' });
  }
  
  return axios.put(`${API_URL}/modulos/${id}`, data)
    .then(response => processResponse(response, 'updateModulo'))
    .catch(error => handleApiError(error, 'updateModulo'));
};

export const deleteModulo = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de módulo no válido' });
  }
  
  return axios.delete(`${API_URL}/modulos/${id}`)
    .then(response => processResponse(response, 'deleteModulo'))
    .catch(error => handleApiError(error, 'deleteModulo'));
};

// Personas
export const getPersonas = () => {
  return axios.get(`${API_URL}/personas`)
    .then(response => processResponse(response, 'getPersonas'))
    .catch(error => handleApiError(error, 'getPersonas'));
};

export const getPersona = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de persona no válido' });
  }
  
  return axios.get(`${API_URL}/personas/${id}`)
    .then(response => processResponse(response, 'getPersona'))
    .catch(error => handleApiError(error, 'getPersona'));
};

export const createPersona = (data) => {
  if (!data || !data.nombre) {
    return Promise.reject({ message: 'Datos de persona incompletos' });
  }
  
  return axios.post(`${API_URL}/personas`, data)
    .then(response => processResponse(response, 'createPersona'))
    .catch(error => handleApiError(error, 'createPersona'));
};

export const updatePersona = (id, data) => {
  if (!id) {
    return Promise.reject({ message: 'ID de persona no válido' });
  }
  
  if (!data) {
    return Promise.reject({ message: 'Datos de persona incompletos' });
  }
  
  return axios.put(`${API_URL}/personas/${id}`, data)
    .then(response => processResponse(response, 'updatePersona'))
    .catch(error => handleApiError(error, 'updatePersona'));
};

export const deletePersona = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de persona no válido' });
  }
  
  return axios.delete(`${API_URL}/personas/${id}`)
    .then(response => processResponse(response, 'deletePersona'))
    .catch(error => handleApiError(error, 'deletePersona'));
};

// Referencias
export const getReferencias = () => {
  return axios.get(`${API_URL}/referencias`)
    .then(response => processResponse(response, 'getReferencias'))
    .catch(error => handleApiError(error, 'getReferencias'));
};

export const getReferencia = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de referencia no válido' });
  }
  
  return axios.get(`${API_URL}/referencias/${id}`)
    .then(response => processResponse(response, 'getReferencia'))
    .catch(error => handleApiError(error, 'getReferencia'));
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
    .then(response => processResponse(response, 'getAsignacionesModulo'))
    .catch(error => handleApiError(error, 'getAsignacionesModulo'));
};

export const getAsignacionModulo = (id) => {
  return axios.get(`${API_URL}/asignaciones-modulo/${id}`)
    .then(response => processResponse(response, 'getAsignacionModulo'))
    .catch(error => handleApiError(error, 'getAsignacionModulo'));
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
    .then(response => processResponse(response, 'getAsignacionesReferencia'))
    .catch(error => handleApiError(error, 'getAsignacionesReferencia'));
};

export const getAsignacionReferencia = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de asignación no válido' });
  }
  
  return axios.get(`${API_URL}/asignaciones-referencia/${id}`)
    .then(response => processResponse(response, 'getAsignacionReferencia'))
    .catch(error => handleApiError(error, 'getAsignacionReferencia'));
};

export const getAsignacionesReferenciaPorModulo = (idModulo) => {
  if (!idModulo) {
    return Promise.reject({ message: 'ID de módulo no válido' });
  }
  
  return axios.get(`${API_URL}/asignaciones-referencia/modulo/${idModulo}`)
    .then(response => processResponse(response, 'getAsignacionesReferenciaPorModulo'))
    .catch(error => handleApiError(error, 'getAsignacionesReferenciaPorModulo'));
};

export const getAsignacionesReferenciaPorReferencia = (idReferencia) => {
  if (!idReferencia) {
    return Promise.reject({ message: 'ID de referencia no válido' });
  }
  
  return axios.get(`${API_URL}/asignaciones-referencia/referencia/${idReferencia}`)
    .then(response => processResponse(response, 'getAsignacionesReferenciaPorReferencia'))
    .catch(error => handleApiError(error, 'getAsignacionesReferenciaPorReferencia'));
};

export const createAsignacionReferencia = (data) => {
  if (!data || !data.id_modulo || !data.id_referencia) {
    return Promise.reject({ message: 'Datos de asignación incompletos' });
  }
  
  return axios.post(`${API_URL}/asignaciones-referencia`, data)
    .then(response => processResponse(response, 'createAsignacionReferencia'))
    .catch(error => handleApiError(error, 'createAsignacionReferencia'));
};

export const updateAsignacionReferencia = (id, data) => {
  if (!id) {
    return Promise.reject({ message: 'ID de asignación no válido' });
  }
  
  if (!data) {
    return Promise.reject({ message: 'Datos de asignación incompletos' });
  }
  
  return axios.put(`${API_URL}/asignaciones-referencia/${id}`, data)
    .then(response => processResponse(response, 'updateAsignacionReferencia'))
    .catch(error => handleApiError(error, 'updateAsignacionReferencia'));
};

export const completarAsignacionReferencia = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de asignación no válido' });
  }
  
  return axios.put(`${API_URL}/asignaciones-referencia/${id}/completar`)
    .then(response => processResponse(response, 'completarAsignacionReferencia'))
    .catch(error => handleApiError(error, 'completarAsignacionReferencia'));
};

export const actualizarAvanceReferencia = (id, minutosProducidos) => {
  if (!id) {
    return Promise.reject({ message: 'ID de asignación no válido' });
  }
  
  if (isNaN(minutosProducidos)) {
    return Promise.reject({ message: 'Minutos producidos no válidos' });
  }
  
  return axios.put(`${API_URL}/asignaciones-referencia/${id}/avance`, { minutos_producidos: minutosProducidos })
    .then(response => processResponse(response, 'actualizarAvanceReferencia'))
    .catch(error => handleApiError(error, 'actualizarAvanceReferencia'));
};

export const deleteAsignacionReferencia = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de asignación no válido' });
  }
  
  return axios.delete(`${API_URL}/asignaciones-referencia/${id}`)
    .then(response => processResponse(response, 'deleteAsignacionReferencia'))
    .catch(error => handleApiError(error, 'deleteAsignacionReferencia'));
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
    .then(response => processResponse(response, 'getRegistrosProduccion'))
    .catch(error => handleApiError(error, 'getRegistrosProduccion'));
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
  if (!id) {
    return Promise.reject({ message: 'ID de registro no válido' });
  }
  
  return axios.get(`${API_URL}/registros-produccion/${id}`)
    .then(response => processResponse(response, 'getRegistroProduccion'))
    .catch(error => handleApiError(error, 'getRegistroProduccion'));
};

export const getRegistrosPorFecha = (fecha) => {
  if (!fecha) {
    return Promise.reject({ message: 'Fecha no válida' });
  }
  
  return axios.get(`${API_URL}/registros-produccion/fecha/${fecha}`)
    .then(response => processResponse(response, 'getRegistrosPorFecha'))
    .catch(error => handleApiError(error, 'getRegistrosPorFecha'));
};

export const getRegistrosPorModulo = (idModulo) => {
  if (!idModulo) {
    return Promise.reject({ message: 'ID de módulo no válido' });
  }
  
  return axios.get(`${API_URL}/registros-produccion/modulo/${idModulo}`)
    .then(response => processResponse(response, 'getRegistrosPorModulo'))
    .catch(error => handleApiError(error, 'getRegistrosPorModulo'));
};

export const getRegistrosPorReferencia = (idReferencia) => {
  if (!idReferencia) {
    return Promise.reject({ message: 'ID de referencia no válido' });
  }
  
  return axios.get(`${API_URL}/registros-produccion/referencia/${idReferencia}`)
    .then(response => processResponse(response, 'getRegistrosPorReferencia'))
    .catch(error => handleApiError(error, 'getRegistrosPorReferencia'));
};

export const createRegistroProduccion = (data) => {
  if (!data || !data.id_asignacion_modulo || !data.id_asignacion_referencia || !data.id_franja || !data.fecha) {
    return Promise.reject({ message: 'Datos de registro incompletos' });
  }
  
  return axios.post(`${API_URL}/registros-produccion`, data)
    .then(response => {
      console.log('Respuesta exitosa del servidor:', response.data);
      return processResponse(response, 'createRegistroProduccion');
    })
    .catch(error => {
      console.error('Error detallado en createRegistroProduccion:', error);
      if (error.response && error.response.data) {
        console.error('Mensaje de error del servidor:', error.response.data.message);
      }
      return handleApiError(error, 'createRegistroProduccion');
    });
};

export const updateRegistroProduccion = (id, data) => {
  if (!id) {
    return Promise.reject({ message: 'ID de registro no válido' });
  }
  
  if (!data) {
    return Promise.reject({ message: 'Datos de registro incompletos' });
  }
  
  return axios.put(`${API_URL}/registros-produccion/${id}`, data)
    .then(response => processResponse(response, 'updateRegistroProduccion'))
    .catch(error => handleApiError(error, 'updateRegistroProduccion'));
};

export const deleteRegistroProduccion = (id) => {
  if (!id) {
    return Promise.reject({ message: 'ID de registro no válido' });
  }
  
  return axios.delete(`${API_URL}/registros-produccion/${id}`)
    .then(response => processResponse(response, 'deleteRegistroProduccion'))
    .catch(error => handleApiError(error, 'deleteRegistroProduccion'));
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

// Interceptor global para manejar errores de red (opcional)
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response && error.message === 'Network Error') {
      console.error('Error de red detectado');
      // Aquí podríamos mostrar una notificación global
    }
    return Promise.reject(error);
  }
);

export const getAusencias = () => {
  const functionName = 'getAusencias';
  return fetch(`${API_URL}/ausencias`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const getAusencia = (id) => {
  const functionName = 'getAusencia';
  return fetch(`${API_URL}/ausencias/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const getAusenciasPorPersona = (idPersona) => {
  const functionName = 'getAusenciasPorPersona';
  return fetch(`${API_URL}/ausencias/persona/${idPersona}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const getAusenciasPorFecha = (fechaInicio, fechaFin) => {
  const functionName = 'getAusenciasPorFecha';
  return fetch(`${API_URL}/ausencias/fechas/${fechaInicio}/${fechaFin}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const createAusencia = (data) => {
  const functionName = 'createAusencia';
  return fetch(`${API_URL}/ausencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const updateAusencia = (id, data) => {
  const functionName = 'updateAusencia';
  return fetch(`${API_URL}/ausencias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
};

export const deleteAusencia = (id) => {
  const functionName = 'deleteAusencia';
  return fetch(`${API_URL}/ausencias/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => handleApiError(error, functionName));
}; 