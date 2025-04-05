const { response } = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const Grupo = require('../models/grupos');
const { infoToken } = require('../helpers/infotoken');

/*
get / 
<-- desde? el salto para buscar en la lista de usuarios
    id? un identificador concreto, solo busca a este
--> devuleve todos los usuarios
*/

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const listaUsuarios = async(req, res) => {
    const lista = req.body.lista;

    if (!lista) {
        return res.json({
            ok: true,
            msg: 'listaUsuarios',
            usuarios: 'none',
        });
    }

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    try {
        const usuarios = await Usuario.find({ _id: { $in: lista }, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.json({
            ok: true,
            msg: 'listaUsuarios',
            usuarios
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar usuarios por uids',
        });
    }

}

const listaUsuariosRol = async(req, res) => {
    const rol = req.params.rol;
    const lista = req.body.lista;

    // Solo puede listar usuarios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para listar usuarios',
        });
    }

    listaB = [];
    if (!lista) { listaB = []; }

    try {
        const usuarios = await Usuario.find({ _id: { $nin: lista }, rol: rol, activo: true }).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 });
        res.json({
            ok: true,
            msg: 'listaUsuarios',
            usuarios
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar usuarios por rol',
            error
        });
    }

}

const obtenerUsuarios = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar usuarios',
            });
        }

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {

            let query = {};
            if (texto) {
                query = { $or: [{ nombre: textoBusqueda }, { apellidos: textoBusqueda }, { email: textoBusqueda }] };
            }

            [usuarios, total] = await Promise.all([
                Usuario.find(query).skip(desde).limit(registropp).collation({ locale: 'es' }).sort({ apellidos: 1, nombre: 1 }),
                Usuario.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniedo usuarios'
        });
    }
}


const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Solo puede crear usuarios un admin
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear usuarios',
            });
        }

        // Comrprobar que no existe un usuario con ese email registrado
        const exiteEmail = await Usuario.findOne({ email: email });

        if (exiteEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        // Cifrar la contraseña, obtenemos el salt y ciframos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(password, salt);

        // Vamos a tomar todo lo que nos llega por el req.body excepto el alta, ya que la fecha de alta se va a signar automáticamente en BD
        const { alta, ...object } = req.body;
        const usuario = new Usuario(object);
        usuario.password = cpassword;

        // Almacenar en BD
        await usuario.save();

        res.json({
            ok: true,
            msg: 'crearUsuarios',
            usuario: usuario,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando usuario'
        });
    }
}


const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ROL_ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

const actualizarUsuario = async(req, res = response) => {

    // Asegurarnos de que aunque venga el password no se va a actualizar, la modificaciñon del password es otra llamada
    // Comprobar que si cambia el email no existe ya en BD, si no existe puede cambiarlo
    const { password, alta, email, activo, ...object } = req.body;
    const uid = req.params.id;


    try {
        // Para actualizar usuario o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN' || infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        // Comprobar si está intentando cambiar el email, que no coincida con alguno que ya esté en BD
        // Obtenemos si hay un usuaruio en BD con el email que nos llega en post
        const existeEmail = await Usuario.findOne({ email: email });

        if (existeEmail) {
            // Si existe un usuario con ese email
            // Comprobamos que sea el suyo, el UID ha de ser igual, si no el email est en uso
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }

        // Comprobar si existe el usuario que queremos actualizar
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        if ((infoToken(token).rol === 'ROL_ADMIN') && activo !== undefined) {
            object.activo = activo;
        }
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario: usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}

/*
delete /:id
--> OK si ha podido borrar
*/
const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar usuarios un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar usuarios',
            });
        }

        // No me puedo borrar a mi mismo
        if ((infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no puede eliminarse a si mismo',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }
}


module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword, listaUsuarios, listaUsuariosRol }