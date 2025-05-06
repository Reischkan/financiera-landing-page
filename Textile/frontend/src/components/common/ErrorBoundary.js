import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  // Método para volver a la página de inicio - más seguro que usar Link
  // ya que ErrorBoundary podría estar fuera del contexto del Router
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return (
        <div className="container mt-5">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h4 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Se ha producido un error
              </h4>
            </div>
            <div className="card-body">
              <h5 className="card-title">Lo sentimos, algo salió mal</h5>
              <p className="card-text">
                La aplicación ha encontrado un error inesperado. Por favor, intenta una de las siguientes opciones:
              </p>
              <ul>
                <li>Recargar la página</li>
                <li>Volver a la página de inicio</li>
                <li>Cerrar sesión y volver a iniciar sesión</li>
              </ul>
              
              <details className="mt-3 mb-3">
                <summary className="text-muted">Detalles técnicos (para desarrolladores)</summary>
                <div className="mt-3">
                  <p className="text-danger">{this.state.error && this.state.error.toString()}</p>
                  <div className="border p-3 bg-light">
                    <pre className="mb-0">
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary" 
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-sync-alt me-1"></i> Recargar página
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={this.handleGoHome}
                >
                  <i className="fas fa-home me-1"></i> Ir a inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 