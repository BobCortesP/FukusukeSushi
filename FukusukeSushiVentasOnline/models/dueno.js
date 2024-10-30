const mongoose = require('mongoose');

const duenoSchema = new mongoose.Schema({
    nombre: String
});
module.exports = mongoose.model('Dueno', duenoSchema);