import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getTallaReferencia, 
  createTallaReferencia, 
  updateTallaReferencia,
  getReferencias
} from '../../services/api';

const TallaReferenciaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    id_referencia: '',
    talla: '',
    cantidad: 0,
    minutos_estimados: 0
  });
  
  const [referencias, setReferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      setLoading(true);
      try {
        const referenciasRes = await getReferencias();
        setReferencias(referenciasRes.data);
      } catch (err) {
        setError('Error al cargar las referencias. Por favor, intente de nuevo.');
        console.error('Error al cargar referencias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDependencies();
  }, []);

  useEffect(() => {
    const fetchTallaReferencia = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const response = await getTallaReferencia(id);
          const tallaReferencia = response.data;
          
          setFormData({
            id_referencia: tallaReferencia.id_referencia,
            talla: tallaReferencia.talla,
            cantidad: tallaReferencia.cantidad,
            minutos_estimados: tallaReferencia.minutos_estimados
          });
        } catch (err) {
          setError('Error al cargar los datos de la talla de referencia. Por favor, intente de nuevo.');
          console.error('Error al cargar la talla de referencia:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTallaReferencia();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convertir a números los campos numéricos
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando datos:', formData);
      
      if (isEditing) {
        await updateTallaReferencia(id, formData);
      } else {
        await createTallaReferencia(formData);
      }
      navigate('/tallas-referencia');
    } catch (err) {
      console.error('Error completo:', err);
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} la talla de referencia: ${err.response?.data?.message || err.message}`);
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
        <h2>{isEditing ? 'Editar' : 'Crear'} Talla de Referencia</h2>
        <div>
          <Link to="/tallas-referencia" className="btn btn-outline-secondary me-2">
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
              <label htmlFor="id_referencia" className="form-label">Referencia *</label>
              <select 
                className="form-select" 
                id="id_referencia" 
                name="id_referencia" 
                value={formData.id_referencia} 
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una referencia</option>
                {referencias.map(referencia => (
                  <option key={referencia.id_referencia} value={referencia.id_referencia}>
                    {referencia.codigo} - {referencia.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="talla" className="form-label">Talla *</label>
              <input 
                type="text" 
                className="form-control" 
                id="talla" 
                name="talla" 
                value={formData.talla} 
                onChange={handleChange}
                required
                maxLength="10"
              />
              <small className="text-muted">Máximo 10 caracteres</small>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="cantidad" className="form-label">Cantidad *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="cantidad" 
                  name="cantidad" 
                  value={formData.cantidad} 
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="minutos_estimados" className="form-label">Minutos Estimados *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="minutos_estimados" 
                  name="minutos_estimados" 
                  value={formData.minutos_estimados} 
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  `${isEditing ? 'Actualizar' : 'Crear'} Talla de Referencia`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TallaReferenciaForm; 