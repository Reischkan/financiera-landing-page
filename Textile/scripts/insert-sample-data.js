const mysql = require('mysql2/promise');
const dbConfig = require('../backend/config/db.config');

/**
 * Script para insertar datos de ejemplo en la tabla RegistroProduccion
 * Ejecutar con: node scripts/insert-sample-data.js
 */

async function insertSampleData() {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('Conectado a la base de datos exitosamente');
    
    // 1. Asegurarse de que existan las tablas necesarias
    await checkAndCreateTables(connection);
    
    // 2. Verificar datos de referencia (módulos, referencias, franjas horarias)
    const modulosCreados = await checkAndCreateModulos(connection);
    const referenciasCreadas = await checkAndCreateReferencias(connection);
    const franjasCreadas = await checkAndCreateFranjas(connection);
    
    // 3. Verificar asignaciones
    const asignacionesModulo = await checkAndCreateAsignacionesModulo(connection);
    const asignacionesReferencias = await checkAndCreateAsignacionesReferencia(connection);
    
    // 4. Crear registros de producción
    await createRegistrosProduccion(connection, asignacionesModulo, asignacionesReferencias, franjasCreadas);
    
    console.log('Proceso completado con éxito');
  } catch (error) {
    console.error('Error durante la inserción de datos:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

async function checkAndCreateTables(connection) {
  try {
    // Verificar/crear tabla Modulo
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Modulo (
        id_modulo INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        estado ENUM('activo', 'inactivo') DEFAULT 'activo'
      )
    `);
    
    // Verificar/crear tabla Persona
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Persona (
        id_persona INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(15),
        correo VARCHAR(100),
        estado ENUM('activo', 'inactivo') DEFAULT 'activo'
      )
    `);
    
    // Verificar/crear tabla Referencia
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Referencia (
        id_referencia INT PRIMARY KEY AUTO_INCREMENT,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        descripcion TEXT,
        minutos_estimados DECIMAL(10,2) DEFAULT 0,
        estado ENUM('activo', 'inactivo') DEFAULT 'activo'
      )
    `);
    
    // Verificar/crear tabla FranjaHoraria
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS FranjaHoraria (
        id_franja INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) DEFAULT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        estado ENUM('activa', 'inactiva') DEFAULT 'activa'
      )
    `);
    
    // Verificar/crear tabla AsignacionModulo
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS AsignacionModulo (
        id_asignacion INT PRIMARY KEY AUTO_INCREMENT,
        id_modulo INT NOT NULL,
        id_persona INT,
        fecha_asignacion DATE NOT NULL,
        fecha_desasignacion DATE DEFAULT NULL,
        FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo),
        FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
      )
    `);
    
    // Verificar/crear tabla AsignacionReferencia
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS AsignacionReferencia (
        id_asignacion_referencia INT PRIMARY KEY AUTO_INCREMENT,
        id_modulo INT NOT NULL,
        id_referencia INT NOT NULL,
        fecha_asignacion DATE NOT NULL,
        fecha_fin DATE DEFAULT NULL,
        minutos_estimados DECIMAL(10,2) DEFAULT 0,
        minutos_producidos DECIMAL(10,2) DEFAULT 0,
        estado ENUM('en_proceso', 'completada', 'cancelada') DEFAULT 'en_proceso',
        FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo),
        FOREIGN KEY (id_referencia) REFERENCES Referencia(id_referencia)
      )
    `);
    
    // Verificar/crear tabla RegistroProduccion
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS RegistroProduccion (
        id_registro INT PRIMARY KEY AUTO_INCREMENT,
        id_asignacion_modulo INT NOT NULL,
        id_asignacion_referencia INT NOT NULL,
        id_franja INT NOT NULL,
        fecha DATE NOT NULL,
        minutos_producidos DECIMAL(10,2) NOT NULL DEFAULT 0,
        observaciones TEXT,
        FOREIGN KEY (id_franja) REFERENCES FranjaHoraria(id_franja),
        FOREIGN KEY (id_asignacion_modulo) REFERENCES AsignacionModulo(id_asignacion),
        FOREIGN KEY (id_asignacion_referencia) REFERENCES AsignacionReferencia(id_asignacion_referencia),
        CONSTRAINT UC_registro_produccion UNIQUE (id_asignacion_modulo, id_asignacion_referencia, id_franja, fecha)
      )
    `);
    
    console.log('Tablas verificadas/creadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al verificar/crear tablas:', error);
    throw error;
  }
}

async function checkAndCreateModulos(connection) {
  try {
    // Verificar si ya existen módulos
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Modulo');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} módulos en la base de datos`);
      const [modulos] = await connection.execute('SELECT id_modulo FROM Modulo LIMIT 5');
      return modulos;
    }
    
    // Crear módulos de ejemplo
    console.log('Creando módulos de ejemplo...');
    await connection.execute(`
      INSERT INTO Modulo (nombre, descripcion, estado) VALUES
      ('Módulo 1', 'Descripción del módulo 1', 'activo'),
      ('Módulo 2', 'Descripción del módulo 2', 'activo'),
      ('Módulo 3', 'Descripción del módulo 3', 'activo'),
      ('Módulo 4', 'Descripción del módulo 4', 'activo'),
      ('Módulo 5', 'Descripción del módulo 5', 'activo')
    `);
    
    const [modulos] = await connection.execute('SELECT id_modulo FROM Modulo');
    console.log(`Se crearon ${modulos.length} módulos de ejemplo`);
    return modulos;
  } catch (error) {
    console.error('Error al verificar/crear módulos:', error);
    throw error;
  }
}

