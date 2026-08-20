const express = require('express');
const app = express();

// Ruta raiz
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Modo de escuchar el servidor
app.listen(port, () => { console.log(`SERVER: http://localhost${port}`) });