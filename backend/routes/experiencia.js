/*
Ruta base: /api/experiencias
*/

const { Router } = require("express");
const {
  obtenerExperienciasPorIdPaciente,
  obtenerExperiencias,
  crearExperiencia,
  actualizarExperiencia,
  borrarExperiencia,
} = require("../controllers/experiencia");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();

// Obtener experiencias por id de paciente
router.get(
  "/paciente/:id_paciente",
  [
    check("id_paciente", "El id del paciente debe ser un número").isNumeric(),
    validarCampos,
  ],
  obtenerExperienciasPorIdPaciente
);

// Obtener experiencias
router.get(
  "/",
  [
    check("id", "El id de la experiencia debe ser válido")
      .optional()
      .isNumeric(),
    check("desde", "El desde debe ser un número").optional().isNumeric(),
    validarCampos,
  ],
  obtenerExperiencias
);

// Crear una nueva experiencia
router.post(
  "/",
  [
    check(
      "duracion",
      "El argumento duracion es obligatorio y debe ser un número"
    ).isNumeric(),
    check(
      "fechaAlta",
      "El argumento fechaAlta es obligatorio y debe ser un número"
    ).isNumeric(),
    check(
      "estresInicial",
      "El argumento estresInicial es obligatorio y debe ser un número"
    ).isNumeric(),
    check(
      "estresFinal",
      "El argumento estresFinal es obligatorio y debe ser un número"
    ).isNumeric(),
    check(
      "id_escena",
      "El argumento id_escena es obligatorio y debe ser un número"
    ).isNumeric(),
    check(
      "id_paciente",
      "El argumento id_paciente es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  crearExperiencia
);

// Actualizar una experiencia existente
router.put(
  "/:id",
  [
    check("id", "El identificador no es válido").isNumeric(),
    check("titulo", "El argumento titulo debe ser un texto")
      .optional()
      .isString(),
    check("duracion", "El argumento duracion debe ser un número")
      .optional()
      .isNumeric(),
    check("fechaAlta", "El argumento fechaAlta debe ser un número")
      .optional()
      .isNumeric(),
    check("estresInicial", "El argumento estresInicial debe ser un número")
      .optional()
      .isNumeric(),
    check("estresFinal", "El argumento estresFinal debe ser un número")
      .optional()
      .isNumeric(),
    check("id_escena", "El argumento id_escena debe ser un número")
      .optional()
      .isNumeric(),
    check("id_paciente", "El argumento id_paciente debe ser un número")
      .optional()
      .isNumeric(),
    validarCampos,
  ],
  actualizarExperiencia
);

// Eliminar una experiencia
router.delete(
  "/:id",
  [check("id", "El identificador no es válido").isNumeric(), validarCampos],
  borrarExperiencia
);

module.exports = router;
