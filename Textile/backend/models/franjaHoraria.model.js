const { connectToDatabase } = require('../config/db.connection');

// Constructor del modelo FranjaHoraria
const FranjaHoraria = function(franjaHoraria) {
  this.hora_inicio = franjaHoraria.hora_inicio;
  this.hora_fin = franjaHoraria.hora_fin;
  this.descripcion = franjaHoraria.descripcion;
  this.estado = franjaHoraria.estado || 'activa';
};

// Crear una nueva franja horaria
FranjaHoraria.create = async (franjaHoraria) => {
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'INSERT INTO FranjaHoraria (hora_inicio, hora_fin, descripcion, estado) VALUES (?, ?, ?, ?)',
      [franjaHoraria.hora_inicio, franjaHoraria.hora_fin, franjaHoraria.descripcion, franjaHoraria.estado || 'activa']
    );
    connection.end();
    return { id: result.insertId, ...franjaHoraria };
  } catch (error) {
    throw error;
  }
};

// Obtener todas las franjas horarias
FranjaHoraria.findAll = async () => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM FranjaHoraria');
    connection.end();
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener una franja horaria por id
FranjaHoraria.findById = async (id) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM FranjaHoraria WHERE id_franja = ?', [id]);
    connection.end();
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Actualizar una franja horaria por id
FranjaHoraria.update = async (id, franjaHoraria) => {
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE FranjaHoraria SET hora_inicio = ?, hora_fin = ?, descripcion = ?, estado = ? WHERE id_franja = ?',
      [franjaHoraria.hora_inicio, franjaHoraria.hora_fin, franjaHoraria.descripcion, franjaHoraria.estado, id]
    );
    connection.end();
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Eliminar una franja horaria por id
FranjaHoraria.delete = async (id) => {
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM FranjaHoraria WHERE id_franja = ?', [id]);
    connection.end();
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// Actualizar el estado de una franja horaria
FranjaHoraria.updateEstado = async (id, estado) => {
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE FranjaHoraria SET estado = ? WHERE id_franja = ?',
      [estado, id]
    );
    connection.end();
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = FranjaHoraria; 