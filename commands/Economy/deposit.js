const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const echoSchema = require('../../Schemas.js/eco')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('deposit your money from your wallet to bank')
    .addIntegerOption( option => 
        option
        .setName('amount')
        .setDescription('the amount you want to deposit')
        .setRequired(true)
    ),
    async execute(interaction){
        const { user, guild, options } = interaction;
        const amount = options.getInteger('amount');

        const data =  await echoSchema.findOne({ Guild: guild.id, User: user.id });
        if(!data){
            return await interaction.reply(`Please create your economy account by typing \`/setaccount\``);
        }
        if(data.Wallet < amount ){
            return await interaction.reply(`Lol you have $${data.Wallet} in your wallet and you are trying to deposit $${amount} in your bank 🤣`)
        }
        const give = 3;
        const req = data.Level * data.Level * 20 + 20;
        data.XP += give;
        if(give + data.XP > req){
            data.Level += 1;
        }
        data.Wallet -= amount;
        data.Bank += amount;
        await data.save();

        const embed  = new EmbedBuilder()
        .setColor("Blue")
        .setDescription('deposited successfully')
        .addFields(
            { name: 'Bank', value: `${data.Bank}`, inline: true },
            { name: 'Wallet', value: `${data.Wallet}`, inline: true },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] });
    }
}