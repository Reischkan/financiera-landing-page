import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getModulos, deleteModulo } from '../../services/api';

const ModulosList = () => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadModulos();
  }, []);

  const loadModulos = async () => {
    setLoading(true);
    try {
      const response = await getModulos();
      setModulos(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los módulos. Por favor, intente de nuevo.');
      console.error('Error al cargar los módulos:', err);
      setModulos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('ID de módulo no válido');
      return;
    }

    if (window.confirm('¿Está seguro de que desea eliminar este módulo?')) {
      try {
        await deleteModulo(id);
        setMessage('Módulo eliminado exitosamente');
        loadModulos();
      } catch (err) {
        setError('Error al eliminar el módulo. Por favor, intente de nuevo.');
        console.error('Error al eliminar el módulo:', err);
      }
    }
  };

  // Función segura para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '-';
    }
  };

  // Función para obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    if (!estado) return 'bg-secondary';
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'inactivo':
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
        <h2>Lista de Módulos</h2>
        <Link to="/modulos/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Nuevo Módulo
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

      {!Array.isArray(modulos) || modulos.length === 0 ? (
        <div className="alert alert-info">No hay módulos disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modulos.map((modulo) => (
                <tr key={modulo?.id_modulo || `unknown-${Math.random()}`}>
                  <td>{modulo?.id_modulo || '-'}</td>
                  <td>{modulo?.nombre || '-'}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(modulo?.estado)}`}>
                      {modulo?.estado || 'desconocido'}
                    </span>
                  </td>
                  <td>{formatDate(modulo?.fecha_creacion)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/modulos/view/${modulo?.id_modulo}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/modulos/edit/${modulo?.id_modulo}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(modulo?.id_modulo)}
                        disabled={!modulo?.id_modulo}
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

export default ModulosList; 