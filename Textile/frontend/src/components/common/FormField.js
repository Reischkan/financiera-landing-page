import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de campo de formulario con validación y manejo de errores
 * 
 * @param {Object} props
 * @param {string} props.id - ID del campo
 * @param {string} props.name - Nombre del campo (para forms)
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.value - Valor del campo
 * @param {function} props.onChange - Función para manejar cambios
 * @param {function} props.onBlur - Función para manejar onBlur
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.touched - Si el campo ha sido tocado
 * @param {string} props.placeholder - Placeholder del campo
 * @param {boolean} props.required - Si el campo es requerido
 * @param {boolean} props.disabled - Si el campo está deshabilitado
 * @param {boolean} props.readOnly - Si el campo es de solo lectura
 * @param {Object} props.options - Opciones para select, radio, checkbox
 * @param {string} props.helpText - Texto de ayuda
 * @param {boolean} props.showErrorMessage - Si mostrar mensaje de error
 */
const FormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  options = [],
  helpText,
  showErrorMessage = true,
  className = '',
  inputClassName = '',
  ...props
}) => {
  // Validar ID y name
  const fieldId = id || `field-${name}`;
  
  // Verificar si debe mostrar error
  const showError = showErrorMessage && touched && error;
  
  // Render según el tipo de campo
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            className={`form-control ${showError ? 'is-invalid' : ''} ${inputClassName}`}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            {...props}
          />
        );
        
      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            className={`form-select ${showError ? 'is-invalid' : ''} ${inputClassName}`}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div>
            {options.map((option) => (
              <div className="form-check" key={option.value}>
                <input
                  id={`${fieldId}-${option.value}`}
                  type="radio"
                  name={name}
                  className={`form-check-input ${showError ? 'is-invalid' : ''}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  required={required}
                  {...props}
                />
                <label className="form-check-label" htmlFor={`${fieldId}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'checkbox':
        if (options && options.length > 0) {
          return (
            <div>
              {options.map((option) => (
                <div className="form-check" key={option.value}>
                  <input
                    id={`${fieldId}-${option.value}`}
                    type="checkbox"
                    name={name}
                    className={`form-check-input ${showError ? 'is-invalid' : ''}`}
                    value={option.value}
                    checked={Array.isArray(value) ? value.includes(option.value) : false}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    {...props}
                  />
                  <label className="form-check-label" htmlFor={`${fieldId}-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div className="form-check">
              <input
                id={fieldId}
                type="checkbox"
                name={name}
                className={`form-check-input ${showError ? 'is-invalid' : ''}`}
                checked={value || false}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
                {...props}
              />
              <label className="form-check-label" htmlFor={fieldId}>
                {label}
              </label>
            </div>
          );
        }
        
      case 'file':
        return (
          <input
            id={fieldId}
            type="file"
            name={name}
            className={`form-control ${showError ? 'is-invalid' : ''} ${inputClassName}`}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            accept={props.accept}
            multiple={props.multiple}
            {...props}
          />
        );
        
      default:
        return (
          <input
            id={fieldId}
            type={type}
            name={name}
            className={`form-control ${showError ? 'is-invalid' : ''} ${inputClassName}`}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && type !== 'checkbox' && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {helpText && !showError && (
        <div className="form-text text-muted">{helpText}</div>
      )}
      
      {showError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  helpText: PropTypes.string,
  showErrorMessage: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default FormField; 