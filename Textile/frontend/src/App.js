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

// Componentes de Referencias
import ReferenciasList from './components/referencias/ReferenciasList';
import ReferenciaForm from './components/referencias/ReferenciaForm';
import ReferenciaView from './components/referencias/ReferenciaView';

// Componentes de Asignaciones de Módulos
import AsignacionModuloList from './components/asignacionesModulo/AsignacionModuloList';
import AsignacionModuloForm from './components/asignacionesModulo/AsignacionModuloForm';
import AsignacionModuloView from './components/asignacionesModulo/AsignacionModuloView';

// Componentes de Tallas de Referencia
import TallaReferenciaList from './components/tallasReferencia/TallaReferenciaList';
import TallaReferenciaForm from './components/tallasReferencia/TallaReferenciaForm';
import TallaReferenciaView from './components/tallasReferencia/TallaReferenciaView';

// Componentes de Asignaciones de Referencias
import AsignacionReferenciaList from './components/asignacionesReferencia/AsignacionReferenciaList';
import AsignacionReferenciaForm from './components/asignacionesReferencia/AsignacionReferenciaForm';
import AsignacionReferenciaView from './components/asignacionesReferencia/AsignacionReferenciaView';

// Componentes de Franjas Horarias
import FranjaHorariaList from './components/franjasHorarias/FranjaHorariaList';
import FranjaHorariaForm from './components/franjasHorarias/FranjaHorariaForm';
import FranjaHorariaView from './components/franjasHorarias/FranjaHorariaView';

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
            
            {/* Rutas de Referencias */}
            <Route path="/referencias" element={<ReferenciasList />} />
            <Route path="/referencias/create" element={<ReferenciaForm />} />
            <Route path="/referencias/edit/:id" element={<ReferenciaForm />} />
            <Route path="/referencias/view/:id" element={<ReferenciaView />} />
            
            {/* Rutas de Tallas de Referencia */}
            <Route path="/tallas-referencia" element={<TallaReferenciaList />} />
            <Route path="/tallas-referencia/create" element={<TallaReferenciaForm />} />
            <Route path="/tallas-referencia/edit/:id" element={<TallaReferenciaForm />} />
            <Route path="/tallas-referencia/view/:id" element={<TallaReferenciaView />} />
            
            {/* Rutas de Asignación de Módulos */}
            <Route path="/asignaciones-modulo" element={<AsignacionModuloList />} />
            <Route path="/asignaciones-modulo/create" element={<AsignacionModuloForm />} />
            <Route path="/asignaciones-modulo/edit/:id" element={<AsignacionModuloForm />} />
            <Route path="/asignaciones-modulo/view/:id" element={<AsignacionModuloView />} />
            
            {/* Rutas de Asignación de Referencias */}
            <Route path="/asignaciones-referencia" element={<AsignacionReferenciaList />} />
            <Route path="/asignaciones-referencia/new" element={<AsignacionReferenciaForm />} />
            <Route path="/asignaciones-referencia/edit/:id" element={<AsignacionReferenciaForm />} />
            <Route path="/asignaciones-referencia/view/:id" element={<AsignacionReferenciaView />} />
            
            {/* Rutas de Franjas Horarias */}
            <Route path="/franjas-horarias" element={<FranjaHorariaList />} />
            <Route path="/franjas-horarias/new" element={<FranjaHorariaForm />} />
            <Route path="/franjas-horarias/edit/:id" element={<FranjaHorariaForm />} />
            <Route path="/franjas-horarias/:id" element={<FranjaHorariaView />} />
            
            {/* Rutas de Producción */}
            <Route path="/produccion" element={<PlaceholderPage title="Producción" />} />
            <Route path="/registros-produccion" element={<PlaceholderPage title="Registros de Producción" />} />
            <Route path="/historial-produccion" element={<PlaceholderPage title="Historial de Producción" />} />
            
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
