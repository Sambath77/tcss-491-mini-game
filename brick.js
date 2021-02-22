class Wall {
  constructor(game, x, y) {
    Object.assign(this, { game, x, y });
    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/ground.png');

    this.animation = new Animator(
      this.spritesheet,
      259,
      0,
      256,
      419,
      1,
      1,
      84,
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
    console.log('heel');

    // ctx.drawImage(
    //   this.spritesheet,
    //   259,
    //   338,
    //   259,
    //   82,
    //   this.x,
    //   this.y - this.game.camera.y,
    //   PARAMS.BLOCKWIDTH * 16,
    //   PARAMS.BLOCKWIDTH * 30
    // );
  }
}

// class Brick {
//   constructor(game, x, y) {
//     Object.assign(this, { game, x, y });

//     this.spritesheet = ASSET_MANAGER.getAsset('./sprites/block3.png');

//     this.BB = new BoundingBox(
//       this.x,
//       this.y,
//       PARAMS.BLOCKWIDTH * 4,
//       PARAMS.BLOCKWIDTH
//     );
//     this.leftBB = new BoundingBox(
//       this.x + PARAMS.BLOCKWIDTH * 2,
//       this.y,
//       PARAMS.BLOCKWIDTH * 2,
//       PARAMS.BLOCKWIDTH / 2
//     );
//     this.rightBB = new BoundingBox(
//       this.x + PARAMS.BLOCKWIDTH * 2,
//       this.y,
//       PARAMS.BLOCKWIDTH * 2,
//       PARAMS.BLOCKWIDTH / 2
//     );
//     this.topBB = new BoundingBox(
//       this.x + PARAMS.BLOCKWIDTH,
//       this.y,
//       PARAMS.BLOCKWIDTH,
//       PARAMS.BLOCKWIDTH / 2
//     );
//     this.bottomBB = new BoundingBox(
//       this.x + PARAMS.BLOCKWIDTH,
//       this.y + PARAMS.BLOCKWIDTH,
//       PARAMS.BLOCKWIDTH,
//       PARAMS.BLOCKWIDTH / 2
//     );
//   }

//   update() {}

//   drawMinimap(ctx, mmX, mmY) {
//     ctx.fillStyle = 'Brown';
//     ctx.fillRect(
//       mmX + this.x / PARAMS.BITWIDTH,
//       mmY + this.y / PARAMS.BITWIDTH,
//       PARAMS.BITWIDTH,
//       PARAMS.SCALE
//     );
//   }

//   draw(ctx) {
//     ctx.drawImage(
//       this.spritesheet,
//       186,
//       91,
//       90,
//       13,
//       this.x,
//       this.y - this.game.camera.y,
//       PARAMS.BLOCKWIDTH * 4,
//       PARAMS.BLOCKWIDTH
//     );

//     if (PARAMS.DEBUG) {
//       ctx.strokeStyle = 'Red';
//       ctx.strokeRect(
//         this.BB.x,
//         this.BB.y - this.game.camera.y,
//         this.BB.width,
//         this.BB.height
//       );
//     }
//   }
// }

class Brickmoved {
  constructor(game, x, y, k) {
    Object.assign(this, { game, x, y, k });
    this.velocity = { x: 0, y: PARAMS.BLOCKWIDTH }; // pixels per second
    this.spritesheet = ASSET_MANAGER.getAsset('./sprites/block3.png');
    this.animation = new Animator(
      this.spritesheet,
      2,
      38,
      27,
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
      PARAMS.BLOCKWIDTH * 1.7,
      PARAMS.BLOCKWIDTH / 1.2
    );
  }

  update() {
    if (!this.paused) {
      if (this.x > this.time) {
        this.velocity = { x: -PARAMS.BITWIDTH, y: 50 };
      } else if (this.x == 0) {
        this.velocity = { x: PARAMS.BITWIDTH, y: -50 };
        console.log('return');
      } else if (this.x > this.game.mapMaxDistance) {
        this.game.isMaxDistance = true;
      }
      this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
      this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
      // if (this.y > PARAMS.BLOCKWIDTH * 13) {
      //   for (let i = 1; i < 50; i++) {
      //     this.game.addEntity(
      //       new Brickmoved(this.game, i * 10 + 10, i * 10 + 10)
      //     );
      //   }
      // }
      this.updateBB();
    }
    //this.fixSantMoveRangeInBossBattle();
  }

  // fixSantMoveRangeInBossBattle() {
  //   if (this.game.isMaxDistance) {
  //     if (this.x <= this.game.mapMaxDistance) {
  //       this.x = this.game.mapMaxDistance;
  //     }
  //     if (this.x >= this.game.mapMaxDistance + PARAMS.BLOCKWIDTH * 14) {
  //       this.x = this.game.mapMaxDistance + PARAMS.BLOCKWIDTH * 14;
  //     }
  //   }
  // }

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
