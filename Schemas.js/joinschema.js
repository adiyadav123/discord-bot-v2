const { model, Schema } = require(`mongoose`);

let joinsSchema = new Schema({
    guildid: String,
    channel: String,
    message: String,
})


module.exports = model(`joinsSchema`, joinsSchema);