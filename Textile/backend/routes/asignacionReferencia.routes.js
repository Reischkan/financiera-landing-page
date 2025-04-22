const express = require('express');
const router = express.Router();
const asignacionReferenciaController = require('../controllers/asignacionReferencia.controller');

// Obtener todas las asignaciones de referencias
router.get('/', asignacionReferenciaController.findAll);

// Obtener asignaciones por módulo
router.get('/modulo/:idModulo', asignacionReferenciaController.findByModulo);

// Obtener asignaciones por referencia
router.get('/referencia/:idReferencia', asignacionReferenciaController.findByReferencia);

// Obtener una asignación por ID
router.get('/:id', asignacionReferenciaController.findOne);

// Crear una nueva asignación
router.post('/', asignacionReferenciaController.create);

// Actualizar una asignación
router.put('/:id', asignacionReferenciaController.update);

// Marcar una asignación como completada
router.put('/:id/completar', asignacionReferenciaController.completar);

// Actualizar el avance de una asignación
router.put('/:id/avance', asignacionReferenciaController.actualizarAvance);

// Eliminar una asignación
router.delete('/:id', asignacionReferenciaController.delete);

module.exports = router; 