const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload('./sprites/plane.png');

ASSET_MANAGER.queueDownload('./sprites/ground.png');

ASSET_MANAGER.queueDownload('./sprites/block3.png');

ASSET_MANAGER.downloadAll(function () {
  var gameEngine = new GameEngine();

  PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
  console.log(PARAMS.BITWIDTH, PARAMS.BLOCKWIDTH);

  const canvas = document.getElementById('gameWorld');
  const ctx = canvas.getContext('2d');

  PARAMS.CANVAS_WIDTH = canvas.width;

  gameEngine.init(ctx);

  new SceneManager(gameEngine);

  gameEngine.start();
});
