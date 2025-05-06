@echo off
echo Iniciando la aplicacion Textile...

echo Iniciando el servidor backend...
start cmd /k "npm run start"

echo Iniciando el cliente frontend...
cd frontend
start cmd /k "npm run start"

echo Los servidores se estan iniciando en ventanas separadas. 
cd .. 