const { Router } = require("express");
const {
  subirArchivo,
  borrarArchivo,
  getFiles,
} = require("../controllers/upload");

const router = Router();

// Ruta para obtener archivos
router.post("/getFiles", getFiles);

// Ruta para subir archivos
router.post("/:id", subirArchivo);

// Ruta para borrar archivos
router.delete("/:nombreArchivo", borrarArchivo);

module.exports = router;
