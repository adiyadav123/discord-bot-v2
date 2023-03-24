const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say-birthday')
    .setDescription('say happy birthday to a user')
    .addUserOption(option => option.setName('user').setDescription('the user you want to say happy birthday').setRequired(true)),
    async execute(interaction){
        const { user, options } = interaction;

        const users = options.getUser('user');
        await interaction.reply({ content: `Wishing you a very happy birthday ${users}. Have some cake 🍰🍰.And do not forget to give me return gift🎁 (joking lol😆)` })
    }
}