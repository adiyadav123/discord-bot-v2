const { SlashCommandBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/eco');
const workSchema = require('../../Schemas.js/work')
var timeout = [];

module.exports = {
    data : new SlashCommandBuilder()
    .setName('work-shift')
    .setDescription('do job and earn money'),
    async execute(interaction){
        if(timeout.includes(interaction.user.id)) return await interaction.reply('Cooldown bro ⌚\nTry again this command in 20 minutes');
        const { user, guild } = interaction;
        const data = await ecoSchema.findOne({ Guild: guild.id, User: user.id });
        if(!data){
            return await interaction.reply(`Please create you economy account by typing \`/setaccount\``);
        }
        const Data = await workSchema.findOne({ Guild: guild.id, User: user.id });
        if(!Data){
            return await interaction.reply(`You haven't selected your job.\nPlease select your job by typing \`/work-setup\``);
        }
        if(Data.Work == 'heck'){
            // const sal = 10000;
            // data.Wallet += sal;
            // data.save();
            const us = [
                {
                    name: 'Police security and they gave you',
                    sal: 2000
                },
                {
                    name: 'your friend\'s computer and he gave you',
                    sal: 800
                },
                {
                    name: 'Nasa\'s Sattelite and they paid you',
                    sal: 5000
                },
                {
                    name: 'World and world paid you',
                    sal: 10000
                }
            ]
            const rand = Math.floor(Math.random() * us.length)
            const name = us[rand].name;
            const sal = us[rand].sal;
            data.Wallet += sal;
            data.save();
            await interaction.reply(`Congracts you hacked ${name}$${sal}`)
        }
        if(Data.Work == 'teach'){
            const sal = 500
            data.Wallet += sal;
            data.save();
            await interaction.reply(`You teached good and got $${sal}`)
        }
        if(Data.Work == 'cook'){
            const sal = 300;
            data.Wallet += sal;
            data.save();
            await interaction.reply(`Your cooked food was delicious and the God paid you $${sal}`)
        }
        if(Data.Work == 'star'){
            const sal = 1000;
            data.Wallet += sal;
            data.save()
            await interaction.reply(`Your movie was having an outstanding story and that's why you earned $${sal}`)
        }
        if(Data.Work == 'gay'){
            const sal = 300;
            data.Wallet += sal;
            data.save()
            await interaction.reply(`Here's your salary $${sal}`)
        }
        if(Data.Work == 'police'){
            const sal = 800;
            data.Wallet += sal;
            data.save()
            await interaction.reply(`You caught a terrorist and the president awarded you with $${sal}`)
        }

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 1200000);
    }

}