const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
 
module.exports = {
   data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('it will show the spotify status of a user')
    .addUserOption(option => option.setName('user').setDescription('choose the user').setRequired(true)),
    async execute(interaction) {
 
        let user = interaction.options.getMember('user');
 
        if (user.bot) return interaction.reply({ content: '', ephemeral: true});
 
        await interaction.deferReply();
        let status;
        console.log(user.presence.activities[0]);
        if(user.presence.activities.length === 1) status = user.presence.activities[0];
        
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];
 
        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            return await interaction.editReply({ content: `${user.user.username} is not listening to spotify.`, ephemeral: true});
        }
 
        if (status !== null && status.name === "Spotify" && status.assets !== null) {
 
            const member = interaction.guild.members.cache.get(user.id)
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state,
            album = status.assets.largeText;
 
            const card = new canvacord.Spotify()
            .setBackground("IMAGE", 'https://i.ibb.co/0nbwmrK/Untitled.png')
            .setAuthor(artist)
            .setAlbum(album)
            .setStartTimestamp(status.timestamps.start)
            .setEndTimestamp(status.timestamps.end)
            .setImage(image)
            .setTitle(name)
 
            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: "spotify.png" });
 
            const embed = new EmbedBuilder()
            .setTitle('Spotify')
            .setDescription('The use is listening to')
            .setImage('attachment://spotify.png')
            .setColor("#d1d7ea")
            .setTimestamp()
 
            await interaction.editReply({ embeds: [embed], files: [attachments] })
        }
    }
}