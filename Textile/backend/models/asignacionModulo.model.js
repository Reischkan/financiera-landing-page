class AsignacionModulo {
    constructor(asignacion) {
        this.id_asignacion = asignacion.id_asignacion;
        this.id_modulo = asignacion.id_modulo;
        this.id_persona = asignacion.id_persona;
        this.fecha_asignacion = asignacion.fecha_asignacion;
        this.fecha_desasignacion = asignacion.fecha_desasignacion;
        this.estado = asignacion.estado;
    }

    static async getAll(connection) {
        try {
            const query = `
                SELECT 
                    a.*, 
                    m.nombre AS nombre_modulo, 
                    p.nombre AS nombre_persona 
                FROM asignacionmodulo a
                JOIN modulo m ON a.id_modulo = m.id_modulo
                JOIN persona p ON a.id_persona = p.id_persona
            `;
            const [rows] = await connection.execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const query = `
                SELECT 
                    a.*, 
                    m.nombre AS nombre_modulo, 
                    p.nombre AS nombre_persona 
                FROM asignacionmodulo a
                JOIN modulo m ON a.id_modulo = m.id_modulo
                JOIN persona p ON a.id_persona = p.id_persona
                WHERE a.id_asignacion = ?
            `;
            const [rows] = await connection.execute(query, [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByModulo(connection, idModulo) {
        try {
            const query = `
                SELECT 
                    a.*, 
                    m.nombre AS nombre_modulo, 
                    p.nombre AS nombre_persona,
                    p.documento
                FROM asignacionmodulo a
                JOIN modulo m ON a.id_modulo = m.id_modulo
                JOIN persona p ON a.id_persona = p.id_persona
                WHERE a.id_modulo = ?
            `;
            const [rows] = await connection.execute(query, [idModulo]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByPersona(connection, idPersona) {
        try {
            const query = `
                SELECT 
                    a.*, 
                    m.nombre AS nombre_modulo, 
                    p.nombre AS nombre_persona
                FROM asignacionmodulo a
                JOIN modulo m ON a.id_modulo = m.id_modulo
                JOIN persona p ON a.id_persona = p.id_persona
                WHERE a.id_persona = ?
            `;
            const [rows] = await connection.execute(query, [idPersona]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(connection, asignacion) {
        try {
            // Verificar si ya existe una asignación activa para esta persona
            const [existingAsignaciones] = await connection.execute(
                'SELECT * FROM asignacionmodulo WHERE id_persona = ? AND estado = "activo"',
                [asignacion.id_persona]
            );

            if (existingAsignaciones.length > 0) {
                throw new Error('La persona ya tiene una asignación activa a otro módulo');
            }

            const query = 'INSERT INTO asignacionmodulo (id_modulo, id_persona, fecha_asignacion, estado) VALUES (?, ?, ?, ?)';
            const [result] = await connection.execute(query, [
                asignacion.id_modulo,
                asignacion.id_persona,
                asignacion.fecha_asignacion || new Date(),
                asignacion.estado || 'activo'
            ]);
            return { id_asignacion: result.insertId, ...asignacion };
        } catch (error) {
            throw error;
        }
    }

    static async update(connection, id, asignacion) {
        try {
            // Verificar que la asignación existe
            const [existingAsignacion] = await connection.execute(
                'SELECT * FROM asignacionmodulo WHERE id_asignacion = ?',
                [id]
            );
            
            if (existingAsignacion.length === 0) {
                throw new Error('Asignación no encontrada');
            }
            
            // Si el estado es "activo", verificar que la persona no tenga otra asignación activa diferente a esta
            if (asignacion.estado === 'activo') {
                const [existingAsignaciones] = await connection.execute(
                    'SELECT * FROM asignacionmodulo WHERE id_persona = ? AND estado = "activo" AND id_asignacion != ?',
                    [asignacion.id_persona, id]
                );
                
                if (existingAsignaciones.length > 0) {
                    throw new Error('La persona ya tiene una asignación activa a otro módulo');
                }
            }
            
            // Verificar que si hay fecha_desasignacion, el estado sea "inactivo"
            if (asignacion.fecha_desasignacion && asignacion.estado === 'activo') {
                throw new Error('Una asignación con fecha de desasignación debe tener estado inactivo');
            }
            
            // Validar que fecha_asignacion sea anterior a fecha_desasignacion si ambas existen
            if (asignacion.fecha_asignacion && asignacion.fecha_desasignacion) {
                const asignacionDate = new Date(asignacion.fecha_asignacion);
                const desasignacionDate = new Date(asignacion.fecha_desasignacion);
                
                if (asignacionDate > desasignacionDate) {
                    throw new Error('La fecha de asignación debe ser anterior a la fecha de desasignación');
                }
            }
            
            // Formatear las fechas para MySQL
            const fechaAsignacion = asignacion.fecha_asignacion ? asignacion.fecha_asignacion : null;
            const fechaDesasignacion = asignacion.fecha_desasignacion ? asignacion.fecha_desasignacion : null;
            
            const query = 'UPDATE asignacionmodulo SET id_modulo = ?, id_persona = ?, fecha_asignacion = ?, fecha_desasignacion = ?, estado = ? WHERE id_asignacion = ?';
            await connection.execute(query, [
                asignacion.id_modulo,
                asignacion.id_persona,
                fechaAsignacion,
                fechaDesasignacion,
                asignacion.estado,
                id
            ]);
            return { id_asignacion: id, ...asignacion };
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            const query = 'DELETE FROM asignacionmodulo WHERE id_asignacion = ?';
            await connection.execute(query, [id]);
            return { message: 'Asignación eliminada exitosamente' };
        } catch (error) {
            throw error;
        }
    }

    static async desasignar(connection, id) {
        try {
            // Verificar que la asignación existe
            const [existingAsignacion] = await connection.execute(
                'SELECT * FROM asignacionmodulo WHERE id_asignacion = ?',
                [id]
            );
            
            if (existingAsignacion.length === 0) {
                throw new Error('Asignación no encontrada');
            }
            
            const fechaActual = new Date();
            
            const query = 'UPDATE asignacionmodulo SET fecha_desasignacion = ?, estado = ? WHERE id_asignacion = ?';
            await connection.execute(query, [
                fechaActual,
                'inactivo',
                id
            ]);
            return { 
                message: 'Persona desasignada exitosamente del módulo',
                fecha_desasignacion: fechaActual,
                estado: 'inactivo' 
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AsignacionModulo; 