const mysql = require('mysql2/promise');
const dbConfig = require('./db.config');

// Configuración de conexión a la base de datos
const dbConnection = {
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: true
};

// Función para inicializar la base de datos
async function setupDatabase() {
  let connection;
  try {
    // Crear conexión
    connection = await mysql.createConnection(dbConnection);
    console.log("Conexión exitosa a la base de datos MySQL");
    
    // Crear tablas si no existen
    await createTables(connection);
    
    // Inicializar datos básicos
    await initializeBasicData(connection);
    
    console.log("Base de datos conectada exitosamente");
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err);
    throw err;
  } finally {
    if (connection) {
      connection.end();
      console.log("Conexión cerrada");
    }
  }
}

// Función para crear las tablas
async function createTables(connection) {
  try {
    // Tabla Modulo
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Modulo (
        id_modulo INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT NULL,
        ubicacion VARCHAR(100) NULL,
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
      )
    `);
    console.log("Tabla Modulo creada o ya existente");

    // Tabla Persona
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Persona (
        id_persona INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        identificacion VARCHAR(20) NOT NULL UNIQUE,
        tipo_identificacion ENUM('CC', 'CE', 'TI', 'Pasaporte') NOT NULL DEFAULT 'CC',
        telefono VARCHAR(15) NULL,
        direccion VARCHAR(150) NULL,
        email VARCHAR(100) NULL,
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
      )
    `);
    console.log("Tabla Persona creada o ya existente");

    // Tabla Referencia
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Referencia (
        id_referencia INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        descripcion VARCHAR(255) NOT NULL,
        minutos_estimados DECIMAL(10,2) NULL DEFAULT 0,
        precio_unidad DECIMAL(10,2) NULL DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
      )
    `);
    console.log("Tabla Referencia creada o ya existente");

    // Tabla AsignacionModulo
    await connection.query(`
      CREATE TABLE IF NOT EXISTS AsignacionModulo (
        id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
        id_modulo INT NOT NULL,
        id_persona INT NULL,
        fecha_asignacion DATE NOT NULL,
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
        comentarios TEXT NULL,
        FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo),
        FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
      )
    `);
    console.log("Tabla AsignacionModulo creada o ya existente");

    // Tabla TallaReferencia
    await connection.query(`
      CREATE TABLE IF NOT EXISTS TallaReferencia (
        id_talla INT AUTO_INCREMENT PRIMARY KEY,
        id_referencia INT NOT NULL,
        talla VARCHAR(10) NOT NULL,
        descripcion VARCHAR(255) NULL,
        FOREIGN KEY (id_referencia) REFERENCES Referencia(id_referencia)
      )
    `);
    console.log("Tabla TallaReferencia creada o ya existente");

    // Tabla AsignacionReferencia
    await connection.query(`
      CREATE TABLE IF NOT EXISTS AsignacionReferencia (
        id_asignacion_referencia INT AUTO_INCREMENT PRIMARY KEY,
        id_modulo INT NOT NULL,
        id_referencia INT NOT NULL,
        fecha_asignacion DATE NOT NULL,
        fecha_inicio DATE NULL,
        fecha_final DATE NULL,
        minutos_producidos DECIMAL(10,2) NOT NULL DEFAULT 0,
        minutos_restantes DECIMAL(10,2) NULL DEFAULT 0,
        porcentaje_avance DECIMAL(5,2) NULL DEFAULT 0,
        estado ENUM('activo', 'completado', 'cancelado') NOT NULL DEFAULT 'activo',
        comentarios TEXT NULL,
        FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo),
        FOREIGN KEY (id_referencia) REFERENCES Referencia(id_referencia)
      )
    `);
    console.log("Tabla AsignacionReferencia creada o ya existente");

    // Tabla FranjaHoraria
    await connection.query(`
      CREATE TABLE IF NOT EXISTS FranjaHoraria (
        id_franja INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255) NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        duracion_minutos INT NOT NULL,
        estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
      )
    `);
    console.log("Tabla FranjaHoraria creada o ya existente");

    // Tabla RegistroProduccion
    await connection.query(`
      CREATE TABLE IF NOT EXISTS RegistroProduccion (
        id_registro INT AUTO_INCREMENT PRIMARY KEY,
        id_asignacion_modulo INT NOT NULL,
        id_asignacion_referencia INT NOT NULL,
        id_franja INT NOT NULL,
        fecha DATE NOT NULL,
        minutos_producidos DECIMAL(10,2) NOT NULL DEFAULT 0,
        observaciones TEXT NULL,
        FOREIGN KEY (id_asignacion_modulo) REFERENCES AsignacionModulo(id_asignacion),
        FOREIGN KEY (id_asignacion_referencia) REFERENCES AsignacionReferencia(id_asignacion_referencia),
        FOREIGN KEY (id_franja) REFERENCES FranjaHoraria(id_franja)
      )
    `);
    console.log("Tabla RegistroProduccion creada o ya existente");

  } catch (err) {
    console.error("Error al crear tablas:", err);
    throw err;
  }
}

// Función para inicializar datos básicos
async function initializeBasicData(connection) {
  try {
    // Verificar si ya existen registros en FranjaHoraria
    const [franjas] = await connection.query("SELECT COUNT(*) as count FROM FranjaHoraria");
    
    if (franjas[0].count === 0) {
      // Insertar franjas horarias predeterminadas
      await connection.query(`
        INSERT INTO FranjaHoraria (nombre, descripcion, hora_inicio, hora_fin, duracion_minutos, estado) VALUES
        ('Mañana 1', 'Primera franja de la mañana', '06:00:00', '08:00:00', 120, 'activo'),
        ('Mañana 2', 'Segunda franja de la mañana', '08:00:00', '10:00:00', 120, 'activo'),
        ('Break AM', 'Descanso de la mañana', '10:00:00', '10:30:00', 30, 'activo'),
        ('Mañana 3', 'Tercera franja de la mañana', '10:30:00', '12:30:00', 120, 'activo'),
        ('Almuerzo', 'Pausa para almuerzo', '12:30:00', '13:30:00', 60, 'activo'),
        ('Tarde 1', 'Primera franja de la tarde', '13:30:00', '15:30:00', 120, 'activo'),
        ('Tarde 2', 'Segunda franja de la tarde', '15:30:00', '17:30:00', 120, 'activo'),
        ('Extra 1', 'Primera hora extra', '17:30:00', '18:30:00', 60, 'activo'),
        ('Extra 2', 'Segunda hora extra', '18:30:00', '19:30:00', 60, 'activo')
      `);
      console.log("Datos iniciales de FranjaHoraria insertados");
    } else {
      console.log("La tabla FranjaHoraria ya contiene", franjas[0].count, "registros");
    }
    
    console.log("Base de datos inicializada correctamente");
  } catch (err) {
    console.error("Error al inicializar datos básicos:", err);
    throw err;
  }
}

module.exports = {
  setupDatabase
}; 