const Persona = require('../models/persona.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const personas = await Persona.getAll(connection);
        await connection.end();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener personas' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const persona = await Persona.getById(connection, req.params.id);
        await connection.end();
        
        if (!persona) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        
        res.json(persona);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener la persona' });
    }
};

exports.create = async (req, res) => {
    // Validar la solicitud
    if (!req.body.nombre || !req.body.documento) {
        return res.status(400).json({ message: 'El nombre y documento son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto Persona
        const persona = {
            nombre: req.body.nombre,
            documento: req.body.documento,
            minutos_diarios_asignados: req.body.minutos_diarios_asignados || 480, // 8 horas por defecto
            fecha_ingreso: req.body.fecha_ingreso || new Date(),
            estado: req.body.estado || 'activo'
        };

        const result = await Persona.create(connection, persona);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al crear la persona' });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.nombre || !req.body.documento) {
        return res.status(400).json({ message: 'El nombre y documento son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto con los datos a actualizar
        const persona = {
            nombre: req.body.nombre,
            documento: req.body.documento,
            minutos_diarios_asignados: req.body.minutos_diarios_asignados,
            estado: req.body.estado
        };

        const result = await Persona.update(connection, req.params.id, persona);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al actualizar la persona' });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await Persona.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al eliminar la persona' });
    }
}; 