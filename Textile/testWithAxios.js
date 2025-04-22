const axios = require('axios');

// Probar la ruta principal
async function testMainRoute() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('Respuesta ruta principal:', response.data);
    return true;
  } catch (error) {
    console.error('Error en ruta principal:', error.message);
    if (error.response) {
      console.log('Datos del error:', error.response.data);
      console.log('Status:', error.response.status);
    }
    return false;
  }
}

// Probar la API de módulos
async function testModulosApi() {
  try {
    const response = await axios.get('http://localhost:5000/api/modulos');
    console.log('Respuesta API módulos:', response.data);
    return true;
  } catch (error) {
    console.error('Error en API módulos:', error.message);
    if (error.response) {
      console.log('Datos del error:', error.response.data);
      console.log('Status:', error.response.status);
    }
    return false;
  }
}

// Probar la API de personas
async function testPersonasApi() {
  try {
    const response = await axios.get('http://localhost:5000/api/personas');
    console.log('Respuesta API personas:', response.data);
    return true;
  } catch (error) {
    console.error('Error en API personas:', error.message);
    if (error.response) {
      console.log('Datos del error:', error.response.data);
      console.log('Status:', error.response.status);
    }
    return false;
  }
}

// Ejecutar todas las pruebas
async function runTests() {
  console.log('Iniciando pruebas de conexión a la API...');
  
  const mainRouteOk = await testMainRoute();
  const modulosApiOk = await testModulosApi();
  const personasApiOk = await testPersonasApi();
  
  console.log('\nResumen de pruebas:');
  console.log(`- Ruta principal: ${mainRouteOk ? 'OK' : 'FALLO'}`);
  console.log(`- API módulos: ${modulosApiOk ? 'OK' : 'FALLO'}`);
  console.log(`- API personas: ${personasApiOk ? 'OK' : 'FALLO'}`);
}

runTests(); 