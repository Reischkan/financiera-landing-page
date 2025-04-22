import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAsignacionesModulo, deleteAsignacionModulo, desasignarPersona } from '../../services/api';

const AsignacionModuloList = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAsignaciones();
  }, []);

  const loadAsignaciones = async () => {
    setLoading(true);
    try {
      const response = await getAsignacionesModulo();
      setAsignaciones(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las asignaciones. Por favor, intente de nuevo.');
      console.error('Error al cargar las asignaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      try {
        await deleteAsignacionModulo(id);
        setMessage('Asignación eliminada exitosamente');
        loadAsignaciones();
      } catch (err) {
        setError('Error al eliminar la asignación. Por favor, intente de nuevo.');
        console.error('Error al eliminar la asignación:', err);
      }
    }
  };

  const handleDesasignar = async (id) => {
    if (window.confirm('¿Está seguro de que desea desasignar a esta persona del módulo?')) {
      try {
        await desasignarPersona(id);
        setMessage('Persona desasignada exitosamente');
        loadAsignaciones();
      } catch (err) {
        setError('Error al desasignar a la persona. Por favor, intente de nuevo.');
        console.error('Error al desasignar a la persona:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Asignaciones de Personas a Módulos</h2>
        <div>
          <Link to="/" className="btn btn-outline-primary me-2">
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link to="/asignaciones-modulo/create" className="btn btn-primary">
            <i className="fas fa-plus"></i> Nueva Asignación
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

      {asignaciones.length === 0 ? (
        <div className="alert alert-info">No hay asignaciones disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Módulo</th>
                <th>Persona</th>
                <th>Fecha Asignación</th>
                <th>Fecha Desasignación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id_asignacion}>
                  <td>{asignacion.id_asignacion}</td>
                  <td>{asignacion.nombre_modulo}</td>
                  <td>{asignacion.nombre_persona}</td>
                  <td>{new Date(asignacion.fecha_asignacion).toLocaleDateString()}</td>
                  <td>
                    {asignacion.fecha_desasignacion 
                      ? new Date(asignacion.fecha_desasignacion).toLocaleDateString() 
                      : '-'}
                  </td>
                  <td>
                    <span className={`badge ${asignacion.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                      {asignacion.estado}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/asignaciones-modulo/view/${asignacion.id_asignacion}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/asignaciones-modulo/edit/${asignacion.id_asignacion}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      {asignacion.estado === 'activo' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDesasignar(asignacion.id_asignacion)}
                          title="Desasignar Persona"
                        >
                          <i className="fas fa-user-minus"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(asignacion.id_asignacion)}
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

export default AsignacionModuloList; 