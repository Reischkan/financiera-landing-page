import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRegistroProduccion, deleteRegistroProduccion } from '../../services/api';
import Swal from 'sweetalert2';

const RegistroProduccionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        setLoading(true);
        const response = await getRegistroProduccion(id);
        setRegistro(response || {});
        setError(null);
      } catch (err) {
        console.error('Error al cargar el registro:', err);
        setError('No se pudo cargar la información del registro. Por favor, intente de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistro();
  }, [id]);

  const handleDelete = async () => {
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
        await deleteRegistroProduccion(id);
        
        Swal.fire(
          'Eliminado',
          'El registro ha sido eliminado correctamente',
          'success'
        ).then(() => {
          navigate('/registros-produccion');
        });
      }
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      Swal.fire(
        'Error',
        'No se pudo eliminar el registro',
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
        <Link to="/registros-produccion" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (!registro) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          No se encontró el registro solicitado.
        </div>
        <Link to="/registros-produccion" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Detalles del Registro de Producción</h1>
        <div>
          <Link to="/registros-produccion" className="btn btn-outline-secondary me-2">
            <i className="fas fa-arrow-left me-2"></i>
            Volver
          </Link>
          <Link 
            to={`/registros-produccion/new?moduloId=${registro.id_asignacion_modulo}&referenciaId=${registro.id_asignacion_referencia}`}
            className="btn btn-primary me-2"
          >
            <i className="fas fa-copy me-2"></i>
            Crear Registro Similar
          </Link>
          <Link 
            to={`/registros-produccion/edit/${registro.id_registro}`} 
            className="btn btn-warning me-2"
          >
            <i className="fas fa-edit me-2"></i>
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            <i className="fas fa-trash me-2"></i>
            Eliminar
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light">
              <h3 className="card-title mb-0">
                Información General
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>ID:</strong>
                      <span>{registro.id_registro}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Fecha:</strong>
                      <span>{formatDate(registro.fecha)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Minutos Producidos:</strong>
                      <span>{registro.minutos_producidos || '0'}</span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Franja Horaria:</strong>
                      <span>{registro.nombre_franja || registro.franja?.nombre || '-'}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Hora Inicio:</strong>
                      <span>{registro.franja?.hora_inicio || '-'}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Hora Fin:</strong>
                      <span>{registro.franja?.hora_fin || '-'}</span>
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
                <strong>Asignación ID:</strong> {registro.id_asignacion_modulo}
              </div>
              <div className="mb-3">
                <strong>Módulo:</strong> {registro.nombre_modulo || registro.modulo?.nombre || '-'}
              </div>
              <div className="mb-3">
                <strong>Persona:</strong> {registro.nombre_persona || registro.persona?.nombre || '-'}
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
                <strong>Asignación ID:</strong> {registro.id_asignacion_referencia}
              </div>
              <div className="mb-3">
                <strong>Código:</strong> {registro.codigo_referencia || registro.referencia?.codigo || '-'}
              </div>
              <div className="mb-3">
                <strong>Descripción:</strong> {registro.descripcion_referencia || registro.referencia?.descripcion || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {registro.observaciones && (
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h3 className="card-title mb-0">Observaciones</h3>
              </div>
              <div className="card-body">
                <p className="mb-0">{registro.observaciones}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroProduccionView; 