const mongoose = require('mongoose');

const disponibleHistoricoSchema = new mongoose.Schema({
    fecha: String,
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'Producto'},
    disponibilidad: Boolean
});

module.exports = mongoose.model('DisponibleHistorico', disponibleHistoricoSchema);