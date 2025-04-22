class Persona {
    constructor(persona) {
        this.id_persona = persona.id_persona;
        this.nombre = persona.nombre;
        this.documento = persona.documento;
        this.minutos_diarios_asignados = persona.minutos_diarios_asignados;
        this.fecha_ingreso = persona.fecha_ingreso;
        this.estado = persona.estado;
    }

    static async getAll(connection) {
        try {
            const [rows] = await connection.execute('SELECT * FROM persona');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const [rows] = await connection.execute('SELECT * FROM persona WHERE id_persona = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(connection, persona) {
        try {
            const query = 'INSERT INTO persona (nombre, documento, minutos_diarios_asignados, fecha_ingreso, estado) VALUES (?, ?, ?, ?, ?)';
            const [result] = await connection.execute(query, [
                persona.nombre,
                persona.documento,
                persona.minutos_diarios_asignados,
                persona.fecha_ingreso || new Date(),
                persona.estado
            ]);
            return { id_persona: result.insertId, ...persona };
        } catch (error) {
            throw error;
        }
    }

    static async update(connection, id, persona) {
        try {
            const query = 'UPDATE persona SET nombre = ?, documento = ?, minutos_diarios_asignados = ?, estado = ? WHERE id_persona = ?';
            await connection.execute(query, [
                persona.nombre,
                persona.documento,
                persona.minutos_diarios_asignados,
                persona.estado,
                id
            ]);
            return { id_persona: id, ...persona };
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            const query = 'DELETE FROM persona WHERE id_persona = ?';
            await connection.execute(query, [id]);
            return { message: 'Persona eliminada exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Persona; 