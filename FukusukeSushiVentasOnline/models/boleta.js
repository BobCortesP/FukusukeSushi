const mongoose = require('mongoose');

const boletaSchema = new mongoose.Schema({
    cliente: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'},
    cajeroVirtual: String,
    fecha: String,
    despacho: String
});

module.exports = mongoose.model('Boleta', boletaSchema);