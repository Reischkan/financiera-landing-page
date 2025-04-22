class TallaReferencia {
    constructor(tallaReferencia) {
        this.id_talla_referencia = tallaReferencia.id_talla_referencia;
        this.id_referencia = tallaReferencia.id_referencia;
        this.talla = tallaReferencia.talla;
        this.cantidad = tallaReferencia.cantidad;
        this.minutos_estimados = tallaReferencia.minutos_estimados;
    }

    static async getAll(connection) {
        try {
            const [rows] = await connection.execute('SELECT * FROM tallareferencia');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            const [rows] = await connection.execute('SELECT * FROM tallareferencia WHERE id_talla_referencia = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByReferenciaId(connection, idReferencia) {
        try {
            const [rows] = await connection.execute('SELECT * FROM tallareferencia WHERE id_referencia = ?', [idReferencia]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async create(connection, tallaReferencia) {
        try {
            console.log('Modelo: creando talla referencia:', tallaReferencia);
            
            // Asegurarnos de que tenemos todos los campos necesarios
            if (!tallaReferencia.id_referencia || !tallaReferencia.talla || tallaReferencia.cantidad == null) {
                throw new Error('Faltan campos requeridos: id_referencia, talla, cantidad');
            }
            
            // Verificar que los tipos de datos son correctos
            if (typeof tallaReferencia.id_referencia !== 'number' || 
                typeof tallaReferencia.cantidad !== 'number' ||
                (tallaReferencia.minutos_estimados != null && typeof tallaReferencia.minutos_estimados !== 'number')) {
                throw new Error('Tipos de datos incorrectos');
            }
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar si ya existe una talla para esta referencia
                const [existingTallas] = await connection.execute(
                    'SELECT * FROM tallareferencia WHERE id_referencia = ? AND talla = ?',
                    [tallaReferencia.id_referencia, tallaReferencia.talla]
                );

                if (existingTallas.length > 0) {
                    throw new Error('Ya existe esta talla para la referencia seleccionada');
                }

                // Verificar que la referencia existe
                const [referencias] = await connection.execute(
                    'SELECT * FROM referencia WHERE id_referencia = ?',
                    [tallaReferencia.id_referencia]
                );

                if (referencias.length === 0) {
                    throw new Error('La referencia seleccionada no existe');
                }

                const query = 'INSERT INTO tallareferencia (id_referencia, talla, cantidad, minutos_estimados) VALUES (?, ?, ?, ?)';
                console.log('Query a ejecutar:', query);
                console.log('Parámetros:', [
                    tallaReferencia.id_referencia,
                    tallaReferencia.talla,
                    tallaReferencia.cantidad,
                    tallaReferencia.minutos_estimados || 0
                ]);
                
                const [result] = await connection.execute(query, [
                    tallaReferencia.id_referencia,
                    tallaReferencia.talla,
                    tallaReferencia.cantidad,
                    tallaReferencia.minutos_estimados || 0
                ]);
                
                // Confirmar transacción
                await connection.commit();
                
                console.log('Resultado de la inserción:', result);
                return { id_talla_referencia: result.insertId, ...tallaReferencia };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al crear talla referencia:', error);
            throw error;
        }
    }

    static async update(connection, id, tallaReferencia) {
        try {
            const query = 'UPDATE tallareferencia SET talla = ?, cantidad = ?, minutos_estimados = ? WHERE id_talla_referencia = ?';
            await connection.execute(query, [
                tallaReferencia.talla,
                tallaReferencia.cantidad,
                tallaReferencia.minutos_estimados || 0,
                id
            ]);
            return { id_talla_referencia: id, ...tallaReferencia };
        } catch (error) {
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que existe la talla de referencia
                const [existingTalla] = await connection.execute(
                    'SELECT * FROM tallareferencia WHERE id_talla_referencia = ?',
                    [id]
                );
                
                if (existingTalla.length === 0) {
                    throw new Error('Talla de referencia no encontrada');
                }
                
                const query = 'DELETE FROM tallareferencia WHERE id_talla_referencia = ?';
                await connection.execute(query, [id]);
                
                // Confirmar transacción
                await connection.commit();
                
                return { message: 'Talla de referencia eliminada exitosamente' };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al eliminar talla referencia:', error);
            throw error;
        }
    }
}

module.exports = TallaReferencia; 