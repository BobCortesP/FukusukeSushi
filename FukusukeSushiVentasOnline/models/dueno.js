const mongoose = require('mongoose');

const duenoSchema = new mongoose.Schema({
    nombre: String,
    pass: String
});
module.exports = mongoose.model('Dueno', duenoSchema);