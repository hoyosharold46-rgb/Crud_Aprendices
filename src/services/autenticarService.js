const jwtoken = require("jsonwebtoken")
const ingresar = (usuario, clave) => {
    //validar el usuario
    //validar datos del usuario
     const usuariobd = {
        "usuario":"oscar",
        "clave": "abc123"
    }
    if (usuario !== usuariobd.usuario || clave !== usuariobd.clave ){
        res.json({mensaje: "Usuario y/o clave incorrectos."})
    }
    //crear token
    const token = jwtoken.sign(
        //pasamos datos del usuario
        {user: usuario},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
    return token
}

module.exports = ingresar