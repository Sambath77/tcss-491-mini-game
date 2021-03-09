class SceneManager {
  constructor(game) {
    this.game = game;
    this.game.camera = this;
    this.game.mapMaxDistance = 50;
    this.game.isMaxDistance = false;
    this.game.isFightingBoss = false;
    this.x = 0;
    //this.y = -PARAMS.BLOCKWIDTH;
    this.score = 0;

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

    for (let i = 1; i < 50; i++) {
      this.game.addEntity(new Brickmoved(this.game, i * 100 + 10, i * 10 + 10));
    }

    this.player.x = x;
    this.player.y = this.player.size ? y - PARAMS.BLOCKWIDTH : y;
    this.game.addEntity(this.player);
  }

  update() {
    PARAMS.DEBUG = document.getElementById('debug').checked;

    let midpoint = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;

    if (this.x < this.player.x - midpoint) this.x = this.player.x - midpoint;

    if (this.x >= this.game.mapMaxDistance) {
      this.x = this.game.mapMaxDistance;
    }
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
