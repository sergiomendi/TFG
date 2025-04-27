/*
Importación de módulos
*/
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

require("dotenv").config();
const { dbConnection } = require("./database/configdb");

// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
  })
);

app.use("/api/paciente", require("./routes/paciente"));
app.use("/api/experiencia", require("./routes/experiencia"));
app.use("/api/escena", require("./routes/escena"));
app.use("/api/evento", require("./routes/evento"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/archivo", require("./routes/archivo"));

// Abrir la aplicacíon en el puerto 3000
app.listen(3000, () => {
  console.log(`Servidor corriendo en: http://localhost:${process.env.PORT}`);
});
