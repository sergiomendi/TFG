/*
Ruta base: /api/eventos
*/

const { Router } = require("express");
const {
  obtenerEventosPorIdExperiencia,
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  borrarEvento,
} = require("../controllers/evento");
const { check } = require("express-validator");
const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");

const router = Router();

// Obtener eventos por id_experiencia
router.get(
  "/experiencia/:id_experiencia",
  [
    check(
      "id_experiencia",
      "El id del paciente debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  obtenerEventosPorIdExperiencia
);
// Obtener eventos
router.get(
  "/",
  [
    check("desde", "El parámetro 'desde' debe ser un número")
      .optional()
      .isNumeric(),
    validarCampos,
  ],
  obtenerEventos
);

// Crear un nuevo evento
router.post(
  "/",
  [
    check("fecha", "La fecha es obligatoria y debe ser un número").isNumeric(),
    check("tipo", "El tipo es obligatorio y debe ser un número").isNumeric(),
    check(
      "id_experiencia",
      "El id_experiencia es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  crearEvento
);

// Actualizar un evento existente
router.put(
  "/:id",
  [
    check("id", "El identificador no es válido").isNumeric(),
    check("fecha", "La fecha es obligatoria y debe ser un número").isNumeric(),
    check("tipo", "El tipo es obligatorio y debe ser un número").isNumeric(),
    check(
      "id_experiencia",
      "El id_experiencia es obligatorio y debe ser un número"
    ).isNumeric(),
    validarCampos,
  ],
  actualizarEvento
);

// Eliminar un evento
router.delete(
  "/:id",
  [check("id", "El identificador no es válido").isNumeric(), validarCampos],
  borrarEvento
);

module.exports = router;
