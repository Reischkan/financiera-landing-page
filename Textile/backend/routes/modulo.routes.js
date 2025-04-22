const express = require('express');
const router = express.Router();
const moduloController = require('../controllers/modulo.controller');

// Obtener todos los módulos
router.get('/', moduloController.findAll);

// Obtener un módulo por ID
router.get('/:id', moduloController.findOne);

// Crear un nuevo módulo
router.post('/', moduloController.create);

// Actualizar un módulo
router.put('/:id', moduloController.update);

// Eliminar un módulo
router.delete('/:id', moduloController.delete);

module.exports = router; 