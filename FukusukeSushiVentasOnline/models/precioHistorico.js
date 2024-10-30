const mongoose = require('mongoose');

const precioHistoricoSchema = new mongoose.Schema({
    fecha: String,
    descripcion: String,
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'Producto'},
    precio: Number
});

module.exports = mongoose.model('PrecioHistorico', precioHistoricoSchema);