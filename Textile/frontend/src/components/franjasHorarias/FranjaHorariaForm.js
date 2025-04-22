import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createFranjaHoraria, getFranjaHoraria, updateFranjaHoraria } from '../../services/api';
import Spinner from '../common/Spinner';

const FranjaHorariaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    hora_inicio: '',
    hora_fin: '',
    descripcion: '',
    estado: 'activa'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEdit) {
      const fetchFranjaHoraria = async () => {
        try {
          setLoading(true);
          const response = await getFranjaHoraria(id);
          // Formatear las horas para que funcionen con el input time
          const data = response.data;
          
          // Formatear las horas si vienen como objetos Date
          const formatTimeForInput = (timeStr) => {
            if (!timeStr) return '';
            
            // Si es un string con formato de hora del servidor (puede incluir segundos)
            if (typeof timeStr === 'string' && timeStr.includes(':')) {
              // Extraer solo horas y minutos
              const parts = timeStr.split(':');
              return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
            
            // Si es un objeto Date o timestamp
            if (timeStr instanceof Date || !isNaN(new Date(timeStr).getTime())) {
              const date = new Date(timeStr);
              return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
            
            return timeStr;
          };

          setFormData({
            hora_inicio: formatTimeForInput(data.hora_inicio),
            hora_fin: formatTimeForInput(data.hora_fin),
            descripcion: data.descripcion || '',
            estado: data.estado || 'activa'
          });
          
          setLoading(false);
        } catch (err) {
          setError('Error al cargar la franja horaria: ' + (err.response?.data?.message || err.message));
          setLoading(false);
        }
      };

      fetchFranjaHoraria();
    }
  }, [id, isEdit]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar el error de este campo si existe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es obligatoria';
    }
    
    if (!formData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es obligatoria';
    }
    
    if (formData.hora_inicio && formData.hora_fin) {
      // Convertir a objetos Date para comparar
      const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
      const fin = new Date(`2000-01-01T${formData.hora_fin}`);
      
      if (fin <= inicio) {
        newErrors.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }
    
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length > 100) {
      newErrors.descripcion = 'La descripción no puede tener más de 100 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEdit) {
        await updateFranjaHoraria(id, formData);
      } else {
        await createFranjaHoraria(formData);
      }
      
      setSubmitting(false);
      navigate('/franjas-horarias');
    } catch (err) {
      setError('Error al guardar la franja horaria: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">
            {isEdit ? 'Editar Franja Horaria' : 'Nueva Franja Horaria'}
          </h3>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="hora_inicio" className="form-label">Hora de Inicio *</label>
                <input
                  type="time"
                  className={`form-control ${errors.hora_inicio ? 'is-invalid' : ''}`}
                  id="hora_inicio"
                  name="hora_inicio"
                  value={formData.hora_inicio}
                  onChange={handleChange}
                  required
                />
                {errors.hora_inicio && (
                  <div className="invalid-feedback">{errors.hora_inicio}</div>
                )}
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="hora_fin" className="form-label">Hora de Fin *</label>
                <input
                  type="time"
                  className={`form-control ${errors.hora_fin ? 'is-invalid' : ''}`}
                  id="hora_fin"
                  name="hora_fin"
                  value={formData.hora_fin}
                  onChange={handleChange}
                  required
                />
                {errors.hora_fin && (
                  <div className="invalid-feedback">{errors.hora_fin}</div>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción *</label>
              <textarea
                className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                required
              ></textarea>
              {errors.descripcion && (
                <div className="invalid-feedback">{errors.descripcion}</div>
              )}
            </div>
            
            {isEdit && (
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            )}
            
            <div className="d-flex justify-content-between mt-4">
              <Link to="/franjas-horarias" className="btn btn-secondary">
                Cancelar
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranjaHorariaForm; 