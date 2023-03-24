const { model, Schema } = require('mongoose');

const stuffsSchema = new Schema({
    Guild: String,
    User: String,
    Stuff: String
})

module.exports = model('stuffs', stuffsSchema);