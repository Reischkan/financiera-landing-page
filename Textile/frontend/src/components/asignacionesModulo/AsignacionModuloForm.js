import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getAsignacionModulo, 
  createAsignacionModulo, 
  updateAsignacionModulo,
  getModulos,
  getPersonas
} from '../../services/api';

const AsignacionModuloForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    id_persona: '',
    id_modulo: '',
    fecha_asignacion: new Date().toISOString().split('T')[0],
    estado: 'activo'
  });
  
  const [modulos, setModulos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      setLoading(true);
      try {
        const [personasRes, modulosRes] = await Promise.all([
          getPersonas(),
          getModulos()
        ]);
        
        setPersonas(personasRes.data);
        setModulos(modulosRes.data);
      } catch (err) {
        setError('Error al cargar datos necesarios. Por favor, intente de nuevo.');
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, []);

  useEffect(() => {
    const fetchAsignacion = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const response = await getAsignacionModulo(id);
          const asignacion = response.data;
          
          // Formato de fecha para el input date
          const fechaAsignacion = asignacion.fecha_asignacion 
            ? new Date(asignacion.fecha_asignacion).toISOString().split('T')[0]
            : '';
          
          setFormData({
            id_persona: asignacion.id_persona,
            id_modulo: asignacion.id_modulo,
            fecha_asignacion: fechaAsignacion,
            estado: asignacion.estado || 'activo'
          });
        } catch (err) {
          setError('Error al cargar la asignación. Por favor, intente de nuevo.');
          console.error('Error al cargar la asignación:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAsignacion();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateAsignacionModulo(id, formData);
      } else {
        await createAsignacionModulo(formData);
      }
      navigate('/asignaciones-modulo');
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la asignación. Por favor, intente de nuevo.`);
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} la asignación:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? 'Editar' : 'Crear'} Asignación de Módulo</h2>
        <div>
          <Link to="/asignaciones-modulo" className="btn btn-outline-secondary me-2">
            <i className="fas fa-arrow-left"></i> Volver a la lista
          </Link>
          <Link to="/" className="btn btn-outline-primary">
            <i className="fas fa-home"></i> Inicio
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="id_persona" className="form-label">Persona</label>
              <select 
                className="form-select" 
                id="id_persona" 
                name="id_persona" 
                value={formData.id_persona} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una persona</option>
                {personas.map(persona => (
                  <option key={persona.id_persona} value={persona.id_persona}>
                    {persona.nombre} {persona.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="id_modulo" className="form-label">Módulo</label>
              <select 
                className="form-select" 
                id="id_modulo" 
                name="id_modulo" 
                value={formData.id_modulo} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un módulo</option>
                {modulos.map(modulo => (
                  <option key={modulo.id_modulo} value={modulo.id_modulo}>
                    {modulo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_asignacion" className="form-label">Fecha de Asignación</label>
              <input 
                type="date" 
                className="form-control" 
                id="fecha_asignacion" 
                name="fecha_asignacion" 
                value={formData.fecha_asignacion} 
                onChange={handleChange}
                required
              />
            </div>

            {isEditing && (
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select 
                  className="form-select" 
                  id="estado" 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            )}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  `${isEditing ? 'Actualizar' : 'Crear'} Asignación`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AsignacionModuloForm; 