class Fireball {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    this.spritesheets = ASSET_MANAGER.getAsset('./sprites/sant/plane.png');
    this.animation = new Animator(
      this.spritesheets,
      106,
      47,
      4,
      10,
      3,
      0.2,
      0,
      true,
      true
    );
    this.initialX = x;
    this.power = 2;
    this.width = 8;
    this.height = 2;
    this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    this.velocity = 8;

    this.updateBoundingBox();
  }

  update() {}
  updateBoundingBox() {
    this.lastBB = this.BB;
    this.BB = new BoundingBox(
      this.x,
      this.y,
      1 * PARAMS.BLOCKWIDTH,
      0.5 * PARAMS.BLOCKWIDTH
    );
  }

  drawMinimap(ctx, mmX, mmY) {}

  draw(ctx) {
    this.animations[this.isFacingLeft].drawFrame(
      this.game.clockTick,
      ctx,
      this.x,
      this.y - this.game.camera.y,
      PARAMS.SCALE
    );
    if (PARAMS.DEBUG) {
      ctx.strokeStyle = 'Red';
      ctx.strokeRect(
        this.BB.x,
        this.BB.y - this.game.camera.y,
        this.BB.width,
        this.BB.height
      );
    }
  }
}
