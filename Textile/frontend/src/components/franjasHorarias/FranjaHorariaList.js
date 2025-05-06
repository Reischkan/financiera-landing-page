import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFranjasHorarias, deleteFranjaHoraria, actualizarEstadoFranjaHoraria } from '../../services/api';
import Spinner from '../common/Spinner';

const FranjaHorariaList = () => {
  const [franjasHorarias, setFranjasHorarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar franjas horarias al montar el componente
  useEffect(() => {
    loadFranjasHorarias();
  }, []);

  // Función para cargar las franjas horarias
  const loadFranjasHorarias = async () => {
    setLoading(true);
    try {
      const response = await getFranjasHorarias();
      // Asegurar que recibimos un array
      setFranjasHorarias(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las franjas horarias. Por favor, intente de nuevo.');
      console.error('Error al cargar las franjas horarias:', err);
      setFranjasHorarias([]); // Inicializar como array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una franja horaria
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta franja horaria?')) {
      try {
        await deleteFranjaHoraria(id);
        setSuccessMessage('Franja horaria eliminada correctamente');
        // Recargar la lista
        loadFranjasHorarias();
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError('Error al eliminar la franja horaria: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Función para cambiar el estado de una franja horaria
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'activa' ? 'inactiva' : 'activa';
      await actualizarEstadoFranjaHoraria(id, newStatus);
      setSuccessMessage(`Estado de la franja horaria actualizado a ${newStatus}`);
      // Recargar la lista
      loadFranjasHorarias();
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Error al actualizar el estado: ' + (err.response?.data?.message || err.message));
    }
  };

  // Formatear la hora (HH:MM)
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Si es un objeto Date o timestamp
    if (timeStr instanceof Date || !isNaN(new Date(timeStr).getTime())) {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    // Si ya es un string con formato HH:MM
    return timeStr;
  };

  return (
    <div className="container mt-4">
      {/* Encabezado y botones */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Franjas Horarias</h2>
        </div>
        <div className="d-flex">
          <Link to="/" className="btn btn-secondary me-2">
            Inicio
          </Link>
          <Link to="/franjas-horarias/new" className="btn btn-primary">
            Nueva Franja Horaria
          </Link>
        </div>
      </div>

      {/* Mensajes de éxito y error */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Spinner de carga */}
      {loading ? (
        <Spinner />
      ) : (
        /* Tabla de franjas horarias */
        <div className="table-responsive">
          {!Array.isArray(franjasHorarias) || franjasHorarias.length === 0 ? (
            <div className="alert alert-info">No hay franjas horarias disponibles.</div>
          ) : (
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {franjasHorarias.map((franja) => (
                  <tr key={franja.id_franja}>
                    <td>{franja.id_franja}</td>
                    <td>{formatTime(franja.hora_inicio)}</td>
                    <td>{formatTime(franja.hora_fin)}</td>
                    <td>{franja.descripcion}</td>
                    <td>
                      <span 
                        className={`badge ${franja.estado === 'activa' ? 'bg-success' : 'bg-danger'}`}
                      >
                        {franja.estado}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/franjas-horarias/${franja.id_franja}`} className="btn btn-sm btn-info me-1">
                          Ver
                        </Link>
                        <Link to={`/franjas-horarias/edit/${franja.id_franja}`} className="btn btn-sm btn-warning me-1">
                          Editar
                        </Link>
                        <button 
                          onClick={() => handleDelete(franja.id_franja)} 
                          className="btn btn-sm btn-danger me-1"
                        >
                          Eliminar
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(franja.id_franja, franja.estado)} 
                          className={`btn btn-sm ${franja.estado === 'activa' ? 'btn-secondary' : 'btn-success'}`}
                          title={`Cambiar a ${franja.estado === 'activa' ? 'inactiva' : 'activa'}`}
                        >
                          {franja.estado === 'activa' ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default FranjaHorariaList; 