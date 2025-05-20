const express = require('express');
const router = express.Router();
const ausenciaController = require('../controllers/ausencia.controller');

// Obtener todas las ausencias
router.get('/', ausenciaController.findAll);

// Obtener ausencia por ID
router.get('/:id', ausenciaController.findOne);

// Obtener ausencias por persona
router.get('/persona/:idPersona', ausenciaController.findByPersona);

// Obtener ausencias por rango de fechas
router.get('/fechas/:fechaInicio/:fechaFin', ausenciaController.findByFechas);

// Crear nueva ausencia
router.post('/', ausenciaController.create);

// Actualizar ausencia
router.put('/:id', ausenciaController.update);

// Eliminar ausencia
router.delete('/:id', ausenciaController.delete);

module.exports = router; 