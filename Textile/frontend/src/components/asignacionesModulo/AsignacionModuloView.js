import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAsignacionModulo, desasignarPersona } from '../../services/api';

const AsignacionModuloView = () => {
  const { id } = useParams();
  const [asignacion, setAsignacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAsignacion = async () => {
      try {
        const response = await getAsignacionModulo(id);
        setAsignacion(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de la asignación. Por favor, intente de nuevo.');
        console.error('Error al cargar la asignación:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAsignacion();
  }, [id]);

  const handleDesasignar = async () => {
    if (window.confirm('¿Está seguro de que desea desasignar a esta persona del módulo?')) {
      try {
        await desasignarPersona(id);
        setMessage('Persona desasignada exitosamente');
        // Actualizar la información
        const response = await getAsignacionModulo(id);
        setAsignacion(response.data);
      } catch (err) {
        setError('Error al desasignar a la persona. Por favor, intente de nuevo.');
        console.error('Error al desasignar a la persona:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/asignaciones-modulo" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  if (!asignacion) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró la asignación.
        </div>
        <Link to="/asignaciones-modulo" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
          <button type="button" className="btn-close float-end" onClick={() => setMessage('')}></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h2>Detalles de la Asignación</h2>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <h4>Información General</h4>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-4">ID:</dt>
                  <dd className="col-sm-8">{asignacion.id_asignacion}</dd>
                  
                  <dt className="col-sm-4">Módulo:</dt>
                  <dd className="col-sm-8">{asignacion.nombre_modulo}</dd>
                  
                  <dt className="col-sm-4">Persona:</dt>
                  <dd className="col-sm-8">{asignacion.nombre_persona}</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-4">Documento:</dt>
                  <dd className="col-sm-8">{asignacion.documento || 'N/A'}</dd>
                  
                  <dt className="col-sm-4">Estado:</dt>
                  <dd className="col-sm-8">
                    <span className={`badge ${asignacion.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                      {asignacion.estado}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4>Información de Fechas</h4>
            <hr />
            <div className="row">
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-6">Fecha de Asignación:</dt>
                  <dd className="col-sm-6">{new Date(asignacion.fecha_asignacion).toLocaleString()}</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <dl className="row">
                  <dt className="col-sm-6">Fecha de Desasignación:</dt>
                  <dd className="col-sm-6">
                    {asignacion.fecha_desasignacion 
                      ? new Date(asignacion.fecha_desasignacion).toLocaleString() 
                      : 'No desasignado'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <Link to="/asignaciones-modulo" className="btn btn-primary">
              <i className="fas fa-list"></i> Volver a la lista
            </Link>
            <Link to={`/asignaciones-modulo/edit/${asignacion.id_asignacion}`} className="btn btn-warning">
              <i className="fas fa-edit"></i> Editar
            </Link>
            {asignacion.estado === 'activo' && (
              <button className="btn btn-secondary" onClick={handleDesasignar}>
                <i className="fas fa-user-minus"></i> Desasignar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Acciones Relacionadas */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4>Acciones Relacionadas</h4>
        </div>
        <div className="card-body">
          <div className="d-flex gap-3">
            <Link 
              to={`/registros-produccion/new?moduloId=${asignacion.id_asignacion}`}
              className="btn btn-primary"
            >
              <i className="fas fa-plus-circle me-2"></i>
              Crear Registro de Producción
            </Link>
            
            <Link 
              to={`/registros-produccion`}
              className="btn btn-info"
            >
              <i className="fas fa-clipboard-list me-2"></i>
              Ver Registros de Producción
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignacionModuloView; 