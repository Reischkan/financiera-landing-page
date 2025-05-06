const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Crear una pool de conexiones a la base de datos con configuración mejorada
const pool = mysql.createPool({
  host: dbConfig.HOST || dbConfig.host,
  user: dbConfig.USER || dbConfig.user,
  password: dbConfig.PASSWORD || dbConfig.password,
  database: dbConfig.DB || dbConfig.database,
  waitForConnections: true,
  connectionLimit: 20,  // Aumentado para manejar más conexiones concurrentes
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 segundos
  namedPlaceholders: true, // Usar placeholders con nombre para consultas complejas
  connectTimeout: 10000, // 10 segundos
  maxIdle: 10, // Máximo de conexiones inactivas
  idleTimeout: 30000 // 30 segundos antes de cerrar conexiones inactivas
});

// Log para monitorear la creación y liberación de conexiones
pool.on('connection', () => {
  console.log('Nueva conexión creada en el pool');
});

pool.on('release', () => {
  console.log('Conexión liberada al pool');
});

// Constructor del modelo
const RegistroProduccion = function(registro) {
  this.id_asignacion_modulo = registro.id_asignacion_modulo;
  this.id_asignacion_referencia = registro.id_asignacion_referencia;
  this.id_franja = registro.id_franja;
  this.fecha = registro.fecha;
  this.minutos_producidos = registro.minutos_producidos;
  this.observaciones = registro.observaciones;
};

// Crear un nuevo registro de producción
RegistroProduccion.create = async (nuevoRegistro) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Verificar que existe la asignación de módulo
    const [asignacionModuloRows] = await connection.query(
      'SELECT * FROM AsignacionModulo WHERE id_asignacion = ?',
      [nuevoRegistro.id_asignacion_modulo]
    );
    
    if (asignacionModuloRows.length === 0) {
      throw new Error('La asignación de módulo especificada no existe');
    }
    
    // Verificar que existe la asignación de referencia
    const [asignacionReferenciaRows] = await connection.query(
      'SELECT * FROM AsignacionReferencia WHERE id_asignacion_referencia = ?',
      [nuevoRegistro.id_asignacion_referencia]
    );
    
    if (asignacionReferenciaRows.length === 0) {
      throw new Error('La asignación de referencia especificada no existe');
    }
    
    // Verificar que existe la franja horaria
    const [franjaRows] = await connection.query(
      'SELECT * FROM FranjaHoraria WHERE id_franja = ?',
      [nuevoRegistro.id_franja]
    );
    
    if (franjaRows.length === 0) {
      throw new Error('La franja horaria especificada no existe');
    }
    
    // Insertar registro
    const [result] = await connection.query(
      'INSERT INTO RegistroProduccion (id_asignacion_modulo, id_asignacion_referencia, id_franja, fecha, minutos_producidos, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
      [
        nuevoRegistro.id_asignacion_modulo,
        nuevoRegistro.id_asignacion_referencia,
        nuevoRegistro.id_franja,
        nuevoRegistro.fecha,
        nuevoRegistro.minutos_producidos,
        nuevoRegistro.observaciones
      ]
    );
    
    // Actualizar los minutos producidos en la asignación de referencia
    if (result.affectedRows > 0 && nuevoRegistro.minutos_producidos > 0) {
      await connection.query(
        'UPDATE AsignacionReferencia SET minutos_producidos = minutos_producidos + ? WHERE id_asignacion_referencia = ?',
        [nuevoRegistro.minutos_producidos, nuevoRegistro.id_asignacion_referencia]
      );
    }
    
    await connection.commit();
    
    return { id_registro: result.insertId, ...nuevoRegistro };
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear registro de producción:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Obtener todos los registros de producción con información relacionada
RegistroProduccion.getAll = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('Ejecutando consulta para obtener todos los registros de producción');
    
    const [rows] = await connection.query(`
      SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      ORDER BY rp.fecha DESC, f.hora_inicio ASC
    `);
    
    console.log(`Consulta exitosa, se encontraron ${rows.length} registros`);
    return rows;
  } catch (error) {
    console.error('Error al obtener registros de producción:', error);
    throw error;
  } finally {
    connection.release();
    console.log('Conexión liberada en getAll');
  }
};

// Obtener un registro de producción por ID
RegistroProduccion.findById = async (id) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Buscando registro de producción con ID ${id}`);
    
    const [rows] = await connection.query(`
      SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      WHERE rp.id_registro = ?
    `, [id]);
    
    if (rows.length === 0) {
      console.log(`No se encontró registro con ID ${id}`);
      return null;
    }
    
    console.log(`Registro encontrado: ${JSON.stringify(rows[0].id_registro)}`);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener registro de producción con ID ${id}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en findById(${id})`);
  }
};

