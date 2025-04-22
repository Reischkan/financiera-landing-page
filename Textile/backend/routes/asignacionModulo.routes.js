const express = require('express');
const router = express.Router();
const asignacionModuloController = require('../controllers/asignacionModulo.controller');

// Obtener todas las asignaciones
router.get('/', asignacionModuloController.findAll);

// Obtener asignaciones por módulo
router.get('/modulo/:idModulo', asignacionModuloController.findByModulo);

// Obtener asignaciones por persona
router.get('/persona/:idPersona', asignacionModuloController.findByPersona);

// Obtener una asignación por ID
router.get('/:id', asignacionModuloController.findOne);

// Crear una nueva asignación
router.post('/', asignacionModuloController.create);

// Actualizar una asignación
router.put('/:id', asignacionModuloController.update);

// Desasignar una persona (cambiar estado y establecer fecha_desasignacion)
router.put('/:id/desasignar', asignacionModuloController.desasignar);

// Eliminar una asignación
router.delete('/:id', asignacionModuloController.delete);

module.exports = router; 