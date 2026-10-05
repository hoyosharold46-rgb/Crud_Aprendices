//consolida las rutas
const {Router} = require("express")
//importsr enrutadores de las entidades
const pruebaRouter = require("./pruebaRouter")
const autenticarRouter = require("./autenticarRouter")
const usuariosRouter = require("./usuariosRouter")
const enrutador = Router()

//ruta de prueba
enrutador.use("/rutaPrueba", pruebaRouter)
//ruta de autenticación
enrutador.use("/autenticar", autenticarRouter)
enrutador.use("/listado", require("./usuariosRouter"))

module.exports = enrutador