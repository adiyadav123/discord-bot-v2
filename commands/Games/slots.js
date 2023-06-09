const { SlashCommandBuilder } = require('discord.js')
const { Slots } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('it is a simple slots game'),
    async execute(interaction){
        const Game = new Slots({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Slot Machine',
              color: '#5865F2'
            },
            slots: ['🍇', '🍊', '🍋', '🍌']
          });
          
          await Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
    }
}