const express = require("express");
const path = require("path");

const app = express();
const PUERTO = 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Arrancar el servidor
app.listen(PUERTO, () => {
  console.log("==============================================");
  console.log(" Recomendador de Lectura");
  console.log(" Servidor ejecutándose en http://localhost:" + PUERTO);
  console.log(" Presiona Ctrl + C para detenerlo");
  console.log("==============================================");
});
