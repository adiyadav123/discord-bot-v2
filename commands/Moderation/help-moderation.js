const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-moderation')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let st = '';
            const economy = fs.readdirSync('./commands/Moderation/').filter(file => file.endsWith('.js'));
            for (const file of economy) {
                const command = require(`./${file}`);
                st += `${command.data.name}\n`;

                
            }
            const embed = new EmbedBuilder()
                    .setTitle('Moderation 🛠️')
                    .setDescription(`\`\`\`${st}\`\`\``)
                return await interaction.reply({ embeds: [embed] })

    },
};