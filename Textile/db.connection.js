const mysql = require('mysql2/promise');
const dbConfig = require('./db.config');

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('Conexión exitosa a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error;
  }
}

module.exports = {
  connectToDatabase
}; 