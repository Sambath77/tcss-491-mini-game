class SceneManager {
  constructor(game) {
    this.game = game;
    this.game.camera = this;
    this.game.mapMaxDistance = 50;
    this.game.isMaxDistance = false;
    this.x = 0;
    this.y = -PARAMS.BLOCKWIDTH;
    this.score = 0;

    this.minimap = new Minimap(
      this.game,
      1.5 * PARAMS.BLOCKWIDTH,
      3.5 * PARAMS.BLOCKWIDTH,
      224 * PARAMS.SCALE
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

    for (let i = 1; i < 50; i++) {
      this.game.addEntity(new Wall(this.game, 0, -i * PARAMS.SCREEN_HEIGHT));
    }

    for (let i = 1; i < 50; i++) {
      this.game.addEntity(new Brickmoved(this.game, i * 100 + 10, i * 10 + 10));
    }

    // for (let i = 1; i < 50; i++) {
    //   this.game.addEntity(
    //     new Brickmoved(this.game, i * 100 + 10, i * 100 + 10)
    //   );
    // }
    // for (let i = 1; i < 500; i++) {
    //   this.game.addEntity(
    //     new Brickmoved(this.game, 0, 8 * PARAMS.BLOCKWIDTH * i)
    //   );
    // }
    // let brick = new Brickmoved(this.game, 400, 8 * PARAMS.BLOCKWIDTH);
    // this.game.addEntity(brick);
    // brick = new Brickmoved(this.game, 0, 10 * PARAMS.BLOCKWIDTH);
    // this.game.addEntity(brick);
    // this.angel.x = x;
    // this.angel.y = this.angel.size ? y - PARAMS.BLOCKWIDTH : y;
    // this.game.addEntity(this.angel);
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
