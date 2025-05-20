class Ausencia {
    constructor(ausencia) {
        this.id_ausencia = ausencia.id_ausencia;
        this.id_persona = ausencia.id_persona;
        this.fecha_inicio = ausencia.fecha_inicio;
        this.fecha_fin = ausencia.fecha_fin;
        this.motivo = ausencia.motivo;
        this.justificada = ausencia.justificada;
    }

    static async getAll(connection) {
        try {
            const query = `
            SELECT a.*, p.nombre as nombre_persona 
            FROM ausencia a
            JOIN persona p ON a.id_persona = p.id_persona
            ORDER BY a.fecha_inicio DESC`;
            
            const [rows] = await connection.execute(query);
            return rows;
        } catch (error) {
            console.error('Error en getAll de Ausencia:', error);
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const query = `
            SELECT a.*, p.nombre as nombre_persona 
            FROM ausencia a
            JOIN persona p ON a.id_persona = p.id_persona 
            WHERE a.id_ausencia = ?`;
            
            const [rows] = await connection.execute(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error en getById de Ausencia:', error);
            throw error;
        }
    }

    static async getByPersona(connection, idPersona) {
        try {
            const query = `
            SELECT a.*, p.nombre as nombre_persona 
            FROM ausencia a
            JOIN persona p ON a.id_persona = p.id_persona 
            WHERE a.id_persona = ?
            ORDER BY a.fecha_inicio DESC`;
            
            const [rows] = await connection.execute(query, [idPersona]);
            return rows;
        } catch (error) {
            console.error('Error en getByPersona de Ausencia:', error);
            throw error;
        }
    }

    static async create(connection, ausencia) {
        try {
            const query = 'INSERT INTO ausencia (id_persona, fecha_inicio, fecha_fin, motivo, justificada) VALUES (?, ?, ?, ?, ?)';
            const [result] = await connection.execute(query, [
                ausencia.id_persona,
                ausencia.fecha_inicio,
                ausencia.fecha_fin,
                ausencia.motivo,
                ausencia.justificada ? 1 : 0
            ]);
            return { id_ausencia: result.insertId, ...ausencia };
        } catch (error) {
            console.error('Error en create de Ausencia:', error);
            throw error;
        }
    }

    static async update(connection, id, ausencia) {
        try {
            const query = 'UPDATE ausencia SET id_persona = ?, fecha_inicio = ?, fecha_fin = ?, motivo = ?, justificada = ? WHERE id_ausencia = ?';
            await connection.execute(query, [
                ausencia.id_persona,
                ausencia.fecha_inicio,
                ausencia.fecha_fin,
                ausencia.motivo,
                ausencia.justificada ? 1 : 0,
                id
            ]);
            return { id_ausencia: id, ...ausencia };
        } catch (error) {
            console.error('Error en update de Ausencia:', error);
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            const query = 'DELETE FROM ausencia WHERE id_ausencia = ?';
            await connection.execute(query, [id]);
            return { message: 'Ausencia eliminada exitosamente' };
        } catch (error) {
            console.error('Error en delete de Ausencia:', error);
            throw error;
        }
    }

    static async getByFechas(connection, fechaInicio, fechaFin) {
        try {
            const query = `
            SELECT a.*, p.nombre as nombre_persona 
            FROM ausencia a
            JOIN persona p ON a.id_persona = p.id_persona 
            WHERE 
                (a.fecha_inicio BETWEEN ? AND ?) OR
                (a.fecha_fin BETWEEN ? AND ?) OR
                (a.fecha_inicio <= ? AND a.fecha_fin >= ?)
            ORDER BY a.fecha_inicio ASC`;
            
            const [rows] = await connection.execute(query, [
                fechaInicio, fechaFin,
                fechaInicio, fechaFin,
                fechaInicio, fechaFin
            ]);
            return rows;
        } catch (error) {
            console.error('Error en getByFechas de Ausencia:', error);
            throw error;
        }
    }
}

module.exports = Ausencia; 