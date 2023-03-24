const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const echoSchema = require('../../Schemas.js/eco');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('flip the coin and get a chance to double your money')
        .addStringOption(option => option.setName('choice').setDescription('your choice heads/tails').setRequired(true).addChoices(
            { name: 'heads', value: 'heads' },
            { name: 'tails', value: 'tails' },
        ).setRequired(true))
        .addIntegerOption(option => option.setName('bet').setDescription('bet your money').setRequired(true)),
    async execute(interaction) {
        const { user, guild, options } = interaction;
        const data = await echoSchema.findOne({ Guild: guild.id, User: user.id });
        if (!data) {
            return await interaction.reply(`Please create you economy account by typing \`/setaccount\``)
        }
        const choice = options.getString('choice');
        const bet = options.getInteger('bet');

        if (bet > data.Wallet) {
            return await interaction.reply(`You have ${data.Wallet} in your wallet and you are betting for ${bet} 🤣`);
        }
        if (bet == data.Wallet) {
            return await interaction.reply(`You can't bet your whole wallet`);
        }

        const give = 3;
        const req = data.Level * data.Level * 20 + 20;
        data.XP += give;
        data.Used += 1;
        // data.save();
        if (give + data.XP > req) {
            data.Level += 1;
            // data.save();
        }

        const result = [
            {
                name: 'heads'
            },
            {
                name: 'tails'
            },
            {
                name: 'tails'
            },
            {
                name: 'tails'
            },
            {
                name: 'heads'
            },
            {
                name: 'heads'
            },
        ]
        const rand = Math.floor(Math.random() * result.length);
        const value = result[rand].name;

        if (choice == value) {
            const result = bet * 2;
            data.Wallet += result;

            await interaction.reply(`You guessed it correctly and you won $${result} 💸`);
        }
        if (choice != value) {
            const result = bet * 2;
            data.Wallet -= result;

            await interaction.reply(`You didn't guessed it correctly and lose $${result} 🥹`)
        }

        data.save();

    }
}