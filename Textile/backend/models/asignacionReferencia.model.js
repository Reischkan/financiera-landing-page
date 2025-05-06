class AsignacionReferencia {
    constructor(asignacion) {
        this.id_asignacion_referencia = asignacion.id_asignacion_referencia;
        this.id_modulo = asignacion.id_modulo;
        this.id_referencia = asignacion.id_referencia;
        this.fecha_asignacion = asignacion.fecha_asignacion;
        this.fecha_inicio = asignacion.fecha_inicio;
        this.fecha_final = asignacion.fecha_final;
        this.minutos_producidos = asignacion.minutos_producidos;
        this.minutos_restantes = asignacion.minutos_restantes;
        this.porcentaje_avance = asignacion.porcentaje_avance;
        this.estado = asignacion.estado;
        this.comentarios = asignacion.comentarios;
    }

    static async getAll(connection) {
        try {
            const query = `
                SELECT 
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo AS codigo_referencia, 
                    r.descripcion AS descripcion_referencia,
                    r.tiempo_total_estimado
                FROM AsignacionReferencia ar
                JOIN Modulo m ON ar.id_modulo = m.id_modulo
                JOIN Referencia r ON ar.id_referencia = r.id_referencia
                ORDER BY ar.fecha_asignacion DESC
            `;
            const [rows] = await connection.execute(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener todas las asignaciones de referencia:', error);
            throw error;
        }
    }

    static async getById(connection, id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID de asignación no válido');
            }

            const query = `
                SELECT 
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo AS codigo_referencia, 
                    r.descripcion AS descripcion_referencia,
                    r.tiempo_total_estimado
                FROM AsignacionReferencia ar
                JOIN Modulo m ON ar.id_modulo = m.id_modulo
                JOIN Referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_asignacion_referencia = ?
            `;
            const [rows] = await connection.execute(query, [id]);
            return rows[0];
        } catch (error) {
            console.error(`Error al obtener asignación de referencia con ID ${id}:`, error);
            throw error;
        }
    }

    static async getByModulo(connection, idModulo) {
        try {
            if (!idModulo || isNaN(parseInt(idModulo))) {
                throw new Error('ID de módulo no válido');
            }

            const query = `
                SELECT 
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo AS codigo_referencia, 
                    r.descripcion AS descripcion_referencia,
                    r.tiempo_total_estimado
                FROM AsignacionReferencia ar
                JOIN Modulo m ON ar.id_modulo = m.id_modulo
                JOIN Referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_modulo = ?
                ORDER BY ar.fecha_asignacion DESC
            `;
            const [rows] = await connection.execute(query, [idModulo]);
            return rows;
        } catch (error) {
            console.error(`Error al obtener asignaciones de referencia para el módulo ${idModulo}:`, error);
            throw error;
        }
    }

    static async getByReferencia(connection, idReferencia) {
        try {
            if (!idReferencia || isNaN(parseInt(idReferencia))) {
                throw new Error('ID de referencia no válido');
            }

            const query = `
                SELECT 
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo AS codigo_referencia, 
                    r.descripcion AS descripcion_referencia,
                    r.tiempo_total_estimado
                FROM AsignacionReferencia ar
                JOIN Modulo m ON ar.id_modulo = m.id_modulo
                JOIN Referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_referencia = ?
                ORDER BY ar.fecha_asignacion DESC
            `;
            const [rows] = await connection.execute(query, [idReferencia]);
            return rows;
        } catch (error) {
            console.error(`Error al obtener asignaciones de referencia para la referencia ${idReferencia}:`, error);
            throw error;
        }
    }

    static async create(connection, asignacion) {
        try {
            console.log('Modelo: creando asignación referencia:', asignacion);
            
            // Validar campos obligatorios
            if (!asignacion.id_modulo || !asignacion.id_referencia) {
                throw new Error('ID de módulo y ID de referencia son requeridos');
            }
            
            // Validar que los IDs sean numéricos
            if (isNaN(parseInt(asignacion.id_modulo)) || isNaN(parseInt(asignacion.id_referencia))) {
                throw new Error('Los IDs de módulo y referencia deben ser valores numéricos');
            }
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que el módulo exista
                const [moduloRows] = await connection.execute(
                    'SELECT * FROM Modulo WHERE id_modulo = ?',
                    [asignacion.id_modulo]
                );
                
                if (moduloRows.length === 0) {
                    throw new Error('El módulo no existe');
                }
                
                // Obtener el tiempo total estimado de la referencia
                const [referenciaRows] = await connection.execute(
                    'SELECT tiempo_total_estimado FROM Referencia WHERE id_referencia = ?',
                    [asignacion.id_referencia]
                );
                
                if (referenciaRows.length === 0) {
                    throw new Error('La referencia no existe');
                }
                
                const tiempoTotalEstimado = referenciaRows[0].tiempo_total_estimado || 0;
                
                // Verificar que la referencia no esté asignada al mismo módulo actualmente
                const [asignacionesExistentes] = await connection.execute(
                    'SELECT * FROM AsignacionReferencia WHERE id_modulo = ? AND id_referencia = ? AND estado != "completado"',
                    [asignacion.id_modulo, asignacion.id_referencia]
                );
                
                if (asignacionesExistentes.length > 0) {
                    throw new Error('Esta referencia ya está asignada a este módulo');
                }
                
                const query = `
                    INSERT INTO AsignacionReferencia (
                        id_modulo, 
                        id_referencia, 
                        fecha_asignacion, 
                        fecha_inicio,
                        minutos_producidos,
                        minutos_restantes,
                        porcentaje_avance,
                        estado,
                        comentarios
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                
                const fechaInicio = asignacion.fecha_inicio || null;
                const minutosProducidos = asignacion.minutos_producidos || 0;
                const minutosRestantes = asignacion.minutos_restantes || tiempoTotalEstimado;
                const porcentajeAvance = asignacion.porcentaje_avance || 0;
                
                const [result] = await connection.execute(query, [
                    asignacion.id_modulo,
                    asignacion.id_referencia,
                    asignacion.fecha_asignacion || new Date(),
                    fechaInicio,
                    minutosProducidos,
                    minutosRestantes,
                    porcentajeAvance,
                    asignacion.estado || 'activo',
                    asignacion.comentarios || ''
                ]);
                
                // Confirmar transacción
                await connection.commit();
                
                console.log('Resultado de la inserción:', result);
                
                return { 
                    id_asignacion_referencia: result.insertId, 
                    ...asignacion,
                    minutos_restantes: minutosRestantes,
                    porcentaje_avance: porcentajeAvance 
                };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al crear asignación referencia:', error);
            throw error;
        }
    }

    static async update(connection, id, asignacion) {
        try {
            console.log('Modelo: actualizando asignación referencia:', asignacion);
            
            // Validar ID de asignación
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID de asignación no válido');
            }
            
            // Validar que los IDs sean numéricos
            if (asignacion.id_modulo && isNaN(parseInt(asignacion.id_modulo))) {
                throw new Error('El ID del módulo debe ser un valor numérico');
            }
            
            if (asignacion.id_referencia && isNaN(parseInt(asignacion.id_referencia))) {
                throw new Error('El ID de la referencia debe ser un valor numérico');
            }
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que la asignación existe
                const [asignacionRows] = await connection.execute(
                    'SELECT * FROM AsignacionReferencia WHERE id_asignacion_referencia = ?',
                    [id]
                );
                
                if (asignacionRows.length === 0) {
                    throw new Error('La asignación no existe');
                }
                
                // Verificar que el módulo exista
                if (asignacion.id_modulo) {
                    const [moduloRows] = await connection.execute(
                        'SELECT * FROM Modulo WHERE id_modulo = ?',
                        [asignacion.id_modulo]
                    );
                    
                    if (moduloRows.length === 0) {
                        throw new Error('El módulo no existe');
                    }
                }
                
                // Verificar que la referencia exista
                if (asignacion.id_referencia) {
                    const [referenciaRows] = await connection.execute(
                        'SELECT * FROM Referencia WHERE id_referencia = ?',
                        [asignacion.id_referencia]
                    );
                    
                    if (referenciaRows.length === 0) {
                        throw new Error('La referencia no existe');
                    }
                }
                
                // Verificar que no se esté cambiando a una referencia que ya esté asignada
                if (asignacion.id_referencia && asignacion.id_modulo && 
                    (asignacion.id_referencia !== asignacionRows[0].id_referencia || 
                    asignacion.id_modulo !== asignacionRows[0].id_modulo)) {
                    
                    const [asignacionesExistentes] = await connection.execute(
                        'SELECT * FROM AsignacionReferencia WHERE id_modulo = ? AND id_referencia = ? AND estado != "completado" AND id_asignacion_referencia != ?',
                        [asignacion.id_modulo, asignacion.id_referencia, id]
                    );
                    
                    if (asignacionesExistentes.length > 0) {
                        throw new Error('Esta referencia ya está asignada a este módulo');
                    }
                }
                
                // Validar fechas
                let fechaAsignacion = asignacionRows[0].fecha_asignacion;
                let fechaInicio = asignacionRows[0].fecha_inicio;
                let fechaFinal = asignacionRows[0].fecha_final;
                
                if (asignacion.fecha_asignacion) {
                    fechaAsignacion = new Date(asignacion.fecha_asignacion);
                }
                
                if (asignacion.fecha_inicio) {
                    fechaInicio = new Date(asignacion.fecha_inicio);
                }
                
                if (asignacion.fecha_final) {
                    fechaFinal = new Date(asignacion.fecha_final);
                }
                
                if (fechaInicio && fechaFinal && fechaInicio > fechaFinal) {
                    throw new Error('La fecha de inicio no puede ser posterior a la fecha final');
                }
                
                // Validar estado
                const estadosValidos = ['activo', 'en_proceso', 'completado', 'cancelado'];
                if (asignacion.estado && !estadosValidos.includes(asignacion.estado)) {
                    throw new Error('Estado no válido. Los valores permitidos son: ' + estadosValidos.join(', '));
                }
                
                // Actualizar asignación
                const queryFragments = [];
                const queryParams = [];
                
                if (asignacion.id_modulo) {
                    queryFragments.push('id_modulo = ?');
                    queryParams.push(asignacion.id_modulo);
                }
                
                if (asignacion.id_referencia) {
                    queryFragments.push('id_referencia = ?');
                    queryParams.push(asignacion.id_referencia);
                }
                
                if (asignacion.fecha_asignacion) {
                    queryFragments.push('fecha_asignacion = ?');
                    queryParams.push(fechaAsignacion);
                }
                
                if (asignacion.fecha_inicio !== undefined) {
                    queryFragments.push('fecha_inicio = ?');
                    queryParams.push(fechaInicio);
                }
                
                if (asignacion.fecha_final !== undefined) {
                    queryFragments.push('fecha_final = ?');
                    queryParams.push(fechaFinal);
                }
                
                if (asignacion.minutos_producidos !== undefined && asignacion.minutos_producidos !== null) {
                    queryFragments.push('minutos_producidos = ?');
                    queryParams.push(asignacion.minutos_producidos);
                }
                
                if (asignacion.minutos_restantes !== undefined && asignacion.minutos_restantes !== null) {
                    queryFragments.push('minutos_restantes = ?');
                    queryParams.push(asignacion.minutos_restantes);
                }
                
                if (asignacion.porcentaje_avance !== undefined && asignacion.porcentaje_avance !== null) {
                    queryFragments.push('porcentaje_avance = ?');
                    queryParams.push(asignacion.porcentaje_avance);
                }
                
                if (asignacion.estado) {
                    queryFragments.push('estado = ?');
                    queryParams.push(asignacion.estado);
                }
                
                if (asignacion.comentarios !== undefined) {
                    queryFragments.push('comentarios = ?');
                    queryParams.push(asignacion.comentarios);
                }
                
                if (queryFragments.length === 0) {
                    throw new Error('No se proporcionaron campos para actualizar');
                }
                
                // Añadir el id al final de los parámetros
                queryParams.push(id);
                
                const query = `
                    UPDATE AsignacionReferencia
                    SET ${queryFragments.join(', ')}
                    WHERE id_asignacion_referencia = ?
                `;
                
                const [result] = await connection.execute(query, queryParams);
                
                if (result.affectedRows === 0) {
                    throw new Error('No se pudo actualizar la asignación');
                }
                
                // Confirmar transacción
                await connection.commit();
                
                // Obtener asignación actualizada
                const [updatedRows] = await connection.execute(
                    `SELECT ar.*, m.nombre AS nombre_modulo, r.codigo AS codigo_referencia, r.descripcion AS descripcion_referencia
                     FROM AsignacionReferencia ar
                     JOIN Modulo m ON ar.id_modulo = m.id_modulo
                     JOIN Referencia r ON ar.id_referencia = r.id_referencia
                     WHERE ar.id_asignacion_referencia = ?`,
                    [id]
                );
                
                return updatedRows[0];
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error(`Error al actualizar asignación referencia con ID ${id}:`, error);
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            console.log('Modelo: eliminando asignación referencia ID:', id);
            
            // Validar ID
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID de asignación no válido');
            }
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que la asignación existe
                const [asignacionRows] = await connection.execute(
                    'SELECT * FROM AsignacionReferencia WHERE id_asignacion_referencia = ?',
                    [id]
                );
                
                if (asignacionRows.length === 0) {
                    throw new Error('La asignación no existe');
                }
                
                // Eliminar asignación
                const [result] = await connection.execute(
                    'DELETE FROM AsignacionReferencia WHERE id_asignacion_referencia = ?',
                    [id]
                );
                
                if (result.affectedRows === 0) {
                    throw new Error('No se pudo eliminar la asignación');
                }
                
                // Confirmar transacción
                await connection.commit();
                
                return { message: 'Asignación eliminada correctamente' };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error(`Error al eliminar asignación referencia con ID ${id}:`, error);
            throw error;
        }
    }

    static async completar(connection, id) {
        try {
            console.log('Modelo: completando asignación referencia ID:', id);
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que la asignación existe
                const [asignacionRows] = await connection.execute(
                    'SELECT * FROM asignacionreferencia WHERE id_asignacion_referencia = ?',
                    [id]
                );
                
                if (asignacionRows.length === 0) {
                    throw new Error('La asignación no existe');
                }
                
                if (asignacionRows[0].estado === 'completado') {
                    throw new Error('La asignación ya está completada');
                }
                
                const query = `
                    UPDATE asignacionreferencia 
                    SET 
                        fecha_final = ?,
                        minutos_restantes = 0,
                        porcentaje_avance = 100,
                        estado = 'completado' 
                    WHERE id_asignacion_referencia = ?
                `;
                
                await connection.execute(query, [new Date(), id]);
                
                // Confirmar transacción
                await connection.commit();
                
                return { 
                    message: 'Referencia marcada como completada',
                    fecha_final: new Date(),
                    minutos_restantes: 0,
                    porcentaje_avance: 100,
                    estado: 'completado'
                };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al completar asignación referencia:', error);
            throw error;
        }
    }

    static async actualizarAvance(connection, id, minutosProducidos) {
        try {
            console.log('Modelo: actualizando avance asignación referencia ID:', id, 'Minutos:', minutosProducidos);
            
            if (minutosProducidos < 0) {
                throw new Error('Los minutos producidos no pueden ser negativos');
            }
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Obtener la asignación actual
                const [asignacionRows] = await connection.execute(
                    'SELECT * FROM asignacionreferencia WHERE id_asignacion_referencia = ?',
                    [id]
                );
                
                if (asignacionRows.length === 0) {
                    throw new Error('La asignación no existe');
                }
                
                const asignacion = asignacionRows[0];
                
                if (asignacion.estado === 'completado') {
                    throw new Error('No se puede actualizar una asignación completada');
                }
                
                // Obtener el tiempo total estimado de la referencia
                const [referenciaRows] = await connection.execute(
                    'SELECT tiempo_total_estimado FROM referencia WHERE id_referencia = ?',
                    [asignacion.id_referencia]
                );
                
                const tiempoTotalEstimado = referenciaRows[0].tiempo_total_estimado || 0;
                
                // Calcular nuevos valores
                const minutosProducidosActualizados = (asignacion.minutos_producidos || 0) + minutosProducidos;
                const minutosRestantes = Math.max(0, tiempoTotalEstimado - minutosProducidosActualizados);
                const porcentajeAvance = tiempoTotalEstimado > 0 
                    ? Math.min(100, Math.round((minutosProducidosActualizados / tiempoTotalEstimado) * 100 * 100) / 100) 
                    : 0;
                
                // Actualizar fecha de inicio si es null
                let fechaInicio = asignacion.fecha_inicio;
                if (!fechaInicio) {
                    fechaInicio = new Date();
                }
                
                // Determinar si se debe completar automáticamente
                let estado = asignacion.estado;
                let fechaFinal = asignacion.fecha_final;
                
                if (porcentajeAvance >= 100) {
                    estado = 'completado';
                    fechaFinal = new Date();
                }
                
                const query = `
                    UPDATE asignacionreferencia 
                    SET 
                        fecha_inicio = ?,
                        fecha_final = ?,
                        minutos_producidos = ?,
                        minutos_restantes = ?,
                        porcentaje_avance = ?,
                        estado = ? 
                    WHERE id_asignacion_referencia = ?
                `;
                
                await connection.execute(query, [
                    fechaInicio,
                    fechaFinal,
                    minutosProducidosActualizados,
                    minutosRestantes,
                    porcentajeAvance,
                    estado,
                    id
                ]);
                
                // Confirmar transacción
                await connection.commit();
                
                return {
                    id_asignacion_referencia: id,
                    fecha_inicio: fechaInicio,
                    fecha_final: fechaFinal,
                    minutos_producidos: minutosProducidosActualizados,
                    minutos_restantes: minutosRestantes,
                    porcentaje_avance: porcentajeAvance,
                    estado: estado
                };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al actualizar avance:', error);
            throw error;
        }
    }
}

module.exports = AsignacionReferencia; 