class Referencia {
    constructor(referencia) {
        this.id_referencia = referencia.id_referencia;
        this.codigo = referencia.codigo;
        this.descripcion = referencia.descripcion;
        this.tiempo_estimado_unidad = referencia.tiempo_estimado_unidad;
        this.tiempo_total_estimado = referencia.tiempo_total_estimado;
        this.serial = referencia.serial;
        this.lote = referencia.lote;
        this.estado = referencia.estado;
    }

    static async getAll(connection) {
        try {
            const [rows] = await connection.execute('SELECT * FROM referencia');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const [rows] = await connection.execute('SELECT * FROM referencia WHERE id_referencia = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(connection, referencia) {
        try {
            const query = 'INSERT INTO referencia (codigo, descripcion, tiempo_estimado_unidad, tiempo_total_estimado, serial, lote, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await connection.execute(query, [
                referencia.codigo,
                referencia.descripcion,
                referencia.tiempo_estimado_unidad,
                referencia.tiempo_total_estimado,
                referencia.serial,
                referencia.lote,
                referencia.estado || 'pendiente'
            ]);
            return { id_referencia: result.insertId, ...referencia };
        } catch (error) {
            throw error;
        }
    }

    static async update(connection, id, referencia) {
        try {
            const query = 'UPDATE referencia SET codigo = ?, descripcion = ?, tiempo_estimado_unidad = ?, tiempo_total_estimado = ?, serial = ?, lote = ?, estado = ? WHERE id_referencia = ?';
            await connection.execute(query, [
                referencia.codigo,
                referencia.descripcion,
                referencia.tiempo_estimado_unidad,
                referencia.tiempo_total_estimado,
                referencia.serial,
                referencia.lote,
                referencia.estado,
                id
            ]);
            return { id_referencia: id, ...referencia };
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            // Primero verificar y eliminar registros relacionados en TallaReferencia
            await connection.execute('DELETE FROM tallareferencia WHERE id_referencia = ?', [id]);
            
            // Luego eliminar la referencia
            const query = 'DELETE FROM referencia WHERE id_referencia = ?';
            await connection.execute(query, [id]);
            return { message: 'Referencia eliminada exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Referencia; 