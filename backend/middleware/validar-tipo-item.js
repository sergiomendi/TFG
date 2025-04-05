const { resonse } = require('express');
const tiposPermitidos = ['MIN', 'OBL', 'OPT'];

const validarTipoItem = (req, res = repsonse, next) => {

    const tipo = req.body.tipo;

    if (tipo && !tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo del item no es inválido, permitido: MIN, OBL u OPT'
        });
    }
    next();
}

module.exports = { validarTipoItem }