/*
Ruta base: /api/pacientes
*/

const { Router } = require("express");
const {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  borrarPaciente,
} = require("../controllers/paciente");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();

// Obtener pacientes
router.get(
  "/",
  [
    check("id", "El id del paciente debe ser válido").optional().isNumeric(),
    check("desde", "El desde debe ser un número").optional().isNumeric(),
    validarCampos,
  ],
  obtenerPacientes
);

// Crear un nuevo paciente
router.post(
  "/",
  [
    check("nombre", "El argumento nombre es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check("comentarios", "El argumento comentarios es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check(
      "fechaAlta",
      "El argumento fechaAlta es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  crearPaciente
);

// Actualizar un paciente existente
router.put(
  "/:id",
  [
    check("id", "El identificador no es válido").isNumeric(),
    check("nombre", "El argumento nombre es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check("comentarios", "El argumento comentarios es obligatorio")
      .not()
      .isEmpty()
      .trim(),
    check(
      "fechaAlta",
      "El argumento fechaAlta es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  actualizarPaciente
);

// Eliminar un paciente
router.delete(
  "/:id",
  [check("id", "El identificador no es válido").isNumeric(), validarCampos],
  borrarPaciente
);

module.exports = router;
