const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { open_api } = require('../../config.json')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription("Ask questions to chatgpt!")
    .addStringOption(option => option.setName('question').setDescription('the question you want to ask!').setRequired(true)),

  async execute(interaction) {

    await interaction.deferReply();

    const question = interaction.options.getString('question');

    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: open_api,
    });
    const openai = new OpenAIApi(configuration);
  
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${question}`,
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });
  
  setTimeout(() => {
    const chatGPTResponse = response.data.choices[0].text.trim();

    const embed = new EmbedBuilder()
    .setDescription(`\`\`\`${chatGPTResponse}\`\`\``)

    interaction.editReply({ embeds: [embed] })
  }, 2000);
    }catch(e){
      console.log(e);
      return   interaction.editReply('error');
  }
  }
}