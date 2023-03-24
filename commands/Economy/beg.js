const { SlashCommandBuilder, time } = require('discord.js')
const ecoSchema = require('../../Schemas.js/eco');
var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('beg for money'),
    async execute (interaction){

    if(timeout.includes(interaction.user.id)) return await interaction.reply('Cooldown bro ⌚\nTry again this command in 20 seconds');

        const { user, guild } = interaction;
        const data = await ecoSchema.findOne({ Guild: guild.id, User: user.id });
        const read = Math.floor( Math.random() * 100 );
        const value = read;
        const used = 1;

        if(!data){
            await interaction.reply({ content: `You haven't created any account\nType \`/setaccount\` to create your account` })
            return;
        }
        data.Wallet += value;
        data.Net += data.Wallet + data.Bank;
        data.Used += used;
        await data.save();

        if(!value){
            await interaction.reply('No money for you!')
        }

        await interaction.reply({ content: `Good job $${value} has been placed in your wallet` })

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 20000);

    }
}