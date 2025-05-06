import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTallasReferencia, deleteTallaReferencia } from '../../services/api';

const TallaReferenciaList = () => {
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTallas();
  }, []);

  const loadTallas = async () => {
    setLoading(true);
    try {
      const response = await getTallasReferencia();
      setTallas(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tallas. Por favor, intente de nuevo.');
      console.error('Error al cargar las tallas:', err);
      setTallas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('ID de talla no válido');
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar esta talla de referencia?')) {
      try {
        await deleteTallaReferencia(id);
        setMessage('Talla de referencia eliminada exitosamente');
        loadTallas();
      } catch (err) {
        setError('Error al eliminar la talla de referencia. Por favor, intente de nuevo.');
        console.error('Error al eliminar la talla de referencia:', err);
      }
    }
  };

  // Función para mostrar información de referencia de forma segura
  const getReferenciaInfo = (talla) => {
    if (!talla) return '-';
    
    const codigo = talla.codigo_referencia || '';
    const descripcion = talla.descripcion_referencia || '';
    
    if (!codigo && !descripcion) return '-';
    return codigo ? (descripcion ? `${codigo} - ${descripcion}` : codigo) : descripcion;
  };

  // Función para formatear número de forma segura
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '-';
    if (isNaN(parseFloat(value))) return '-';
    return value.toString();
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tallas de Referencias</h2>
        <div>
          <Link to="/" className="btn btn-outline-primary me-2">
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link to="/tallas-referencia/create" className="btn btn-primary">
            <i className="fas fa-plus"></i> Nueva Talla
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
          <button type="button" className="btn-close float-end" onClick={() => setMessage('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
        </div>
      )}

      {!Array.isArray(tallas) || tallas.length === 0 ? (
        <div className="alert alert-info">No hay tallas disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Referencia</th>
                <th>Talla</th>
                <th>Cantidad</th>
                <th>Minutos Estimados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tallas.map((talla) => (
                <tr key={talla?.id_talla_referencia || `unknown-${Math.random()}`}>
                  <td>{talla?.id_talla_referencia || '-'}</td>
                  <td>{getReferenciaInfo(talla)}</td>
                  <td>{talla?.talla || '-'}</td>
                  <td>{formatNumber(talla?.cantidad)}</td>
                  <td>{formatNumber(talla?.minutos_estimados)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/tallas-referencia/view/${talla?.id_talla_referencia}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/tallas-referencia/edit/${talla?.id_talla_referencia}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(talla?.id_talla_referencia)}
                        disabled={!talla?.id_talla_referencia}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TallaReferenciaList; 