import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReferencias, deleteReferencia } from '../../services/api';

const ReferenciasList = () => {
  const [referencias, setReferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadReferencias();
  }, []);

  const loadReferencias = async () => {
    setLoading(true);
    try {
      const response = await getReferencias();
      setReferencias(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las referencias. Por favor, intente de nuevo.');
      console.error('Error al cargar las referencias:', err);
      setReferencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('ID de referencia no válido');
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar esta referencia?')) {
      try {
        await deleteReferencia(id);
        setMessage('Referencia eliminada exitosamente');
        loadReferencias();
      } catch (err) {
        setError('Error al eliminar la referencia. Por favor, intente de nuevo.');
        console.error('Error al eliminar la referencia:', err);
      }
    }
  };

  // Función segura para formatear tiempo en minutos
  const formatMinutos = (minutos) => {
    if (minutos === undefined || minutos === null) return '-';
    if (isNaN(parseFloat(minutos))) return '-';
    return `${minutos} min`;
  };

  // Función para obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    if (!estado) return 'bg-secondary';
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-warning';
      case 'en_proceso':
      case 'en proceso':
        return 'bg-info';
      case 'completado':
        return 'bg-success';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Referencias</h2>
        <Link to="/referencias/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Nueva Referencia
        </Link>
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

      {!Array.isArray(referencias) || referencias.length === 0 ? (
        <div className="alert alert-info">No hay referencias disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Tiempo Est. Unidad</th>
                <th>Tiempo Total Est.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {referencias.map((referencia) => (
                <tr key={referencia?.id_referencia || `unknown-${Math.random()}`}>
                  <td>{referencia?.id_referencia || '-'}</td>
                  <td>{referencia?.codigo || '-'}</td>
                  <td>{referencia?.descripcion || '-'}</td>
                  <td>{formatMinutos(referencia?.tiempo_estimado_unidad)}</td>
                  <td>{formatMinutos(referencia?.tiempo_total_estimado)}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(referencia?.estado)}`}>
                      {referencia?.estado || 'desconocido'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/referencias/view/${referencia?.id_referencia}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/referencias/edit/${referencia?.id_referencia}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(referencia?.id_referencia)}
                        disabled={!referencia?.id_referencia}
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

export default ReferenciasList; 