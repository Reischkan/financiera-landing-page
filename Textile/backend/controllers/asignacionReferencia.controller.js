const AsignacionReferencia = require('../models/asignacionReferencia.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionReferencia.getAll(connection);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones de referencias' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignacion = await AsignacionReferencia.getById(connection, req.params.id);
        await connection.end();
        
        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación de referencia no encontrada' });
        }
        
        res.json(asignacion);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener la asignación de referencia' });
    }
};

exports.findByModulo = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionReferencia.getByModulo(connection, req.params.idModulo);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones del módulo' });
    }
};

exports.findByReferencia = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const asignaciones = await AsignacionReferencia.getByReferencia(connection, req.params.idReferencia);
        await connection.end();
        res.json(asignaciones);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener asignaciones de la referencia' });
    }
};

exports.create = async (req, res) => {
    console.log('Datos recibidos para crear asignación de referencia:', req.body);
    
    // Validar la solicitud
    if (!req.body.id_modulo || !req.body.id_referencia) {
        return res.status(400).json({ message: 'El ID del módulo y de la referencia son requeridos' });
    }

    // Validar que los campos sean del tipo correcto
    if (isNaN(parseInt(req.body.id_modulo)) || isNaN(parseInt(req.body.id_referencia))) {
        return res.status(400).json({ message: 'ID del módulo y de la referencia deben ser números' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto AsignacionReferencia
        const asignacion = {
            id_modulo: parseInt(req.body.id_modulo),
            id_referencia: parseInt(req.body.id_referencia),
            fecha_asignacion: req.body.fecha_asignacion ? new Date(req.body.fecha_asignacion) : new Date(),
            fecha_inicio: req.body.fecha_inicio ? new Date(req.body.fecha_inicio) : null,
            minutos_producidos: req.body.minutos_producidos ? parseFloat(req.body.minutos_producidos) : 0,
            minutos_restantes: req.body.minutos_restantes ? parseFloat(req.body.minutos_restantes) : null,
            porcentaje_avance: req.body.porcentaje_avance ? parseFloat(req.body.porcentaje_avance) : 0,
            estado: req.body.estado || 'activo'
        };

        console.log('Objeto asignación preparado:', asignacion);

        const result = await AsignacionReferencia.create(connection, asignacion);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error detallado al crear asignación de referencia:', error);
        
        let statusCode = 500;
        let message = 'Error al crear la asignación de referencia';
        
        if (error.message.includes('ya está asignada')) {
            statusCode = 400;
            message = error.message;
        } else if (error.message.includes('no existe')) {
            statusCode = 400;
            message = error.message;
        }
        
        res.status(statusCode).json({ message: message });
    }
};

exports.update = async (req, res) => {
    console.log('Datos recibidos para actualizar asignación de referencia:', req.body);
    
    // Validar la solicitud
    if (!req.body.id_modulo || !req.body.id_referencia) {
        return res.status(400).json({ message: 'El ID del módulo y de la referencia son requeridos' });
    }

    // Validar que los campos sean del tipo correcto
    if (isNaN(parseInt(req.body.id_modulo)) || isNaN(parseInt(req.body.id_referencia))) {
        return res.status(400).json({ message: 'ID del módulo y de la referencia deben ser números' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Formatear las fechas correctamente
        const fechaAsignacion = req.body.fecha_asignacion ? new Date(req.body.fecha_asignacion) : null;
        const fechaInicio = req.body.fecha_inicio ? new Date(req.body.fecha_inicio) : null;
        const fechaFinal = req.body.fecha_final ? new Date(req.body.fecha_final) : null;
        
        // Log para debugging
        console.log('Fechas recibidas:', {
            fecha_asignacion: req.body.fecha_asignacion,
            fecha_inicio: req.body.fecha_inicio,
            fecha_final: req.body.fecha_final
        });
        
        console.log('Fechas parseadas:', {
            fecha_asignacion: fechaAsignacion,
            fecha_inicio: fechaInicio,
            fecha_final: fechaFinal
        });
        
        // Crear un objeto con los datos a actualizar
        const asignacion = {
            id_modulo: parseInt(req.body.id_modulo),
            id_referencia: parseInt(req.body.id_referencia),
            fecha_asignacion: fechaAsignacion,
            fecha_inicio: fechaInicio,
            fecha_final: fechaFinal,
            minutos_producidos: null,
            minutos_restantes: null,
            porcentaje_avance: null,
            estado: req.body.estado || 'activo',
            comentarios: req.body.comentarios || ''
        };

        // Procesar valores numéricos con validación
        try {
            if (req.body.minutos_producidos !== undefined) {
                const minutos = parseFloat(req.body.minutos_producidos);
                if (!isNaN(minutos)) {
                    asignacion.minutos_producidos = minutos;
                }
            }
            
            if (req.body.minutos_restantes !== undefined) {
                const minutos = parseFloat(req.body.minutos_restantes);
                if (!isNaN(minutos)) {
                    asignacion.minutos_restantes = minutos;
                }
            }
            
            if (req.body.porcentaje_avance !== undefined) {
                const porcentaje = parseFloat(req.body.porcentaje_avance);
                if (!isNaN(porcentaje)) {
                    asignacion.porcentaje_avance = porcentaje;
                }
            }
        } catch (e) {
            console.error('Error al convertir valores numéricos:', e);
        }

        console.log('Objeto asignación preparado para actualizar:', asignacion);

        const result = await AsignacionReferencia.update(connection, req.params.id, asignacion);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Asignación de referencia no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error detallado al actualizar asignación de referencia:', error);
        
        let statusCode = 500;
        let message = 'Error al actualizar la asignación de referencia';
        
        if (error.message.includes('ya está asignada') || 
            error.message.includes('fecha de inicio') ||
            error.message.includes('Estado no válido')) {
            statusCode = 400;
            message = error.message;
        } else if (error.message.includes('no existe')) {
            statusCode = 404;
            message = error.message;
        } else if (error.sqlMessage) {
            // Si es un error de SQL, mostrar información más detallada
            message = `Error en la base de datos: ${error.sqlMessage}`;
            console.error('Error SQL:', error.sqlMessage, 'Código:', error.code);
        } else {
            // Para cualquier otro error, mostrar el mensaje original del error
            message = `Error: ${error.message}`;
        }
        
        res.status(statusCode).json({ message: message });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await AsignacionReferencia.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        console.error('Error detallado al eliminar asignación de referencia:', error);
        
        let statusCode = 500;
        let message = 'Error al eliminar la asignación de referencia';
        
        if (error.message.includes('no existe')) {
            statusCode = 404;
            message = error.message;
        }
        
        res.status(statusCode).json({ message: message });
    }
};

exports.completar = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await AsignacionReferencia.completar(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        console.error('Error detallado al completar asignación de referencia:', error);
        
        let statusCode = 500;
        let message = 'Error al completar la referencia';
        
        if (error.message.includes('no existe')) {
            statusCode = 404;
            message = error.message;
        } else if (error.message.includes('ya está completada')) {
            statusCode = 400;
            message = error.message;
        }
        
        res.status(statusCode).json({ message: message });
    }
};

exports.actualizarAvance = async (req, res) => {
    console.log('Datos recibidos para actualizar avance:', req.body);
    
    // Validar la solicitud
    if (req.body.minutos_producidos === undefined) {
        return res.status(400).json({ message: 'Los minutos producidos son requeridos' });
    }

    // Validar que minutos_producidos sea un número positivo
    const minutosProducidos = parseFloat(req.body.minutos_producidos);
    if (isNaN(minutosProducidos) || minutosProducidos < 0) {
        return res.status(400).json({ message: 'Los minutos producidos deben ser un número positivo' });
    }

    try {
        const connection = await connectToDatabase();
        const result = await AsignacionReferencia.actualizarAvance(
            connection, 
            req.params.id, 
            minutosProducidos
        );
        await connection.end();
        res.json(result);
    } catch (error) {
        console.error('Error detallado al actualizar avance de referencia:', error);
        
        let statusCode = 500;
        let message = 'Error al actualizar el avance de la referencia';
        
        if (error.message.includes('no existe')) {
            statusCode = 404;
            message = error.message;
        } else if (error.message.includes('no puede') || error.message.includes('negativos')) {
            statusCode = 400;
            message = error.message;
        }
        
        res.status(statusCode).json({ message: message });
    }
}; 