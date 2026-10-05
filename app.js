const express = require('express');
<<<<<<< HEAD
const registroMiddleware = require("./src/middleware/registroMiddleware")
const manejadorErrores = require("./src/middleware/manejadorErrores")
const autenticarToken = require("./src/middleware/autenticar")
const jswtoken = require("jsonwebtoken")
const sistemaArchivo = require('fs');
const ruta = require('path');
const app = express();
require('dotenv').config({ quiet: true });
const port = process.env.PORT || 3000;
//body-parser
app.use(express.json())
app.use(express.urlencoded({extend:true}))

//creacion y usu de middleware, ver el tiempo de ejecucion de una peticion
app.use((req,res, next)=>{
    const tiempoMilisegundos = Date.now()
    console.log(`Tiempo: ${tiempoMilisegundos}`)
    next()
})
app.use(registroMiddleware)

//utilizar libreria multer
const multer = require("multer")
//configurar almacenamiento
const almacenamiento = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null, "misImagenes/")
    },
    filename:(req, file, cb)=> {
        const extension = ruta.extname(file.originalname)
        cb(null, `${Date.now()}${extension}`)
    }
})

//crear sistema de carga
const cargar = multer({ storage: almacenamiento });

=======
const app = express();
require('dotenv/config');
const port = process.env.PUERTO || 3111;
//body-parser
app.use(express.json())
//utilizacion de libreia multer
const multer = require('multer');
//configuracion almacenamiento
const almacenamiento = multer.diskStorage8({
    destination: (req, file, cb) => {
        cb(null, "misimagenes/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}`)
    }
})

const cargar = multer({ storage: almacenamiento })


//libreria para leer archivo
const sistemaArchivo = require('fs');
const ruta = require('path');
//funciones de validación
const { validarAprendiz } = require('./validaciones');
>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44
//generar una ruta para el archivo aprendices.json
const rutaArchivoJson = ruta.join(__dirname, 'listaDatos.json');
//ruta raiz
app.get('/', (req, res) => {
    res.send('API RESTFUL - CRUD Aprendices');
});

//endpoint para obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
<<<<<<< HEAD
    //const listaAprendices = []
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
=======
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44
        }
        const listaAprendices = JSON.parse(datos);
        res.json(listaAprendices);
    });
});

<<<<<<< HEAD
//endpoint crear un aprendiz
app.post("/api/aprendices", cargar.single("imagen"),(req, res)=>{
    const datoAprendiz = req.body
    
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
        }
        const listaAprendices = JSON.parse(datos);
        //modificar datoAprendiz con la ruta de la foto
    datoAprendiz.avatar = req.filename ? `/misImagenes/${req.file.filename}`:"sin imagen"    
        //adicionar a la lista el nuevo aprendiz
        listaAprendices.push(datoAprendiz)
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices,null, 2),(error)=>{
            if(error){
                res.status(500).json({Error: "No se puede registrar el aprendiz."})
            }
            res.json(datoAprendiz)
        })
        
=======


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
app.post("/api/aprendices", cargar.single('imagen'), (req, res) => {
    const datoAprendiz = req.body


    //modificar datoaprendidz con la ruta de la imagen si se subió una imagen
    datoAprendiz.avatar = req.filename? 'misimagenes/' + req.filename : null;  
    if (req.file) {
        datoAprendiz.imagen = req.file.path;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

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

>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44
    })
})

//Endpoint para editar un aprendiz
<<<<<<< HEAD
app.put("/api/aprendices/:dni", (req, res)=>{
    const dni = parseInt(req.params.dni)
    const datosAprendiz = req.body
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if (error) {
            res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
=======
app.put("/api/aprendices/:dni", (req, res) => {
    const dni = parseInt(req.params.dni)
    const datosAprendiz = req.body
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
        if (error) {
            return res.status(500).json({ Error: "Error al leer el archivo, conxion bd" })
>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44
        }
        let listaAprendices = JSON.parse(datos);
        //modificar datos de un aprendiz

        listaAprendices = listaAprendices.map(aprendiz => {
<<<<<<< HEAD
                return aprendiz.dni === dni ? {...aprendiz, ...datosAprendiz } : aprendiz
            })
        //adicionar al archivo el nuevo aprendiz
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices,null, 2),(error)=>{
            if(error){
                res.status(500).json({Error: "No se puede registrar el aprendiz."})
            }
            res.json(datosAprendiz)
        })
        
    })
})

//mi middleware 
app.use(registroMiddleware)
=======
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

>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44

// Modo de escucha del servidor
app.listen(port, () => {
    console.log(`SERVER: http://localhost:${port}`)
<<<<<<< HEAD
})

//endpoint con ruta protegida
app.get("/rutaProtegida", autenticarToken,(req, res) => {
    res.json({mensaje: "Este es una ruta protegida"})
})

// endpoint inicio sesion para generar token
app.post("/login", (req, res) => {
    const {usuario, clave} = req.body
    //simular bd
    const usuariobd = {
        "usuario" : "oscar",
        "clave" : "abc123"
    }
    //validar datos del usuario
    if (usuario !== usuariobd.usuario || clave !==  usuariobd.clave){
        res.json({mensaje: "Usuario y/o clave incorrectos."})
    }
//crear token
const token = jswtoken.sign(
    //pasamos datos del usuario
    {user: usuario},
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
)
res.json({token})
})

//manejador de errores
app.use(manejadorErrores)

// endpoint para provocar un error
app.get("/error", (req, res, next) => {
    next(new Error("Error provocado"))
=======
>>>>>>> c3e725876a083a659292ed6e4c47402e17a44c44
})