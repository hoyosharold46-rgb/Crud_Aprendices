const express = require('express');
const app = express();
require('dotenv/config');
const port = process.env.PUERTO || 3111;
//body-parser
app.use(express.json())

//libreria para leer archivo
const sistemaArchivo = require('fs');
const ruta = require('path');
//funciones de validación
const { validarAprendiz } = require('./validaciones');
//generar una ruta para el archivo aprendices.json
const rutaArchivoJson = ruta.join(__dirname, 'listaDatos.json');
//ruta raiz
app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});

//endpoint para obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);
        res.json(listaAprendices);
    });
});



//endpoint para obtener un solo aprendiz por dni
app.get('/api/aprendices/:dni', (req, res) => {
    const dni = parseInt(req.params.dni)
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);
        const aprendiz = listaAprendices.find(aprendiz => aprendiz.dni === dni)

        if (!aprendiz) {
            return res.status(404).json({ Error: "Aprendiz no encontrado." })
        }

        res.json(aprendiz);
    });
});

//endpoint crear un aprendiz
app.post("/api/aprendices", (req, res) => {
    const datoAprendiz = req.body

    //validar nombre y correo antes de continuar
    const { esValido, errores } = validarAprendiz(datoAprendiz);
    if (!esValido) {
        return res.status(400).json({ Error: "Datos inválidos", detalles: errores });
    }

    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);

        //generar dni automático: el mayor dni existente + 1 (si no hay registros, inicia en 1)
        const dniAutomatico = listaAprendices.length > 0
            ? Math.max(...listaAprendices.map(aprendiz => aprendiz.dni)) + 1
            : 1;
        datoAprendiz.dni = dniAutomatico;

        //adicionar a la lista el nuevo aprendiz
        listaAprendices.push(datoAprendiz)
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) {
                return res.status(500).json({ Error: "No se puede registrar el aprendiz." })
            }
            res.json(datoAprendiz)
        })

    })
})

//Endpoint para editar un aprendiz
app.put("/api/aprendices/:dni", (req, res) => {
    const dni = parseInt(req.params.dni)
    const datosAprendiz = req.body
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        let listaAprendices = JSON.parse(datos);
        //modificar datos de un aprendiz

        listaAprendices = listaAprendices.map(aprendiz => {
            return aprendiz.dni === dni ? { ...aprendiz, ...datosAprendiz } : aprendiz
        })
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) {
                return res.status(500).json({ Error: "No se puede registrar el aprendiz." })
            }
            res.json(datosAprendiz)
        })

    })
})

//Endpoint para eliminar un aprendiz
app.delete("/api/aprendices/:dni", (req, res) => {
    const dni = parseInt(req.params.dni)
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        let listaAprendices = JSON.parse(datos);

        const existeAprendiz = listaAprendices.some(aprendiz => aprendiz.dni === dni)
        if (!existeAprendiz) {
            return res.status(404).json({ Error: "Aprendiz no encontrado." })
        }

        //filtrar la lista excluyendo el aprendiz con el dni indicado
        listaAprendices = listaAprendices.filter(aprendiz => aprendiz.dni !== dni)

        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) {
                return res.status(500).json({ Error: "No se puede eliminar el aprendiz." })
            }
            res.json({ mensaje: "Aprendiz eliminado correctamente." })
        })
    })
})


// Modo de escucha del servidor
app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`)
})