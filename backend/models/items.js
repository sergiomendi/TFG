const { Schema, model } = require('mongoose');

const ItemSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    descripcion: {
        type: String
    },
    valor: {
        type: Number
    },
    horasEstimadas: {
        type: Number
    },
    horasAbsolutas: {
        type: Boolean,
        default: false
    },
    tipo: {
        type: String,
        require: true,
        default: 'OBL'
    },
    asignatura: {
        type: Schema.Types.ObjectId,
        ref: 'Asignatura',
        require: true
    },
    orden: {
        type: Number,
        default: 0,
        require: true
    }
}, { collection: 'items' });

ItemSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;
})

module.exports = model('Item', ItemSchema);