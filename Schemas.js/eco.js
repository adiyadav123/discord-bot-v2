const { model, Schema } = require('mongoose');

const ecoSchema = new Schema({
    Guild: String,
    User: String,
    Wallet: Number,
    Bank: Number,
    Stuff: String,
    Level: Number,
    XP: Number,
    Net: Number,
    Used: Number,
})

module.exports = model('ecoSchema', ecoSchema);