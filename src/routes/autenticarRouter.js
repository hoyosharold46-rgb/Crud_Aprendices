const {Router} = require("express")

const enrutador = Router()
//esta función la vamos a pasar al controlador de autenticar
//importamos el controlador
const iniciarSesion = require("../controllers/autenticarController")

enrutador.post("/login", iniciarSesion)

enrutador.post("/registro", (req, res) => {
    res.json({ message: "Ruta de registro" })
})

module.exports = enrutador