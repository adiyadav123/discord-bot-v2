const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const tranSchema = require('../../Schemas.js/transactions');
const ecoSchema = require('../../Schemas.js/eco')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('money-give-unlimited')
    .setDescription('you can unlimited money to users of your server in their wallet')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('the user you want to give money').setRequired(true)
    )
    .addIntegerOption(option =>
        option
        .setName('amount')
        .setDescription('the amount you want to give to a particular user or yourself')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction){
        const { user, guild, options } = interaction;
        const users = options.getUser('user') || user;
        const member = guild.members.cache.get(users.id);
        const amount = options.getInteger('amount');

        try{
            const Data = await ecoSchema.findOne({ Guild: guild.id, User: member.id });
        if(!Data){
            return await interaction.reply(`Please create your economy account by typing \`/setAccount\``)
        }

        const data = await tranSchema.findOne({ Guild: guild.id, User: member.id });
        if(!data) {
            tranSchema.create({
                Guild: guild.id,
                User: user.id,
                Amount: 0,
                To: member.id
            });
        }
        
        const req = Data.Level * Data.Level * 20 + 20;
        const give = 10;
        Data.Wallet += amount;
        Data.XP += give;
        Data.save();
        if(Data.XP >= req){
            Data.Level += 1;
            Data.save();
        }
        // Data.save();
        // data.To += member.id;
        // data.Amount += amount;
        // data.save();

        const embed = new EmbedBuilder()
        .setColor("Black")
        .setDescription('\`$sudo heck unlimited-money\`')
        .addFields(
            { name: 'Amount', value: `${amount}`, inline: true },
            { name: 'To', value: `${member.user}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `${guild.name}` })

        await interaction.reply({ embeds: [embed] })
    
        }catch(e){
            console.log(e)
            return await interaction.reply('Go an error try again after some time');
        }

    }
}