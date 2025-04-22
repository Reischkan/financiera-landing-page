import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getReferencia, createReferencia, updateReferencia } from '../../services/api';

const ReferenciaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    tiempo_estimado_unidad: 0,
    tiempo_total_estimado: 0,
    serial: '',
    lote: '',
    estado: 'pendiente'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchReferencia = async () => {
        try {
          const response = await getReferencia(id);
          setFormData({
            codigo: response.data.codigo,
            descripcion: response.data.descripcion,
            tiempo_estimado_unidad: response.data.tiempo_estimado_unidad,
            tiempo_total_estimado: response.data.tiempo_total_estimado,
            serial: response.data.serial || '',
            lote: response.data.lote || '',
            estado: response.data.estado
          });
          setError(null);
        } catch (err) {
          setError('Error al cargar los datos de la referencia. Por favor, intente de nuevo.');
          console.error('Error al cargar la referencia:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchReferencia();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convertir a número si el campo es numérico
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditMode) {
        await updateReferencia(id, formData);
      } else {
        await createReferencia(formData);
      }
      
      navigate('/referencias');
    } catch (err) {
      setError(`Error al ${isEditMode ? 'actualizar' : 'crear'} la referencia. Por favor, intente de nuevo.`);
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} la referencia:`, err);
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
          <h2>{isEditMode ? 'Editar Referencia' : 'Crear Nueva Referencia'}</h2>
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
                <label htmlFor="codigo" className="form-label">Código *</label>
                <input
                  type="text"
                  className="form-control"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción *</label>
                <input
                  type="text"
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="tiempo_estimado_unidad" className="form-label">Tiempo Estimado por Unidad (min)</label>
                <input
                  type="number"
                  className="form-control"
                  id="tiempo_estimado_unidad"
                  name="tiempo_estimado_unidad"
                  value={formData.tiempo_estimado_unidad}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="tiempo_total_estimado" className="form-label">Tiempo Total Estimado (min)</label>
                <input
                  type="number"
                  className="form-control"
                  id="tiempo_total_estimado"
                  name="tiempo_total_estimado"
                  value={formData.tiempo_total_estimado}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="serial" className="form-label">Serial</label>
                <input
                  type="text"
                  className="form-control"
                  id="serial"
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lote" className="form-label">Lote</label>
                <input
                  type="text"
                  className="form-control"
                  id="lote"
                  name="lote"
                  value={formData.lote}
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
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
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
              <Link to="/referencias" className="btn btn-secondary">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferenciaForm; 