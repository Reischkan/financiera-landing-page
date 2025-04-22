import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModulo } from '../../services/api';

const ModuloView = () => {
  const { id } = useParams();
  const [modulo, setModulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModulo = async () => {
      try {
        const response = await getModulo(id);
        setModulo(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos del módulo. Por favor, intente de nuevo.');
        console.error('Error al cargar el módulo:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModulo();
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
        <Link to="/modulos" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  if (!modulo) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró el módulo.
        </div>
        <Link to="/modulos" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>Detalles del Módulo</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h4>Información General</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-3">ID:</dt>
              <dd className="col-sm-9">{modulo.id_modulo}</dd>
              
              <dt className="col-sm-3">Nombre:</dt>
              <dd className="col-sm-9">{modulo.nombre}</dd>
              
              <dt className="col-sm-3">Estado:</dt>
              <dd className="col-sm-9">
                <span className={`badge ${modulo.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                  {modulo.estado}
                </span>
              </dd>
              
              <dt className="col-sm-3">Fecha de Creación:</dt>
              <dd className="col-sm-9">{new Date(modulo.fecha_creacion).toLocaleDateString()}</dd>
            </dl>
          </div>
          
          <div className="d-flex gap-2">
            <Link to="/modulos" className="btn btn-primary">
              <i className="fas fa-list"></i> Volver a la lista
            </Link>
            <Link to={`/modulos/edit/${modulo.id_modulo}`} className="btn btn-warning">
              <i className="fas fa-edit"></i> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuloView; 