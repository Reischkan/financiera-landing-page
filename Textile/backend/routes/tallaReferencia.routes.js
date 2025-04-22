const express = require('express');
const router = express.Router();
const tallaReferenciaController = require('../controllers/tallaReferencia.controller');

// Obtener todas las tallas de referencia
router.get('/', tallaReferenciaController.findAll);

// Obtener una talla de referencia por ID
router.get('/:id', tallaReferenciaController.findOne);

// Obtener tallas por ID de referencia
router.get('/referencia/:idReferencia', tallaReferenciaController.findByReferenciaId);

// Crear una nueva talla de referencia
router.post('/', tallaReferenciaController.create);

// Actualizar una talla de referencia
router.put('/:id', tallaReferenciaController.update);

// Eliminar una talla de referencia
router.delete('/:id', tallaReferenciaController.delete);

module.exports = router; 