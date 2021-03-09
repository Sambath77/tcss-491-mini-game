class SceneManager {
  constructor(game) {
    this.game = game;
    this.game.camera = this;
    this.game.mapMaxDistance = 9000;
    this.game.isMaxDistance = false;
    this.x = 0;
    //this.y = -PARAMS.BLOCKWIDTH;
    this.score = 0;

    this.minimap = new Minimap(
      this.game,
      1.5 * PARAMS.BLOCKWIDTH,
      3.5 * PARAMS.BLOCKWIDTH,
      224 * PARAMS.SCALE
    );

    this.player = new Sant(
      this.game,
      2.5 * PARAMS.BLOCKWIDTH,
      0 * PARAMS.BLOCKWIDTH
    );
    this.loadLevelOne(2.5 * PARAMS.BLOCKWIDTH, 0 * PARAMS.BLOCKWIDTH);
  }

  addCoin() {
    if (this.coins++ === 100) {
      this.coins = 0;
      this.lives++;
    }
  }

  loadLevelOne(x, y) {
    this.game.entities = [];
    this.x = 0;

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

    // let brick = new BrickLevelOne(
    //   this.game,
    //   10 * 0 * PARAMS.BLOCKWIDTH,
    //   10 * PARAMS.BLOCKWIDTH
    // );
    // this.game.addEntity(brick);

    for (let i = 0; i < this.game.mapMaxDistance; i++) {
      this.game.addEntity(
        new BrickLevelOne(
          this.game,
          10 * i * PARAMS.BLOCKWIDTH,
          11 * PARAMS.BLOCKWIDTH
        )
      );
    }

    for (let i = 0; i < this.game.mapMaxDistance; i++) {
      this.game.addEntity(
        new BrickLevelOne(
          this.game,
          10 * i * PARAMS.BLOCKWIDTH + 200,
          8 * PARAMS.BLOCKWIDTH
        )
      );
    }

    for (
      let i = 0;
      PARAMS.BLOCKWIDTH * 10 * i + 1000 < this.game.mapMaxDistance;
      i = i + 7
    ) {
      this.game.addEntity(
        new Brickmoved(
          this.game,
          PARAMS.BLOCKWIDTH * 10 * i + 1000,
          PARAMS.BLOCKWIDTH * 10
        )
      );
    }

    this.player.x = x;
    this.player.y = this.player.size ? y - PARAMS.BLOCKWIDTH : y;
    this.game.addEntity(this.player);
  }

  update() {
    PARAMS.DEBUG = document.getElementById('debug').checked;

    let midpoint = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;

    // if (this.x < this.sant.x - midpoint) this.x = this.sant.x - midpoint;

    // if (this.x >= this.game.mapMaxDistance) {
    //   this.x = this.game.mapMaxDistance;
    // }
  }

  draw(ctx) {}
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
