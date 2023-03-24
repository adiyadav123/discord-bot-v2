const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("It will create a poll!")
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Choose the channel where you want to send the poll!')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription('enter the description here')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {

            const { user, guild, options } = interaction;
            const chID = options.getChannel('channel');
            // const channel = await guild.channels.cache.get(chID);
            const description = options.getString('description')

            const embed = new EmbedBuilder()
            .setColor('0x2f3136')
            .setDescription(`${description}`)

            await interaction.deferReply();

            const ms = await interaction.editReply({ content: `Successfully sent the poll to #${chID}`, ephemeral: true });
            const msg = await chID.send({ embeds:[embed] })
            msg.react("☑️");
            msg.react("❌");
        } catch (error) {
            await interaction.editReply({ content: `Got some errors, try again this command after few minutes`, ephemeral: true })
            return console.log(error)
        }
    }
}