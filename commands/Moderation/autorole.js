const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const roleSchema = require('../../Schemas.js/autorole');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-autorole')
        .setDescription('it will setup the autorole system')
        .addRoleOption(option => option
            .setName('role')
            .setDescription('choose the role which you want to give a user joins')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('choose')
                .setDescription('choose what you want to do setup / disable')
                .addChoices(
                    { name: 'setup', value: 'setup' },
                    { name: 'disable', value: 'disable' },
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const { options, user, guild } = interaction;

        const role = options.getRole('role');
        const choice = options.getString('choose');

        let data = await roleSchema.findOne({ Guild: guild.id });
        if (!data) {
            data = new roleSchema({
                Guild: guild.id,
                Yes: false,
                Role: '123'
            })
        }

        if (choice === 'setup') {

            if (data.Yes === true) return await interaction.reply({ content: `Autorole system has been already enabled in your server`, ephemeral: true })

            data.Yes = true;
            data.Role = role.id;
            console.log(data.Role);

            await data.save();


            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(` ✅ Autorole system has been enabled in your server`)
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (choice === 'disable') {
            if (data.Yes === false) return await interaction.reply({ content: `Autorole system has been already disabled in your server`, ephemeral: true })

            console.log(data.Yes)
            console.log(data.Role)

            data.Yes = false;
            data.Role = '123';
            await data.save();


            console.log(data.Yes)
            console.log(data.Role)
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(` ✅ Autorole system has been successfully disabled in your server`)
            return await interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}