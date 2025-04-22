const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./backend/config/db.connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
let connection;
async function initializeDatabase() {
  try {
    connection = await connectToDatabase();
    console.log('Base de datos conectada exitosamente');
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
// TODO: Implementar el resto de las rutas para cada entidad

// Iniciar el servidor
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
}); 