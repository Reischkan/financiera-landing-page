const FranjaHoraria = require('../models/franjaHoraria.model');

// Obtener todas las franjas horarias
exports.findAll = async (req, res) => {
  try {
    const data = await FranjaHoraria.findAll();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Ocurrió un error al obtener las franjas horarias'
    });
  }
};

// Obtener una franja horaria por ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const franjaHoraria = await FranjaHoraria.findById(id);
    
    if (!franjaHoraria) {
      return res.status(404).json({ message: `No se encontró la franja horaria con ID ${id}` });
    }
    
    res.status(200).json(franjaHoraria);
  } catch (error) {
    console.error('Error al obtener franja horaria:', error);
    res.status(500).json({ message: 'Error al obtener la franja horaria' });
  }
};

// Crear una nueva franja horaria
exports.create = async (req, res) => {
  try {
    // Validar request
    if (!req.body.hora_inicio || !req.body.hora_fin || !req.body.descripcion) {
      return res.status(400).json({ message: 'Los campos hora_inicio, hora_fin y descripcion son obligatorios' });
    }

    // Crear objeto franja horaria
    const franjaHoraria = {
      hora_inicio: req.body.hora_inicio,
      hora_fin: req.body.hora_fin,
      descripcion: req.body.descripcion,
      estado: req.body.estado || 'activa'
    };

    // Guardar en la base de datos
    const resultado = await FranjaHoraria.create(franjaHoraria);
    
    // Enviar respuesta
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear franja horaria:', error);
    res.status(500).json({ message: 'Error al crear la franja horaria: ' + error.message });
  }
};

// Actualizar una franja horaria
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Validar request
    if (!req.body.hora_inicio || !req.body.hora_fin || !req.body.descripcion) {
      return res.status(400).json({ message: 'El contenido no puede estar vacío' });
    }

    // Crear objeto franja horaria
    const franjaHoraria = {
      hora_inicio: req.body.hora_inicio,
      hora_fin: req.body.hora_fin,
      descripcion: req.body.descripcion,
      estado: req.body.estado
    };

    // Actualizar en la base de datos
    const success = await FranjaHoraria.update(id, franjaHoraria);
    
    if (!success) {
      return res.status(404).json({ message: `No se encontró la franja horaria con ID ${id}` });
    }
    
    res.status(200).json({ id, ...franjaHoraria });
  } catch (error) {
    console.error('Error al actualizar franja horaria:', error);
    res.status(500).json({ message: 'Error al actualizar la franja horaria' });
  }
};

// Eliminar una franja horaria
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const success = await FranjaHoraria.delete(id);
    
    if (!success) {
      return res.status(404).json({ message: `No se encontró la franja horaria con ID ${id}` });
    }
    
    res.status(200).json({ message: 'Franja horaria eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar franja horaria:', error);
    res.status(500).json({ message: 'Error al eliminar la franja horaria' });
  }
};

// Actualizar estado de una franja horaria
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;
    
    // Validar el estado
    if (!estado || !['activa', 'inactiva'].includes(estado)) {
      return res.status(400).json({ 
        message: 'Estado no válido. Debe ser "activa" o "inactiva"' 
      });
    }
    
    // Actualizar en la base de datos
    const success = await FranjaHoraria.updateEstado(id, estado);
    
    if (!success) {
      return res.status(404).json({ 
        message: `No se encontró la franja horaria con ID ${id}` 
      });
    }
    
    res.status(200).json({ 
      message: `Estado de la franja horaria actualizado a ${estado}`,
      id,
      estado
    });
  } catch (error) {
    console.error('Error al actualizar estado de franja horaria:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el estado de la franja horaria: ' + error.message 
    });
  }
}; 