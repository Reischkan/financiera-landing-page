const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');

// Obtener todas las personas
router.get('/', personaController.findAll);

// Obtener una persona por ID
router.get('/:id', personaController.findOne);

// Crear una nueva persona
router.post('/', personaController.create);

// Actualizar una persona
router.put('/:id', personaController.update);

// Eliminar una persona
router.delete('/:id', personaController.delete);

module.exports = router; 