// Obtener registros por fecha
RegistroProduccion.findByDate = async (fecha) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Buscando registros de producción para la fecha ${fecha}`);
    
    const [rows] = await connection.query(`
      SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      WHERE rp.fecha = ?
      ORDER BY f.hora_inicio ASC
    `, [fecha]);
    
    console.log(`Se encontraron ${rows.length} registros para la fecha ${fecha}`);
    return rows;
  } catch (error) {
    console.error(`Error al obtener registros de producción por fecha ${fecha}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en findByDate(${fecha})`);
  }
};

// Obtener registros por módulo
RegistroProduccion.findByModulo = async (idModulo) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Buscando registros de producción para el módulo ${idModulo}`);
    
    const [rows] = await connection.query(`
      SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      WHERE m.id_modulo = ?
      ORDER BY rp.fecha DESC, f.hora_inicio ASC
    `, [idModulo]);
    
    console.log(`Se encontraron ${rows.length} registros para el módulo ${idModulo}`);
    return rows;
  } catch (error) {
    console.error(`Error al obtener registros de producción por módulo ${idModulo}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en findByModulo(${idModulo})`);
  }
};

// Obtener registros por referencia
RegistroProduccion.findByReferencia = async (idReferencia) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Buscando registros de producción para la referencia ${idReferencia}`);
    
    const [rows] = await connection.query(`
      SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      WHERE r.id_referencia = ?
      ORDER BY rp.fecha DESC, f.hora_inicio ASC
    `, [idReferencia]);
    
    console.log(`Se encontraron ${rows.length} registros para la referencia ${idReferencia}`);
    return rows;
  } catch (error) {
    console.error(`Error al obtener registros de producción por referencia ${idReferencia}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en findByReferencia(${idReferencia})`);
  }
};

// Actualizar un registro de producción
RegistroProduccion.update = async (id, registroProduccion) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Actualizando registro de producción ID ${id}:`, registroProduccion);
    await connection.beginTransaction();
    
    // Verificar que el registro existe
    const [existingRows] = await connection.query(
      'SELECT * FROM RegistroProduccion WHERE id_registro = ?',
      [id]
    );
    
    if (existingRows.length === 0) {
      throw new Error(`No se encontró el registro de producción con ID ${id}`);
    }
    
    const existingRegistro = existingRows[0];
    const minutosAnteriores = existingRegistro.minutos_producidos;
    
    // Validar y actualizar campos solo si están presentes
    const updatedFields = {};
    const params = [];
    const fieldsToUpdate = [];
    
    if (registroProduccion.id_asignacion_modulo !== undefined) {
      const [modRows] = await connection.query(
        'SELECT * FROM AsignacionModulo WHERE id_asignacion = ?',
        [registroProduccion.id_asignacion_modulo]
      );
      
      if (modRows.length === 0) {
        throw new Error('La asignación de módulo especificada no existe');
      }
      
      fieldsToUpdate.push('id_asignacion_modulo = ?');
      params.push(registroProduccion.id_asignacion_modulo);
      updatedFields.id_asignacion_modulo = registroProduccion.id_asignacion_modulo;
    }
    
    if (registroProduccion.id_asignacion_referencia !== undefined) {
      const [refRows] = await connection.query(
        'SELECT * FROM AsignacionReferencia WHERE id_asignacion_referencia = ?',
        [registroProduccion.id_asignacion_referencia]
      );
      
      if (refRows.length === 0) {
        throw new Error('La asignación de referencia especificada no existe');
      }
      
      fieldsToUpdate.push('id_asignacion_referencia = ?');
      params.push(registroProduccion.id_asignacion_referencia);
      updatedFields.id_asignacion_referencia = registroProduccion.id_asignacion_referencia;
    }
    
    if (registroProduccion.id_franja !== undefined) {
      const [franjaRows] = await connection.query(
        'SELECT * FROM FranjaHoraria WHERE id_franja = ?',
        [registroProduccion.id_franja]
      );
      
      if (franjaRows.length === 0) {
        throw new Error('La franja horaria especificada no existe');
      }
      
      fieldsToUpdate.push('id_franja = ?');
      params.push(registroProduccion.id_franja);
      updatedFields.id_franja = registroProduccion.id_franja;
    }
    
    if (registroProduccion.fecha !== undefined) {
      fieldsToUpdate.push('fecha = ?');
      params.push(registroProduccion.fecha);
      updatedFields.fecha = registroProduccion.fecha;
    }
    
    let newMinutos = null;
    if (registroProduccion.minutos_producidos !== undefined) {
      fieldsToUpdate.push('minutos_producidos = ?');
      params.push(registroProduccion.minutos_producidos);
      updatedFields.minutos_producidos = registroProduccion.minutos_producidos;
      newMinutos = registroProduccion.minutos_producidos;
    }
    
    if (registroProduccion.observaciones !== undefined) {
      fieldsToUpdate.push('observaciones = ?');
      params.push(registroProduccion.observaciones);
      updatedFields.observaciones = registroProduccion.observaciones;
    }
    
    // Si no hay campos que actualizar, retornar el registro existente
    if (fieldsToUpdate.length === 0) {
      console.log('No hay campos para actualizar');
      return existingRegistro;
    }
    
    // Actualizar el registro
    params.push(id); // Añadir el ID al final
    const query = `UPDATE RegistroProduccion SET ${fieldsToUpdate.join(', ')} WHERE id_registro = ?`;
    console.log('Query SQL:', query);
    console.log('Parámetros:', params);
    
    const [updateResult] = await connection.query(query, params);
    
    // Si cambiaron los minutos, actualizar la asignación de referencia
    if (newMinutos !== null && 
        existingRegistro.id_asignacion_referencia === (registroProduccion.id_asignacion_referencia || existingRegistro.id_asignacion_referencia)) {
      
      const diferencia = newMinutos - minutosAnteriores;
      if (diferencia !== 0) {
        console.log(`Actualizando minutos en asignación de referencia. Diferencia: ${diferencia}`);
        await connection.query(
          'UPDATE AsignacionReferencia SET minutos_producidos = minutos_producidos + ? WHERE id_asignacion_referencia = ?',
          [diferencia, existingRegistro.id_asignacion_referencia]
        );
      }
    }
    
    await connection.commit();
    
    // Obtener el registro actualizado
    const [updatedRows] = await connection.query(
      `SELECT 
        rp.*,
        m.nombre AS nombre_modulo,
        p.nombre AS nombre_persona,
        r.codigo AS codigo_referencia, 
        r.descripcion AS descripcion_referencia,
        f.descripcion AS nombre_franja,
        f.hora_inicio,
        f.hora_fin
      FROM RegistroProduccion rp
      LEFT JOIN AsignacionModulo am ON rp.id_asignacion_modulo = am.id_asignacion
      LEFT JOIN Modulo m ON am.id_modulo = m.id_modulo
      LEFT JOIN Persona p ON am.id_persona = p.id_persona
      LEFT JOIN AsignacionReferencia ar ON rp.id_asignacion_referencia = ar.id_asignacion_referencia
      LEFT JOIN Referencia r ON ar.id_referencia = r.id_referencia
      LEFT JOIN FranjaHoraria f ON rp.id_franja = f.id_franja
      WHERE rp.id_registro = ?`,
      [id]
    );
    
    console.log('Registro actualizado correctamente');
    return updatedRows[0];
  } catch (error) {
    await connection.rollback();
    console.error(`Error al actualizar registro de producción con ID ${id}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en update(${id})`);
  }
};

