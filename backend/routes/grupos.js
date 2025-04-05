/*
Ruta base: /api/grupos
*/

const { Router } = require('express');
const { obtenerGrupos, crearGrupo, actualizarGrupo, borrarGrupo, actualizarLista } = require('../controllers/grupos');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del grupo debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto de búsqueda debe ser un texto').optional().trim(),
    check('curso', 'El curso debe ser un identificador de curso válido').optional().isMongoId(),
    validarCampos,
], obtenerGrupos);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Campos opciones, si vienen comprobamos el formato
    check('alumnos.*.usuario', 'El identificador de alumno no es válido').optional().isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], crearGrupo);
router.put('/lista/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarLista);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    check('id', 'El identificador no es válido').isMongoId(),
    // Campos opciones, si vienen comprobamos el formato
    check('alumnos.*.alumno', 'El identificador de alumno no es válido').optional().isMongoId(),
    check('proyecto').optional().trim(),
    check('proyectodes').optional().trim(),
    validarCampos,
], actualizarGrupo);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarGrupo);

module.exports = router;