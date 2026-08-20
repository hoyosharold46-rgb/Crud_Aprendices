const express = require('express');
const app = express();

require('dotenv/config');

const port = process.env.PUERTO || 3000;

//libreria para leer el archivo listarDatos.json
const sistemaArchivo = require('fs');
const ruta = require('path');

//generar una ruta absoluta para el archivo listarDatos.json
const rutaArchivoJson = ruta.join(__dirname, 'listarDatos.json');

// Ruta raiz
app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD APRENDICES');
});

//endpoint para obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
  // const listaAprendices = require('./listarDatos.json');
  sistemaArchivo.readFile(rutaArchivoJson, "utf8", (error, datos) => {
    if (error) {
      res.status(500).json({ error: 'Error al leer el archivo listarDatos.json, conexion db' });
    }
    const listaAprendices = JSON.parse(datos);
    res.json(listaAprendices);
    });
});
// Modo de escuchar el servidor
app.listen(port, () => {
     console.log(`SERVER: http://localhost:${port}`) 
    });