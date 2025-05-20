import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAusencias, deleteAusencia, getAusenciasPorFecha } from '../../services/api';

const AusenciasList = () => {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ausenciaToDelete, setAusenciaToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchAusencias();
  }, []);

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchAusencias = async () => {
    setLoading(true);
    try {
      const data = await getAusencias();
      if (Array.isArray(data)) {
        setAusencias(data);
      } else {
        showNotification('Error al cargar ausencias: Formato de datos incorrecto', 'danger');
        console.error('Datos recibidos incorrectos:', data);
      }
    } catch (error) {
      showNotification('Error al cargar ausencias', 'danger');
      console.error('Error al cargar ausencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = async (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) {
      showNotification('Por favor seleccione ambas fechas para filtrar', 'warning');
      return;
    }

    // Verificar que la fecha fin no sea menor que la fecha inicio
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      showNotification('La fecha de fin debe ser igual o posterior a la fecha de inicio', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await getAusenciasPorFecha(fechaInicio, fechaFin);
      if (Array.isArray(data)) {
        setAusencias(data);
        if (data.length === 0) {
          showNotification('No se encontraron ausencias en el rango de fechas seleccionado', 'info');
        } else {
          showNotification(`Se encontraron ${data.length} ausencias en el rango seleccionado`, 'success');
        }
      } else {
        showNotification('Error al filtrar ausencias: Formato de datos incorrecto', 'danger');
      }
    } catch (error) {
      showNotification('Error al filtrar ausencias por fecha', 'danger');
      console.error('Error al filtrar ausencias por fecha:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    fetchAusencias();
  };

  const confirmDelete = (ausencia) => {
    setAusenciaToDelete(ausencia);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!ausenciaToDelete) return;
    
    setLoading(true);
    try {
      await deleteAusencia(ausenciaToDelete.id_ausencia);
      setShowModal(false);
      showNotification('Ausencia eliminada correctamente');
      fetchAusencias();
    } catch (error) {
      showNotification('Error al eliminar la ausencia', 'danger');
      console.error('Error al eliminar ausencia:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fechas desde la API
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calcular días entre fechas
  const calcularDias = (fechaInicio, fechaFin) => {
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
    return diffDays;
  };

  // Determinar el estado de la ausencia (programada, en curso, finalizada)
  const getEstadoAusencia = (fechaInicio, fechaFin) => {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (hoy < inicio) {
      return { text: 'Programada', class: 'bg-primary' };
    } else if (hoy > fin) {
      return { text: 'Finalizada', class: 'bg-secondary' };
    } else {
      return { text: 'En curso', class: 'bg-warning text-dark' };
    }
  };

  return (
    <div className="container mt-4">
      {/* Notificación */}
      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-3`} 
             role="alert" style={{zIndex: 1050}}>
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({...notification, show: false})}></button>
        </div>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro que desea eliminar la ausencia de <strong>{ausenciaToDelete?.nombre_persona}</strong> del <strong>{formatDate(ausenciaToDelete?.fecha_inicio)}</strong> al <strong>{formatDate(ausenciaToDelete?.fecha_fin)}</strong>?</p>
                <p className="text-danger"><small>Esta acción no se puede deshacer.</small></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-trash me-1"></i> Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fas fa-calendar-minus me-2"></i>
            Gestión de Ausencias
          </h5>
          <span className="badge bg-light text-primary">
            {ausencias.length} {ausencias.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <Link to="/ausencias/nueva" className="btn btn-success w-100">
                <i className="fas fa-plus-circle me-1"></i> Nueva Ausencia
              </Link>
            </div>
            <div className="col-md-8">
              <form className="row g-3" onSubmit={handleFiltrar}>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-calendar"></i></span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="fechaInicio"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      placeholder="Fecha inicio"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-calendar"></i></span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="fechaFin"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      placeholder="Fecha fin"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-grid gap-2 d-md-flex">
                    <button type="submit" className="btn btn-primary flex-grow-1" disabled={loading}>
                      <i className="fas fa-search me-1"></i> Filtrar
                    </button>
                    {(fechaInicio || fechaFin) && (
                      <button type="button" className="btn btn-secondary" onClick={handleLimpiarFiltro} disabled={loading}>
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Persona</th>
                    <th scope="col">Fecha Inicio</th>
                    <th scope="col">Fecha Fin</th>
                    <th scope="col" className="text-center">Días</th>
                    <th scope="col">Motivo</th>
                    <th scope="col" className="text-center">Justificada</th>
                    <th scope="col" className="text-center">Estado</th>
                    <th scope="col" className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ausencias.length > 0 ? (
                    ausencias.map((ausencia) => {
                      const estado = getEstadoAusencia(ausencia.fecha_inicio, ausencia.fecha_fin);
                      return (
                        <tr key={ausencia.id_ausencia}>
                          <td>{ausencia.id_ausencia}</td>
                          <td>
                            <i className="fas fa-user me-1 text-secondary"></i>
                            {ausencia.nombre_persona}
                          </td>
                          <td>{formatDate(ausencia.fecha_inicio)}</td>
                          <td>{formatDate(ausencia.fecha_fin)}</td>
                          <td className="text-center">
                            <span className="badge bg-info">
                              {calcularDias(ausencia.fecha_inicio, ausencia.fecha_fin)}
                            </span>
                          </td>
                          <td>
                            <span title={ausencia.motivo} className="d-inline-block text-truncate" style={{maxWidth: "150px"}}>
                              {ausencia.motivo}
                            </span>
                          </td>
                          <td className="text-center">
                            {ausencia.justificada ? (
                              <span className="badge bg-success">
                                <i className="fas fa-check-circle me-1"></i> Sí
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                <i className="fas fa-times-circle me-1"></i> No
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            <span className={`badge ${estado.class}`}>
                              {estado.text}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to={`/ausencias/${ausencia.id_ausencia}`} className="btn btn-info" title="Ver detalles">
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link to={`/ausencias/editar/${ausencia.id_ausencia}`} className="btn btn-warning" title="Editar">
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button 
                                className="btn btn-danger" 
                                title="Eliminar"
                                onClick={() => confirmDelete(ausencia)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <p className="text-muted mb-0">
                          <i className="fas fa-info-circle me-1"></i>
                          No hay ausencias registradas
                        </p>
                        <Link to="/ausencias/nueva" className="btn btn-sm btn-outline-primary mt-2">
                          <i className="fas fa-plus-circle me-1"></i> Crear nueva ausencia
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer text-muted">
          <small>Última actualización: {new Date().toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
};

export default AusenciasList; 