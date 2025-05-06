const express = require('express');
const router = express.Router();
const registrosProduccion = require("../controllers/registroProduccion.controller.js");

// Crear un nuevo registro de producción
router.post("/", registrosProduccion.create);

// Recuperar todos los registros de producción
router.get("/", registrosProduccion.findAll);

// Recuperar registros por fecha
router.get("/fecha/:fecha", registrosProduccion.findByDate);

// Recuperar registros por módulo
router.get("/modulo/:idModulo", registrosProduccion.findByModulo);

// Recuperar registros por referencia
router.get("/referencia/:idReferencia", registrosProduccion.findByReferencia);

// Recuperar un solo registro de producción por id
router.get("/:id", registrosProduccion.findOne);

// Actualizar un registro de producción por id
router.put("/:id", registrosProduccion.update);

// Eliminar un registro de producción por id
router.delete("/:id", registrosProduccion.delete);

module.exports = router; 