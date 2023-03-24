const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const echoSchema = require('../../Schemas.js/eco');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('withdraw your money from bank to wallet')
    .addIntegerOption (option => 
        option
        .setName('amount')
        .setDescription('the amount you want to withdraw')
        .setRequired(true)
    ),
    async execute(interaction){
        const { user, guild, options } = interaction;
        const amount = options.getInteger('amount');
        const data = await echoSchema.findOne({ Guild: guild.id, User: user.id });
        if(!data){
            return await interaction.reply({ content: 'You haven\'t created your economy account\nType \`/setaccount\` to create your account' });
        }

        if(data.Bank < amount){
            return await interaction.reply(`Lol you have $${data.Bank} in your bank and you are trying to withdraw $${amount} to your wallet 🤣`)
        }

        const give = 3;
        const req = data.Level * data.Level * 20 + 20;
        data.XP += give;
        if(give + data.XP > req){
            data.Level += 1;
        }
        data.Wallet += amount;
        data.Bank -= amount;
        await data.save();

        const embed  = new EmbedBuilder()
        .setColor("Blue")
        .setDescription('withdrawed successfully')
        .addFields(
            { name: 'Bank', value: `${data.Bank}`, inline: true },
            { name: 'Wallet', value: `${data.Wallet}`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}