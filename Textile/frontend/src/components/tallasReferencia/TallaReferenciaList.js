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
      setTallas(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tallas de referencia. Por favor, intente de nuevo.');
      console.error('Error al cargar las tallas de referencia:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
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

      {tallas.length === 0 ? (
        <div className="alert alert-info">No hay tallas de referencia disponibles.</div>
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
                <tr key={talla.id_talla_referencia}>
                  <td>{talla.id_talla_referencia}</td>
                  <td>{talla.codigo_referencia || talla.descripcion_referencia}</td>
                  <td>{talla.talla}</td>
                  <td>{talla.cantidad}</td>
                  <td>{talla.minutos_estimados}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/tallas-referencia/view/${talla.id_talla_referencia}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/tallas-referencia/edit/${talla.id_talla_referencia}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(talla.id_talla_referencia)}
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