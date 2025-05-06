import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrosProduccion, deleteRegistroProduccion } from '../../services/api';
import Swal from 'sweetalert2';

const RegistroProduccionList = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      console.log('Solicitando registros de producción al servidor...');
      const response = await getRegistrosProduccion();
      console.log('Respuesta recibida:', response);
      
      // Ensure we handle both array and non-array responses safely
      setRegistros(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error('Error detallado al cargar registros de producción:', err);
      
      // Create a more specific error message based on the error details
      let errorMessage = 'No se pudieron cargar los registros de producción. Por favor, intente de nuevo.';
      
      if (err.message) {
        errorMessage = `Error: ${err.message}`;
      } else if (err.data && err.data.message) {
        errorMessage = `Error: ${err.data.message}`;
      } else if (err.status) {
        errorMessage = `Error del servidor: ${err.status}`;
      } else if (err.type === 'networkError') {
        errorMessage = 'Error de conexión: No se pudo contactar al servidor.';
      }
      
      setError(errorMessage);
      setRegistros([]);
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
        await deleteRegistroProduccion(id);
        setRegistros(registros.filter(registro => registro.id_registro !== id));
        setSuccessMessage('Registro eliminado correctamente');
        
        // Mostrar mensaje de éxito y ocultarlo después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error al eliminar registro:', err);
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Registros de Producción</h1>
        </div>
        <div className="d-flex">
          <Link to="/" className="btn btn-outline-secondary me-2">
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link to="/registros-produccion/new" className="btn btn-primary">
            <i className="fas fa-plus"></i> Nuevo Registro
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
      ) : !Array.isArray(registros) || registros.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-inbox fa-3x mb-3 text-muted"></i>
            <h5>No hay registros de producción</h5>
            <p className="text-muted">¡Comience creando un nuevo registro!</p>
            <Link to="/registros-produccion/new" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Crear Nuevo Registro
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
                <th>Franja Horaria</th>
                <th>Minutos Producidos</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(registro => (
                <tr key={registro.id_registro}>
                  <td>{registro.id_registro}</td>
                  <td>{registro.nombre_modulo || '-'}</td>
                  <td>{registro.codigo_referencia || '-'}</td>
                  <td>{formatDate(registro.fecha)}</td>
                  <td>{registro.nombre_franja || registro.descripcion_franja || '-'}</td>
                  <td>{registro.minutos_producidos || '0'}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <Link 
                        to={`/registros-produccion/view/${registro.id_registro}`} 
                        className="btn btn-sm btn-info"
                        title="Ver detalles"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link 
                        to={`/registros-produccion/edit/${registro.id_registro}`} 
                        className="btn btn-sm btn-warning"
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => handleDelete(registro.id_registro)} 
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

export default RegistroProduccionList; 