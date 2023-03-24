const { model, Schema } = require('mongoose');

const inviteSchema = new Schema({
    Guild: String,
    Channel: String,
});
module.exports = model('inviteSchema', inviteSchema);