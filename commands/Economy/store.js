const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const echoSchema = require('../../Schemas.js/eco');
const stuff = require('../../Schemas.js/stuff');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('buy stuffs and increase your inventory')
        .addStringOption(
            option =>
                option
                    .setName('type')
                    .setDescription('type of product you want to buy')
                    .addChoices(
                        { name: 'animals', value: 'animals' },
                        { name: 'materials', value: 'materials' },
                    )
                    .setRequired(true)
        ),
    async execute(interaction) {
        const { user, guild } = interaction;
        const data = await echoSchema.findOne({ Guild: guild.id, User: user.id });
        const type = interaction.options.getString('type');
        if (!data) return await interaction.reply({ content: `You haven't created your economy account.\nPlease create your account by typing \`/setaccount\`` });


        await interaction.deferReply();

        if (type === 'materials') {
            const store = [
                {
                    name: 'Hunting Rifle',
                    price: 3000
                },
                {
                    name: 'Shovel',
                    price: 2000
                },
                {
                    name: 'Fishing Rod',
                    price: 1000
                },
                {
                    name: 'Gunpowder',
                    price: 500
                },
                {
                    name: 'Padlock',
                    price: 5000
                }
            ]

            var text = "";
            for (var c = 0; c < store.length; c++) {
                const { name, price } = store[c];

                text += `${c + 1}. ${name} | Price: $${price}\n`;

                const embed = new EmbedBuilder()
                    .setColor('Black')
                    .setDescription(`\`\`\`${text}\`\`\``)
                    .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
                    .setTimestamp()


                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('first')
                        .setLabel(`${store[0].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('second')
                        .setLabel(`${store[1].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('third')
                        .setLabel(`${store[2].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('fourth')
                        .setLabel(`${store[3].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('fifth')
                        .setLabel(`${store[4].name}`)
                        .setStyle(ButtonStyle.Primary),
                    )

                    await interaction.editReply({ embeds: [embed], components: [button] });
            }
        }


        if(type === "animals") {
            const store = [
                { 
                    name: 'Dragon',
                    price: 500000
                },
                {
                    name: 'Dinasaur',
                    price: 1000000
                },
                {
                    name: 'Lizard',
                    price: 20000
                },
                {
                    name: 'Dog',
                    price: 120000
                },
                {
                    name: 'Cat',
                    price: 10000
                }
            ]

            var text = "";
            for(var c = 0; c < store.length; c++) {
                const { name, price } =  store[c];
                text += `${c + 1}. ${name} | Price: $${price}\n`;

                const embed = new EmbedBuilder()
                    .setColor('Black')
                    .setDescription(`\`\`\`${text}\`\`\``)
                    .setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
                    .setTimestamp()


                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('fir')
                        .setLabel(`${store[0].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('s')
                        .setLabel(`${store[1].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('t')
                        .setLabel(`${store[2].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('f')
                        .setLabel(`${store[3].name}`)
                        .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                        .setCustomId('fi')
                        .setLabel(`${store[4].name}`)
                        .setStyle(ButtonStyle.Primary),
                    )

                    await interaction.editReply({ embeds: [embed], components: [button] });
            }
        }

        const collector = await interaction.channel.createMessageComponentCollector();
        let dat = await stuff.findOne({ Guild: guild.id, User: user.id });
        if(!dat){
            dat = new stuff({
                Guild: guild.id,
                User: user.id,
                Stuff: 'Banknote'
            })
        }
        collector.on("collect", async (i) => {
            if(i.customId === "first"){
                if(data.Wallet < 3000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 3000;
                dat.Stuff += 'Hunting Rifle';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "second"){
                if(data.Wallet < 2000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 2000;
                dat.Stuff += 'Shovel';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "third"){
                if(data.Wallet < 1000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 1000;
                dat.Stuff += 'Fishing Rod';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "fourth"){
                if(data.Wallet < 500){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 500;
                dat.Stuff += 'Gunpowder';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "fifth"){
                if(data.Wallet < 5000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 5000;
                dat.Stuff += 'Padlock';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }


            if(i.customId === "fir"){
                if(data.Wallet < 500000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 500000;
                dat.Stuff += 'Dragon';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "s"){
                if(data.Wallet < 1000000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 1000000;
                dat.Stuff += 'Dinasaur';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "t"){
                if(data.Wallet < 20000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 20000;
                dat.Stuff += 'Lizard';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "f"){
                if(data.Wallet < 120000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 120000;
                dat.Stuff += 'Dog';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            if(i.customId === "fi"){
                if(data.Wallet < 10000){
                    return await interaction.reply({ content: 'you haven\`t enough money in your wallet to buy this' });
                }
                data.Wallet -= 10000;
                dat.Stuff += 'Cat';
                await i.reply('Bought successfully, do \`/profile\` to check your stuff!');
            }
            await dat.save();
            await data.save();
        })

       
       
    }
}