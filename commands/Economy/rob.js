const { SlashCommandBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/eco');
let timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('rob a user and get a random money')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('choose a user you to rob')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user, guild, options } = interaction;
        if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: 'Cooldown bro⌚\nWait 30s to use this command again', ephemeral: true });
        const member = options.getUser('user');
        const data = await ecoSchema.findOne({ Guild: guild.id, User: user.id });
        const dat = await ecoSchema.findOne({ Guild: guild.id, User: member.id });

        if (!data) {
            return interaction.reply({ content: 'you dont have any money', ephemeral: true });
        }
        if (!dat) {
            return interaction.reply({ content: `${member.user} haven't any money in their wallet`, ephemeral: true });
        }

        if (data.Wallet < 1000) {
            return interaction.reply({ content: 'you dont have enough money to rob (go and get some money. You need more than $1,000 in your wallet)', ephemeral: true });
        }
        if (dat.Wallet < 1000) {
            return await interaction.reply('You choosed a wrong user, he is poor choose another one!')
        }
        if (user.id === member.id) {
            return await interaction.reply({ content: 'you cant rob yourself', ephemeral: true });
        }

        const positive = Math.round((Math.random() * dat.Wallet) + 20);
        const negative = Math.round((Math.random() * -350) - 20);

        const posN = [negative, positive];
        const amount = Math.round(Math.random() * posN.length);
        const value = posN[amount];
        console.log(value)

        if(value === undefined){
            return await interaction.reply(`The user called the cops, but you ran away. You didn't lose or gain anything`);
        }

        if (value >= 0) {
            const quotes = [
                "You were robbing a user and got ",
                "The server owner saw you and helped you to rob ",
                "You stole a user\'s wallet and got ",
                `You almost robbed the user and got`,
                "You robbed "
            ]
            const rand = Math.floor(Math.random() * quotes.length);
            if (isNaN(value)) {
                member.send(`**${user.username}** you were almost robbed in **${guild.name}** by **$${value}**, but they failed and they paid you $${nonSymbol}`)
                return await interaction.reply({ content: `The user called the cops, but you ran away. You didn't lose or gain anything` })
            }
            await interaction.reply({ content: `${quotes[[rand]]} $${value} ` })

            data.Wallet += value;
            dat.Wallet -= value;
            member.send(`**${user.username}** robbed you from **${guild.name}** and took **$${value}** from your wallet`)
            await data.save();
            await dat.save();
        }
        else if (value < 0) {
            const quotes = [
                "You got caught by the cops and lost ",
                "You left your id and got arrested, you lost ",
                "The person knocked you out and took "
            ]

            const wal = data.Wallet;
            if (isNaN(value)) {
                member.send(`**${user.username}** you were almost robbed in **${guild.name}** by **$${value}**, but they failed and they paid you $${nonSymbol}`)
                return await interaction.reply({ content: `The user called the cops, but you ran away. You didn't lose or gain anything` })
            }

            const rand = Math.floor(Math.random() * quotes.length);

            let nonSymbol;
            if (value - wal < 0) {
                const stringV = `${value}`;

                nonSymbol = stringV.slice(1);
                data.Bank += value;
                dat.Wallet -= value;
                await data.save();
                await data.save();
                member.send(`**${user.username}** you were almost robbed in **${guild.name}** by **$${value}**, but they failed and they paid you **$${nonSymbol}**`)
                return await interaction.reply({ content: `${quotes[[rand]]} $${nonSymbol} ` })

            }



            await interaction.reply(`${quotes[[rand]]} $${nonSymbol} `)

            data.Wallet += value;
            dat.Wallet -= value;
            member.send(`${user.username} you were almost robbed in ${guild.name} by $${value}, but they failed and they paid you $${nonSymbol}`)
            await data.save();
            await dat.save();
        }
        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 30000);
    }
}