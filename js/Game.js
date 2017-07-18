(function (global) {
  var Game = global.Game = function (game) {};

  Game.prototype.create = function () {
    this.stage.disableVisibilityChange = true; // Continue game on lost focus in the window.

    this.createGame = true; // Create game.
    this.amountEnemies = 0; // Set initial amount of enemies to 0.

    // Background.
    this.background = this.game.add.sprite(0, 0, 'backgroundGame');

    // Target.
    this.target = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'target');
    this.target.anchor.setTo(0.5, 0.5);
    this.target.z = 1;
    this.groupGame = this.game.add.group();
    this.groupGame.enableBody = true;
    this.groupGame.physicsBodyType = Phaser.Physics.ARCADE;
    this.groupGame.add(this.target);

    // Score text.
    this.score = 0;
    this.spriteScore = this.game.add.sprite(this.game.world.width * 0.03, this.game.world.height * 0.03, 'score');
    this.scoreText = this.game.add.text(this.game.world.width * 0.1, this.game.world.height * 0.04, this.score, {
      font: '25px arcade_normalregular',
      fill: '#ffffff',
      align: 'right',
      stroke: '#666666',
      strokeThickness: 7
    });
    this.scoreTextTween = this.add.tween(this.scoreText.scale).to({x: 2, y: 2}, 100, Phaser.Easing.Linear.In).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.In);

    // Round text.
    this.stage = 0;
    this.spriteRound = this.game.add.sprite(this.game.world.width * 0.2, this.game.world.height * 0.03, 'round');
    this.roundText = this.game.add.text(this.game.world.width * 0.25, this.game.world.height * 0.04, this.stage, {
      font: '25px arcade_normalregular',
      fill: '#ffffff',
      align: 'right',
      stroke: '#666666',
      strokeThickness: 7
    });
    this.roundTextTween = this.add.tween(this.roundText.scale).to({x: 2, y: 2}, 100, Phaser.Easing.Linear.In).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.In);

    // Kills text.
    this.amountZenvas = 0;
    this.spriteAmountZenvas = this.game.add.sprite(this.game.world.width * 0.37, this.game.world.height * 0.03, 'zenvas');
    this.amountZenvasText = this.game.add.text(this.game.world.width * 0.45, this.game.world.height * 0.04, this.amountZenvas, {
      font: '25px arcade_normalregular',
      fill: '#ffffff',
      align: 'right',
      stroke: '#535353',
      strokeThickness: 7
    });
    this.amountZenvasTextTween = this.add.tween(this.amountZenvasText.scale).to({x: 2, y: 2}, 100, Phaser.Easing.Linear.In).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.In);

    // Sounds.
    this.soundGame = this.game.add.audio('audioBackgroundGame');
    this.soundDeadZenva = this.game.add.audio('audioDeadZenva');
    this.soundGameOver = this.game.add.audio('audioGameOver');
    this.soundDeadEnemy = this.game.add.audio('audioDeadEnemy');

    // Sound buttons.
    this.buttonMusic = this.game.add.button(this.game.world.width * 0.83, this.game.world.height * 0.03, 'music', this.toggleBackgroundMusic, this);
    this.buttonMusicToggle = false;
    this.buttonAudio = this.game.add.button(this.game.world.width * 0.91, this.game.world.height * 0.03, 'audio', this.toggleGameAudio, this);
    this.buttonAudioToggle = false;

    this.soundGame.play('', 0, 1, true); // Play game music in the loop.
  };

  // Loop throughout game and update necessary stuff.
  Game.prototype.update = function () {
    this.hit(); // Call hit method.

    if (this.gameOver()) {
      return; // Return true if gameOver occured.
    }

    this.updateRound(); // Update round.
    this.updateTarget(); // Update target.

    this.groupGame.sort('y', Phaser.Group.SORT_ASCENDING);
  };

  // Punctuate statistics when Blue Enemy killed.
  Game.prototype.punctuateBlueEnemy = function () {
    this.amountEnemies -= 1; // Decrement amount of enemies.
    this.score += 1; // Increment score.
    this.scoreTextTween.start(); // Start tween animation.
    this.scoreText.setText(this.score); // Set score text.
  };

  // Punctuate statistics when Green Enemy killed.
  Game.prototype.punctuateGreenEnemy = function () {
    this.amountEnemies -= 1; // Decrement amount of enemies.
    this.score += 4; // Increment score.
    this.scoreTextTween.start(); // Start tween animation.
    this.scoreText.setText(this.score); // Set score text.
  };

  // Punctuate statistics when Pink Enemy killed.
  Game.prototype.punctuatePinkEnemy = function () {
    this.amountEnemies -= 1; // Decrement amount of enemies.
    this.score += 5; // Increment score.
    this.scoreTextTween.start(); // Start tween animation.
    this.scoreText.setText(this.score); // Set score text.
  };

  // Punctuate statistics when Beige Enemy killed.
  Game.prototype.punctuateBeigeEnemy = function () {
    this.amountEnemies -= 1; // Decrement amount of enemies.
    this.score += 1; // Increment score.
    this.scoreTextTween.start(); // Start tween animation.
    this.scoreText.setText(this.score); // Set score text.
  };

  // Punctuate statistics when Yellow Enemy killed.
  Game.prototype.punctuateYellowEnemy = function () {
    this.amountEnemies -= 1; // Decrement amount of enemies.
    this.score += 3; // Increment score.
    this.scoreTextTween.start(); // Start tween animation.
    this.scoreText.setText(this.score); // Set score text.
  };

  // Play sound when Enemy killed.
  Game.prototype.playSoundDeadEnemy = function () {
    this.soundDeadEnemy.play(); // Play dead enemy sound.
  };

  // Update current stage.
  Game.prototype.stageMethod = function () {
    this.roundText.setText(++this.stage); // Set stage text.
    this.roundTextTween.start(); // Start tween animation.
  };

  // Update amount of zenvas.
  Game.prototype.amountZenvasMethod = function (amountZenvas) {
    this.amountZenvasText.setText(this.amountZenvas += amountZenvas); // Set amount of zenvas text.
    this.amountZenvasTextTween.start(); // Start tween animation.
  };

  // Game over method.
  Game.prototype.gameOver = function () {
    this.game.lastScore = this.score; // Get last score.
    this.game.lastRound = this.stage; // Get last round.

    // Check if there are no more zenvas of the map.
    if (this.amountZenvas === 0 && !this.createGame) {
      // No more zenvas on the map then the game is over.
      this.soundGameOver.play(); // Play game over sound.
      this.soundGame.stop(); // Stop playing background music.

      this.game.state.start('Game'); // Start Game state.

      return true;
    }
    return false;
  };

  // Hit method.
  Game.prototype.hit = function () {
    this.game.physics.arcade.overlap(this.groupGame, this.groupGame, this.collisionHandler, null, this); // Overlap zenvas, enemies and hanle collision.
  };

  // Collision handler method.
  Game.prototype.collisionHandler = function (obj1, obj2) {
    var zenva, enemy; // Set variables.

    // Check collisions between Zenva and every Enemy and set to appropriate object.
    if (obj1 instanceof Zenva && (obj2 instanceof BlueEnemy || obj2 instanceof GreenEnemy || obj2 instanceof PinkEnemy || obj2 instanceof BeigeEnemy || obj2 instanceof YellowEnemy)) {
      zenva = obj1;
      enemy = obj2;
    } else if ((obj1 instanceof BlueEnemy || obj1 instanceof GreenEnemy || obj1 instanceof PinkEnemy || obj1 instanceof BeigeEnemy || obj1 instanceof YellowEnemy) && obj2 instanceof Zenva) {
      zenva = obj2;
      enemy = obj1;
    }
    else {
      return;
    }

    // Check if zenva is alive on collision.
    if (zenva.alive) {
      zenva.killZenva(enemy); // Kill Zenva on collision.
      this.soundDeadZenva.play(); // Play dead zenva sound.
    }
  };

  // Initialize zenvas.
  Game.prototype.initZenvas = function () {
    var zenva = new Zenva(this); // Zenva constructor.

    this.groupGame.add(zenva); // Add zenvas to the game.
    this.amountZenvasMethod(1); // Increment by 1 number of current zenvas on the world in the HUD.
    this.createGame = false; // Don't create game while initializing Zenvas.
  };

  // Initialize enemies.
  Game.prototype.initEnemies = function (person) {
    // Constructors of enemies.
    var blueEnemy = new BlueEnemy(this, person);
    var greenEnemy = new GreenEnemy(this, person);
    var pinkEnemy = new PinkEnemy(this, person);
    var beigeEnemy = new BeigeEnemy(this, person);
    var yellowEnemy = new YellowEnemy(this, person);

    // Add enemies to the game.
    this.groupGame.add(blueEnemy);
    this.groupGame.add(greenEnemy);
    this.groupGame.add(pinkEnemy);
    this.groupGame.add(beigeEnemy);
    this.groupGame.add(yellowEnemy);

    this.createGame = false; // Don't create game while adding enemies.

    // Check if Blue Enemy exists in the game.
    if (blueEnemy) {
      // Blue Enemy exists in the game.
      this.amountEnemies += 1; // Increment number of enemies.
    }
    // Check if Green Enemy exists in the game.
    else if (greenEnemy) {
      // Green Enemy exists in the game.
      this.amountEnemies += 1; // Increment number of enemies.
    }
    // Check if Pink Enemy exists in the game.
    else if (pinkEnemy) {
      // Pink Enemy exists in the game.
      this.amountEnemies += 1; // Increment number of enemies.
    }
    // Check if Beige Enemy exists in the game.
    else if (beigeEnemy) {
      // Beige Enemy exists in the game.
      this.amountEnemies += 1; // Increment number of enemies.
    }
    // Check if Yellow Enemy exists in the game.
    else if (yellowEnemy) {
      // Yellow Enemy exists in the game.
      this.amountEnemies += 1; // Increment number of enemies.
    }
  };

  // Update round method.
  Game.prototype.updateRound = function () {
    // Check if there are no more enemies.
    if (this.amountEnemies === 0) {
      // No more enemies on the map.
      this.stageMethod(); //
      this.amountEnemies = this.stage * 2; // Multiply amount of enemies depended by stage.
      this.game.time.events.repeat(Phaser.Timer.SECOND * 2, 3, this.initZenvas, this);
      this.game.time.events.repeat(Phaser.Timer.SECOND * 10, this.amountEnemies, this.initEnemies, this);
    }
  };

  // Update target method.
  Game.prototype.updateTarget = function () {
    // Set target coordinates to input coordinates.
    this.target.x = this.game.input.x;
    this.target.y = this.game.input.y;
  };

  // Toggle background music.
  Game.prototype.toggleBackgroundMusic = function () {
    this.soundGame.mute = !this.soundGame.mute; // Toggle background sound.
    this.buttonMusicToggle = !this.buttonMusicToggle; // Toggle background music button.
    this.buttonMusic.frame = (this.buttonMusicToggle) ? 1 : 0; // Show appropriate background music button.
  };

  // Toggle game audio.
  Game.prototype.toggleGameAudio = function () {
    this.buttonAudioToggle = !this.buttonAudioToggle; // Toggle game audio button.
    this.buttonAudio.frame = this.buttonAudioToggle ? 1 : 0; // Show appropriate background music button.
    this.soundDeadZenva.volume = this.buttonAudioToggle ? 0 : 1; //  Toggle dead zenva sound.
    this.soundGameOver.volume = this.buttonAudioToggle ? 0 : 1; // Toggle game over sound.
    this.soundDeadEnemy.volume = this.buttonAudioToggle ? 0 : 1; // Toggle game over sound.
  };
}(this));