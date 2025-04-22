import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPersona, createPersona, updatePersona } from '../../services/api';

const PersonaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    minutos_diarios_asignados: 480, // 8 horas por defecto
    fecha_ingreso: new Date().toISOString().split('T')[0],
    estado: 'activo'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchPersona = async () => {
        try {
          const response = await getPersona(id);
          const persona = response.data;
          
          setFormData({
            nombre: persona.nombre,
            documento: persona.documento,
            minutos_diarios_asignados: persona.minutos_diarios_asignados,
            fecha_ingreso: new Date(persona.fecha_ingreso).toISOString().split('T')[0],
            estado: persona.estado
          });
          
          setError(null);
        } catch (err) {
          setError('Error al cargar los datos de la persona. Por favor, intente de nuevo.');
          console.error('Error al cargar la persona:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPersona();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditMode) {
        await updatePersona(id, formData);
      } else {
        await createPersona(formData);
      }
      
      navigate('/personas');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} la persona. Por favor, intente de nuevo.`);
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la persona:`, err);
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2>{isEditMode ? 'Editar Persona' : 'Crear Nueva Persona'}</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
              <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre completo *</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="documento" className="form-label">Documento *</label>
                <input
                  type="text"
                  className="form-control"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="minutos_diarios_asignados" className="form-label">Minutos diarios asignados</label>
                <input
                  type="number"
                  className="form-control"
                  id="minutos_diarios_asignados"
                  name="minutos_diarios_asignados"
                  value={formData.minutos_diarios_asignados}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="fecha_ingreso" className="form-label">Fecha de ingreso</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleChange}
                />
              </div>
            </div>
            
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
            
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="ms-2">Guardando...</span>
                  </>
                ) : (
                  'Guardar'
                )}
              </button>
              <Link to="/personas" className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonaForm; 