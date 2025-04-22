import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFranjaHoraria } from '../../services/api';
import Spinner from '../common/Spinner';

const FranjaHorariaView = () => {
  const { id } = useParams();
  const [franjaHoraria, setFranjaHoraria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFranjaHoraria = async () => {
      try {
        setLoading(true);
        const response = await getFranjaHoraria(id);
        setFranjaHoraria(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la franja horaria: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchFranjaHoraria();
  }, [id]);

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

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/franjas-horarias" className="btn btn-primary">
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (!franjaHoraria) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">No se encontró la franja horaria</div>
        <Link to="/franjas-horarias" className="btn btn-primary">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">Detalle de Franja Horaria</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3">
                <strong>ID:</strong> {franjaHoraria.id_franja}
              </div>
              <div className="mb-3">
                <strong>Hora de Inicio:</strong> {formatTime(franjaHoraria.hora_inicio)}
              </div>
              <div className="mb-3">
                <strong>Hora de Fin:</strong> {formatTime(franjaHoraria.hora_fin)}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <strong>Descripción:</strong> {franjaHoraria.descripcion}
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>{' '}
                <span className={`badge ${franjaHoraria.estado === 'activa' ? 'bg-success' : 'bg-danger'}`}>
                  {franjaHoraria.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <Link to="/franjas-horarias" className="btn btn-secondary">
              Volver a la lista
            </Link>
            <Link to={`/franjas-horarias/edit/${franjaHoraria.id_franja}`} className="btn btn-warning">
              Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranjaHorariaView; 