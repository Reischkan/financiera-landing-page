import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getAsignacionReferencia,
  createAsignacionReferencia,
  updateAsignacionReferencia,
  getReferencias,
  getModulos
} from '../../services/api';
import Swal from 'sweetalert2';

const AsignacionReferenciaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const initialState = {
    id_modulo: '',
    id_referencia: '',
    fecha_asignacion: new Date().toISOString().split('T')[0],
    estado: 'activo',
    comentarios: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [referencias, setReferencias] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar referencias y módulos
        const [refResponse, modulosResponse] = await Promise.all([
          getReferencias(),
          getModulos()
        ]);
        
        // Las funciones API ahora devuelven los datos directamente mediante processResponse
        setReferencias(refResponse || []);
        setModulos(modulosResponse || []);
        
        // Si estamos editando, cargar los datos de la asignación
        if (isEditing) {
          const asignacionResponse = await getAsignacionReferencia(id);
          // getAsignacionReferencia ya usa processResponse
          const asignacion = asignacionResponse || {};
          
          setFormData({
            id_modulo: asignacion.id_modulo || '',
            id_referencia: asignacion.id_referencia || '',
            fecha_asignacion: asignacion.fecha_asignacion ? new Date(asignacion.fecha_asignacion).toISOString().split('T')[0] : '',
            estado: asignacion.estado || 'activo',
            comentarios: asignacion.comentarios || ''
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos. Por favor, intente de nuevo.');
        setReferencias([]);
        setModulos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const validateForm = () => {
    const errors = {};
    if (!formData.id_modulo) errors.id_modulo = 'El módulo es requerido';
    if (!formData.id_referencia) errors.id_referencia = 'La referencia es requerida';
    if (!formData.fecha_asignacion) errors.fecha_asignacion = 'La fecha de asignación es requerida';
    if (!formData.estado) errors.estado = 'El estado es requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico al modificar un campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const payload = {
        ...formData,
        id_modulo: parseInt(formData.id_modulo),
        id_referencia: parseInt(formData.id_referencia)
      };
      
      if (isEditing) {
        await updateAsignacionReferencia(id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Asignación actualizada',
          text: 'La asignación se ha actualizado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate(`/asignaciones-referencia/view/${id}`);
        });
      } else {
        const response = await createAsignacionReferencia(payload);
        // createAsignacionReferencia ahora devuelve directamente los datos procesados
        const newId = response.id_asignacion_referencia;
        
        Swal.fire({
          icon: 'success',
          title: 'Asignación creada',
          text: 'La asignación se ha creado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate(`/asignaciones-referencia/view/${newId}`);
        });
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${isEditing ? 'actualizar' : 'crear'} la asignación. Por favor, intente de nuevo.`,
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>{isEditing ? 'Editar Asignación de Referencia' : 'Nueva Asignación de Referencia'}</h1>
            <Link to="/asignaciones-referencia" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Volver a la lista
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="id_modulo" className="form-label">Módulo *</label>
                    <select
                      id="id_modulo"
                      name="id_modulo"
                      className={`form-select ${formErrors.id_modulo ? 'is-invalid' : ''}`}
                      value={formData.id_modulo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un módulo</option>
                      {Array.isArray(modulos) && modulos.map(modulo => (
                        <option key={modulo.id_modulo} value={modulo.id_modulo}>
                          {modulo.nombre}
                        </option>
                      ))}
                    </select>
                    {formErrors.id_modulo && (
                      <div className="invalid-feedback">{formErrors.id_modulo}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="id_referencia" className="form-label">Referencia *</label>
                    <select
                      id="id_referencia"
                      name="id_referencia"
                      className={`form-select ${formErrors.id_referencia ? 'is-invalid' : ''}`}
                      value={formData.id_referencia}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una referencia</option>
                      {Array.isArray(referencias) && referencias.map(referencia => (
                        <option key={referencia.id_referencia} value={referencia.id_referencia}>
                          {referencia.codigo} - {referencia.descripcion}
                        </option>
                      ))}
                    </select>
                    {formErrors.id_referencia && (
                      <div className="invalid-feedback">{formErrors.id_referencia}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="fecha_asignacion" className="form-label">Fecha de Asignación *</label>
                    <input
                      type="date"
                      id="fecha_asignacion"
                      name="fecha_asignacion"
                      className={`form-control ${formErrors.fecha_asignacion ? 'is-invalid' : ''}`}
                      value={formData.fecha_asignacion}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.fecha_asignacion && (
                      <div className="invalid-feedback">{formErrors.fecha_asignacion}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="estado" className="form-label">Estado *</label>
                    <select
                      id="estado"
                      name="estado"
                      className={`form-select ${formErrors.estado ? 'is-invalid' : ''}`}
                      value={formData.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="activo">Activo</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                    {formErrors.estado && (
                      <div className="invalid-feedback">{formErrors.estado}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="comentarios" className="form-label">Comentarios</label>
                    <textarea
                      id="comentarios"
                      name="comentarios"
                      className="form-control"
                      value={formData.comentarios}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Agregue comentarios o instrucciones adicionales..."
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Link to="/asignaciones-referencia" className="btn btn-secondary">
                        Cancelar
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {isEditing ? 'Actualizando...' : 'Guardando...'}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            {isEditing ? 'Actualizar' : 'Guardar'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignacionReferenciaForm; 