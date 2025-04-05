const { Schema, model } = require('mongoose');

const AsignaturaSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    nombrecorto: {
        type: String,
        require: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    profesores: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }],
    alumnos: [{
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }],
    alta: {
        type: Date,
        default: Date.now
    },
}, { collection: 'asignaturas' });

AsignaturaSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Asignatura', AsignaturaSchema);