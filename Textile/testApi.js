const http = require('http');

// Probar la ruta principal
http.get('http://localhost:5000', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Respuesta de ruta principal:', data);
    testModulosApi();
  });
}).on('error', (e) => {
  console.error('Error en ruta principal:', e.message);
});

// Probar la API de módulos
function testModulosApi() {
  http.get('http://localhost:5000/api/modulos', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Respuesta de API de módulos:', data);
    });
  }).on('error', (e) => {
    console.error('Error en API de módulos:', e.message);
  });
} 