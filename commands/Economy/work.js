const { SlashCommandBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/eco');
const workSchema = require('../../Schemas.js/work');
// var user = []
var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work-setup')
        .setDescription('work to earn more money')
        // .addStringOption(option => option.setName('job').setRequired(true).addChoices(
        //             { name: 'hecker', value: 'heck' },
        //             { name: 'teacher', value: 'teach' },
        //             { name: 'chef', value: 'cook' },
        //             { name: 'actor', value: 'star' },
        //             { name: 'gay', value: 'gay' },
        //             { name: 'police', value: 'police' },
        //         ).setRequired(true)),
        .addStringOption(option => option.setName('job').setDescription('choose your job').setRequired(true).addChoices(
            { name: 'Hecker', value: 'heck' },
            { name: 'Teacher', value: 'teach' },
            { name: 'Chef', value: 'cook' },
            { name: 'Actor', value: 'star' },
            { name: 'Gay', value: 'gay' },
            { name: 'Police', value: 'police' },
        ).setRequired(true)),
    async execute(interaction) {
        if(timeout.includes(interaction.user.id)) return await interaction.reply('Cooldown bro ⌚\nTry again this command in 20 seconds');
       try{
        const { user, guild, options } = interaction;
        const choices = options.getString('job');

        let Data = await workSchema.findOne({ Guild: guild.id, User: user.id });
        const data = await ecoSchema.findOne({ Guild: guild.id, User: user.id })


        if (!data) {
            return await interaction.reply(`You haven't created your economy account.\nPlease create your account by typing \`/setaccount\``)
        }

        const give = 3;
        const req = data.Level * data.Level * 20 + 20;
        data.XP += give;
        data.Used += 1;
        data.save();
        if (give + data.XP > req) {
            data.Level += 1;
            // await data.save();
        }

        if (choices == 'heck') {
            const sal = 100;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();
            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        if (choices == 'teach') {
            const sal = 100;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();
            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        if (choices == 'cook') {
            const sal = 100;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();

            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        if (choices == 'star') {
            const sal = 100;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();
            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        if (choices == 'gay') {
            const sal = 100;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();
            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        if (choices == 'police') {
            const sal = 200;
            Data = new workSchema({
                Guild: guild.id,
                User: user.id,
                Work: `${choices}`
            })
            await Data.save();
            data.Wallet += sal;
            // await data.save();
            await interaction.reply(`Congracts you got $${sal} on your first work-shift`)
        }
        await data.save();
       } catch(e){
        console.log(e)
        return await interaction.reply(`You already selected your job!`)
       }
       timeout.push(interaction.user.id);
       setTimeout(() => {
           timeout.shift();
       }, 86400000);
    }
}