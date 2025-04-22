const AsignacionModulo = require('../models/asignacionModulo.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionModulo.getAll(connection);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones de módulos' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignacion = await AsignacionModulo.getById(connection, req.params.id);
        await connection.end();
        
        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }
        
        res.json(asignacion);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener la asignación' });
    }
};

exports.findByModulo = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionModulo.getByModulo(connection, req.params.idModulo);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones del módulo' });
    }
};

exports.findByPersona = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionModulo.getByPersona(connection, req.params.idPersona);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones de la persona' });
    }
};

exports.create = async (req, res) => {
    // Validar la solicitud
    if (!req.body.id_modulo || !req.body.id_persona) {
        return res.status(400).json({ message: 'El ID del módulo y de la persona son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto AsignacionModulo
        const asignacion = {
            id_modulo: req.body.id_modulo,
            id_persona: req.body.id_persona,
            fecha_asignacion: req.body.fecha_asignacion || new Date(),
            estado: req.body.estado || 'activo'
        };

        const result = await AsignacionModulo.create(connection, asignacion);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        if (error.message.includes('La persona ya tiene una asignación activa')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Error al crear la asignación' });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.id_modulo || !req.body.id_persona) {
        return res.status(400).json({ message: 'El ID del módulo y de la persona son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Formatear las fechas correctamente
        const fechaAsignacion = req.body.fecha_asignacion ? new Date(req.body.fecha_asignacion) : null;
        const fechaDesasignacion = req.body.fecha_desasignacion ? new Date(req.body.fecha_desasignacion) : null;
        
        console.log('Datos recibidos para actualización:', {
            id: req.params.id,
            id_modulo: req.body.id_modulo,
            id_persona: req.body.id_persona,
            fecha_asignacion: fechaAsignacion,
            fecha_desasignacion: fechaDesasignacion,
            estado: req.body.estado
        });
        
        // Crear un objeto con los datos a actualizar
        const asignacion = {
            id_modulo: req.body.id_modulo,
            id_persona: req.body.id_persona,
            fecha_asignacion: fechaAsignacion,
            fecha_desasignacion: fechaDesasignacion,
            estado: req.body.estado
        };

        const result = await AsignacionModulo.update(connection, req.params.id, asignacion);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error detallado al actualizar asignación:', error);
        
        if (error.message.includes('La persona ya tiene una asignación activa')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes('fecha de asignación debe ser anterior')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes('Una asignación con fecha de desasignación')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes('Asignación no encontrada')) {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ message: error.message || 'Error al actualizar la asignación' });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await AsignacionModulo.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al eliminar la asignación' });
    }
};

exports.desasignar = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await AsignacionModulo.desasignar(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        console.error('Error detallado al desasignar:', error);
        
        if (error.message.includes('Asignación no encontrada')) {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ message: error.message || 'Error al desasignar a la persona' });
    }
}; 