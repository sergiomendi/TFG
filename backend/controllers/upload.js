const { response } = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const subirArchivo = async (req, res = response) => {
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
  const path = `${process.env.PATHUPLOAD || "uploads"}`;
  const nombreArchivo = `${uuidv4()}.${extension}`;
  const patharchivo = `${path}/${nombreArchivo}`;

  // Crear la carpeta si no existe
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  // Mover el archivo al path especificado
  archivo.mv(patharchivo, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        ok: false,
        msg: `No se pudo cargar el archivo`,
      });
    }

    // Respuesta exitosa
    res.json({
      ok: true,
      msg: "Archivo subido correctamente",
      nombreArchivo,
      path: patharchivo,
    });
  });
};

module.exports = { subirArchivo };
