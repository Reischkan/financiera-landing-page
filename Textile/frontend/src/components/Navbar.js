import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="fas fa-tshirt me-2"></i>
          <span>Sistema de Gestión Textile</span>
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
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
              >
                <i className="fas fa-home me-1"></i> Inicio
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownCatalogos"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-book me-1"></i> Catálogos
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownCatalogos">
                <li>
                  <NavLink className="dropdown-item" to="/modulos">
                    <i className="fas fa-sitemap me-1"></i> Módulos
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/personas">
                    <i className="fas fa-users me-1"></i> Personas
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/referencias">
                    <i className="fas fa-tag me-1"></i> Referencias
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/tallas-referencia">
                    <i className="fas fa-ruler me-1"></i> Tallas de Referencia
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/franjas-horarias">
                    <i className="fas fa-clock me-1"></i> Franjas Horarias
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownAsignaciones"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-tasks me-1"></i> Asignaciones
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownAsignaciones">
                <li>
                  <NavLink className="dropdown-item" to="/asignaciones-modulo">
                    <i className="fas fa-user-cog me-1"></i> Asignaciones de Módulo
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/asignaciones-referencia">
                    <i className="fas fa-boxes me-1"></i> Asignaciones de Referencia
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownProduccion"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-industry me-1"></i> Producción
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownProduccion">
                <li>
                  <NavLink className="dropdown-item" to="/registros-produccion">
                    <i className="fas fa-clipboard-list me-1"></i> Registros de Producción
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/registros-produccion/new">
                    <i className="fas fa-plus-circle me-1"></i> Nuevo Registro
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