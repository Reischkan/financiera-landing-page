/**
 * Utilidad para validación de formularios
 */
import React, { useState, useEffect, useCallback } from 'react';

// Validadores predefinidos
export const validators = {
  // Verifica si un valor no está vacío
  required: (value) => {
    if (value === undefined || value === null) return 'Este campo es obligatorio';
    if (typeof value === 'string' && value.trim() === '') return 'Este campo es obligatorio';
    if (Array.isArray(value) && value.length === 0) return 'Debe seleccionar al menos una opción';
    return null;
  },
  
  // Verifica longitud mínima para strings
  minLength: (min) => (value) => {
    if (!value || typeof value !== 'string') return null;
    return value.length < min ? `Debe contener al menos ${min} caracteres` : null;
  },
  
  // Verifica longitud máxima para strings
  maxLength: (max) => (value) => {
    if (!value || typeof value !== 'string') return null;
    return value.length > max ? `No puede exceder ${max} caracteres` : null;
  },
  
  // Verifica si es un correo electrónico válido
  email: (value) => {
    if (!value) return null;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !regex.test(value) ? 'Debe ser un correo electrónico válido' : null;
  },
  
  // Verifica si es un número
  number: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    return isNaN(Number(value)) ? 'Debe ser un número válido' : null;
  },
  
  // Verifica si es un número positivo
  positiveNumber: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num)) return 'Debe ser un número válido';
    return num <= 0 ? 'Debe ser un número mayor que cero' : null;
  },
  
  // Verifica si es una fecha válida
  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Debe ser una fecha válida' : null;
  },
  
  // Verifica si el valor coincide con un patrón regex
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return !regex.test(value) ? (message || 'Formato inválido') : null;
  },
  
  // Verifica si el valor es igual a otro campo
  matches: (field, fieldName) => (value, formValues) => {
    if (!value) return null;
    return value !== formValues[field] ? `Debe coincidir con ${fieldName || field}` : null;
  }
};

// Función para validar un objeto completo de formulario
export const validateForm = (values, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach(field => {
    const fieldValidators = validationSchema[field];
    const value = values[field];
    
    // Si validationSchema[field] es un array, ejecutar cada validador
    if (Array.isArray(fieldValidators)) {
      for (const validator of fieldValidators) {
        const error = validator(value, values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } 
    // Si es una función única, ejecutarla directamente
    else if (typeof fieldValidators === 'function') {
      const error = fieldValidators(value, values);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

// Hook personalizado para validación de formulario
export const useFormValidation = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  
  // Validar todo el formulario
  const validate = useCallback(() => {
    const newErrors = validateForm(values, validationSchema);
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return newErrors;
  }, [values, validationSchema]);
  
  // Manejar cambios en los campos
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  }, []);
  
  // Manejar cuando un campo pierde el foco
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  // Efecto para validar cuando cambian los valores
  useEffect(() => {
    validate();
  }, [values, validate]);
  
  return {
    values,
    errors,
    touched,
    isValid,
    setValues,
    handleChange,
    handleBlur,
    validate
  };
};

export default {
  validators,
  validateForm,
  useFormValidation
}; 