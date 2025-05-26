const { response } = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const subirArchivo = async (req, res = response) => {
  const { id } = req.params;
  // Si req.body.retos viene como string, parsea, si no, usa array vacío
  let retos = [];
  try {
    retos = req.body.retos ? JSON.parse(req.body.retos) : [];
  } catch (e) {
    return res.status(400).json({
      ok: false,
      msg: "El campo 'retos' debe ser un array válido o un string JSON",
    });
  }

  // Validar que se haya enviado un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha enviado archivo",
    });
  }

  // Validar que el archivo se envíe con el campo 'archivo'
  if (!req.files.archivo) {
    return res.status(400).json({
      ok: false,
      msg: `Debe enviarse el archivo como form-data llamado 'archivo'`,
    });
  }

  const archivo = req.files.archivo;
  const nombrePartido = archivo.name.split(".");
  const extension = nombrePartido[nombrePartido.length - 1];

  // Crear el path donde se guardará el archivo
  const uploadPath = path.join(
    __dirname,
    "../",
    process.env.PATHUPLOAD || "uploads"
  );
  const nombreArchivo = `${uuidv4()}.${extension}`;
  const patharchivo = path.join(uploadPath, nombreArchivo);

  // Crear la carpeta si no existe
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Mover el archivo al path especificado
  archivo.mv(patharchivo, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        ok: false,
        msg: `No se pudo cargar el archivo`,
      });
    }

    try {
      const insertQuery = `
        INSERT INTO archivo (titulo, tipo, url, retos, id_escena)
        VALUES (?, ?, ?, ?, ?)
      `;
      const insertValues = [
        archivo.name,
        extension,
        nombreArchivo,
        JSON.stringify(retos),
        id,
      ];

      const [insertResult] = await global.db.query(insertQuery, insertValues);

      if (insertResult.affectedRows === 0) {
        return res.status(500).json({
          ok: false,
          msg: "No se pudo insertar el archivo en la base de datos",
        });
      }

      // Respuesta exitosa
      res.json({
        ok: true,
        msg: "Archivo subido correctamente y registrado en la base de datos",
        archivo: {
          id: insertResult.insertId,
          titulo: archivo.name,
          tipo: extension,
          url: nombreArchivo,
          id_escena: id,
        },
      });
    } catch (dbError) {
      console.error(dbError);
      return res.status(500).json({
        ok: false,
        msg: "Error al insertar el archivo en la base de datos",
      });
    }
  });
};

const borrarArchivo = async (req, res = response) => {
  const { nombreArchivo } = req.params;

  // Validar que se haya enviado el nombre del archivo
  if (!nombreArchivo) {
    return res.status(400).json({
      ok: false,
      msg: "Debe proporcionar el nombre del archivo a eliminar",
    });
  }

  const filePath = path.join(
    process.env.PATHUPLOAD || "uploads",
    nombreArchivo
  );

  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      ok: false,
      msg: "El archivo no existe",
    });
  }

  // Eliminar el archivo
  try {
    fs.unlinkSync(filePath);
    res.json({
      ok: true,
      msg: "Archivo eliminado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "No se pudo eliminar el archivo",
    });
  }
};

const getFiles = (req, res) => {
  console.log("Cuerpo de la solicitud:", req.body); // Depuración

  let { files } = req.body;

  // Verificar si `files` es un string y convertirlo a un array
  if (typeof files === "string") {
    try {
      files = JSON.parse(files);
    } catch (err) {
      return res.status(400).json({
        ok: false,
        msg: "El campo 'files' debe ser un array válido o un string JSON",
      });
    }
  }

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      ok: false,
      msg: "Debe proporcionar un array de nombres de archivos",
    });
  }

  try {
    const fileBlobs = files.map((fileName) => {
      const filePath = path.join(
        __dirname,
        "../",
        process.env.PATHUPLOAD || "uploads",
        fileName
      );

      if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${fileName} no existe`);
      }

      // Leer el archivo como buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Devolver un objeto con el nombre y el contenido del archivo
      return {
        fileName,
        content: fileBuffer.toString("base64"), // Convertir a base64 para enviarlo como JSON
      };
    });

    res.json({
      ok: true,
      files: fileBlobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los archivos",
      error: err.message,
    });
  }
};

module.exports = { subirArchivo, borrarArchivo, getFiles };
