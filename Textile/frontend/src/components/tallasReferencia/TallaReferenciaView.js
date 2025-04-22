import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTallaReferencia } from '../../services/api';

const TallaReferenciaView = () => {
  const { id } = useParams();
  const [tallaReferencia, setTallaReferencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTallaReferencia = async () => {
      try {
        const response = await getTallaReferencia(id);
        setTallaReferencia(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de la talla de referencia. Por favor, intente de nuevo.');
        console.error('Error al cargar la talla de referencia:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTallaReferencia();
  }, [id]);

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/tallas-referencia" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  if (!tallaReferencia) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró la talla de referencia.
        </div>
        <Link to="/tallas-referencia" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalles de Talla de Referencia</h2>
        <div>
          <Link to="/tallas-referencia" className="btn btn-outline-secondary me-2">
            <i className="fas fa-arrow-left"></i> Volver a la lista
          </Link>
          <Link to="/" className="btn btn-outline-primary">
            <i className="fas fa-home"></i> Inicio
          </Link>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-info text-white">
          <h4>Información General</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-4">ID:</dt>
                <dd className="col-sm-8">{tallaReferencia.id_talla_referencia}</dd>
                
                <dt className="col-sm-4">Referencia:</dt>
                <dd className="col-sm-8">
                  {tallaReferencia.codigo_referencia || tallaReferencia.descripcion_referencia || 'N/A'}
                </dd>
                
                <dt className="col-sm-4">Talla:</dt>
                <dd className="col-sm-8">{tallaReferencia.talla}</dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row">
                <dt className="col-sm-4">Cantidad:</dt>
                <dd className="col-sm-8">{tallaReferencia.cantidad}</dd>
                
                <dt className="col-sm-4">Minutos Estimados:</dt>
                <dd className="col-sm-8">{tallaReferencia.minutos_estimados}</dd>
                
                <dt className="col-sm-4">Tiempo Total:</dt>
                <dd className="col-sm-8">
                  {tallaReferencia.cantidad * tallaReferencia.minutos_estimados} minutos
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {tallaReferencia.referencia && (
        <div className="card shadow">
          <div className="card-header bg-secondary text-white">
            <h4>Información de la Referencia</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-4">Código:</dt>
                  <dd className="col-sm-8">{tallaReferencia.referencia.codigo}</dd>
                  
                  <dt className="col-sm-4">Descripción:</dt>
                  <dd className="col-sm-8">{tallaReferencia.referencia.descripcion}</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-6">Estado:</dt>
                  <dd className="col-sm-6">
                    <span className={`badge ${tallaReferencia.referencia.estado === 'pendiente' ? 'bg-warning' : 
                      tallaReferencia.referencia.estado === 'en_proceso' ? 'bg-info' : 
                      tallaReferencia.referencia.estado === 'completado' ? 'bg-success' : 'bg-danger'}`}>
                      {tallaReferencia.referencia.estado}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex gap-2 mt-4">
        <Link to={`/tallas-referencia/edit/${tallaReferencia.id_talla_referencia}`} className="btn btn-warning">
          <i className="fas fa-edit"></i> Editar
        </Link>
        <Link to="/tallas-referencia" className="btn btn-primary">
          <i className="fas fa-list"></i> Ver todas las tallas
        </Link>
        {tallaReferencia.id_referencia && (
          <Link to={`/referencias/view/${tallaReferencia.id_referencia}`} className="btn btn-info">
            <i className="fas fa-tag"></i> Ver Referencia
          </Link>
        )}
      </div>
    </div>
  );
};

export default TallaReferenciaView; 