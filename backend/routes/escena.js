/*
Ruta base: /api/escenas
*/

const { Router } = require("express");
const {
  obtenerEscenas,
  crearEscena,
  actualizarEscena,
  borrarEscena,
} = require("../controllers/escena");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();

// Obtener escenas
router.get(
  "/",
  [
    check("id", "El id de la escena debe ser válido").optional().isNumeric(),
    check("desde", "El desde debe ser un número").optional().isNumeric(),
    check("texto", "El texto debe ser válido").optional().trim(),
    validarCampos,
  ],
  obtenerEscenas
);

// Crear una nueva escena
router.post(
  "/",
  [
    check("titulo", "El argumento titulo es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check(
      "fechaAlta",
      "El argumento fechaAlta es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  crearEscena
);

// Actualizar una escena existente
router.put(
  "/:id",
  [
    check("titulo", "El argumento titulo es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check(
      "fechaAlta",
      "El argumento fechaAlta es obligatorio y debe ser un número"
    ).isNumeric(),
    check("id", "El identificador no es válido").isNumeric(),
    validarCampos,
  ],
  actualizarEscena
);

// Eliminar una escena
router.delete(
  "/:id",
  [check("id", "El identificador no es válido").isNumeric(), validarCampos],
  borrarEscena
);

module.exports = router;
