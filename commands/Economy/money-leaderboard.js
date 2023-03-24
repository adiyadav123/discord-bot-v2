const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const echoSchema = require('../../Schemas.js/eco');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('money-leaderboard')
    .setDescription('check the money leaderboard')
    .addStringOption(option => 
        option 
        .setName('scope')
        .setDescription('field to check balance')
        .addChoices(
            { name: 'wallet-bank', value: 'wallet' },
            { name: 'money-level-xp', value: 'level' },
        )
        .setRequired(true)
    ),
    async execute(interaction){
        const { guild, client } = interaction;
        const choice = interaction.options.getString('scope');
        let text = "";
          const embed1 = new EmbedBuilder()
          .setColor("Blue")
          .setDescription(":white_check_mark: No one is on leaderboard yet!")

          const Data = await echoSchema.find({ Guild: guild.id })
          .sort({
            Bank: -1,
            XP: -1,
            Level: -1,
            Wallet: -1
          })
          .limit(10)

          if(!Data) return await interaction.reply({ embeds: [embed1] });

          await interaction.deferReply();

          if(choice == 'wallet'){
            for(let counter = 0; counter < Data.length; ++counter){
                let { Wallet, Bank, User } = Data[counter]

            const value = await client.users.fetch(User) || "Unknown";
            const member = value.tag;
            text +=`${counter + 1}. ${member} | Wallet: ${Wallet} | Bank: ${Bank}\n`;

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${interaction.guild.name}'s Economy Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "Economy Leaderboard" })

            interaction.editReply({ embeds: [embed] })
            }
        }
        if(choice == 'level'){
            for(let counter = 0; counter < Data.length; ++counter){
                let { XP, Level, User } = Data[counter]

            const value = await client.users.fetch(User) || "Unknown";
            const member = value.tag;
            text +=`${counter + 1}. ${member} | XP: ${XP} | Level: ${Level}\n`;

            const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${interaction.guild.name}'s Economy Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "Economy Leaderboard" })

            interaction.editReply({ embeds: [embed] })
            }
        }
    }
}