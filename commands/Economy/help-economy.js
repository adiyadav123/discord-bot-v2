const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help-economy')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        let st = '';
            const economy = fs.readdirSync('./commands/Economy/').filter(file => file.endsWith('.js'));
            for (const file of economy) {
                const command = require(`./${file}`);
                st += `${command.data.name}\n`;

                
            }
            const embed = new EmbedBuilder()
                    .setTitle('Economy 💸')
                    .setDescription(`\`\`\`${st}\`\`\``)
                return await interaction.reply({ embeds: [embed] })

    },
};