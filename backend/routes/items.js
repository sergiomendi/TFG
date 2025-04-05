/*
Ruta base: /api/items
*/

const { Router } = require('express');
const { obtenerItems, crearItem, actualizarItem, borrarItem, actualizarOrden } = require('../controllers/items');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarTipoItem } = require('../middleware/validar-tipo-item');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del item debe ser válido').optional().isMongoId(),
    check('idasignatura', 'El id del item debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    validarCampos,
], obtenerItems);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio: MIN/OBL/OPT').not().isEmpty().trim(),
    validarTipoItem,
    // Opcionales si vienen limpiamos y comprobamos
    check('valor', 'El argumento valor debe ser un número').optional().isNumeric(),
    check('descripcion').optional().trim(),
    check('horasEstimadas', 'El argumento horasEstimadas debe ser un número').optional().isNumeric(),
    check('horasAbsolutas', 'El argumento horasAbsolutas debe ser un true/false').optional().isBoolean(),
    validarCampos,
], crearItem);
router.put('/orden', [
    validarJWT,
    check('listauids', 'El argumento lista es obligatorio').not().isEmpty(),
    validarTipoItem,
    // Opcionales si vienen limpiamos y comprobamos
    validarCampos,
], actualizarOrden);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('asignatura', 'El argumento asignatura no es válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio: MIN/OBL/OPT').not().isEmpty().trim(),
    validarTipoItem,
    // Opcionales si vienen limpiamos y comprobamos
    check('valor', 'El argumento valor debe ser un número').optional().isNumeric(),
    check('descripcion').optional().trim(),
    check('horasEstimadas', 'El argumento horasEstimadas debe ser un número').optional().isNumeric(),
    check('horasAbsolutas', 'El argumento horasAbsolutas debe ser un true/false').optional().isBoolean(),
    validarCampos,
], actualizarItem);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarItem);

module.exports = router;