const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    persona: {type: mongoose.Schema.Types.ObjectId, ref: 'Persona'}
});

module.exports = mongoose.model('Cliente', clienteSchema);