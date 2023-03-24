const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-games')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let st = '';

            const community = fs.readdirSync('./commands/Games/').filter(file => file.endsWith('.js'));
            for (const file of community) {
                const command = require(`./${file}`);
                st += `${command.data.name + '\n'}`;


            }
            const embed = new EmbedBuilder()
                .setTitle('Games 🎮')
                .setDescription(`\`\`\`${st}\`\`\``)
            return await interaction.reply({ embeds: [embed] })
    },
};