async function checkAndCreateReferencias(connection) {
  try {
    // Verificar si ya existen referencias
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Referencia');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} referencias en la base de datos`);
      const [referencias] = await connection.execute('SELECT id_referencia FROM Referencia LIMIT 5');
      return referencias;
    }
    
    // Crear referencias de ejemplo
    console.log('Creando referencias de ejemplo...');
    await connection.execute(`
      INSERT INTO Referencia (codigo, descripcion, minutos_estimados, estado) VALUES
      ('REF001', 'Camisa manga corta', 120, 'activo'),
      ('REF002', 'Camisa manga larga', 150, 'activo'),
      ('REF003', 'Pantalón casual', 180, 'activo'),
      ('REF004', 'Falda corta', 100, 'activo'),
      ('REF005', 'Vestido formal', 200, 'activo')
    `);
    
    const [referencias] = await connection.execute('SELECT id_referencia FROM Referencia');
    console.log(`Se crearon ${referencias.length} referencias de ejemplo`);
    return referencias;
  } catch (error) {
    console.error('Error al verificar/crear referencias:', error);
    throw error;
  }
}

async function checkAndCreatePersonas(connection) {
  try {
    // Verificar si ya existen personas
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Persona');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} personas en la base de datos`);
      const [personas] = await connection.execute('SELECT id_persona FROM Persona LIMIT 5');
      return personas;
    }
    
    // Crear personas de ejemplo
    console.log('Creando personas de ejemplo...');
    await connection.execute(`
      INSERT INTO Persona (nombre, telefono, correo, estado) VALUES
      ('Juan Pérez', '123456789', 'juan@ejemplo.com', 'activo'),
      ('María López', '987654321', 'maria@ejemplo.com', 'activo'),
      ('Carlos Rodríguez', '555555555', 'carlos@ejemplo.com', 'activo'),
      ('Ana Martínez', '333333333', 'ana@ejemplo.com', 'activo'),
      ('Pedro Sánchez', '111111111', 'pedro@ejemplo.com', 'activo')
    `);
    
    const [personas] = await connection.execute('SELECT id_persona FROM Persona');
    console.log(`Se crearon ${personas.length} personas de ejemplo`);
    return personas;
  } catch (error) {
    console.error('Error al verificar/crear personas:', error);
    throw error;
  }
}

async function checkAndCreateFranjas(connection) {
  try {
    // Verificar si ya existen franjas horarias
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM FranjaHoraria');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} franjas horarias en la base de datos`);
      const [franjas] = await connection.execute('SELECT id_franja FROM FranjaHoraria LIMIT 5');
      return franjas;
    }
    
    // Crear franjas horarias de ejemplo
    console.log('Creando franjas horarias de ejemplo...');
    await connection.execute(`
      INSERT INTO FranjaHoraria (nombre, hora_inicio, hora_fin, estado) VALUES
      ('Mañana 1', '07:00', '08:00', 'activa'),
      ('Mañana 2', '08:00', '09:00', 'activa'),
      ('Mañana 3', '09:00', '10:00', 'activa'),
      ('Mañana 4', '10:00', '11:00', 'activa'),
      ('Mañana 5', '11:00', '12:00', 'activa')
    `);
    
    const [franjas] = await connection.execute('SELECT id_franja FROM FranjaHoraria');
    console.log(`Se crearon ${franjas.length} franjas horarias de ejemplo`);
    return franjas;
  } catch (error) {
    console.error('Error al verificar/crear franjas horarias:', error);
    throw error;
  }
}

async function checkAndCreateAsignacionesModulo(connection) {
  try {
    // Verificar si ya existen asignaciones de módulo
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM AsignacionModulo');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} asignaciones de módulo en la base de datos`);
      const [asignaciones] = await connection.execute('SELECT id_asignacion FROM AsignacionModulo LIMIT 5');
      return asignaciones;
    }
    
    // Obtener módulos y personas
    const [modulos] = await connection.execute('SELECT id_modulo FROM Modulo LIMIT 5');
    const personas = await checkAndCreatePersonas(connection);
    
    if (modulos.length === 0 || personas.length === 0) {
      throw new Error('No hay módulos o personas disponibles para crear asignaciones');
    }
    
    // Crear asignaciones de módulo de ejemplo
    console.log('Creando asignaciones de módulo de ejemplo...');
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    for (let i = 0; i < Math.min(modulos.length, personas.length); i++) {
      await connection.execute(`
        INSERT INTO AsignacionModulo (id_modulo, id_persona, fecha_asignacion) 
        VALUES (?, ?, ?)
      `, [modulos[i].id_modulo, personas[i].id_persona, fechaActual]);
    }
    
    const [asignaciones] = await connection.execute('SELECT id_asignacion FROM AsignacionModulo');
    console.log(`Se crearon ${asignaciones.length} asignaciones de módulo de ejemplo`);
    return asignaciones;
  } catch (error) {
    console.error('Error al verificar/crear asignaciones de módulo:', error);
    throw error;
  }
}

