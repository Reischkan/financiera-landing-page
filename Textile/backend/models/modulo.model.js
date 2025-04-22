class Modulo {
    constructor(modulo) {
        this.id_modulo = modulo.id_modulo;
        this.nombre = modulo.nombre;
        this.estado = modulo.estado;
        this.fecha_creacion = modulo.fecha_creacion;
    }

    static async getAll(connection) {
        try {
            const [rows] = await connection.execute('SELECT * FROM modulo');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const [rows] = await connection.execute('SELECT * FROM modulo WHERE id_modulo = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(connection, modulo) {
        try {
            const query = 'INSERT INTO modulo (nombre, estado, fecha_creacion) VALUES (?, ?, ?)';
            const [result] = await connection.execute(query, [
                modulo.nombre,
                modulo.estado,
                modulo.fecha_creacion || new Date()
            ]);
            return { id_modulo: result.insertId, ...modulo };
        } catch (error) {
            throw error;
        }
    }

    static async update(connection, id, modulo) {
        try {
            const query = 'UPDATE modulo SET nombre = ?, estado = ? WHERE id_modulo = ?';
            await connection.execute(query, [modulo.nombre, modulo.estado, id]);
            return { id_modulo: id, ...modulo };
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            const query = 'DELETE FROM modulo WHERE id_modulo = ?';
            await connection.execute(query, [id]);
            return { message: 'Módulo eliminado exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Modulo; 