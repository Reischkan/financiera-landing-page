const express = require("express");
const cors = require("cors");
const app = express();
const initDb = require("./config/init-db");

// Configuración CORS
app.use(cors({
  origin: "http://localhost:3000" // Permitir solo el frontend
}));

// Parsear requests de contenido application/json
app.use(express.json());

// Parsear requests de contenido application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Inicializar la base de datos
// initDb.setupDatabase();

// Ruta simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API del Sistema de Gestión Textile." });
});

// Incluir rutas
require("./routes/modulo.routes")(app);
require("./routes/persona.routes")(app);
require("./routes/referencia.routes")(app);
require("./routes/asignacionModulo.routes")(app);
require("./routes/asignacionReferencia.routes")(app);
require("./routes/tallaReferencia.routes")(app);
require("./routes/franjaHoraria.routes")(app);
require("./routes/registroProduccion.routes")(app);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Inicialización de la base de datos cuando se inicia el servidor
initDb.setupDatabase()
  .then(() => {
    console.log("Base de datos inicializada correctamente");
  })
  .catch(err => {
    console.error("Error inicializando la base de datos:", err);
  }); 