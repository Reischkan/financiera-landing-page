const TallaReferencia = require('../models/tallaReferencia.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const tallasReferencia = await TallaReferencia.getAll(connection);
        await connection.end();
        res.json(tallasReferencia);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener tallas de referencia' });
    }
};

exports.findOne = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const tallaReferencia = await TallaReferencia.getById(connection, req.params.id);
        await connection.end();
        
        if (!tallaReferencia) {
            return res.status(404).json({ message: 'Talla de referencia no encontrada' });
        }
        
        res.json(tallaReferencia);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener la talla de referencia' });
    }
};

exports.findByReferenciaId = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const tallasReferencia = await TallaReferencia.getByReferenciaId(connection, req.params.idReferencia);
        await connection.end();
        res.json(tallasReferencia);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al obtener tallas por referencia' });
    }
};

exports.create = async (req, res) => {
    console.log('Datos recibidos para crear talla de referencia:', req.body);
    
    // Validar la solicitud
    if (!req.body.id_referencia || !req.body.talla || !req.body.cantidad) {
        return res.status(400).json({ message: 'El ID de referencia, talla y cantidad son requeridos' });
    }

    // Validar que los campos sean del tipo correcto
    if (isNaN(parseInt(req.body.id_referencia)) || isNaN(parseInt(req.body.cantidad))) {
        return res.status(400).json({ message: 'ID de referencia y cantidad deben ser números' });
    }

    if (req.body.minutos_estimados && isNaN(parseFloat(req.body.minutos_estimados))) {
        return res.status(400).json({ message: 'Minutos estimados debe ser un número' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto TallaReferencia sin el campo estado
        const tallaReferencia = {
            id_referencia: parseInt(req.body.id_referencia),
            talla: req.body.talla,
            cantidad: parseInt(req.body.cantidad),
            minutos_estimados: req.body.minutos_estimados ? parseFloat(req.body.minutos_estimados) : 0
        };

        console.log('Objeto tallaReferencia preparado:', tallaReferencia);

        const result = await TallaReferencia.create(connection, tallaReferencia);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error detallado al crear talla referencia:', error);
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('Ya existe esta talla')) {
            return res.status(400).json({ message: 'Ya existe esta talla para la referencia seleccionada' });
        }
        res.status(500).json({ message: error.message || 'Error al crear la talla de referencia' });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.talla || !req.body.cantidad) {
        return res.status(400).json({ message: 'La talla y cantidad son requeridos' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto con los datos a actualizar, sin el campo estado
        const tallaReferencia = {
            talla: req.body.talla,
            cantidad: parseInt(req.body.cantidad),
            minutos_estimados: req.body.minutos_estimados ? parseFloat(req.body.minutos_estimados) : 0
        };

        const result = await TallaReferencia.update(connection, req.params.id, tallaReferencia);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Talla de referencia no encontrada' });
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al actualizar la talla de referencia' });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await TallaReferencia.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al eliminar la talla de referencia' });
    }
}; 