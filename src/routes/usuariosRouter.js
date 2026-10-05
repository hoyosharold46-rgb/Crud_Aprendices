const {Router} = require("express")

const enrutador = Router()

enrutador.get("/usuarios", (req, res) => {
    res.json({ message: "lista de usuarios" })
})


module.exports = enrutador