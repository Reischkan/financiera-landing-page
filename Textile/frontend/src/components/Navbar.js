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
            <li className="nav-item">
              <NavLink className="nav-link" to="/referencias">
                <i className="fas fa-tag me-1"></i> Referencias
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/produccion">
                <i className="fas fa-chart-line me-1"></i> Producción
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 