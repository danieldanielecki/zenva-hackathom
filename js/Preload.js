(function (global) {
  var Preload = global.Preload = function () {};

  Preload.prototype = {
    // Initialize settings before preload starts.
    init: function () {
      // Scale page to fill full screen size.
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
      this.scale.setScreenSize(true);
      this.scale.refresh();
    },

    // Load game assets before game starts.
    preload: function preload() {
      // Load sprite sheets with its metadata in JSON.
      this.load.atlasJSONArray('zenva',      spriteSheetImageZenva,       spriteSheetJSONZenva);
      this.load.atlasJSONArray('blueEnemy',   spriteSheetImageBlueEnemy,    spriteSheetJSONBlueEnemy);
      this.load.atlasJSONArray('greenEnemy',  spriteSheetImageGreenEnemy,   spriteSheetJSONGreenEnemy);
      this.load.atlasJSONArray('pinkEnemy',    spriteSheetImagePinkEnemy,     spriteSheetJSONPinkEnemy);
      this.load.atlasJSONArray('yellowEnemy', spriteSheetImageYellowEnemy,  spriteSheetJSONYellowEnemy);
      this.load.atlasJSONArray('beigeEnemy',  spriteSheetImageBeigeEnemy,   spriteSheetJSONBeigeEnemy);

      // Boards.
      this.load.image('target', spriteTarget);
      this.load.image('score', spriteScore);
      this.load.image('round', spriteRound);
      this.load.image('zenvas', spriteZenvas);

      // Scenarios.
      this.load.image('backgroundGame', backgroundGame);

      // Sounds spritesheets.
      this.game.load.spritesheet('audio', 'asset/audio.png', 49, 45);
      this.game.load.spritesheet('music', 'asset/music.png', 49, 45);

      // Audios.
      this.load.audio('audioBackgroundGame', audioBackgroundGame);
      this.load.audio('audioDeadEnemy', audioDeadEnemy);
      this.load.audio('audioDeadZenva', audioDeadZenva);
      this.load.audio('audioGameOver', audioGameOver);
    },

    // Create game.
    create: function () {
      this.state.start('Game'); // Start Menu state.
    }
  };
}(this));