const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    run: String,
    nombreCompleto: String,
    direccion: String,
    comuna: String,
    provincia: String,
    region: String,
    fechaNacimiento: Date,
    sexo: String,
    telefono: String
});

module.exports = mongoose.model('Persona', personaSchema);