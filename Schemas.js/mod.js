const { model, Schema } = require('mongoose');

const modSchema = new Schema({
    Guild: String,
    User: String
});
module.exports = model("modSchema", modSchema);