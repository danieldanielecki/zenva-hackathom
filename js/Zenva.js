(function (global) {
  var Zenva = global.Zenva = function (state) {
    this.state = state;
    this.game = state.game;

    var pos = this.rand(); // Call method to randomly choose X and Y coordinates.

    // Set X and Y coordinate returned from rand method.
    var x = pos.x;
    var y = pos.y;

    Phaser.Sprite.call(this, state.game, x, y, 'zenva'); // Call zenva sprite.

    // Add sailing animations.
    this.animations.add('zenva', Phaser.Animation.generateFrameNames('zenva-', 0, 0, '.png', 0), 3, true, false); // Play animation in loop.

    // Add shooting animations.
    this.animations.add('zenva-dead', Phaser.Animation.generateFrameNames('zenva-', 0, 2, '.png', 0), 4, false, false); // Play animation once.

    this.animations.play('zenva'); // Play sailing animation.

    // Physics values.
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.enable = true;
    this.body.setSize(30, 30);

    this.checkWorldBounds = true; // Check world bounds.
    this.events.onOutOfBounds.add(this.boundOut, this); // Call boundOut if sprite leaves the world.

    // Check where is initial X coordinate.
    if (this.x < 0) {
      // Initial X coordinate is on the left from the world.
      this.body.velocity.x = this.game.rnd.integerInRange(40, 100); // Set to sailing from left to right.
      this.body.velocity.y = 0; // Don't move in the Y coordinate.
    } else {
      // Initial X coordinate is on the right from the world.
      this.body.velocity.x = -this.game.rnd.integerInRange(40, 100); // Set to sailing from right to left.
      this.body.velocity.y = 0; // Don't move in the Y coordinate.
    }
  };

  // Set up constructor.
  Zenva.prototype = Object.create(Phaser.Sprite.prototype);
  Zenva.prototype.constructor = Zenva;

  Zenva.prototype.boundOut = function (zenva) {
    var pos = this.rand(true); // Call method to randomly choose X and Y coordinates.

    // Set X and Y coordinate returned from rand method.
    this.x = pos.x;
    this.y = pos.y;
  };

  Zenva.prototype.killZenva = function (enemy) {
    this.alive = false; // Zenva is dead.

    enemy.body.velocity.x = 0; // Stop enemy while killing Zenva.

    // Stop the zenva, must be here, otherwise this.body.velocity.x would be always 0.
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    // Play shooting and sinking animation, sinking animation is done once shooting animation will be finished.
    this.animations.play('zenva-dead', null, false, true) // Play shooting left animation.
      .onComplete.add(function () {
      enemy.destroy(true); // Kill enemy.
    }, this);

    this.state.amountZenvasMethod(-1); // Decrement by 1 number of current zenvas on the world in the HUD.
  };

  // Randomly choose X and Y coordinates.
  Zenva.prototype.rand = function (wrap) {
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