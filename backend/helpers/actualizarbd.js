const Usuario = require('../models/usuarios');
const fs = require('fs');
const { infoToken } = require('../helpers/infotoken');

const actualizarBD = async(tipo, path, nombreArchivo, id, token) => {

    switch (tipo) {
        case 'fotoperfil':

            const usuario = await Usuario.findById(id);
            if (!usuario) {
                return false;
            }

            // Comprobar que el id de usuario que actualiza es el mismo id del token
            // solo el usuario puede cambiar su foto
            if (infoToken(token).uid !== id) {
                console.log('el usuario que actualiza no es el propietario de la foto')
                return false;
            }

            const fotoVieja = usuario.imagen;
            const pathFotoVieja = `${path}/${fotoVieja}`;
            if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }

            usuario.imagen = nombreArchivo;
            await usuario.save();

            return true;

            break;

        case 'evidencia':

            return false;
            break;

        default:
            return false;
            break;
    }

    console.log(tipo, path, nombreArchivo, id);
}

module.exports = { actualizarBD }