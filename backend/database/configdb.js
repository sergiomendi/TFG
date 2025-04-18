const mysql = require("mysql2/promise");

const dbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost", // Dirección del servidor MySQL
      user: process.env.DB_USER || "root", // Usuario de MySQL
      password: process.env.DB_PASSWORD || "", // Contraseña de MySQL
      database: process.env.DB_NAME || "tfg", // Nombre de la base de datos
    });

    console.log("DB online");
    global.db = connection; // Guardar la conexión globalmente si es necesario
  } catch (error) {
    console.error(error);
    throw new Error("Error al conectar con la base de datos MySQL");
  }
};

module.exports = { dbConnection };
