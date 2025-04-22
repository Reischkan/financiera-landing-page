import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Módulos
export const getModulos = () => {
  return axios.get(`${API_URL}/modulos`);
};

export const getModulo = (id) => {
  return axios.get(`${API_URL}/modulos/${id}`);
};

export const createModulo = (data) => {
  return axios.post(`${API_URL}/modulos`, data);
};

export const updateModulo = (id, data) => {
  return axios.put(`${API_URL}/modulos/${id}`, data);
};

export const deleteModulo = (id) => {
  return axios.delete(`${API_URL}/modulos/${id}`);
};

// Personas
export const getPersonas = () => {
  return axios.get(`${API_URL}/personas`);
};

export const getPersona = (id) => {
  return axios.get(`${API_URL}/personas/${id}`);
};

export const createPersona = (data) => {
  return axios.post(`${API_URL}/personas`, data);
};

export const updatePersona = (id, data) => {
  return axios.put(`${API_URL}/personas/${id}`, data);
};

export const deletePersona = (id) => {
  return axios.delete(`${API_URL}/personas/${id}`);
}; 