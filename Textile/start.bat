@echo off
echo Iniciando la aplicacion Textile...

echo Iniciando el servidor backend...
start cmd /k "cd backend && npm start"

echo Iniciando el cliente frontend...
start cmd /k "cd frontend && npm start"

echo Los servidores se estan iniciando en ventanas separadas. 