const { model, Schema } = require('mongoose');

const afkSchema = new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Time: Date
})

module.exports = model('afkSchema', afkSchema);