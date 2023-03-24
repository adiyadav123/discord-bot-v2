const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const rollSchema = require('../../Schemas.js/roll');
const { QuickDB } = require('quick.db')
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nitro-gen')
    .setDescription('It will generate a nitro for you!'),
    async execute(interaction) {
        const { user, guild } = interaction;
        const Data = await rollSchema.findOne({ Guild: guild.id, User: user.id });
        const channel = await db.get(`rickroll_${guild.id}`);
        const ch = await guild.channels.cache.get(channel);
        if(!Data){
            rollSchema.create({
                Guild: guild.id,
                User: user.id
            })
        }
        await ch.send(`${user} got rick rolled hahaha :rickroll:`)
        console.log(ch)
        console.log(channel)
        user.send('https://media.tenor.com/x8v1oNUOmg4AAAAC/rickroll-roll.gif');
        user.send('Got rick rolled hahaha')

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription('I sent you the gift link please check your dms')
        await interaction.reply({ embeds: [embed] });
    }
}