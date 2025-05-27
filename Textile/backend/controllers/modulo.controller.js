const Modulo = require('../models/modulo.model');
const { connectToDatabase } = require('../config/db.connection');

exports.findAll = async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const modulos = await Modulo.getAll(connection);
        res.json({
            success: true,
            data: modulos
        });
    } catch (error) {
        console.error('Error en findAll:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error al obtener módulos',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (e) {
                console.error('Error cerrando la conexión:', e);
            }
        }
    }
};

exports.findOne = async (req, res) => {
    let connection;
    try {
        connection = await connectToDatabase();
        const modulo = await Modulo.getById(connection, req.params.id);
        
        if (!modulo) {
            return res.status(404).json({ 
                success: false,
                message: 'Módulo no encontrado' 
            });
        }
        
        res.json({
            success: true,
            data: modulo
        });
    } catch (error) {
        console.error('Error en findOne:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error al obtener el módulo',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (e) {
                console.error('Error cerrando la conexión:', e);
            }
        }
    }
};

exports.create = async (req, res) => {
    // Validar la solicitud
    if (!req.body.nombre) {
        return res.status(400).json({ 
            success: false,
            message: 'El nombre del módulo es requerido' 
        });
        return res.status(400).json({ message: 'El nombre del módulo es requerido' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto Modulo
        const modulo = {
            nombre: req.body.nombre,
            estado: req.body.estado || 'activo',
            fecha_creacion: req.body.fecha_creacion || new Date()
        };

        const result = await Modulo.create(connection, modulo);
        await connection.end();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al crear el módulo' });
    }
};

exports.update = async (req, res) => {
    // Validar la solicitud
    if (!req.body.nombre) {
        return res.status(400).json({ message: 'El nombre del módulo es requerido' });
    }

    try {
        const connection = await connectToDatabase();
        
        // Crear un objeto con los datos a actualizar
        const modulo = {
            nombre: req.body.nombre,
            estado: req.body.estado
        };

        const result = await Modulo.update(connection, req.params.id, modulo);
        await connection.end();
        
        if (!result) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al actualizar el módulo' });
    }
};

exports.delete = async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await Modulo.delete(connection, req.params.id);
        await connection.end();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error al eliminar el módulo' });
    }
}; 