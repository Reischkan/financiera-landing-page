import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-tshirt me-2"></i>
          Textile
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="fas fa-home me-1"></i> Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/modulos">
                <i className="fas fa-boxes me-1"></i> Módulos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/personas">
                <i className="fas fa-users me-1"></i> Personas
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="referenciasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-tag me-1"></i> Referencias
              </a>
              <ul className="dropdown-menu" aria-labelledby="referenciasDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/referencias">
                    <i className="fas fa-list me-1"></i> Listado de Referencias
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/tallas-referencia">
                    <i className="fas fa-ruler me-1"></i> Tallas de Referencias
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="asignacionesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-tasks me-1"></i> Asignaciones
              </a>
              <ul className="dropdown-menu" aria-labelledby="asignacionesDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/asignaciones-modulo">
                    <i className="fas fa-user-plus me-1"></i> Asignación de Personas
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/asignaciones-referencia">
                    <i className="fas fa-clipboard-list me-1"></i> Asignación de Referencias
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="produccionDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-chart-line me-1"></i> Producción
              </a>
              <ul className="dropdown-menu" aria-labelledby="produccionDropdown">
                <li>
                  <NavLink className="dropdown-item" to="/franjas-horarias">
                    <i className="fas fa-clock me-1"></i> Franjas Horarias
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/registros-produccion">
                    <i className="fas fa-clipboard-check me-1"></i> Registros de Producción
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/registros-produccion/resumen">
                    <i className="fas fa-tachometer-alt me-1"></i> Resumen de Producción
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/historial-produccion">
                    <i className="fas fa-history me-1"></i> Historial de Producción
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 