import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPersonas, deletePersona } from '../../services/api';

const PersonasList = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const response = await getPersonas();
      setPersonas(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las personas. Por favor, intente de nuevo.');
      console.error('Error al cargar las personas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta persona?')) {
      try {
        await deletePersona(id);
        setMessage('Persona eliminada exitosamente');
        loadPersonas();
      } catch (err) {
        setError('Error al eliminar la persona. Por favor, intente de nuevo.');
        console.error('Error al eliminar la persona:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Personas</h2>
        <Link to="/personas/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Nueva Persona
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

      {personas.length === 0 ? (
        <div className="alert alert-info">No hay personas disponibles.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Minutos Diarios</th>
                <th>Fecha Ingreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona) => (
                <tr key={persona.id_persona}>
                  <td>{persona.id_persona}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.documento}</td>
                  <td>{persona.minutos_diarios_asignados}</td>
                  <td>{new Date(persona.fecha_ingreso).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${persona.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                      {persona.estado}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/personas/view/${persona.id_persona}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/personas/edit/${persona.id_persona}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(persona.id_persona)}
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

export default PersonasList; 