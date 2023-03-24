const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leavelogs-setup')
    .setDescription('setup a channel in which the bot will send the leave logs')
    .addChannelOption(option =>
         option     
         .setName('channel')
         .setDescription('the channel where the bot will send the leave logs')
         .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const { guild, user } = interaction;
        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`✅ Leave log channel has been successfully set to ${channel.name}`)
        
        await db.set(`leavelogs_${guild.id}`, channel.id);

        await interaction.reply({ embeds: [embed] });
    }
}