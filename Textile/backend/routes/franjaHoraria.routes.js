const franjasHorarias = require('../controllers/franjaHoraria.controller.js');
const express = require('express');
const router = express.Router();

// Crear una nueva franja horaria
router.post('/', franjasHorarias.create);

// Obtener todas las franjas horarias
router.get('/', franjasHorarias.findAll);

// Obtener una franja horaria por id
router.get('/:id', franjasHorarias.findOne);

// Actualizar una franja horaria por id
router.put('/:id', franjasHorarias.update);

// Eliminar una franja horaria por id
router.delete('/:id', franjasHorarias.delete);

// Actualizar el estado de una franja horaria por id
router.patch('/:id/estado', franjasHorarias.updateStatus);

module.exports = router; 