import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReferencia, getTallasPorReferencia } from '../../services/api';

const ReferenciaView = () => {
  const { id } = useParams();
  const [referencia, setReferencia] = useState(null);
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferencia = async () => {
      try {
        const response = await getReferencia(id);
        setReferencia(response.data);
        setError(null);
        
        // Obtener tallas de la referencia
        try {
          const tallasResponse = await getTallasPorReferencia(id);
          setTallas(tallasResponse.data);
        } catch (tallasErr) {
          console.error('Error al cargar tallas de la referencia:', tallasErr);
        }
      } catch (err) {
        setError('Error al cargar los datos de la referencia. Por favor, intente de nuevo.');
        console.error('Error al cargar la referencia:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferencia();
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
        <Link to="/referencias" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  if (!referencia) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró la referencia.
        </div>
        <Link to="/referencias" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h2>Detalles de la Referencia</h2>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <h4>Información General</h4>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-4">ID:</dt>
                  <dd className="col-sm-8">{referencia.id_referencia}</dd>
                  
                  <dt className="col-sm-4">Código:</dt>
                  <dd className="col-sm-8">{referencia.codigo}</dd>
                  
                  <dt className="col-sm-4">Descripción:</dt>
                  <dd className="col-sm-8">{referencia.descripcion}</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-4">Serial:</dt>
                  <dd className="col-sm-8">{referencia.serial || 'N/A'}</dd>
                  
                  <dt className="col-sm-4">Lote:</dt>
                  <dd className="col-sm-8">{referencia.lote || 'N/A'}</dd>
                  
                  <dt className="col-sm-4">Estado:</dt>
                  <dd className="col-sm-8">
                    <span className={`badge ${referencia.estado === 'pendiente' ? 'bg-warning' : 
                      referencia.estado === 'en_proceso' ? 'bg-info' : 
                      referencia.estado === 'completado' ? 'bg-success' : 'bg-danger'}`}>
                      {referencia.estado}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4>Información de Tiempos</h4>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-6">Tiempo Est. por Unidad:</dt>
                  <dd className="col-sm-6">{referencia.tiempo_estimado_unidad} minutos</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-6">Tiempo Total Estimado:</dt>
                  <dd className="col-sm-6">{referencia.tiempo_total_estimado} minutos</dd>
                </dl>
              </div>
            </div>
          </div>

          {tallas.length > 0 && (
            <div className="mb-4">
              <h4>Tallas</h4>
              <hr />
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Talla</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tallas.map((talla) => (
                      <tr key={talla.id_talla_referencia}>
                        <td>{talla.id_talla_referencia}</td>
                        <td>{talla.talla}</td>
                        <td>{talla.cantidad}</td>
                        <td>
                          <span className={`badge ${talla.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                            {talla.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="d-flex gap-2">
            <Link to="/referencias" className="btn btn-primary">
              <i className="fas fa-list"></i> Volver a la lista
            </Link>
            <Link to={`/referencias/edit/${referencia.id_referencia}`} className="btn btn-warning">
              <i className="fas fa-edit"></i> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenciaView; 