const express = require('express');
const router = express.Router();
const referenciaController = require('../controllers/referencia.controller');

// Obtener todas las referencias
router.get('/', referenciaController.findAll);

// Obtener una referencia por ID
router.get('/:id', referenciaController.findOne);

// Crear una nueva referencia
router.post('/', referenciaController.create);

// Actualizar una referencia
router.put('/:id', referenciaController.update);

// Eliminar una referencia
router.delete('/:id', referenciaController.delete);

module.exports = router; 