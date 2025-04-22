import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes comunes
import Navbar from './components/Navbar';
import Home from './components/Home';

// Componentes de Módulos
import ModulosList from './components/modulos/ModulosList';
import ModuloForm from './components/modulos/ModuloForm';
import ModuloView from './components/modulos/ModuloView';

// Componentes de Personas
import PersonasList from './components/personas/PersonasList';
import PersonaForm from './components/personas/PersonaForm';
import PersonaView from './components/personas/PersonaView';

// Placeholder para otras páginas
const PlaceholderPage = ({ title }) => (
  <div className="container mt-4">
    <div className="alert alert-info">
      <h2>{title}</h2>
      <p>Esta sección está en construcción.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="py-3">
          <Routes>
            {/* Rutas principales */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas de Módulos */}
            <Route path="/modulos" element={<ModulosList />} />
            <Route path="/modulos/create" element={<ModuloForm />} />
            <Route path="/modulos/edit/:id" element={<ModuloForm />} />
            <Route path="/modulos/view/:id" element={<ModuloView />} />
            
            {/* Rutas de Personas */}
            <Route path="/personas" element={<PersonasList />} />
            <Route path="/personas/create" element={<PersonaForm />} />
            <Route path="/personas/edit/:id" element={<PersonaForm />} />
            <Route path="/personas/view/:id" element={<PersonaView />} />
            
            {/* Rutas de placeholder */}
            <Route path="/referencias" element={<PlaceholderPage title="Referencias" />} />
            <Route path="/produccion" element={<PlaceholderPage title="Producción" />} />
            
            {/* Ruta 404 */}
            <Route path="*" element={
              <div className="container mt-4">
                <div className="alert alert-danger">
                  <h2>404 - Página no encontrada</h2>
                  <p>La página que buscas no existe.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-5">
          <div className="container">
            <p className="mb-0">Sistema de Gestión Textile &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
