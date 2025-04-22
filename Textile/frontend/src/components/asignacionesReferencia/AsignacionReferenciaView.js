import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { getAsignacionReferencia, completarAsignacionReferencia } from '../../services/api';
import Swal from 'sweetalert2';

const AsignacionReferenciaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asignacion, setAsignacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const fetchAsignacion = async () => {
      try {
        setLoading(true);
        const response = await getAsignacionReferencia(id);
        setAsignacion(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar la asignación:', err);
        setError('No se pudo cargar la información de la asignación. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsignacion();
  }, [id]);

  const handleCompletar = async () => {
    const result = await Swal.fire({
      title: '¿Marcar como completada?',
      text: "Esta acción registrará la asignación como completada y actualizará su estado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setProcesando(true);
        await completarAsignacionReferencia(id);
        
        // Recargar los datos
        const response = await getAsignacionReferencia(id);
        setAsignacion(response.data);
        
        Swal.fire(
          'Completada',
          'La asignación ha sido marcada como completada exitosamente.',
          'success'
        );
      } catch (error) {
        console.error('Error al completar la asignación:', error);
        Swal.fire(
          'Error',
          'No se pudo completar la asignación. Por favor, intente de nuevo.',
          'error'
        );
      } finally {
        setProcesando(false);
      }
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

  // Función para obtener la clase del badge según el estado
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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <Link to="/asignaciones-referencia" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (!asignacion) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          No se encontró la asignación solicitada.
        </div>
        <Link to="/asignaciones-referencia" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Detalles de Asignación de Referencia</h1>
        <div>
          <Link to="/asignaciones-referencia" className="btn btn-outline-secondary me-2">
            <i className="fas fa-arrow-left me-2"></i>
            Volver
          </Link>
          {asignacion.estado?.toLowerCase() !== 'completado' && (
            <>
              <Link 
                to={`/asignaciones-referencia/edit/${asignacion.id_asignacion_referencia}`} 
                className="btn btn-warning me-2"
              >
                <i className="fas fa-edit me-2"></i>
                Editar
              </Link>
              <button 
                className="btn btn-success"
                onClick={handleCompletar}
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle me-2"></i>
                    Marcar como Completada
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h3 className="card-title mb-0">
                Información General
                <span className={`badge ms-2 ${getBadgeClass(asignacion.estado)}`}>
                  {asignacion.estado || 'No definido'}
                </span>
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>ID:</strong>
                      <span>{asignacion.id_asignacion_referencia}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Fecha de Asignación:</strong>
                      <span>{formatDate(asignacion.fecha_asignacion)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Fecha de Inicio:</strong>
                      <span>{formatDate(asignacion.fecha_inicio)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Fecha de Finalización:</strong>
                      <span>{formatDate(asignacion.fecha_final)}</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Porcentaje de Avance:</strong>
                      <span>{asignacion.porcentaje_avance || 0}%</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Minutos Producidos:</strong>
                      <span>{asignacion.minutos_producidos || 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Minutos Restantes:</strong>
                      <span>{asignacion.minutos_restantes || 0}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Estado:</strong>
                      <span className={`badge ${getBadgeClass(asignacion.estado)}`}>
                        {asignacion.estado || 'No definido'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h3 className="card-title mb-0">Información del Módulo</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>ID del Módulo:</strong> {asignacion.id_modulo}
              </div>
              <div className="mb-3">
                <strong>Nombre:</strong> {asignacion.nombre_modulo || '-'}
              </div>
              <div className="text-end">
                <Link 
                  to={`/modulos/view/${asignacion.id_modulo}`} 
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="fas fa-info-circle me-1"></i>
                  Ver Detalles del Módulo
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h3 className="card-title mb-0">Información de la Referencia</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>ID de la Referencia:</strong> {asignacion.id_referencia}
              </div>
              <div className="mb-3">
                <strong>Código:</strong> {asignacion.codigo || '-'}
              </div>
              <div className="mb-3">
                <strong>Descripción:</strong> {asignacion.descripcion || '-'}
              </div>
              <div className="mb-3">
                <strong>Tiempo Total Estimado (min):</strong> {asignacion.tiempo_total_estimado || '-'}
              </div>
              <div className="text-end">
                <Link 
                  to={`/referencias/view/${asignacion.id_referencia}`} 
                  className="btn btn-outline-info btn-sm"
                >
                  <i className="fas fa-info-circle me-1"></i>
                  Ver Detalles de la Referencia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {asignacion.comentarios && (
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h3 className="card-title mb-0">Comentarios</h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  {asignacion.comentarios || 'No hay comentarios disponibles.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignacionReferenciaView; 