const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");

const {
  obtenerArchivosPorIdEscena,
  obtenerArchivos,
  crearArchivo,
  actualizarArchivo,
  borrarArchivo,
} = require("../controllers/archivo.js");

const router = Router();

// Obtener un archivo por ID
router.get(
  "/:id",
  [check("id", "El id del archivo debe ser válido").isNumeric(), validarCampos],
  obtenerArchivosPorIdEscena
);

// Obtener archivos
router.get(
  "/",
  [
    check("id", "El id del archivo debe ser válido").optional().isNumeric(),
    check("titulo", "El titulo debe ser válido").optional().trim(),
    check("tipo", "El tipo debe ser válido").optional().trim(),
    validarCampos,
  ],
  obtenerArchivos
);

// Crear un nuevo archivo
router.post(
  "/",
  [
    check("titulo", "El argumento titulo es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check("tipo", "El argumento tipo es obligatorio").not().isEmpty().trim(),
    check("url", "El argumento url es obligatorio").not().isEmpty().trim(),
    check("id_escena", "El id_escena debe ser un número").isNumeric(),
    validarCampos,
  ],
  crearArchivo
);

// Actualizar un archivo existente
router.put(
  "/:id",
  [
    check("titulo", "El argumento titulo es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check("tipo", "El argumento tipo es obligatorio").not().isEmpty().trim(),
    check("url", "El argumento url es obligatorio").not().isEmpty().trim(),
    check("id", "El identificador no es válido").isNumeric(),
    validarCampos,
  ],
  actualizarArchivo
);

// Eliminar un archivo
router.delete(
  "/:id",
  [check("id", "El identificador no es válido").isNumeric(), validarCampos],
  borrarArchivo
);

module.exports = router;
