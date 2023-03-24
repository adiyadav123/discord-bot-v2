const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ecoSchema = require('../../Schemas.js/eco');
const stuff = require('../../Schemas.js/stuff');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('your economy balance')
    .addUserOption(option => 
        option
        .setName('user')
        .setDescription('or any other user\'s balance')
    ),
    async execute(interaction){
        const { user, guild, options } = interaction;
        const users = options.getUser('user') || user;
        const member = guild.members.cache.get(users.id);

        const data = await ecoSchema.findOne({ Guild: guild.id, User: member.id  });
        if(!data){
            await interaction.reply(`You haven't created your account\nType \`/setAccount\` to create your account`);
            return;
        }
        const req = data.Level * data.Level * 20 + 20;
        const give = 3;
        const used = 1;
        if(give + data.XP >= req){
            data.Level += 1;
            await data.save();
        }
        data.Used += used;
        data.XP += give;
        data.save();

        let da = await stuff.findOne({ Guild: guild.id, User: member.id  });
        if(!da){
            da = new stuff({
                Guild: guild.id,
                User: member.id,
                Stuff: 'Banknote'
            })

            await da.save();
        }

        const wallet = data.Wallet;
        const bank = data.Bank;
        const net = wallet + bank;
        const use = data.Used;
        const xp = data.XP;
        const level = data.Level;
        const stff =  da.Stuff + ", " ;

        const embed = new EmbedBuilder()
        .setColor("Black")
        .setTitle(`${member.user.username}'s Profile`)
        .setThumbnail(member.displayAvatarURL())
        .addFields(
            { name: 'Wallet', value: `${wallet}` , inline: true},
            { name: 'Bank', value: `${bank}`, inline: true },
            { name: 'Net Worth', value: `${net}`, inline: true },
            { name: 'Used', value: `${use} times` , inline: true},
            { name: 'XP', value: `${xp}`, inline: true },
            { name: 'Level', value: `${level}`, inline: true },
            { name: 'Stuff', value: `${stff}, `, inline: true },
        )
        .setTimestamp()

        await interaction.reply({ embeds: [embed] })
        
    }
}