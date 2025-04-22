const Referencia = require('../models/referencia.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const referencias = await Referencia.getAll(connection);
        await connection.end();
        res.json(referencias);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener referencias' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const referencia = await Referencia.getById(connection, req.params.id);
        await connection.end();
        
        if (!referencia) {
            return res.status(404).json({ message: 'Referencia no encontrada' });
        }
        
        res.json(referencia);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener la referencia' });
    }
};

exports.create = async (req, res) => {
    // Validar la solicitud
    if (!req.body.codigo || !req.body.descripcion) {
        return res.status(400).json({ message: 'El código y descripción son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto Referencia
        const referencia = {
            codigo: req.body.codigo,
            descripcion: req.body.descripcion,
            tiempo_estimado_unidad: req.body.tiempo_estimado_unidad || 0,
            tiempo_total_estimado: req.body.tiempo_total_estimado || 0,
            serial: req.body.serial || '',
            lote: req.body.lote || '',
            estado: req.body.estado || 'pendiente'
        };

        const result = await Referencia.create(connection, referencia);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al crear la referencia' });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.codigo || !req.body.descripcion) {
        return res.status(400).json({ message: 'El código y descripción son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto con los datos a actualizar
        const referencia = {
            codigo: req.body.codigo,
            descripcion: req.body.descripcion,
            tiempo_estimado_unidad: req.body.tiempo_estimado_unidad,
            tiempo_total_estimado: req.body.tiempo_total_estimado,
            serial: req.body.serial,
            lote: req.body.lote,
            estado: req.body.estado
        };

        const result = await Referencia.update(connection, req.params.id, referencia);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Referencia no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al actualizar la referencia' });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await Referencia.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al eliminar la referencia' });
    }
}; 