class Wall {
  constructor(game, x, y, z) {
    Object.assign(this, { game, x, y, z });
    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/my_wall.png');
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(
      this.spritesheet,
      640,
      240,
      640,
      240,
      this.x,
      this.y - this.game.camera.x + PARAMS.BLOCKWIDTH * this.z,
      PARAMS.BLOCKWIDTH * 25,
      PARAMS.BLOCKWIDTH * 25
    );
  }
}

class Brickmoved {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });
    this.velocity = { x: PARAMS.BITWIDTH, y: 0 }; // pixels per second
    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/block3.png');
    this.animation = new Animator(
      this.spritesheet,
      2,
      38,
      90,
      13,
      1,
      0.5,
      30,
      true,
      true
    );
    this.paused = false;
    this.time = 0;
    this.updateBB();
  }

  updateBB() {
    this.lastBB = this.BB;
    this.BB = new BoundingBox(
      this.x,
      this.y,
      PARAMS.BLOCKWIDTH * 5.6,
      PARAMS.BLOCKWIDTH / 1.2
    );
  }

  update() {
    if (!this.paused) {
      if (this.x > this.time) {
        this.velocity = { x: -PARAMS.BITWIDTH, y: 0 };
      } else if (this.x < 5) {
        this.velocity = { x: PARAMS.BITWIDTH, y: 0 };
      }
      this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
      this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
      this.updateBB();
    }
  }

  drawMinimap(ctx, mmX, mmY) {
    ctx.fillStyle = 'Brown';
    ctx.fillRect(
      mmX + this.x / PARAMS.BITWIDTH,
      mmY + this.y / PARAMS.BITWIDTH,
      PARAMS.BITWIDTH,
      PARAMS.SCALE
    );
  }

  draw(ctx) {
    this.animation.drawFrame(
      this.game.clockTick,
      ctx,
      this.x,
      this.y - this.game.camera.x,
      PARAMS.SCALE
    );

    if (PARAMS.DEBUG) {
      ctx.strokeStyle = 'Red';
      ctx.strokeRect(
        this.BB.x,
        this.BB.y - this.game.camera.x,
        this.BB.width,
        this.BB.height
      );
    }
  }
}
class BrickLevelOne {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });

    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/block3.png');

    this.BB = new BoundingBox(
      this.x + PARAMS.BLOCKWIDTH - 50,
      this.y + 50,
      PARAMS.BLOCKWIDTH * 3,
      PARAMS.BLOCKWIDTH
    );
    this.leftBB = new BoundingBox(
      this.x + PARAMS.BLOCKWIDTH * 2,
      this.y,
      PARAMS.BLOCKWIDTH * 2,
      PARAMS.BLOCKWIDTH / 2
    );
    this.rightBB = new BoundingBox(
      this.x + PARAMS.BLOCKWIDTH * 2,
      this.y,
      PARAMS.BLOCKWIDTH * 2,
      PARAMS.BLOCKWIDTH / 2
    );
    this.topBB = new BoundingBox(
      this.x + PARAMS.BLOCKWIDTH,
      this.y,
      PARAMS.BLOCKWIDTH,
      PARAMS.BLOCKWIDTH / 2
    );
    this.bottomBB = new BoundingBox(
      this.x + PARAMS.BLOCKWIDTH,
      this.y + PARAMS.BLOCKWIDTH,
      PARAMS.BLOCKWIDTH,
      PARAMS.BLOCKWIDTH / 2
    );
  }

  update() {}

  drawMinimap(ctx, mmX, mmY) {
    ctx.fillStyle = 'Brown';
    ctx.fillRect(
      mmX + this.x / PARAMS.BITWIDTH,
      mmY + this.y / PARAMS.BITWIDTH,
      PARAMS.BITWIDTH,
      PARAMS.SCALE
    );
  }

  draw(ctx) {
    ctx.drawImage(
      this.spritesheet,
      280,
      92,
      58,
      14,
      this.x,
      this.y + PARAMS.BLOCKWIDTH - this.game.camera.x,
      PARAMS.BLOCKWIDTH * 3,
      PARAMS.BLOCKWIDTH
    );

    if (PARAMS.DEBUG) {
      ctx.strokeStyle = 'Red';
      ctx.strokeRect(
        this.BB.x,
        this.BB.y - this.game.camera.x,
        this.BB.width,
        this.BB.height
      );
    }
  }
}
