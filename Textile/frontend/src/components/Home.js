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
          <div className="col-md-3 mb-4">
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
          
          <div className="col-md-3 mb-4">
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
          
          <div className="col-md-3 mb-4">
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
          
          <div className="col-md-3 mb-4">
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