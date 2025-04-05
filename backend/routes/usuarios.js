/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword, listaUsuarios, listaUsuariosRol } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.post('/rol/:rol', [
    validarJWT,
    check('rol', 'Debe indicar un rol de búsqueda').not().isEmpty().trim(),
    validarCampos,
], listaUsuariosRol);

router.get('/', [
    validarJWT,
    // Campos opcionales, si vienen los validamos
    check('id', 'El id de usuario debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'La busqueda debe contener texto').optional().trim(),
    validarCampos,
], obtenerUsuarios);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('password', 'El argumento password es obligatorio').not().isEmpty(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
], crearUsuario);

router.post('/lista', [
    validarJWT,
], listaUsuarios);

router.put('/np/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('password', 'El argumento password es obligatorio').not().isEmpty().trim(),
    check('nuevopassword', 'El argumento nuevopassword es obligatorio').not().isEmpty().trim(),
    check('nuevopassword2', 'El argumento nuevopassword2 es obligatorio').not().isEmpty().trim(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    validarCampos,
], actualizarPassword);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('apellidos', 'El argumento apellidos es obligatorio').not().isEmpty().trim(),
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('email', 'El argumento email debe ser un email').isEmail(),
    check('id', 'El identificador no es válido').isMongoId(),
    // campos que son opcionales que vengan pero que si vienen queremos validar el tipo
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
], actualizarUsuario);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarUsuario);


module.exports = router;