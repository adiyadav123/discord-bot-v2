const { SlashCommandBuilder } = require('discord.js')
const { Snake } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snake')
        .setDescription("Play snake game"),
    async execute(interaction) {
        const Game = new Snake({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Snake Game',
                overTitle: 'Game Over',
                color: '#5865F2'
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆️',
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        });

        try {
            await Game.startGame();
          } catch (err) {
            console.log(err);
            await interaction.reply('There was an error starting the game!');
          }
        Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
        });
    }
}