// Eliminar un registro de producción
RegistroProduccion.delete = async (id) => {
  const connection = await pool.getConnection();
  
  try {
    console.log(`Eliminando registro de producción ID ${id}`);
    await connection.beginTransaction();
    
    // Obtener el registro antes de eliminarlo para ajustar los minutos producidos
    const [rows] = await connection.query(
      'SELECT * FROM RegistroProduccion WHERE id_registro = ?',
      [id]
    );
    
    if (rows.length === 0) {
      throw new Error(`No se encontró el registro de producción con ID ${id}`);
    }
    
    const registro = rows[0];
    
    // Eliminar el registro
    const [result] = await connection.query(
      'DELETE FROM RegistroProduccion WHERE id_registro = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error(`No se pudo eliminar el registro de producción con ID ${id}`);
    }
    
    // Actualizar los minutos producidos en la asignación de referencia
    if (registro.minutos_producidos > 0) {
      await connection.query(
        'UPDATE AsignacionReferencia SET minutos_producidos = minutos_producidos - ? WHERE id_asignacion_referencia = ?',
        [registro.minutos_producidos, registro.id_asignacion_referencia]
      );
    }
    
    await connection.commit();
    
    console.log(`Registro ID ${id} eliminado correctamente`);
    return true;
  } catch (error) {
    await connection.rollback();
    console.error(`Error al eliminar registro de producción con ID ${id}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log(`Conexión liberada en delete(${id})`);
  }
};

module.exports = RegistroProduccion; 