const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatbot-setup')
        .setDescription('it will setup the chatbot to a particular channel')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('select a channel where you want to make the chatbot active')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('choose')
            .setDescription('choose whether you want to setup or disable it')
            .addChoices(
                { name: 'setup', value: 'setup' },
                { name: 'disable', value: 'disable' },
            )
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const { user, guild, options } = interaction;

        const channel = options.getChannel('channel');
        const choice = options.getString('choose');

        const data = await db.get(`chatbot_${guild.id}`);

        if (choice === 'setup') {
            if (data) {
                return await interaction.reply(`Chatbot is already enabled in your server (re-enable it if you want to change the channel)`);
            }
            await db.set(`chatbot_${guild.id}`, channel.id);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Chatbot has been set up to ${channel}`)

            channel.send(`I am active here, ask me question and I will answer it within some seconds (enabled in this server by ${user})`);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (choice === 'disable') {

            if (!data) return await interaction.reply(`Chatbot is already disabled in your server!`);

            await db.deleteAll(`chatbot_${guild.id}`)

            return await interaction.reply(`Chatbot has been successfully removed from your server!`)

        }
    }
}