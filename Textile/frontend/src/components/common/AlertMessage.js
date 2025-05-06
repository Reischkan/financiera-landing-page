import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar mensajes de alerta
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de alerta (success, danger, warning, info)
 * @param {string} props.message - Mensaje a mostrar
 * @param {boolean} props.dismissible - Si la alerta puede cerrarse
 * @param {number} props.autoClose - Tiempo en ms para cerrar automáticamente (0 para desactivar)
 * @param {Function} props.onClose - Callback al cerrar la alerta
 */
const AlertMessage = ({ 
  type = 'info', 
  message, 
  dismissible = true, 
  autoClose = 0, 
  onClose,
  icon = true
}) => {
  const [visible, setVisible] = useState(true);

  // Manejar cierre de alerta
  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Efecto para autoclose - siempre debe estar en el nivel superior
  useEffect(() => {
    let timer;

    // Solo programar el timer si hay un mensaje, es visible y autoClose > 0
    if (message && autoClose > 0 && visible) {
      timer = setTimeout(() => {
        handleClose();
      }, autoClose);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [autoClose, visible, message, onClose]);

  // Validar el mensaje - después de los hooks
  if (!message) return null;
  
  // Si no es visible, no renderizar
  if (!visible) return null;

  // Determinar el icono según el tipo
  const getIcon = () => {
    if (!icon) return null;
    
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle me-2"></i>;
      case 'danger':
        return <i className="fas fa-exclamation-circle me-2"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle me-2"></i>;
      case 'info':
      default:
        return <i className="fas fa-info-circle me-2"></i>;
    }
  };

  return (
    <div 
      className={`alert alert-${type} ${dismissible ? 'alert-dismissible fade show' : ''}`} 
      role="alert"
      data-testid="alert-message"
    >
      {getIcon()}
      {message}
      {dismissible && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close" 
          onClick={handleClose}
        ></button>
      )}
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  dismissible: PropTypes.bool,
  autoClose: PropTypes.number,
  onClose: PropTypes.func,
  icon: PropTypes.bool
};

export default AlertMessage; 