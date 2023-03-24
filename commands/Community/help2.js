const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-community')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let st = '';

            const community = fs.readdirSync('./commands/Community/').filter(file => file.endsWith('.js'));
            for (const file of community) {
                const command = require(`./${file}`);
                st += `${command.data.name + '\n'}`;


            }
            const embed = new EmbedBuilder()
                .setTitle('Community 💖')
                .setDescription(`\`\`\`${st}\`\`\``)
            return await interaction.reply({ embeds: [embed] })
    },
};