const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot-stats')
    .setDescription('gives some information about the bot'),
    async execute(interaction, client){
        const name = 'Karya';
        const icon = `${client.user.displayAvatarURL()}`;
        let guild = await client.guilds.cache.reduce((a, b) => a+b.memberCount, 0);
        let sec = (client.uptime / 1000);
        let days = Math.floor(sec / 86400);
        let hours = Math.floor(sec / 3600);
        sec %= 3600;
        let minutes = Math.floor(sec / 60);
        let seconds = Math.floor(sec % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes & ${seconds} seconds`;
        let ping = `${Date.now() - interaction.createdTimestamp} ms`;

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.gg/hCpYyjDVGD`),

            new ButtonBuilder()
            .setLabel('Bot Invite')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=1066394215107543061&permissions=8&scope=bot`)
        )

        const embed = new EmbedBuilder()
        .setColor("Black")
        .setAuthor({ name: name, iconURL: icon })
        .setThumbnail(`${icon}`)
        .setFooter({ text: `Bot id - ${client.id}` })
        .setTimestamp()
        .addFields(
            { name: 'Server Numbers', value: `${client.guilds.cache.size}`, inline: true },
            { name: 'Server Members', value: `${guild}`, inline: true },
            { name: 'Latency', value: `${ping}`, inline: true },
            { name: 'Uptime', value: `\`\`\`${uptime}\`\`\``, inline: true },
        )

        await interaction.reply({ embeds: [embed], components: [button] });
    }
}