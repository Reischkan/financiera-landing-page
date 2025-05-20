import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPersonas, getAusencia, createAusencia, updateAusencia } from '../../services/api';

const AusenciaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [personas, setPersonas] = useState([]);
  
  const [formData, setFormData] = useState({
    id_persona: '',
    fecha_inicio: '',
    fecha_fin: '',
    motivo: '',
    justificada: false
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchDependencies = async () => {
      setLoading(true);
      try {
        const personasData = await getPersonas();
        if (Array.isArray(personasData)) {
          setPersonas(personasData);
          
          if (personasData.length === 0) {
            showNotification('No hay personas registradas. Primero debe crear empleados.', 'warning');
          }
        } else {
          showNotification('Error al cargar personas: Formato de datos incorrecto', 'danger');
          console.error('Datos de personas recibidos incorrectos:', personasData);
        }
      } catch (error) {
        showNotification('Error al cargar los datos de personas', 'danger');
        console.error('Error al cargar personas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchAusenciaData = async () => {
        setLoading(true);
        try {
          const data = await getAusencia(id);
          if (data) {
            setFormData({
              id_persona: data.id_persona,
              fecha_inicio: formatDateForInput(data.fecha_inicio),
              fecha_fin: formatDateForInput(data.fecha_fin),
              motivo: data.motivo,
              justificada: data.justificada === 1 || data.justificada === true
            });
          } else {
            showNotification('No se encontró la ausencia', 'danger');
            navigate('/ausencias');
          }
        } catch (error) {
          showNotification('Error al cargar los datos de la ausencia', 'danger');
          console.error('Error al cargar ausencia:', error);
          navigate('/ausencias');
        } finally {
          setLoading(false);
        }
      };

      fetchAusenciaData();
    }
  }, [id, isEditing, navigate]);

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Convertir formato de fecha para inputs HTML (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
    
    // Validar el campo cuando cambia
    validateField(name, newValue);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'id_persona':
        if (!value) {
          newErrors.id_persona = 'Debe seleccionar una persona';
        } else {
          delete newErrors.id_persona;
        }
        break;
      case 'fecha_inicio':
        if (!value) {
          newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
        } else {
          delete newErrors.fecha_inicio;
          
          // Validar que fecha_inicio no sea posterior a fecha_fin si ambas existen
          if (formData.fecha_fin && new Date(value) > new Date(formData.fecha_fin)) {
            newErrors.fecha_inicio = 'La fecha de inicio no puede ser posterior a la fecha de fin';
          }
        }
        break;
      case 'fecha_fin':
        if (!value) {
          newErrors.fecha_fin = 'La fecha de fin es obligatoria';
        } else {
          delete newErrors.fecha_fin;
          
          // Validar que fecha_fin no sea anterior a fecha_inicio si ambas existen
          if (formData.fecha_inicio && new Date(value) < new Date(formData.fecha_inicio)) {
            newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la fecha de inicio';
          }
        }
        break;
      case 'motivo':
        if (!value) {
          newErrors.motivo = 'El motivo es obligatorio';
        } else if (value.length < 5) {
          newErrors.motivo = 'El motivo debe tener al menos 5 caracteres';
        } else if (value.length > 500) {
          newErrors.motivo = 'El motivo no puede exceder los 500 caracteres';
        } else {
          delete newErrors.motivo;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validar todos los campos
    let formIsValid = true;
    let newErrors = {};
    
    // Persona
    if (!formData.id_persona) {
      newErrors.id_persona = 'Debe seleccionar una persona';
      formIsValid = false;
    }
    
    // Fecha inicio
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
      formIsValid = false;
    }
    
    // Fecha fin
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es obligatoria';
      formIsValid = false;
    } else if (formData.fecha_inicio && new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
      newErrors.fecha_fin = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      formIsValid = false;
    }
    
    // Motivo
    if (!formData.motivo) {
      newErrors.motivo = 'El motivo es obligatorio';
      formIsValid = false;
    } else if (formData.motivo.length < 5) {
      newErrors.motivo = 'El motivo debe tener al menos 5 caracteres';
      formIsValid = false;
    } else if (formData.motivo.length > 500) {
      newErrors.motivo = 'El motivo no puede exceder los 500 caracteres';
      formIsValid = false;
    }
    
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      showNotification('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const ausenciaData = {
        id_persona: formData.id_persona,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        motivo: formData.motivo,
        justificada: formData.justificada
      };

      if (isEditing) {
        await updateAusencia(id, ausenciaData);
        showNotification('Ausencia actualizada correctamente');
      } else {
        await createAusencia(ausenciaData);
        showNotification('Ausencia creada correctamente');
      }
      
      // Esperar un segundo para que el usuario vea la notificación antes de redirigir
      setTimeout(() => {
        navigate('/ausencias');
      }, 1000);
    } catch (error) {
      const errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} la ausencia`;
      showNotification(errorMessage, 'danger');
      console.error(`${errorMessage}:`, error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Generar las opciones de personas para el select
  const getPersonasOptions = () => {
    if (personas.length === 0) {
      return <option value="">No hay personas disponibles</option>;
    }
    
    return [
      <option key="default" value="">Seleccione una persona</option>,
      ...personas.map(persona => (
        <option key={persona.id_persona} value={persona.id_persona}>
          {persona.nombre} - {persona.documento}
        </option>
      ))
    ];
  };

  return (
    <div className="container mt-4">
      {/* Notificación */}
      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`} 
             role="alert" style={{zIndex: 1050}}>
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({...notification, show: false})}></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="card-title mb-0">
            <i className={`fas fa-${isEditing ? 'edit' : 'plus-circle'} me-2`}></i>
            {isEditing ? 'Editar Ausencia' : 'Registrar Nueva Ausencia'}
          </h5>
          <Link to="/ausencias" className="btn btn-sm btn-light">
            <i className="fas fa-arrow-left me-1"></i> Volver
          </Link>
        </div>
        
        {loading ? (
          <div className="card-body text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos...</p>
          </div>
        ) : (
          <div className="card-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="id_persona" className="form-label">
                    Persona <span className="text-danger">*</span>
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <select
                      className={`form-select ${touched.id_persona && (errors.id_persona ? 'is-invalid' : 'is-valid')}`}
                      id="id_persona"
                      name="id_persona"
                      value={formData.id_persona}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={personas.length === 0 || loading || submitting}
                      required
                    >
                      {getPersonasOptions()}
                    </select>
                    {touched.id_persona && errors.id_persona && (
                      <div className="invalid-feedback">
                        {errors.id_persona}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    Seleccione el empleado que estará ausente
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block">
                    ¿Ausencia Justificada?
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="justificada"
                      name="justificada"
                      role="switch"
                      checked={formData.justificada}
                      onChange={handleInputChange}
                      disabled={submitting}
                    />
                    <label className="form-check-label" htmlFor="justificada">
                      {formData.justificada ? (
                        <span className="text-success">
                          <i className="fas fa-check-circle me-1"></i> 
                          Justificada
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="fas fa-times-circle me-1"></i> 
                          No Justificada
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="form-text">
                    Indique si la ausencia está justificada con algún soporte
                  </div>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_inicio" className="form-label">
                    Fecha Inicio <span className="text-danger">*</span>
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <i className="fas fa-calendar"></i>
                    </span>
                    <input
                      type="date"
                      className={`form-control ${touched.fecha_inicio && (errors.fecha_inicio ? 'is-invalid' : 'is-valid')}`}
                      id="fecha_inicio"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={submitting}
                      required
                    />
                    {touched.fecha_inicio && errors.fecha_inicio && (
                      <div className="invalid-feedback">
                        {errors.fecha_inicio}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    Fecha en que inicia la ausencia
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="fecha_fin" className="form-label">
                    Fecha Fin <span className="text-danger">*</span>
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <i className="fas fa-calendar"></i>
                    </span>
                    <input
                      type="date"
                      className={`form-control ${touched.fecha_fin && (errors.fecha_fin ? 'is-invalid' : 'is-valid')}`}
                      id="fecha_fin"
                      name="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={submitting}
                      required
                    />
                    {touched.fecha_fin && errors.fecha_fin && (
                      <div className="invalid-feedback">
                        {errors.fecha_fin}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    Fecha en que finaliza la ausencia
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="motivo" className="form-label">
                  Motivo <span className="text-danger">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text">
                    <i className="fas fa-comment"></i>
                  </span>
                  <textarea
                    className={`form-control ${touched.motivo && (errors.motivo ? 'is-invalid' : 'is-valid')}`}
                    id="motivo"
                    name="motivo"
                    rows="4"
                    placeholder="Describa el motivo de la ausencia"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                    maxLength="500"
                    required
                  ></textarea>
                  {touched.motivo && errors.motivo && (
                    <div className="invalid-feedback">
                      {errors.motivo}
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between">
                  <div className="form-text">
                    Detalle el motivo de la ausencia
                  </div>
                  <small className={formData.motivo.length > 450 ? 'text-danger' : 'text-muted'}>
                    {formData.motivo.length}/500 caracteres
                  </small>
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <Link to="/ausencias" className="btn btn-secondary" disabled={submitting}>
                  <i className="fas fa-times me-1"></i> Cancelar
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || Object.keys(errors).length > 0}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {isEditing ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      <i className={`fas fa-${isEditing ? 'save' : 'plus-circle'} me-1`}></i>
                      {isEditing ? 'Actualizar' : 'Guardar'}
                    </>
                  )}
                </button>
              </div>
              
              {formData.fecha_inicio && formData.fecha_fin && !errors.fecha_inicio && !errors.fecha_fin && (
                <div className="alert alert-info mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  La ausencia durará <strong>
                    {Math.ceil((new Date(formData.fecha_fin) - new Date(formData.fecha_inicio)) / (1000 * 60 * 60 * 24)) + 1}
                  </strong> día(s).
                </div>
              )}
            </form>
          </div>
        )}
        
        <div className="card-footer text-muted">
          <small>Los campos marcados con <span className="text-danger">*</span> son obligatorios</small>
        </div>
      </div>
    </div>
  );
};

export default AusenciaForm; 