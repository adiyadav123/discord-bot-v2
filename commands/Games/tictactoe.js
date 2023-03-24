const { 
    SlashCommandBuilder 
} = require('discord.js');

const { TicTacToe } = require('discord-gamecord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('Play a game of Tic Tac Toe with another user.')
    .addUserOption(option => 
      option.setName('opponent')
        .setDescription('The user you want to play with.')
        .setRequired(true)),

  async execute(interaction) {
    const game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser('opponent'),
      embed: {
        title: 'Tic Tac Toe',
        color: '#5865F2',
        statusTitle: 'Status',
        overTitle: 'Game Over'
      },
      emojis: {
        xButton: '❎',
        oButton: '🔵',
        blankButton: '➖'
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: 'DANGER',
      oButtonStyle: 'PRIMARY',
      turnMessage: '**{player}**, it is your turn!.',
      winMessage: '**{player}** won the TicTacToe Game!',
      tieMessage: 'The game tied! no one won the game!',
      timeoutMessage: 'The game went unfinished! no one won the game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
    });

    try {
      await game.startGame();
    } catch (err) {
      console.log(err);
      await interaction.reply('There was an error starting the game!');
    }

    game.on('gameOver', result => {
      console.log(result); // => { result... }
    });
  },
};