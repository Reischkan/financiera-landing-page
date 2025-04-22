import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron bg-light p-5 rounded shadow-sm">
        <h1 className="display-4">Sistema de Gestión Textile</h1>
        <p className="lead">
          Bienvenido al sistema de gestión de producción textil. Esta aplicación te permite gestionar módulos, personas, referencias y producción.
        </p>
        <hr className="my-4" />
        <p>Selecciona una de las opciones para comenzar:</p>
        
        <div className="row mt-4">
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-boxes fa-3x mb-3 text-primary"></i>
                <h5 className="card-title">Módulos</h5>
                <p className="card-text">Gestiona los módulos de producción.</p>
                <Link to="/modulos" className="btn btn-primary">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Módulos
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-users fa-3x mb-3 text-success"></i>
                <h5 className="card-title">Personas</h5>
                <p className="card-text">Administra el personal de la empresa.</p>
                <Link to="/personas" className="btn btn-success">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Personas
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-tag fa-3x mb-3 text-info"></i>
                <h5 className="card-title">Referencias</h5>
                <p className="card-text">Gestiona las referencias de producción.</p>
                <Link to="/referencias" className="btn btn-info">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Referencias
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-user-plus fa-3x mb-3 text-secondary"></i>
                <h5 className="card-title">Asignaciones de Personas</h5>
                <p className="card-text">Administra la asignación de personas a módulos.</p>
                <Link to="/asignaciones-modulo" className="btn btn-secondary">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Asignaciones
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-tasks fa-3x mb-3 text-purple" style={{ color: '#8655c4' }}></i>
                <h5 className="card-title">Asignaciones de Referencias</h5>
                <p className="card-text">Administra las referencias asignadas a módulos.</p>
                <Link to="/asignaciones-referencia" className="btn btn-purple" style={{ backgroundColor: '#8655c4', color: 'white' }}>
                  <i className="fas fa-arrow-right me-1"></i> Ir a Asignaciones
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-ruler fa-3x mb-3 text-danger"></i>
                <h5 className="card-title">Tallas de Referencias</h5>
                <p className="card-text">Gestiona las tallas y cantidades por referencia.</p>
                <Link to="/tallas-referencia" className="btn btn-danger">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Tallas
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-clock fa-3x mb-3 text-dark"></i>
                <h5 className="card-title">Franjas Horarias</h5>
                <p className="card-text">Gestiona los horarios de producción.</p>
                <Link to="/franjas-horarias" className="btn btn-dark">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Franjas Horarias
                </Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <i className="fas fa-chart-line fa-3x mb-3 text-warning"></i>
                <h5 className="card-title">Producción</h5>
                <p className="card-text">Seguimiento de la producción.</p>
                <Link to="/produccion" className="btn btn-warning">
                  <i className="fas fa-arrow-right me-1"></i> Ir a Producción
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 