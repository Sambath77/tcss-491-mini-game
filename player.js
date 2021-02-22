class Player {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });
    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/plane.png');

    this.animation = new Animator(
      this.spritesheet,
      47,
      13,
      23,
      42,
      1,
      1,
      0,
      false,
      true
    );
  }

  update() {}

  draw(ctx) {
    this.animation.drawFrame(
      this.game.clockTick,
      ctx,
      this.x,
      this.y - this.game.camera.y,
      PARAMS.SCALE * 1.2
    );
  }
}
