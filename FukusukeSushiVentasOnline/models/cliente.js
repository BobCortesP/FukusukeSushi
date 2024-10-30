const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    run: String,
    nombreCompleto: String,
    direccion: String,
    comuna: String,
    provincia: String,
    region: String,
    fechaNacimiento: Date,
    sexo: String,
    email: String,
    telefono: String
});

module.exports = mongoose.model('Cliente', clienteSchema);