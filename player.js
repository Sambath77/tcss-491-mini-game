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
    this.dead = false;
    this.velocity = { x: 0, y: 0 };
    this.updateBB();
  }

  updateBB() {
    this.lastBB = this.BB;

    if (this.size === 0 || this.size === 3) {
      this.BB = new BoundingBox(
        this.x,
        this.y,
        25 * PARAMS.SCALE,
        25 * PARAMS.SCALE
      );
    } else {
      this.BB = new BoundingBox(
        this.x,
        this.y,
        25 * PARAMS.SCALE,
        25 * PARAMS.SCALE
      );
    }

    if (this.deadAnim) {
      this.BB = new BoundingBox(
        this.x,
        this.y,
        25 * PARAMS.SCALE,
        25 * PARAMS.SCALE
      );
    }
  }

  update() {
    if (this.x >= this.game.mapMaxDistance) {
      this.game.isFightingBoss = true;
    }
    const TICK = this.game.clockTick;

    // I used this page to approximate my constants
    // https://web.archive.org/web/20130807122227/http://i276.photobucket.com/albums/kk21/jdaster64/smb_playerphysics.png
    // I converted these values from hex and into units of pixels and seconds.

    const MIN_WALK = 4.453125;
    const MAX_WALK = 93.75;
    const MAX_RUN = 153.75;
    const ACC_WALK = 133.59375;
    const ACC_RUN = 200.390625;
    const DEC_REL = 182.8125;
    const DEC_SKID = 365.625;
    const MIN_SKID = 33.75;

    const STOP_FALL = 1575;
    const WALK_FALL = 1800;
    const RUN_FALL = 2025;
    const STOP_FALL_A = 450;
    const WALK_FALL_A = 421.875;
    const RUN_FALL_A = 562.5;

    const MAX_FALL = 270;

    if (this.dead) {
      this.updateBB();
      // this.velocity.y += RUN_FALL * TICK;
      // this.y += this.velocity.y * TICK * PARAMS.SCALE;
    } else {
      // update velocity

      if (this.state !== 4) {
        // not jumping
        // ground physics
        if (Math.abs(this.velocity.x) < MIN_WALK && this.state !== 7) {
          // slower than a walk // starting, stopping or turning around
          this.velocity.x = 0;
          this.state = 0;
          if (this.game.left) {
            this.velocity.x -= MIN_WALK;
          }
          if (this.game.right) {
            this.velocity.x += MIN_WALK;
          }
        } else if (Math.abs(this.velocity.x) >= MIN_WALK && this.state !== 7) {
          // faster than a walk // accelerating or decelerating
          if (this.isFacingLeft === 0) {
            if (this.game.right && !this.game.left) {
              if (this.game.B) {
                this.velocity.x += ACC_RUN * TICK;
              } else this.velocity.x += ACC_WALK * TICK;
            } else if (this.game.left && !this.game.right) {
              this.velocity.x -= DEC_SKID * TICK;
              this.state = 3;
            } else {
              this.velocity.x -= DEC_REL * TICK;
            }
          }
          if (this.isFacingLeft === 1) {
            if (this.game.left && !this.game.right) {
              if (this.game.B) {
                this.velocity.x -= ACC_RUN * TICK;
              } else this.velocity.x -= ACC_WALK * TICK;
            } else if (this.game.right && !this.game.left) {
              this.velocity.x += DEC_SKID * TICK;
              this.state = 3;
            } else {
              this.velocity.x += DEC_REL * TICK;
            }
          }
        }

        this.velocity.y += this.fallAcc * TICK;

        if (this.game.A) {
          // jump
          if (Math.abs(this.velocity.x) < 16) {
            this.velocity.y = -240;
            this.fallAcc = STOP_FALL;
          } else if (Math.abs(this.velocity.x) < 40) {
            this.velocity.y = -240;
            this.fallAcc = WALK_FALL;
          } else {
            this.velocity.y = -300;
            this.fallAcc = RUN_FALL;
          }
          if (this.state !== 7) {
            this.state = 4;
          }
          //play jumping audio
          ASSET_MANAGER.playAsset('./soundEffect/jumping.mp3');
        }
        if (this.game.attack) {
          if (this.state !== 4 && this.state !== 7) {
            this.state = 6;
          }
        }
        // else if the sant is not in attack mode and jump mode, change it to walk mode
        else if (!this.game.A) {
          this.state = 1;
        }
        if (this.state === 7) {
          this.velocity.y = 270;
        }
      } else {
        // air physics
        // vertical physics
        if (this.velocity.y < 0 && this.game.A) {
          // holding A while jumping jumps higher
          if (this.fallAcc === STOP_FALL)
            this.velocity.y -= (STOP_FALL - STOP_FALL_A) * TICK;
          if (this.fallAcc === WALK_FALL)
            this.velocity.y -= (WALK_FALL - WALK_FALL_A) * TICK;
          if (this.fallAcc === RUN_FALL)
            this.velocity.y -= (RUN_FALL - RUN_FALL_A) * TICK;
        }
        this.velocity.y += this.fallAcc * TICK;

        // horizontal physics
        if (this.game.right && !this.game.left) {
          if (Math.abs(this.velocity.x) > MAX_WALK) {
            this.velocity.x += ACC_RUN * TICK;
          } else this.velocity.x += ACC_WALK * TICK;
        } else if (this.game.left && !this.game.right) {
          if (Math.abs(this.velocity.x) > MAX_WALK) {
            this.velocity.x -= ACC_RUN * TICK;
          } else this.velocity.x -= ACC_WALK * TICK;
        } else {
          // do nothing
        }
      }

      // max speed calculation
      if (this.velocity.y >= MAX_FALL) this.velocity.y = MAX_FALL;
      if (this.velocity.y <= -MAX_FALL) this.velocity.y = -MAX_FALL;

      if (this.velocity.x >= MAX_RUN) this.velocity.x = MAX_RUN;
      if (this.velocity.x <= -MAX_RUN) this.velocity.x = -MAX_RUN;
      if (this.velocity.x >= MAX_WALK && !this.game.B)
        this.velocity.x = MAX_WALK;
      if (this.velocity.x <= -MAX_WALK && !this.game.B)
        this.velocity.x = -MAX_WALK;

      // update position
      this.x += this.velocity.x * TICK * PARAMS.SCALE;
      this.y += this.velocity.y * TICK * PARAMS.SCALE;
      this.updateBB();

      // if sant fell of the map he's dead
      if (this.y > PARAMS.BLOCKWIDTH * 16) this.die();
      // collision
      var that = this;
      this.game.entities.forEach(function (entity) {
        if (entity.BB && that.BB.collide(entity.BB)) {
          if (entity instanceof Flag && that.isFirstTimeTouchedFlag) {
            that.game.addEntity(new Finish(that.game));
            that.isFirstTimeTouchedFlag = false;
            setTimeout(function () {
              that.game.camera.loadLevel(
                2.5 * PARAMS.BLOCKWIDTH,
                0 * PARAMS.BLOCKWIDTH,
                that.game.currentLevel + 1
              );
            }, 3000);
          }
          if (that.velocity.y > 0) {
            // falling
            if (
              entity instanceof Brickmoved && // landin
              that.lastBB.bottom <= entity.BB.top
            ) {
              // was above last tick
              entity.time += 5;
              if (that.size === 0 || that.size === 3) {
                // small
                that.y = entity.BB.top - that.BB.height;
              } else {
                // big
                that.y = entity.BB.top - that.BB.height;
              }
              that.velocity.y === 0;

              if (that.state === 4) that.state = 0; // set state to idle
              that.updateBB();

              // if (entity instanceof Tube && entity.destination && that.game.down) {
              //     that.game.camera.loadBonusLevelOne();
              // }
            }
          }
          // if (that.velocity.y < 0) {
          //   // jumping
          //   if (
          //     (entity instanceof Brick || entity instanceof BrickLevelOne) && // hit ceiling
          //     that.lastBB.top >= entity.BB.bottom && // was below last tick
          //     that.BB.collide(entity.leftBB) &&
          //     that.BB.collide(entity.rightBB)
          //   ) {
          //     // collide with the center point of the brick
          //     entity.bounce = true;
          //     that.velocity.y = 0;
          //   }
          // }
        }
      });

      if (this.state !== 4 && this.state !== 6 && this.state !== 7) {
        // if (this.game.down) this.state = 5;
        if (Math.abs(this.velocity.x) > MAX_WALK) this.state = 2;
        else if (Math.abs(this.velocity.x) >= MIN_WALK) this.state = 1;
        else this.state = 0;
      } else {
      }

      // update direction
      if (this.velocity.x < 0) this.isFacingLeft = this.state !== 7 ? 1 : 0;
      if (this.velocity.x > 0) this.isFacingLeft = this.state !== 7 ? 0 : 1;
      this.fixSantMoveRangeInBossBattle();
    }
  }

  fixSantMoveRangeInBossBattle() {
    if (this.game.isFightingBoss) {
      if (this.x <= this.game.mapMaxDistance) {
        this.x = this.game.mapMaxDistance;
      }
      if (
        this.x >=
        this.game.mapMaxDistance + PARAMS.SCREEN_WIDTH - this.BB.width
      ) {
        this.x = this.game.mapMaxDistance + PARAMS.SCREEN_WIDTH - this.BB.width;
      }
    }
  }

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
