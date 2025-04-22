const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let createdModuloId = null;

// Función para pausar la ejecución
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test completo para módulos
async function testModuloCrud() {
  console.log('\n====== INICIANDO PRUEBA CRUD DE MÓDULOS ======\n');
  
  // CREATE - Crear un nuevo módulo
  try {
    console.log('Creando un nuevo módulo...');
    const newModulo = {
      nombre: 'Módulo de Prueba',
      estado: 'activo'
    };
    
    const createResponse = await axios.post(`${API_URL}/modulos`, newModulo);
    console.log('✅ CREATE exitoso:', createResponse.data);
    createdModuloId = createResponse.data.id_modulo;
    
    // Pequeña pausa para asegurar que se complete la operación
    await sleep(500);
    
    // READ - Obtener todos los módulos
    console.log('\nObteniendo todos los módulos...');
    const getAllResponse = await axios.get(`${API_URL}/modulos`);
    console.log('✅ READ (todos) exitoso:', getAllResponse.data);
    
    if (createdModuloId) {
      // READ - Obtener un módulo específico
      console.log(`\nObteniendo el módulo con ID ${createdModuloId}...`);
      const getOneResponse = await axios.get(`${API_URL}/modulos/${createdModuloId}`);
      console.log('✅ READ (uno) exitoso:', getOneResponse.data);
      
      // UPDATE - Actualizar un módulo
      console.log(`\nActualizando el módulo con ID ${createdModuloId}...`);
      const updateData = {
        nombre: 'Módulo Actualizado',
        estado: 'inactivo'
      };
      
      const updateResponse = await axios.put(`${API_URL}/modulos/${createdModuloId}`, updateData);
      console.log('✅ UPDATE exitoso:', updateResponse.data);
      
      await sleep(500);
      
      // Verificar la actualización
      const checkUpdateResponse = await axios.get(`${API_URL}/modulos/${createdModuloId}`);
      console.log('Módulo después de actualizar:', checkUpdateResponse.data);
      
      // DELETE - Eliminar un módulo
      console.log(`\nEliminando el módulo con ID ${createdModuloId}...`);
      const deleteResponse = await axios.delete(`${API_URL}/modulos/${createdModuloId}`);
      console.log('✅ DELETE exitoso:', deleteResponse.data);
      
      // Verificar la eliminación
      try {
        await axios.get(`${API_URL}/modulos/${createdModuloId}`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('✅ Verificación DELETE: El módulo ya no existe');
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error en las pruebas de CRUD:', error.message);
    if (error.response) {
      console.log('Detalles del error:', error.response.data);
    }
    return false;
  }
}

// Función principal para ejecutar todas las pruebas
async function runTests() {
  console.log('==== PRUEBAS DE OPERACIONES CRUD ====');
  
  const moduloCrudSuccess = await testModuloCrud();
  
  console.log('\n==== RESUMEN DE PRUEBAS CRUD ====');
  console.log(`CRUD de Módulos: ${moduloCrudSuccess ? '✅ EXITOSO' : '❌ FALLIDO'}`);
}

runTests(); 