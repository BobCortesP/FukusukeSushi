const mongoose = require('mongoose');

const detalleCompraSchema = new mongoose.Schema({
    boleta: {type: mongoose.Schema.Types.ObjectId, ref: 'Boleta'},
    producto: {type: mongoose.Schema.Types.ObjectId, ref: 'Producto'},
    total: Number,
    cantidad: Number
});

module.exports = mongoose.model('DetalleCompra', detalleCompraSchema);