const Ausencia = require('../models/ausencia.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        console.log('Controller: Obteniendo todas las ausencias');
        const connection = await connectToDatabase();
        const ausencias = await Ausencia.getAll(connection);
        await connection.end();
        res.json(ausencias);
    } catch (error) {
        console.error('Error al obtener ausencias:', error);
        res.status(500).json({ 
            message: error.message || 'Error al obtener ausencias',
            error: error.stack
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        console.log(`Controller: Obteniendo ausencia con ID ${req.params.id}`);
        const connection = await connectToDatabase();
        const ausencia = await Ausencia.getById(connection, req.params.id);
        await connection.end();
        
        if (!ausencia) {
            return res.status(404).json({ message: 'Ausencia no encontrada' });
        }
        
        res.json(ausencia);
    } catch (error) {
        console.error('Error al obtener ausencia por ID:', error);
        res.status(500).json({ 
            message: error.message || 'Error al obtener la ausencia',
            error: error.stack
        });
    }
};

exports.findByPersona = async (req, res) => {
    try {
        console.log(`Controller: Obteniendo ausencias para persona ID ${req.params.idPersona}`);
        const connection = await connectToDatabase();
        const ausencias = await Ausencia.getByPersona(connection, req.params.idPersona);
        await connection.end();
        res.json(ausencias);
    } catch (error) {
        console.error('Error al obtener ausencias por persona:', error);
        res.status(500).json({ 
            message: error.message || 'Error al obtener ausencias por persona',
            error: error.stack
        });
    }
};

exports.create = async (req, res) => {
    // Validar la solicitud
    if (!req.body.id_persona || !req.body.fecha_inicio || !req.body.fecha_fin || !req.body.motivo) {
        return res.status(400).json({ 
            message: 'La persona, fecha de inicio, fecha de fin y motivo son campos requeridos' 
        });
    }

    try {
        console.log('Controller: Creando nueva ausencia', req.body);
        const connection = await connectToDatabase();
        
        // Crear un objeto Ausencia
        const ausencia = {
            id_persona: req.body.id_persona,
            fecha_inicio: req.body.fecha_inicio,
            fecha_fin: req.body.fecha_fin,
            motivo: req.body.motivo,
            justificada: req.body.justificada || false
        };

        const result = await Ausencia.create(connection, ausencia);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear ausencia:', error);
        res.status(500).json({ 
            message: error.message || 'Error al crear la ausencia',
            error: error.stack 
        });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.id_persona || !req.body.fecha_inicio || !req.body.fecha_fin || !req.body.motivo) {
        return res.status(400).json({ 
            message: 'La persona, fecha de inicio, fecha de fin y motivo son campos requeridos' 
        });
    }

    try {
        console.log(`Controller: Actualizando ausencia ID ${req.params.id}`, req.body);
        const connection = await connectToDatabase();
        
        // Crear un objeto con los datos a actualizar
        const ausencia = {
            id_persona: req.body.id_persona,
            fecha_inicio: req.body.fecha_inicio,
            fecha_fin: req.body.fecha_fin,
            motivo: req.body.motivo,
            justificada: req.body.justificada
        };

        const result = await Ausencia.update(connection, req.params.id, ausencia);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Ausencia no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar ausencia:', error);
        res.status(500).json({ 
            message: error.message || 'Error al actualizar la ausencia',
            error: error.stack
        });
    }
};

exports.delete = async (req, res) => {
    try {
        console.log(`Controller: Eliminando ausencia ID ${req.params.id}`);
        const connection = await connectToDatabase();
        const result = await Ausencia.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        console.error('Error al eliminar ausencia:', error);
        res.status(500).json({ 
            message: error.message || 'Error al eliminar la ausencia',
            error: error.stack
        });
    }
};

exports.findByFechas = async (req, res) => {
    if (!req.params.fechaInicio || !req.params.fechaFin) {
        return res.status(400).json({ message: 'Se requieren fechas de inicio y fin' });
    }

    try {
        console.log(`Controller: Obteniendo ausencias entre ${req.params.fechaInicio} y ${req.params.fechaFin}`);
        const connection = await connectToDatabase();
        const ausencias = await Ausencia.getByFechas(
            connection,
            req.params.fechaInicio,
            req.params.fechaFin
        );
        await connection.end();
        res.json(ausencias);
    } catch (error) {
        console.error('Error al obtener ausencias por rango de fechas:', error);
        res.status(500).json({ 
            message: error.message || 'Error al obtener ausencias por rango de fechas',
            error: error.stack
        });
    }
}; 