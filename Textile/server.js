const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./backend/config/db.connection');
const { initializeDatabase } = require('./backend/config/db.init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
let connection;
async function connectDB() {
  try {
    connection = await connectToDatabase();
    console.log('Base de datos conectada exitosamente');
    // Inicializar la base de datos
    await initializeDatabase();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Textile' });
});

// Importar rutas
app.use('/api/modulos', require('./backend/routes/modulo.routes'));
app.use('/api/personas', require('./backend/routes/persona.routes'));
app.use('/api/referencias', require('./backend/routes/referencia.routes'));
app.use('/api/asignaciones-modulo', require('./backend/routes/asignacionModulo.routes'));
app.use('/api/asignaciones-referencia', require('./backend/routes/asignacionReferencia.routes'));
app.use('/api/tallas-referencia', require('./backend/routes/tallaReferencia.routes'));
app.use('/api/franjas-horarias', require('./backend/routes/franjaHoraria.routes'));
app.use('/api/registros-produccion', require('./backend/routes/registroProduccion.routes'));
app.use('/api/ausencias', require('./backend/routes/ausencia.routes'));

// TODO: Implementar el resto de las rutas para cada entidad
// - Nota
// - HistorialProduccion
// - Usuario

// Iniciar el servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
}); 