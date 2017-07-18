(function (global) {
  var game = new Phaser.Game(640, 360, Phaser.AUTO, 'body');

  // Add Phaser states.
  game.state.add('Preload', Preload);
  game.state.add('Game', Game);

  game.state.start('Preload'); // Start Preload state.
}(this));