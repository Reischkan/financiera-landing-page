import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getModulo, createModulo, updateModulo } from '../../services/api';

const ModuloForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'activo'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchModulo = async () => {
        try {
          const modulo = await getModulo(id);
          setFormData({
            nombre: modulo.nombre || '',
            estado: modulo.estado || 'activo'
          });
          setError(null);
        } catch (err) {
          setError('Error al cargar los datos del módulo. Por favor, intente de nuevo.');
          console.error('Error al cargar el módulo:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchModulo();
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
        await updateModulo(id, formData);
      } else {
        await createModulo(formData);
      }
      
      navigate('/modulos');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} el módulo. Por favor, intente de nuevo.`);
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el módulo:`, err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2>{isEditMode ? 'Editar Módulo' : 'Crear Nuevo Módulo'}</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
              <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre *</label>
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
              <Link to="/modulos" className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModuloForm; 