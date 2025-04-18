/*
Importación de módulos
*/
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { dbConnection } = require("./database/configdb");

// Crear una aplicación de express
const app = express();

dbConnection();

app.use(cors());
app.use(express.json());

app.use("/api/paciente", require("./routes/paciente"));
app.use("/api/experiencia", require("./routes/experiencia"));
app.use("/api/escena", require("./routes/escena"));
app.use("/api/evento", require("./routes/evento"));

// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${process.env.PORT}`);
});
