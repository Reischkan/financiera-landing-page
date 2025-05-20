import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAusencia, deleteAusencia, getPersona } from '../../services/api';

const AusenciaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ausencia, setAusencia] = useState(null);
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ausenciaData = await getAusencia(id);
        if (!ausenciaData) {
          alert('No se encontró la ausencia');
          navigate('/ausencias');
          return;
        }
        
        setAusencia(ausenciaData);
        
        // Cargar datos completos de la persona
        if (ausenciaData.id_persona) {
          const personaData = await getPersona(ausenciaData.id_persona);
          if (personaData) {
            setPersona(personaData);
          }
        }
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos de la ausencia');
        navigate('/ausencias');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de eliminar esta ausencia?')) {
      setDeleting(true);
      try {
        await deleteAusencia(id);
        alert('Ausencia eliminada correctamente');
        navigate('/ausencias');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la ausencia');
      } finally {
        setDeleting(false);
      }
    }
  };

  // Formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calcular duración en días
  const calcularDias = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
  };
  
  // Determinar estado actual de la ausencia
  const getEstadoAusencia = (fechaInicio, fechaFin) => {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (hoy < inicio) {
      return { texto: 'Programada', clase: 'bg-primary' };
    } else if (hoy > fin) {
      return { texto: 'Finalizada', clase: 'bg-secondary' };
    } else {
      return { texto: 'En curso', clase: 'bg-warning text-dark' };
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!ausencia) {
    return null;
  }

  const diasAusencia = calcularDias(ausencia.fecha_inicio, ausencia.fecha_fin);
  const estadoAusencia = getEstadoAusencia(ausencia.fecha_inicio, ausencia.fecha_fin);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="card-title mb-0">Detalle de Ausencia</h5>
          <Link to="/ausencias" className="btn btn-sm btn-light">
            <i className="fas fa-arrow-left me-1"></i> Volver
          </Link>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th className="bg-light" style={{width: '25%'}}>ID Ausencia</th>
                      <td>{ausencia.id_ausencia}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Persona</th>
                      <td>
                        <i className="fas fa-user me-1"></i> {ausencia.nombre_persona}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-light">Fecha Inicio</th>
                      <td>
                        <i className="fas fa-calendar me-1"></i> {formatDate(ausencia.fecha_inicio)}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-light">Fecha Fin</th>
                      <td>
                        <i className="fas fa-calendar me-1"></i> {formatDate(ausencia.fecha_fin)}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-light">Duración</th>
                      <td>{diasAusencia} {diasAusencia === 1 ? 'día' : 'días'}</td>
                    </tr>
                    <tr>
                      <th className="bg-light">Justificada</th>
                      <td>
                        {ausencia.justificada === 1 || ausencia.justificada === true ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check-circle me-1"></i> Sí
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="fas fa-times-circle me-1"></i> No
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-light">Motivo</th>
                      <td>{ausencia.motivo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {persona && (
                <div className="mt-4">
                  <h6 className="border-bottom pb-2">Información de la Persona</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th className="bg-light" style={{width: '25%'}}>Documento</th>
                          <td>{persona.documento}</td>
                        </tr>
                        <tr>
                          <th className="bg-light">Fecha Ingreso</th>
                          <td>{formatDate(persona.fecha_ingreso)}</td>
                        </tr>
                        <tr>
                          <th className="bg-light">Minutos Diarios</th>
                          <td>{persona.minutos_diarios_asignados}</td>
                        </tr>
                        <tr>
                          <th className="bg-light">Estado</th>
                          <td>
                            <span className={`badge ${persona.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                              {persona.estado}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-4">
              <div className="mb-4">
                <div className="d-grid gap-2">
                  <Link to={`/ausencias/editar/${ausencia.id_ausencia}`} className="btn btn-warning">
                    <i className="fas fa-edit me-1"></i> Editar
                  </Link>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash-alt me-1"></i> Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-header bg-light">
                  <h6 className="card-title mb-0">Información Adicional</h6>
                </div>
                <div className="card-body">
                  <p><strong>Registrado por:</strong> Sistema</p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={`badge ${estadoAusencia.clase}`}>
                      {estadoAusencia.texto}
                    </span>
                  </p>
                  <p><strong>Fecha creación:</strong> {formatDate(new Date())}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AusenciaView; 