async function checkAndCreateAsignacionesReferencia(connection) {
  try {
    // Verificar si ya existen asignaciones de referencia
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM AsignacionReferencia');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} asignaciones de referencia en la base de datos`);
      const [asignaciones] = await connection.execute('SELECT id_asignacion_referencia FROM AsignacionReferencia LIMIT 5');
      return asignaciones;
    }
    
    // Obtener módulos y referencias
    const [modulos] = await connection.execute('SELECT id_modulo FROM Modulo LIMIT 5');
    const [referencias] = await connection.execute('SELECT id_referencia, minutos_estimados FROM Referencia LIMIT 5');
    
    if (modulos.length === 0 || referencias.length === 0) {
      throw new Error('No hay módulos o referencias disponibles para crear asignaciones');
    }
    
    // Crear asignaciones de referencia de ejemplo
    console.log('Creando asignaciones de referencia de ejemplo...');
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    for (let i = 0; i < Math.min(modulos.length, referencias.length); i++) {
      await connection.execute(`
        INSERT INTO AsignacionReferencia (id_modulo, id_referencia, fecha_asignacion, minutos_estimados, estado) 
        VALUES (?, ?, ?, ?, 'en_proceso')
      `, [modulos[i].id_modulo, referencias[i].id_referencia, fechaActual, referencias[i].minutos_estimados]);
    }
    
    const [asignaciones] = await connection.execute('SELECT id_asignacion_referencia FROM AsignacionReferencia');
    console.log(`Se crearon ${asignaciones.length} asignaciones de referencia de ejemplo`);
    return asignaciones;
  } catch (error) {
    console.error('Error al verificar/crear asignaciones de referencia:', error);
    throw error;
  }
}

async function createRegistrosProduccion(connection, asignacionesModulo, asignacionesReferencia, franjasHorarias) {
  try {
    // Verificar si ya existen registros de producción
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM RegistroProduccion');
    if (rows[0].count > 0) {
      console.log(`Ya existen ${rows[0].count} registros de producción en la base de datos`);
      return;
    }
    
    if (asignacionesModulo.length === 0 || asignacionesReferencia.length === 0 || franjasHorarias.length === 0) {
      throw new Error('No hay asignaciones o franjas horarias disponibles para crear registros de producción');
    }
    
    console.log('Creando registros de producción de ejemplo...');
    
    // Fechas de ejemplo para los últimos 5 días
    const fechaHoy = new Date();
    const fechas = [];
    for (let i = 0; i < 5; i++) {
      const fecha = new Date(fechaHoy);
      fecha.setDate(fechaHoy.getDate() - i);
      fechas.push(fecha.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }
    
    // Crear registros de ejemplo
    let creados = 0;
    let duplicados = 0;
    
    for (let i = 0; i < asignacionesModulo.length; i++) {
      for (let j = 0; j < asignacionesReferencia.length; j++) {
        for (let k = 0; k < franjasHorarias.length; k++) {
          for (let l = 0; l < 2; l++) { // 2 registros por cada combinación para tener suficientes datos
            const fecha = fechas[Math.floor(Math.random() * fechas.length)];
            const minutosProducidos = (Math.random() * 50 + 10).toFixed(2); // Entre 10 y 60 minutos
            
            try {
              await connection.execute(`
                INSERT INTO RegistroProduccion 
                (id_asignacion_modulo, id_asignacion_referencia, id_franja, fecha, minutos_producidos, observaciones) 
                VALUES (?, ?, ?, ?, ?, ?)
              `, [
                asignacionesModulo[i].id_asignacion,
                asignacionesReferencia[j].id_asignacion_referencia,
                franjasHorarias[k].id_franja,
                fecha,
                minutosProducidos,
                `Registro de ejemplo creado para pruebas - Fecha: ${fecha}`
              ]);
              creados++;
            } catch (error) {
              if (error.code === 'ER_DUP_ENTRY') {
                duplicados++;
              } else {
                console.error('Error al insertar registro de producción:', error);
              }
            }
          }
        }
      }
    }
    
    console.log(`Se crearon ${creados} registros de producción (y se detectaron ${duplicados} duplicados)`);
  } catch (error) {
    console.error('Error al crear registros de producción:', error);
    throw error;
  }
}

// Ejecutar el script
insertSampleData()
  .then(() => {
    console.log('Script finalizado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error al ejecutar el script:', error);
    process.exit(1);
  }); 