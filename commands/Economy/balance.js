const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/eco');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('your economy balance')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('or any other user\'s balance')
    ),
    async execute(interaction){
        const { user, guild, options } = interaction;
        const users = options.getUser('user') || user;
        const member = guild.members.cache.get(users.id);

        const data = await ecoSchema.findOne({ Guild: guild.id, User: member.id  });
        if(!data){
            await interaction.reply(`You haven't created your account\nType \`/setAccount\` to create your account`);
            return;
        }
        const req = data.Level * data.Level * 20 + 20;
        const give = 3;
        const used = 1;
        if(give + data.XP >= req){
            data.Level += 1;
            await data.save();
        }
        data.Used += used;
        data.XP += give;
        data.Net = data.Wallet + data.Bank;
        data.save();

        const wallet = data.Wallet;
        const bank = data.Bank;
        const net = data.Net;

        const embed = new EmbedBuilder()
        .setColor("Black")
        .addFields(
            { name: 'Wallet', value: `${wallet}` },
            { name: 'Bank', value: `${bank}` },
            { name: 'Net Worth', value: `${net}` },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] })
        
    }
}