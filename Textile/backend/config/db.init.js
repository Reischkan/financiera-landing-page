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

    // Crear tabla RegistroProduccion si no existe
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
        CONSTRAINT UC_registro_produccion UNIQUE (id_asignacion_modulo, id_asignacion_referencia, id_franja, fecha)
      )
    `);
    console.log('Tabla RegistroProduccion creada o ya existente');

    // Crear tabla Ausencia si no existe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Ausencia (
        id_ausencia INT AUTO_INCREMENT PRIMARY KEY,
        id_persona INT NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        motivo TEXT NOT NULL,
        justificada BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
      )
    `);
    console.log('Tabla Ausencia creada o ya existente');

    // Verificar si hay datos en la tabla RegistroProduccion
    const [registrosRows] = await connection.execute('SELECT COUNT(*) as count FROM RegistroProduccion');
    const registrosCount = registrosRows[0].count;

    // Verificar que tengamos asignaciones de módulo y referencia para crear registros de ejemplo
    const [asignacionesModulo] = await connection.execute('SELECT id_asignacion FROM AsignacionModulo LIMIT 5');
    const [asignacionesReferencia] = await connection.execute('SELECT id_asignacion_referencia FROM AsignacionReferencia LIMIT 5');
    const [franjasHorarias] = await connection.execute('SELECT id_franja FROM FranjaHoraria LIMIT 5');

    if (registrosCount === 0 && asignacionesModulo.length > 0 && asignacionesReferencia.length > 0 && franjasHorarias.length > 0) {
      console.log('Insertando datos de ejemplo en RegistroProduccion...');
      
      // Fechas de ejemplo para los últimos 5 días
      const fechaHoy = new Date();
      const fechas = [];
      for (let i = 0; i < 5; i++) {
        const fecha = new Date(fechaHoy);
        fecha.setDate(fechaHoy.getDate() - i);
        fechas.push(fecha.toISOString().split('T')[0]); // Formato YYYY-MM-DD
      }

      // Insertar varios registros de ejemplo
      for (let i = 0; i < Math.min(asignacionesModulo.length, asignacionesReferencia.length); i++) {
        const idAsignacionModulo = asignacionesModulo[i].id_asignacion;
        const idAsignacionReferencia = asignacionesReferencia[i].id_asignacion_referencia;
        
        for (let j = 0; j < Math.min(franjasHorarias.length, 3); j++) {
          const idFranja = franjasHorarias[j].id_franja;
          const fecha = fechas[Math.floor(Math.random() * fechas.length)];
          const minutosProducidos = (Math.random() * 50 + 10).toFixed(2); // Entre 10 y 60 minutos
          
          try {
            await connection.execute(`
              INSERT INTO RegistroProduccion 
              (id_asignacion_modulo, id_asignacion_referencia, id_franja, fecha, minutos_producidos, observaciones) 
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              idAsignacionModulo,
              idAsignacionReferencia,
              idFranja,
              fecha,
              minutosProducidos,
              `Registro de ejemplo generado automáticamente ${fecha}`
            ]);
            console.log(`Registro de producción creado para módulo ${idAsignacionModulo}, referencia ${idAsignacionReferencia}, franja ${idFranja}, fecha ${fecha}`);
          } catch (error) {
            // Si hay error de duplicados, continuamos con el siguiente
            if (error.code === 'ER_DUP_ENTRY') {
              console.log(`Registro duplicado, omitiendo: ${idAsignacionModulo}, ${idAsignacionReferencia}, ${idFranja}, ${fecha}`);
            } else {
              console.error('Error al insertar registro de producción:', error);
            }
          }
        }
      }
      
      // Verificar cuántos registros se insertaron
      const [newCount] = await connection.execute('SELECT COUNT(*) as count FROM RegistroProduccion');
      console.log(`Se insertaron ${newCount[0].count} registros de ejemplo en la tabla RegistroProduccion`);
    } else if (registrosCount > 0) {
      console.log(`La tabla RegistroProduccion ya contiene ${registrosCount} registros`);
    } else {
      console.log('No se pudieron insertar datos de ejemplo en RegistroProduccion: faltan asignaciones previas');
    }

    // Verificar si hay datos en la tabla Ausencia
    const [ausenciasRows] = await connection.execute('SELECT COUNT(*) as count FROM Ausencia');
    const ausenciasCount = ausenciasRows[0].count;

    // Verificar que tengamos personas para crear ausencias de ejemplo
    const [personas] = await connection.execute('SELECT id_persona FROM Persona LIMIT 5');

    if (ausenciasCount === 0 && personas.length > 0) {
      console.log('Insertando datos de ejemplo en Ausencia...');
      
      // Fechas de ejemplo para ausencias
      const fechaHoy = new Date();
      const ausencias = [];
      
      // Crear algunas ausencias de ejemplo
      for (let i = 0; i < personas.length; i++) {
        const idPersona = personas[i].id_persona;
        
        // Crear ausencia con fecha aleatoria en los próximos 30 días
        const fechaInicio = new Date(fechaHoy);
        fechaInicio.setDate(fechaHoy.getDate() + Math.floor(Math.random() * 30));
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaInicio.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 días de ausencia
        
        const motivos = [
          'Enfermedad', 
          'Asuntos personales', 
          'Cita médica', 
          'Licencia familiar', 
          'Capacitación'
        ];
        const motivoIndex = Math.floor(Math.random() * motivos.length);
        const justificada = Math.random() > 0.3; // 70% de probabilidad de estar justificada

        try {
          await connection.execute(`
            INSERT INTO Ausencia 
            (id_persona, fecha_inicio, fecha_fin, motivo, justificada) 
            VALUES (?, ?, ?, ?, ?)
          `, [
            idPersona,
            fechaInicio.toISOString().split('T')[0],
            fechaFin.toISOString().split('T')[0],
            motivos[motivoIndex],
            justificada
          ]);
          console.log(`Ausencia creada para persona ${idPersona}, desde ${fechaInicio.toISOString().split('T')[0]} hasta ${fechaFin.toISOString().split('T')[0]}`);
        } catch (error) {
          console.error('Error al insertar ausencia de ejemplo:', error);
        }
      }
      
      // Verificar cuántas ausencias se insertaron
      const [newAusenciasCount] = await connection.execute('SELECT COUNT(*) as count FROM Ausencia');
      console.log(`Se insertaron ${newAusenciasCount[0].count} ausencias de ejemplo en la tabla Ausencia`);
    } else if (ausenciasCount > 0) {
      console.log(`La tabla Ausencia ya contiene ${ausenciasCount} registros`);
    } else {
      console.log('No se pudieron insertar datos de ejemplo en Ausencia: faltan personas registradas');
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