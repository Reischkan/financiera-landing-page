const { connectToDatabase } = require('./db.connection');

async function main() {
  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await connectToDatabase();
    
    // Ejemplo de consulta
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tablas en la base de datos:');
    console.log(rows);
    
    // Aquí puedes poner tus propias consultas
    
  } catch (error) {
    console.error('Error en la aplicación:', error.message);
  } finally {
    // Cerrar la conexión cuando termines
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

main(); 