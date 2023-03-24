const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addsticker')
        .setDescription('it will add a sticker to your server')
        .addAttachmentOption(option => option.setName('file').setDescription('choose the file you want to upload').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('this will be the name of sticker').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    async execute(interaction) {

        const upload = interaction.options.getAttachment('file');
        const name = interaction.options.getString('name');

        try {
            if (name.length <= 2) return await interaction.reply({ content: `Your sticker name must be greater than 2 characters`, ephemeral: true });
            if (upload.contentType === 'image/gif') return await interaction.reply({ content: `You cannnot upload gif at this time`, ephemeral: true });

            await interaction.reply(`🕧 Loading your sticker...`)

            const sticker = await interaction.guild.stickers.create({ file: `${upload.attachment}`, name: `${name}` }).catch(err => {
                setTimeout(() => {
                    return interaction.editReply(`${err.rawError.message}`);
                }, 2000);
            })

            const emebd = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Successfully added 1 sticker with name \`${name}\``)

            setTimeout(() => {
                if (!sticker) return;

                interaction.editReply({ content: '', embeds: [emebd] });
            }, 3000);
        }catch(e){
            console.log(e)
            return;
        }

    }
}