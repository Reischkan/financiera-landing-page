const { connectToDatabase } = require('./db.connection');

async function initializeDatabase() {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Conectado a la base de datos. Iniciando configuración...');

    // Crear tabla FranjaHoraria si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS FranjaHoraria (
        id_franja INT PRIMARY KEY AUTO_INCREMENT,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        descripcion VARCHAR(100) NOT NULL,
        estado ENUM('activa', 'inactiva') DEFAULT 'activa'
      )
    `);
    console.log('Tabla FranjaHoraria creada o ya existente');

    // Verificar si hay datos en la tabla
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM FranjaHoraria');
    const count = rows[0].count;

    if (count === 0) {
      // Insertar datos de ejemplo si la tabla está vacía
      await connection.execute(`
        INSERT INTO FranjaHoraria (hora_inicio, hora_fin, descripcion, estado) VALUES
        ('07:00', '08:00', 'Franja de la mañana 1', 'activa'),
        ('08:00', '09:00', 'Franja de la mañana 2', 'activa'),
        ('09:00', '10:00', 'Franja de la mañana 3', 'activa'),
        ('10:00', '11:00', 'Franja de media mañana 1', 'activa'),
        ('11:00', '12:00', 'Franja de media mañana 2', 'activa'),
        ('12:00', '13:00', 'Franja de almuerzo', 'activa'),
        ('13:00', '14:00', 'Franja de la tarde 1', 'activa'),
        ('14:00', '15:00', 'Franja de la tarde 2', 'activa'),
        ('15:00', '16:00', 'Franja de la tarde 3', 'activa'),
        ('16:00', '17:00', 'Franja de cierre', 'activa')
      `);
      console.log('Datos de ejemplo insertados en la tabla FranjaHoraria');
    } else {
      console.log(`La tabla FranjaHoraria ya contiene ${count} registros`);
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    if (connection) {
      connection.end();
      console.log('Conexión cerrada');
    }
  }
}

module.exports = { initializeDatabase }; 