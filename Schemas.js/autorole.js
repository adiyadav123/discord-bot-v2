const { model, Schema } = require('mongoose');

const roleSchema = new Schema({
    Guild: String,
    Yes: Boolean,
    Role: String
})

module.exports = model('roleSchema', roleSchema);