const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    
    async execute(message) {

        if (message.author.bot) return;
        if (message.channel.type != 'DM') return;

        message.react('👍');
        console.log(message.content)
    },
};