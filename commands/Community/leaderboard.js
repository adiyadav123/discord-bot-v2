const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js')
const levelSchema = require('../../Schemas.js/level');
const Canvacord = require('canvacord');

//  background image link -  https://i.ibb.co/q5rqfSW/canvacord.jpg

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-leaderboard')
    .setDescription("Leaderboard of server"),
  async execute(interaction) {
    const { guild, client } = interaction;
    let text = "";
    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(":white_check_mark: No one is on leaderboard yet!")

    const Data = await levelSchema.find({ Guild: guild.id })
      .sort({
        XP: -1,
        Level: -1
      })
      .limit(20)

    if (!Data) return await interaction.reply({ embeds: [embed1] });

    await interaction.deferReply();

    for (let counter = 0; counter < 10; ++counter) {
      let { User, XP, Level } = Data[counter]

      const value = await client.users.fetch(User) || "Unknown";
      const member = value.tag;
      text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level}\n`
      //   console.log(text)

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${interaction.guild.name}'s XP Leaderboard`)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setTimestamp()
        .setFooter({ text: "XP Leaderboard" })

        const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('first')
          .setLabel('Next')
          .setEmoji('⏭️')
          .setStyle(ButtonStyle.Success),
        )

      interaction.editReply({ embeds: [embed], components: [button] })
    }
    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async i => {
      if(i.customId === 'first'){
        let text = "";
        await i.deferReply();
        let data = await levelSchema.find({ Guild: guild.id })
        .sort({
          XP: -1,
          Level: -1
        })
        .limit(20)

        for (let counter = 10; counter < Data.length; ++counter) {
          let { User, XP, Level } = data[counter]
    
          const value = await client.users.fetch(User) || "Unknown";
          const member = value.tag;
          text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level}\n`
          //   console.log(text)
    
          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${interaction.guild.name}'s XP Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "XP Leaderboard" })


          i.editReply({ embeds: [embed] })
        }
      }
    })
  }
}