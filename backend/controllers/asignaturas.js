const { response, query } = require('express');

const Asignatura = require('../models/asignaturas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');

const { infoToken } = require('../helpers/infotoken');


const obtenerAsignaturas = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const idprof = req.query.idprof || '';
    const textos = req.query.texto || '';
    const curso = req.query.curso || '';

    try {

        let asignaturas, total;
        if (id) {
            [asignaturas, total] = await Promise.all([
                Asignatura.findById(id).populate('curso'), //.populate('profesores.usuario', '-password -alta -__v'),                
                Asignatura.countDocuments()
            ]);


        } else {
            // {curso:'', {$or: {nombre : '', nombrecorto:''}, 'profesores.usuario':idprof}}}

            let query = {};

            if (textos !== '') {
                texto = new RegExp(textos, 'i');
                if (curso !== '') {
                    if (idprof !== '') {
                        // texto, curso e idprof
                        query = { curso: curso, $or: [{ nombre: texto }, { nombrecorto: texto }], 'profesores.usuario': idprof };
                    } else {
                        // texto, curso
                        query = { curso: curso, $or: [{ nombre: texto }, { nombrecorto: texto }] };
                    }
                } else {
                    if (idprof !== '') {
                        // texto e idprof
                        query = { $or: [{ nombre: texto }, { nombrecorto: texto }], 'profesores.usuario': idprof };
                    } else {
                        // texto
                        query = { $or: [{ nombre: texto }, { nombrecorto: texto }] };
                    }
                }
            } else {
                if (curso !== '') {
                    if (idprof !== '') {
                        // curso e idprof
                        query = { curso: curso, 'profesores.usuario': idprof };
                    } else {
                        query = { curso: curso }
                    }
                } else {
                    if (idprof !== '') {
                        query = { 'profesores.usuario': idprof };
                    } else {
                        query = {};
                    }
                }
            }

            [asignaturas, total] = await Promise.all([
                Asignatura.find(query).skip(desde).limit(registropp).populate('curso'), //.populate('profesores.usuario', '-password -alta -__v'),
                Asignatura.countDocuments(query)
            ]);

        }

        res.json({
            ok: true,
            msg: 'obtenerAsignaturas',
            asignaturas,
            items: asignaturas.items,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener asignaturas'
        });
    }
}


const crearAsignatura = async(req, res = response) => {

    // De lo que nos manden extraemos curso, profesores y alumnos
    // profesores y alumnos no se van a insertar al crear
    const { curso, profesores, alumnos, ...object } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear asignatura',
        });
    }

    try {

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        /*let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });

            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }

        }
        // Sustituir el campo profesores por la lista de profesores preparada
        asignatura.profesores = listaprofesoresinsertar;
        */

        const asignatura = new Asignatura(object);
        // Insertamos el curso que ya está comprobado en el body
        asignatura.curso = curso;
        // Almacenar en BD
        await asignatura.save();

        res.json({
            ok: true,
            msg: 'Asignatura creada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando asignatura'
        });
    }
}

const actualizarAsignatura = async(req, res) => {

    const { profesores, alumnos, curso, ...object } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para modificar asignatura',
        });
    }

    try {

        // Comprobar que la asignatura que se va a actualizar existe
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: false,
                msg: 'La asignatura no existe'
            });
        }

        // Comprobar que el curso que se va a asignar a la asignatura existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        /*let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });
            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la asignatura no existe o están repetidos'
                });
            }
        }
        object.profesores = listaprofesoresinsertar;
        */
        object.curso = curso;
        const asignatura = await Asignatura.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Asignatura actualizada',
            asignatura
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando asignatura'
        });
    }
}

const borrarAsignatura = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar asignatura',
        });
    }

    try {
        // Comprobamos si existe el asignatura que queremos borrar
        const existeAsignatura = await Asignatura.findById(uid);
        if (!existeAsignatura) {
            return res.status(400).json({
                ok: true,
                msg: 'El asignatura no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Asignatura.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Asignatura eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando asignatura'
        });

    }
}

const actualizarLista = async(req, res) => {

    const id = req.params.id;
    const tipo = req.body.tipo;
    const tiposPermitidos = ['profesores', 'alumnos'];
    const lista = req.body.lista;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para modificar lista de profesores/alumnos de asignatura',
        });
    }

    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo no permitido',
            tipo
        });
    }
    ['uid', 'uid', 'uid']
    // Antes de insertar, limpiamos la lista de posibles duplicados o no existentes ['1','2','3'] -> [{usuario:'1'},{usuario:'3'}]
    let listaInsertar = [];
    try {
        const usuarios = await Usuario.find({ _id: { $in: lista } }, { _id: 0, 'usuario': '$_id' });
        let objetc;
        if (tipo === 'alumnos') { object = { alumnos: usuarios }; } // { alumnos: [{usuario:'1'},{usuario:'3'}]}
        if (tipo === 'profesores') { object = { profesores: usuarios }; } // { profesores: : [{usuario:'1'},{usuario:'3'}]}
        const asignatura = await Asignatura.findByIdAndUpdate(id, object, { new: true });
        res.json({
            ok: true,
            msg: `Actualizar lista de ${tipo}`,
            asignatura
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: `Error al actualizar listas`
        });
    }
}


module.exports = { obtenerAsignaturas, crearAsignatura, actualizarAsignatura, borrarAsignatura, actualizarLista }