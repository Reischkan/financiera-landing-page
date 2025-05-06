const RegistroProduccion = require('../models/registroProduccion.model');

// Crear un nuevo registro de producción
exports.create = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body || !req.body.id_asignacion_modulo || !req.body.id_asignacion_referencia || 
        !req.body.id_franja || !req.body.fecha || req.body.minutos_producidos === undefined) {
      return res.status(400).send({
        message: "El contenido no puede estar vacío y debe incluir todos los campos requeridos."
      });
    }

    // Validar que los IDs sean numéricos
    if (isNaN(parseInt(req.body.id_asignacion_modulo)) || 
        isNaN(parseInt(req.body.id_asignacion_referencia)) || 
        isNaN(parseInt(req.body.id_franja))) {
      return res.status(400).send({
        message: "Los IDs de asignación de módulo, asignación de referencia y franja horaria deben ser valores numéricos."
      });
    }

    // Validar minutos producidos
    if (isNaN(parseFloat(req.body.minutos_producidos)) || parseFloat(req.body.minutos_producidos) < 0) {
      return res.status(400).send({
        message: "Los minutos producidos deben ser un número válido mayor o igual a 0."
      });
    }

    // Crear un objeto de registro de producción
    const registroProduccion = {
      id_asignacion_modulo: parseInt(req.body.id_asignacion_modulo),
      id_asignacion_referencia: parseInt(req.body.id_asignacion_referencia),
      id_franja: parseInt(req.body.id_franja),
      fecha: req.body.fecha,
      minutos_producidos: parseFloat(req.body.minutos_producidos),
      observaciones: req.body.observaciones || null
    };

    console.log("Datos recibidos para crear registro:", JSON.stringify(registroProduccion));

    // Guardar registro de producción en la base de datos
    const result = await RegistroProduccion.create(registroProduccion);
    
    console.log("Registro creado con éxito:", JSON.stringify(result));
    
    res.status(201).send(result);
  } catch (err) {
    console.error('Error al crear registro de producción:', err);
    
    // Mensajes de error específicos basados en el tipo de error
    if (err.message && (
        err.message.includes('asignación de módulo') || 
        err.message.includes('asignación de referencia') || 
        err.message.includes('franja horaria'))) {
      return res.status(400).send({
        message: err.message
      });
    }
    
    // Error de conexión a base de datos
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).send({
        message: "No se pudo conectar a la base de datos. Por favor, intente más tarde."
      });
    }
    
    // Error de duplicación de clave
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({
        message: "Ya existe un registro con estos datos para esta fecha y franja horaria."
      });
    }
    
    // Errores de integridad referencial
    if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).send({
        message: "Una de las referencias (módulo, referencia o franja) no existe en la base de datos."
      });
    }
    
    res.status(500).send({
      message: err.message || "Ocurrió un error al crear el registro de producción."
    });
  }
};

// Recuperar todos los registros de producción
exports.findAll = async (req, res) => {
  try {
    console.log('Controller: Obteniendo todos los registros de producción');
    
    const registros = await RegistroProduccion.getAll();
    
    console.log(`Se encontraron ${registros.length} registros de producción`);
    res.status(200).json(registros);
  } catch (err) {
    console.error('Error detallado al obtener registros de producción:', err);
    
    // Identificar el tipo de error y devolver un mensaje apropiado
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        message: "No se pudo conectar a la base de datos. Por favor, intente más tarde."
      });
    }
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        message: "Error de acceso a la base de datos. Contacte al administrador."
      });
    }
    
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        message: "Error en la estructura de la base de datos. Contacte al administrador."
      });
    }
    
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        message: "La tabla de registros de producción no existe. Contacte al administrador."
      });
    }
    
    // Mensaje genérico para otros errores
    res.status(500).json({
      message: err.message || "Ocurrió un error al recuperar los registros de producción."
    });
  }
};

// Encontrar un solo registro de producción por ID
exports.findOne = async (req, res) => {
  try {
    const registro = await RegistroProduccion.findById(req.params.id);
    
    if (!registro) {
      return res.status(404).send({
        message: `No se encontró el registro de producción con id ${req.params.id}.`
      });
    }
    
    res.send(registro);
  } catch (err) {
    console.error(`Error al obtener el registro de producción con id ${req.params.id}:`, err);
    res.status(500).send({
      message: `Error al recuperar el registro de producción con id ${req.params.id}`
    });
  }
};

// Encontrar registros por fecha
exports.findByDate = async (req, res) => {
  try {
    const registros = await RegistroProduccion.findByDate(req.params.fecha);
    res.send(registros);
  } catch (err) {
    console.error(`Error al obtener registros por fecha ${req.params.fecha}:`, err);
    res.status(500).send({
      message: `Error al recuperar registros para la fecha ${req.params.fecha}`
    });
  }
};

// Encontrar registros por módulo
exports.findByModulo = async (req, res) => {
  try {
    const registros = await RegistroProduccion.findByModulo(req.params.idModulo);
    res.send(registros);
  } catch (err) {
    console.error(`Error al obtener registros por módulo ${req.params.idModulo}:`, err);
    res.status(500).send({
      message: `Error al recuperar registros para el módulo ${req.params.idModulo}`
    });
  }
};

// Encontrar registros por referencia
exports.findByReferencia = async (req, res) => {
  try {
    const registros = await RegistroProduccion.findByReferencia(req.params.idReferencia);
    res.send(registros);
  } catch (err) {
    console.error(`Error al obtener registros por referencia ${req.params.idReferencia}:`, err);
    res.status(500).send({
      message: `Error al recuperar registros para la referencia ${req.params.idReferencia}`
    });
  }
};

// Actualizar un registro de producción por ID
exports.update = async (req, res) => {
  try {
    // Validar la solicitud
    if (!req.body) {
      return res.status(400).send({
        message: "El contenido no puede estar vacío."
      });
    }

    const result = await RegistroProduccion.update(req.params.id, req.body);
    res.send(result);
  } catch (err) {
    console.error(`Error al actualizar el registro de producción con id ${req.params.id}:`, err);
    if (err.message && (
        err.message.includes('No se encontró') ||
        err.message.includes('asignación de módulo') || 
        err.message.includes('asignación de referencia') || 
        err.message.includes('franja horaria'))) {
      return res.status(400).send({
        message: err.message
      });
    }
    res.status(500).send({
      message: `Error al actualizar el registro de producción con id ${req.params.id}`
    });
  }
};

// Eliminar un registro de producción por ID
exports.delete = async (req, res) => {
  try {
    const result = await RegistroProduccion.delete(req.params.id);
    res.send({ message: "Registro de producción eliminado correctamente." });
  } catch (err) {
    console.error(`Error al eliminar el registro de producción con id ${req.params.id}:`, err);
    if (err.message && err.message.includes('No se encontró')) {
      return res.status(404).send({
        message: err.message
      });
    }
    res.status(500).send({
      message: `No se pudo eliminar el registro de producción con id ${req.params.id}`
    });
  }
}; 