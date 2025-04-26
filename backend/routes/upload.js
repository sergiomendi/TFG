const { Router } = require("express");
const { subirArchivo } = require("../controllers/upload");

const router = Router();

// Ruta para subir archivos
router.post("/:tipo/:id", subirArchivo);

module.exports = router;
