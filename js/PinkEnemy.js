(function (global) {
  var PinkEnemy = global.PinkEnemy = function (state, zenva) {
    this.game = state.game;
    this.state = state;

    var x, y;

    if (zenva) {
      x = zenva.x;
      y = zenva.y;
    } else {
      var pos = this.rand(); // Call method to randomly choose X and Y coordinates.

      // Set X and Y coordinate returned from rand method.
      x = pos.x;
      y = pos.y;
    }

    Phaser.Sprite.call(this, state.game, x, y, 'pinkEnemy'); // Call Pink Enemy sprite.

    // Add sailing animations.
    this.animations.add('pink-enemy', Phaser.Animation.generateFrameNames('pink-enemy-', 0, 0, '.png', 0), 3, true, false); // Play animation in loop.

    // Add shooting animations.
    this.animations.add('pink-enemy-dead', Phaser.Animation.generateFrameNames('pink-enemy-', 0, 2, '.png', 0), 4, false, false); // Play animation once.

    this.animations.play('pink-enemy'); // Play sailing animation.

    // Physics values.
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.enable = true;
    this.body.setSize(30, 30);

    this.inputEnabled = true; // Enable input events.
    this.events.onInputDown.add(this.killPinkEnemy, this); // Kill Pink Enemy on input down.

    this.checkWorldBounds = true; // Check world bounds.
    this.events.onOutOfBounds.add(this.boundOut, this); // Call boundOut if sprite leaves the world.

    // Check where is initial X coordinate.
    if (x < 0) {
      // Initial X coordinate is on the left from the world.
      this.body.velocity.x = this.game.rnd.integerInRange(150, 400); // Set to sailing from left to right.
      this.body.velocity.y = 0; // Don't move in the Y coordinate.
    } else {
      // Initial X coordinate is on the right from the world.
      this.body.velocity.x = -this.game.rnd.integerInRange(150, 400); // Set to sailing from right to left.
      this.body.velocity.y = 0; // Don't move in the Y coordinate.
    }
  };

  // Set up constructor.
  PinkEnemy.prototype = Object.create(Phaser.Sprite.prototype);
  PinkEnemy.prototype.constructor = PinkEnemy;

  // Loop througout game.
  PinkEnemy.prototype.update = function () {
    // Check if Pink Enemy is dead.
    if (!this.alive) {
      this.destroy(); // Destroy Pink Enemy.
    }
  };

  PinkEnemy.prototype.killPinkEnemy = function () {
    this.health--; // Decrease health to be under 0 from its default value.

    // Check if health is under 0, which means Enemy is dead.
    if (this.health <= 0) {

      this.inputEnabled = false; // Disable input events.

        // Stop the zenva, must be here, otherwise this.body.velocity.x would be always 0.
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // Play shooting and sinking animation, sinking animation is done once shooting animation will be finished.
        this.animations.play('pink-enemy-dead', null, false, true) // Play shooting left animation.
          .onComplete.add(function () {
          // this.animations.play('sinking-left', null, false, true); // Play sinking left animation.
        }, this);

      this.state.punctuatePinkEnemy(); // Update HUD.
      this.state.playSoundDeadEnemy(); // Play dead enemy sound.
    }
  };

  PinkEnemy.prototype.boundOut = function (zenva) {
    var pos = this.rand(true);  // Call method to randomly choose X and Y coordinates.

    // Set X and Y coordinate returned from rand method.
    this.x = pos.x;
    this.y = pos.y;
  };

  // Randomly choose X and Y coordinates.
  PinkEnemy.prototype.rand = function (wrap) {
    var x, y, r;

    if (wrap) {
      x = this.x < 0 ? 500 : -50; // Set X coordinate to 500 if X coordinate is less than 0 or -50 otherwise.
    } else {
      x = this.game.rnd.pick([-50, 500]); // Return random number between -50 and 500 for X coordinate.
    }

    r = this.game.rnd.integerInRange(0, 4); // Return random number between 0 and 4 for radius.
    y = 80 + (280 - 80) / 5 * r; // Calculate Y coordinate.
    return {x: x, y: y}; // Return X and Y coordinate.
  };
}(this));