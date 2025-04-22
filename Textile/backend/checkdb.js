const mysql = require('mysql2/promise');
const dbConfig = require('./config/db.config');

async function checkAndUpdateEnum() {
  let connection;
  
  try {
    // Conectar a la base de datos usando config
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('Conexión a la base de datos establecida.');
    
    // Obtener información sobre la tabla asignacionreferencia
    const [tableInfo] = await connection.query(`
      SHOW COLUMNS FROM asignacionreferencia
    `);
    
    console.log('Columnas de la tabla asignacionreferencia:');
    tableInfo.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type}`);
    });
    
    // Buscar la columna estado
    const estadoColumn = tableInfo.find(column => column.Field === 'estado');
    
    if (!estadoColumn) {
      console.log('No se encontró la columna estado en la tabla asignacionreferencia.');
      return;
    }
    
    console.log(`Columna estado encontrada: ${estadoColumn.Type}`);
    
    // Verificar si el tipo ya incluye 'cancelado'
    const enumValues = estadoColumn.Type.match(/'([^']*)'/g).map(val => val.replace(/'/g, ''));
    console.log('Valores actuales del enum:', enumValues);
    
    if (enumValues.includes('cancelado')) {
      console.log('El valor "cancelado" ya está incluido en el enum.');
      return;
    }
    
    // Modificar la columna para incluir 'cancelado'
    console.log('Actualizando la columna estado para incluir "cancelado"...');
    
    await connection.query(`
      ALTER TABLE asignacionreferencia 
      MODIFY COLUMN estado ENUM('activo', 'pausado', 'completado', 'cancelado') NOT NULL DEFAULT 'activo'
    `);
    
    console.log('Columna estado actualizada exitosamente.');
    
    // Verificar la actualización
    const [updatedColumnInfo] = await connection.query(`
      SHOW COLUMNS FROM asignacionreferencia WHERE Field = 'estado'
    `);
    
    console.log('Tipo actualizado:', updatedColumnInfo[0].Type);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada.');
    }
  }
}

checkAndUpdateEnum(); 