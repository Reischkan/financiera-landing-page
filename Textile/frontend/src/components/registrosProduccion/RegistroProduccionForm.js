import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  getRegistroProduccion, 
  createRegistroProduccion, 
  updateRegistroProduccion,
  getAsignacionesModulo,
  getAsignacionesReferencia,
  getFranjasHorarias
} from '../../services/api';
import Swal from 'sweetalert2';

const RegistroProduccionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preselectedModuloId = searchParams.get('moduloId');
  const preselectedReferenciaId = searchParams.get('referenciaId');

  const isEditing = !!id;
  
  const initialState = {
    id_asignacion_modulo: preselectedModuloId || '',
    id_asignacion_referencia: preselectedReferenciaId || '',
    id_franja: '',
    fecha: new Date().toISOString().split('T')[0],
    minutos_producidos: '',
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [asignacionesModulo, setAsignacionesModulo] = useState([]);
  const [asignacionesReferencia, setAsignacionesReferencia] = useState([]);
  const [franjasHorarias, setFranjasHorarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos relacionados
        const [
          asigModulosResponse, 
          asigReferenciasResponse, 
          franjasResponse
        ] = await Promise.all([
          getAsignacionesModulo(),
          getAsignacionesReferencia(),
          getFranjasHorarias()
        ]);
        
        setAsignacionesModulo(asigModulosResponse || []);
        setAsignacionesReferencia(asigReferenciasResponse || []);
        setFranjasHorarias(franjasResponse || []);
        
        // Si estamos editando, cargar los datos del registro
        if (isEditing) {
          const registroResponse = await getRegistroProduccion(id);
          const registro = registroResponse || {};
          
          setFormData({
            id_asignacion_modulo: registro.id_asignacion_modulo || '',
            id_asignacion_referencia: registro.id_asignacion_referencia || '',
            id_franja: registro.id_franja || '',
            fecha: registro.fecha ? registro.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
            minutos_producidos: registro.minutos_producidos || '',
            observaciones: registro.observaciones || ''
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar datos. Por favor, intente de nuevo.');
        setAsignacionesModulo([]);
        setAsignacionesReferencia([]);
        setFranjasHorarias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const validateForm = () => {
    const errors = {};
    if (!formData.id_asignacion_modulo) errors.id_asignacion_modulo = 'La asignación de módulo es requerida';
    if (!formData.id_asignacion_referencia) errors.id_asignacion_referencia = 'La asignación de referencia es requerida';
    if (!formData.id_franja) errors.id_franja = 'La franja horaria es requerida';
    if (!formData.fecha) errors.fecha = 'La fecha es requerida';
    if (!formData.minutos_producidos) errors.minutos_producidos = 'Los minutos producidos son requeridos';
    if (isNaN(formData.minutos_producidos) || parseFloat(formData.minutos_producidos) < 0) {
      errors.minutos_producidos = 'Los minutos producidos deben ser un número válido mayor o igual a 0';
    }
    
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
        id_asignacion_modulo: parseInt(formData.id_asignacion_modulo),
        id_asignacion_referencia: parseInt(formData.id_asignacion_referencia),
        id_franja: parseInt(formData.id_franja),
        minutos_producidos: parseFloat(formData.minutos_producidos)
      };
      
      console.log('Enviando datos al servidor:', payload);
      
      if (isEditing) {
        await updateRegistroProduccion(id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado',
          text: 'El registro de producción se ha actualizado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate(`/registros-produccion/view/${id}`);
        });
      } else {
        const response = await createRegistroProduccion(payload);
        const newId = response.id_registro;
        
        Swal.fire({
          icon: 'success',
          title: 'Registro creado',
          text: 'El registro de producción se ha creado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          navigate(`/registros-produccion/view/${newId}`);
        });
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      
      // Mensaje de error más específico
      const errorMessage = err.message || err.data?.message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} el registro. Por favor, intente de nuevo.`;
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
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
            <h1>{isEditing ? 'Editar Registro de Producción' : 'Nuevo Registro de Producción'}</h1>
            <Link to="/registros-produccion" className="btn btn-outline-secondary">
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
                    <label htmlFor="id_asignacion_modulo" className="form-label">Asignación de Módulo *</label>
                    <select
                      id="id_asignacion_modulo"
                      name="id_asignacion_modulo"
                      className={`form-select ${formErrors.id_asignacion_modulo ? 'is-invalid' : ''}`}
                      value={formData.id_asignacion_modulo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una asignación</option>
                      {Array.isArray(asignacionesModulo) && asignacionesModulo.map(asignacion => (
                        <option key={asignacion.id_asignacion} value={asignacion.id_asignacion}>
                          Módulo: {asignacion.nombre_modulo || asignacion.modulo?.nombre || 'N/A'} - 
                          Persona: {asignacion.nombre_persona || asignacion.persona?.nombre || 'N/A'}
                        </option>
                      ))}
                    </select>
                    {formErrors.id_asignacion_modulo && (
                      <div className="invalid-feedback">{formErrors.id_asignacion_modulo}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="id_asignacion_referencia" className="form-label">Asignación de Referencia *</label>
                    <select
                      id="id_asignacion_referencia"
                      name="id_asignacion_referencia"
                      className={`form-select ${formErrors.id_asignacion_referencia ? 'is-invalid' : ''}`}
                      value={formData.id_asignacion_referencia}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una asignación</option>
                      {Array.isArray(asignacionesReferencia) && asignacionesReferencia.map(asignacion => (
                        <option key={asignacion.id_asignacion_referencia} value={asignacion.id_asignacion_referencia}>
                          Módulo: {asignacion.nombre_modulo || asignacion.modulo?.nombre || 'N/A'} - 
                          Ref: {asignacion.codigo_referencia || asignacion.referencia?.codigo || 'N/A'}
                        </option>
                      ))}
                    </select>
                    {formErrors.id_asignacion_referencia && (
                      <div className="invalid-feedback">{formErrors.id_asignacion_referencia}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="id_franja" className="form-label">Franja Horaria *</label>
                    <select
                      id="id_franja"
                      name="id_franja"
                      className={`form-select ${formErrors.id_franja ? 'is-invalid' : ''}`}
                      value={formData.id_franja}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione una franja horaria</option>
                      {Array.isArray(franjasHorarias) && franjasHorarias.map(franja => (
                        <option key={franja.id_franja} value={franja.id_franja}>
                          {franja.nombre} ({franja.hora_inicio} - {franja.hora_fin})
                        </option>
                      ))}
                    </select>
                    {formErrors.id_franja && (
                      <div className="invalid-feedback">{formErrors.id_franja}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="fecha" className="form-label">Fecha *</label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      className={`form-control ${formErrors.fecha ? 'is-invalid' : ''}`}
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.fecha && (
                      <div className="invalid-feedback">{formErrors.fecha}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="minutos_producidos" className="form-label">Minutos Producidos *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="minutos_producidos"
                      name="minutos_producidos"
                      className={`form-control ${formErrors.minutos_producidos ? 'is-invalid' : ''}`}
                      value={formData.minutos_producidos}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.minutos_producidos && (
                      <div className="invalid-feedback">{formErrors.minutos_producidos}</div>
                    )}
                  </div>

                  <div className="col-md-12">
                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      className="form-control"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          {isEditing ? 'Actualizar' : 'Guardar'}
                        </>
                      )}
                    </button>
                    <Link to="/registros-produccion" className="btn btn-outline-secondary ms-2">
                      <i className="fas fa-times me-2"></i>
                      Cancelar
                    </Link>
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

export default RegistroProduccionForm; 