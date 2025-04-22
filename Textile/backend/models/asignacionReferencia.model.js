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
                    r.codigo, 
                    r.descripcion,
                    r.tiempo_total_estimado
                FROM asignacionreferencia ar
                JOIN modulo m ON ar.id_modulo = m.id_modulo
                JOIN referencia r ON ar.id_referencia = r.id_referencia
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
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo, 
                    r.descripcion,
                    r.tiempo_total_estimado
                FROM asignacionreferencia ar
                JOIN modulo m ON ar.id_modulo = m.id_modulo
                JOIN referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_asignacion_referencia = ?
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
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo, 
                    r.descripcion,
                    r.tiempo_total_estimado
                FROM asignacionreferencia ar
                JOIN modulo m ON ar.id_modulo = m.id_modulo
                JOIN referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_modulo = ?
            `;
            const [rows] = await connection.execute(query, [idModulo]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByReferencia(connection, idReferencia) {
        try {
            const query = `
                SELECT 
                    ar.*, 
                    m.nombre AS nombre_modulo, 
                    r.codigo, 
                    r.descripcion,
                    r.tiempo_total_estimado
                FROM asignacionreferencia ar
                JOIN modulo m ON ar.id_modulo = m.id_modulo
                JOIN referencia r ON ar.id_referencia = r.id_referencia
                WHERE ar.id_referencia = ?
            `;
            const [rows] = await connection.execute(query, [idReferencia]);
            return rows;
        } catch (error) {
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
            
            // Iniciar transacción
            await connection.beginTransaction();
            
            try {
                // Verificar que el módulo exista
                const [moduloRows] = await connection.execute(
                    'SELECT * FROM modulo WHERE id_modulo = ?',
                    [asignacion.id_modulo]
                );
                
                if (moduloRows.length === 0) {
                    throw new Error('El módulo no existe');
                }
                
                // Obtener el tiempo total estimado de la referencia
                const [referenciaRows] = await connection.execute(
                    'SELECT tiempo_total_estimado FROM referencia WHERE id_referencia = ?',
                    [asignacion.id_referencia]
                );
                
                if (referenciaRows.length === 0) {
                    throw new Error('La referencia no existe');
                }
                
                const tiempoTotalEstimado = referenciaRows[0].tiempo_total_estimado || 0;
                
                // Verificar que la referencia no esté asignada al mismo módulo actualmente
                const [asignacionesExistentes] = await connection.execute(
                    'SELECT * FROM asignacionreferencia WHERE id_modulo = ? AND id_referencia = ? AND estado != "completado"',
                    [asignacion.id_modulo, asignacion.id_referencia]
                );
                
                if (asignacionesExistentes.length > 0) {
                    throw new Error('Esta referencia ya está asignada a este módulo');
                }
                
                const query = `
                    INSERT INTO asignacionreferencia (
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
                
                // Verificar que el módulo exista
                const [moduloRows] = await connection.execute(
                    'SELECT * FROM modulo WHERE id_modulo = ?',
                    [asignacion.id_modulo]
                );
                
                if (moduloRows.length === 0) {
                    throw new Error('El módulo no existe');
                }
                
                // Verificar que la referencia exista
                const [referenciaRows] = await connection.execute(
                    'SELECT * FROM referencia WHERE id_referencia = ?',
                    [asignacion.id_referencia]
                );
                
                if (referenciaRows.length === 0) {
                    throw new Error('La referencia no existe');
                }
                
                // Verificar que no se esté cambiando a una referencia que ya esté asignada
                if (asignacion.id_referencia !== asignacionRows[0].id_referencia || 
                    asignacion.id_modulo !== asignacionRows[0].id_modulo) {
                    
                    const [asignacionesExistentes] = await connection.execute(
                        'SELECT * FROM asignacionreferencia WHERE id_modulo = ? AND id_referencia = ? AND estado != "completado" AND id_asignacion_referencia != ?',
                        [asignacion.id_modulo, asignacion.id_referencia, id]
                    );
                    
                    if (asignacionesExistentes.length > 0) {
                        throw new Error('Esta referencia ya está asignada a este módulo');
                    }
                }
                
                // Validar fechas
                if (asignacion.fecha_inicio && asignacion.fecha_final) {
                    const fechaInicio = new Date(asignacion.fecha_inicio);
                    const fechaFinal = new Date(asignacion.fecha_final);
                    
                    if (fechaInicio > fechaFinal) {
                        throw new Error('La fecha de inicio debe ser anterior a la fecha final');
                    }
                }
                
                // Validar estado
                if (asignacion.estado && !['activo', 'pausado', 'completado', 'cancelado'].includes(asignacion.estado)) {
                    throw new Error('Estado no válido. Debe ser: activo, pausado, completado o cancelado');
                }
                
                // Si el estado es completado, asegurar que hay fecha final
                if (asignacion.estado === 'completado' && !asignacion.fecha_final) {
                    asignacion.fecha_final = new Date();
                }
                
                // Mantener los valores originales para cualquier campo que sea undefined o null
                const originalAsignacion = asignacionRows[0];
                
                const updateFields = {
                    id_modulo: asignacion.id_modulo,
                    id_referencia: asignacion.id_referencia,
                    fecha_asignacion: asignacion.fecha_asignacion !== null ? asignacion.fecha_asignacion : originalAsignacion.fecha_asignacion,
                    fecha_inicio: asignacion.fecha_inicio !== null ? asignacion.fecha_inicio : originalAsignacion.fecha_inicio,
                    fecha_final: asignacion.fecha_final !== null ? asignacion.fecha_final : originalAsignacion.fecha_final,
                    minutos_producidos: asignacion.minutos_producidos !== null ? asignacion.minutos_producidos : originalAsignacion.minutos_producidos,
                    minutos_restantes: asignacion.minutos_restantes !== null ? asignacion.minutos_restantes : originalAsignacion.minutos_restantes,
                    porcentaje_avance: asignacion.porcentaje_avance !== null ? asignacion.porcentaje_avance : originalAsignacion.porcentaje_avance,
                    estado: asignacion.estado || originalAsignacion.estado,
                    comentarios: asignacion.comentarios !== null ? asignacion.comentarios : (originalAsignacion.comentarios || '')
                };
                
                console.log('Valores originales:', originalAsignacion);
                console.log('Valores actualizados:', updateFields);
                
                const query = `
                    UPDATE asignacionreferencia 
                    SET 
                        id_modulo = ?, 
                        id_referencia = ?, 
                        fecha_asignacion = ?, 
                        fecha_inicio = ?,
                        fecha_final = ?,
                        minutos_producidos = ?,
                        minutos_restantes = ?,
                        porcentaje_avance = ?,
                        estado = ?,
                        comentarios = ? 
                    WHERE id_asignacion_referencia = ?
                `;
                
                await connection.execute(query, [
                    updateFields.id_modulo,
                    updateFields.id_referencia,
                    updateFields.fecha_asignacion,
                    updateFields.fecha_inicio,
                    updateFields.fecha_final,
                    updateFields.minutos_producidos,
                    updateFields.minutos_restantes,
                    updateFields.porcentaje_avance,
                    updateFields.estado,
                    updateFields.comentarios,
                    id
                ]);
                
                // Confirmar transacción
                await connection.commit();
                
                console.log('Actualización exitosa');
                return { id_asignacion_referencia: id, ...asignacion };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al actualizar asignación referencia:', error);
            throw error;
        }
    }

    static async delete(connection, id) {
        try {
            console.log('Modelo: eliminando asignación referencia ID:', id);
            
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
                
                const query = 'DELETE FROM asignacionreferencia WHERE id_asignacion_referencia = ?';
                await connection.execute(query, [id]);
                
                // Confirmar transacción
                await connection.commit();
                
                return { message: 'Asignación de referencia eliminada exitosamente' };
            } catch (err) {
                // Revertir transacción en caso de error
                await connection.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Error en el modelo al eliminar asignación referencia:', error);
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