import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersona } from '../../services/api';

const PersonaView = () => {
  const { id } = useParams();
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const response = await getPersona(id);
        setPersona(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de la persona. Por favor, intente de nuevo.');
        console.error('Error al cargar la persona:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPersona();
  }, [id]);

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/personas" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          No se encontró la persona.
        </div>
        <Link to="/personas" className="btn btn-primary">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-info text-white">
          <h2>Detalles de la Persona</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h4>Información Personal</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-3">ID:</dt>
              <dd className="col-sm-9">{persona.id_persona}</dd>
              
              <dt className="col-sm-3">Nombre:</dt>
              <dd className="col-sm-9">{persona.nombre}</dd>
              
              <dt className="col-sm-3">Documento:</dt>
              <dd className="col-sm-9">{persona.documento}</dd>
              
              <dt className="col-sm-3">Minutos diarios:</dt>
              <dd className="col-sm-9">{persona.minutos_diarios_asignados}</dd>
              
              <dt className="col-sm-3">Fecha de ingreso:</dt>
              <dd className="col-sm-9">{new Date(persona.fecha_ingreso).toLocaleDateString()}</dd>
              
              <dt className="col-sm-3">Estado:</dt>
              <dd className="col-sm-9">
                <span className={`badge ${persona.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                  {persona.estado}
                </span>
              </dd>
            </dl>
          </div>
          
          <div className="d-flex gap-2">
            <Link to="/personas" className="btn btn-primary">
              <i className="fas fa-list"></i> Volver a la lista
            </Link>
            <Link to={`/personas/edit/${persona.id_persona}`} className="btn btn-warning">
              <i className="fas fa-edit"></i> Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaView; 