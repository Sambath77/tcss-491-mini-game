class SceneManager {
  constructor(game, level) {
    this.game = game;
    this.game.camera = this;
    this.game.mapMaxDistance = 8000;
    this.game.isFightingBoss = false;
    this.game.isBulletCapacityVisible = false;
    this.game.isMagazine = false;

    this.game.currentLevel = level;
    this.game.show = false;
    this.game.isOnWinningPage = false;
    this.title = true;
    this.x = 0;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;

    this.coinAnimation = new Animator(
      ASSET_MANAGER.getAsset('./sprites/coins.png'),
      0,
      160,
      8,
      8,
      4,
      0.2,
      0,
      false,
      true
    );

    this.minimap = new Minimap(
      this.game,
      1.5 * PARAMS.BLOCKWIDTH,
      3.5 * PARAMS.BLOCKWIDTH,
      224 * PARAMS.SCALE
    );

    this.player = new Player(
      this.game,
      2.5 * PARAMS.BLOCKWIDTH,
      0 * PARAMS.BLOCKWIDTH
    );

    //this.loadLevelOne(2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);
    this.loadLevel(2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH, level);
  }

  addCoin() {
    if (this.coins++ === 100) {
      this.coins = 0;
      this.lives++;
    }
  }

  loadLevel(x, y, level) {
    if (level === 0) {
      this.loadTitle();
    } else if (level === 1) {
      this.loadLevelOne(x, y);
    }
  }

  loadTitle() {
    this.game.currentLevel = 0;
    this.game.entities = [];
    this.x = 0;
    this.game.show = false;
  }
  loadLevelOne(x, y) {
    this.game.isFightingBoss = false;
    this.game.currentLevel = 1;
    this.game.entities = [];
    this.x = 0;
    this.game.show = false;

    let background = new Wall(this.game, 0, PARAMS.BLOCKWIDTH, 0);
    this.game.addEntity(background);

    for (let i = 0; i < PARAMS.BLOCKWIDTH; i++) {
      background = new Wall(
        this.game,
        PARAMS.BLOCKWIDTH * 25 * i,
        PARAMS.BLOCKWIDTH,
        25
      );
      this.game.addEntity(background);
    }

    let brick = new Brickmoved(
      this.game,
      10 * 0 * PARAMS.BLOCKWIDTH + 400,
      10 * PARAMS.BLOCKWIDTH
    );
    this.game.addEntity(brick);

    for (
      let i = 1;
      10 * i * PARAMS.BLOCKWIDTH + 400 < this.game.mapMaxDistance;
      i = i + 3
    ) {
      brick = new Brickmoved(
        this.game,
        10 * i * PARAMS.BLOCKWIDTH + 400,
        10 * PARAMS.BLOCKWIDTH
      );
      this.game.addEntity(brick);
    }

    brick = new Brickmoved(
      this.game,
      this.game.mapMaxDistance,
      PARAMS.BLOCKWIDTH * 10,
      PARAMS.BLOCKWIDTH
    );
    this.game.addEntity(brick);
    brick = new Brickmoved(
      this.game,
      this.game.mapMaxDistance + 300,
      PARAMS.BLOCKWIDTH * 9,
      PARAMS.BLOCKWIDTH
    );
    this.game.addEntity(brick);

    let flag = new Flag(
      this.game,
      this.game.mapMaxDistance + 600,
      10 * PARAMS.BLOCKWIDTH
    );
    this.game.addEntity(flag);

    this.player.x = x;
    this.player.y = this.player.size ? y - PARAMS.BLOCKWIDTH : y;
    this.game.addEntity(this.sant);
  }

  loadWinningPage() {
    this.sant.isFirstTimeTouchedFlag = true;
    this.game.isFightingBoss = false;
    this.game.show = true;
    this.game.entities = [];
    this.game.isOnWinningPage = true;
  }

  update() {
    PARAMS.DEBUG = document.getElementById('debug').checked;

    if (
      (this.game.currentLevel === 0 ||
        this.player.dead ||
        this.game.isOnWinningPage) &&
      this.game.click
    ) {
      if (
        this.game.click &&
        this.game.click.y > 9 * PARAMS.BLOCKWIDTH &&
        this.game.click.y < 9.5 * PARAMS.BLOCKWIDTH
      ) {
        console.log('!');
        this.player.revive();
        this.game.isOnWinningPage = false;
        this.loadLevelOne(2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);
      }
    }

    let midpoint = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;

    if (this.x < this.player.x - midpoint) this.x = this.player.x - midpoint;

    if (this.x >= this.game.mapMaxDistance) {
      this.x = this.game.mapMaxDistance;
    }
    // if (this.sant.dead && this.sant.y > PARAMS.BLOCKWIDTH * 16) {
    //   this.sant.dead = false;
    //   this.loadLevelOne(2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);
    // }
  }

  draw(ctx) {
    if (this.game.currentLevel === 0) {
      ctx.fillStyle =
        this.game.mouse &&
        this.game.mouse.y > 9 * PARAMS.BLOCKWIDTH &&
        this.game.mouse.y < 9.5 * PARAMS.BLOCKWIDTH
          ? 'Grey'
          : 'White';
      ctx.fillText('START', 6.75 * PARAMS.BLOCKWIDTH, 9.5 * PARAMS.BLOCKWIDTH);
    }
    if (this.player.dead) {
      ctx.fillStyle =
        this.game.mouse &&
        this.game.mouse.y > 9 * PARAMS.BLOCKWIDTH &&
        this.game.mouse.y < 9.5 * PARAMS.BLOCKWIDTH
          ? 'Grey'
          : 'White';
      ctx.fillText(
        'TRY AGAIN',
        6.75 * PARAMS.BLOCKWIDTH,
        9.5 * PARAMS.BLOCKWIDTH
      );
    }
    if (this.game.isOnWinningPage) {
      ctx.fillStyle = 'White';
      ctx.fillText(
        'CONGRATULATIONS. YOU WIN!',
        1.75 * PARAMS.BLOCKWIDTH,
        8 * PARAMS.BLOCKWIDTH
      );
      ctx.fillStyle =
        this.game.mouse &&
        this.game.mouse.y > 9 * PARAMS.BLOCKWIDTH &&
        this.game.mouse.y < 9.5 * PARAMS.BLOCKWIDTH
          ? 'Grey'
          : 'White';
      ctx.fillText(
        'PLAY AGAIN',
        5.5 * PARAMS.BLOCKWIDTH,
        9.5 * PARAMS.BLOCKWIDTH
      );
    }
    ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
    ctx.fillStyle = 'White';
    if (!this.game.isOnWinningPage && this.game.currentLevel >= 1) {
      ctx.fillText('SANT', 1.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
      ctx.fillText(
        (this.score + '').padStart(8, '0'),
        1.5 * PARAMS.BLOCKWIDTH,
        1.5 * PARAMS.BLOCKWIDTH
      );

      // ctx.fillText("WORLD", 9 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
      // ctx.fillText("1-1", 9.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText(
        `Level ${this.game.currentLevel}`,
        12 * PARAMS.BLOCKWIDTH,
        1 * PARAMS.BLOCKWIDTH
      );
    }

    //magazines capacity

    if (PARAMS.DEBUG) {
      // let xV = 'xV=' + Math.floor(this.game.mario.velocity.x);
      // let yV = 'yV=' + Math.floor(this.game.mario.velocity.y);
      // ctx.fillText(xV, 1.5 * PARAMS.BLOCKWIDTH, 2.5 * PARAMS.BLOCKWIDTH);
      // ctx.fillText(yV, 1.5 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);

      ctx.translate(0, -10); // hack to move elements up by 10 pixels instead of adding -10 to all y coordinates below
      ctx.strokeStyle = 'White';
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.game.left ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.strokeRect(
        6 * PARAMS.BLOCKWIDTH - 2,
        2.5 * PARAMS.BLOCKWIDTH - 2,
        0.5 * PARAMS.BLOCKWIDTH + 2,
        0.5 * PARAMS.BLOCKWIDTH + 2
      );
      ctx.fillText('L', 6 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
      ctx.strokeStyle = this.game.down ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.strokeRect(
        6.5 * PARAMS.BLOCKWIDTH,
        3 * PARAMS.BLOCKWIDTH,
        0.5 * PARAMS.BLOCKWIDTH + 2,
        0.5 * PARAMS.BLOCKWIDTH + 2
      );
      ctx.fillText(
        'D',
        6.5 * PARAMS.BLOCKWIDTH + 2,
        3.5 * PARAMS.BLOCKWIDTH + 2
      );
      ctx.strokeStyle = this.game.up ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.strokeRect(
        6.5 * PARAMS.BLOCKWIDTH,
        2 * PARAMS.BLOCKWIDTH - 4,
        0.5 * PARAMS.BLOCKWIDTH + 2,
        0.5 * PARAMS.BLOCKWIDTH + 2
      );
      ctx.fillText(
        'U',
        6.5 * PARAMS.BLOCKWIDTH + 2,
        2.5 * PARAMS.BLOCKWIDTH - 2
      );
      ctx.strokeStyle = this.game.right ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.strokeRect(
        7 * PARAMS.BLOCKWIDTH + 2,
        2.5 * PARAMS.BLOCKWIDTH - 2,
        0.5 * PARAMS.BLOCKWIDTH + 2,
        0.5 * PARAMS.BLOCKWIDTH + 2
      );
      ctx.fillText('R', 7 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

      ctx.strokeStyle = this.game.A ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(
        8.25 * PARAMS.BLOCKWIDTH + 2,
        2.75 * PARAMS.BLOCKWIDTH,
        0.25 * PARAMS.BLOCKWIDTH + 4,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fillText('A', 8 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);
      ctx.strokeStyle = this.game.B ? 'White' : 'Grey';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.arc(
        9 * PARAMS.BLOCKWIDTH + 2,
        2.75 * PARAMS.BLOCKWIDTH,
        0.25 * PARAMS.BLOCKWIDTH + 4,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fillText('B', 8.75 * PARAMS.BLOCKWIDTH + 4, 3 * PARAMS.BLOCKWIDTH);

      ctx.translate(0, 10);
      ctx.strokeStyle = 'White';
      ctx.fillStyle = ctx.strokeStyle;

      this.minimap.draw(ctx);
    }
  }
}

class Minimap {
  constructor(game, x, y, w) {
    Object.assign(this, { game, x, y, w });
  }

  update() {}

  draw(ctx) {
    ctx.strokeStyle = 'Black';
    ctx.strokeRect(this.x, this.y, this.w, PARAMS.BLOCKWIDTH);
    for (var i = 0; i < this.game.entities.length; i++) {
      this.game.entities[i].drawMinimap(ctx, this.x, this.y);
    }
  }
}
