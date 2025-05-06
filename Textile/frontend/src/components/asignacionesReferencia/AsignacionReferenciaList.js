import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAsignacionesReferencia, deleteAsignacionReferencia } from '../../services/api';
import Swal from 'sweetalert2';

const AsignacionReferenciaList = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAsignaciones();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      setLoading(true);
      const response = await getAsignacionesReferencia();
      setAsignaciones(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar asignaciones:', err);
      setError('No se pudieron cargar las asignaciones. Por favor, intente de nuevo.');
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await deleteAsignacionReferencia(id);
        setAsignaciones(asignaciones.filter(asignacion => asignacion.id_asignacion_referencia !== id));
        setSuccessMessage('Asignación eliminada correctamente');
        
        // Mostrar mensaje de éxito y ocultarlo después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error al eliminar asignación:', err);
      Swal.fire(
        'Error',
        'No se pudo eliminar la asignación',
        'error'
      );
    }
  };

  // Formatear fechas de forma simple
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  // Devolver la clase de badge según el estado
  const getBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'completado':
        return 'bg-primary';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Asignaciones de Referencias</h1>
        </div>
        <div className="d-flex">
          <Link to="/" className="btn btn-outline-secondary me-2">
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link to="/asignaciones-referencia/new" className="btn btn-primary">
            <i className="fas fa-plus"></i> Nueva Asignación
          </Link>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : !asignaciones || asignaciones.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
            <h5>No hay asignaciones registradas</h5>
            <p className="text-muted">¡Comience creando una nueva asignación!</p>
            <Link to="/asignaciones-referencia/new" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Crear Nueva Asignación
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Módulo</th>
                <th>Referencia</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map(asignacion => (
                <tr key={asignacion.id_asignacion_referencia}>
                  <td>{asignacion.id_asignacion_referencia}</td>
                  <td>{asignacion.nombre_modulo || asignacion.modulo?.nombre || '-'}</td>
                  <td>
                    {asignacion.codigo_referencia || asignacion.referencia?.codigo || '-'}
                    {asignacion.descripcion_referencia || asignacion.referencia?.descripcion 
                      ? ` - ${asignacion.descripcion_referencia || asignacion.referencia?.descripcion}` 
                      : ''}
                  </td>
                  <td>{formatDate(asignacion.fecha_asignacion)}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(asignacion.estado)}`}>
                      {asignacion.estado || 'No definido'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <Link 
                        to={`/asignaciones-referencia/view/${asignacion.id_asignacion_referencia}`} 
                        className="btn btn-sm btn-info"
                        title="Ver detalles"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link 
                        to={`/asignaciones-referencia/edit/${asignacion.id_asignacion_referencia}`} 
                        className="btn btn-sm btn-warning"
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => handleDelete(asignacion.id_asignacion_referencia)} 
                        className="btn btn-sm btn-danger"
                        title="Eliminar"
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

export default AsignacionReferenciaList; 