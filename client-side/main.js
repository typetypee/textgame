const textBox = document.getElementById("text"), textName = document.getElementById("name"), gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
const answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState; //text, interact, inventory
var currentLevel = "";

const canvas = document.getElementById("game-window");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false
//}
const config = {
    type: Phaser.CANVAS,
    canvas: canvas,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
        gravity: {y: 0}
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    scale: {
      mode: Phaser.Scale.NONE,
      width: 640,
      height: 360,
      zoom: 2
    }
}

var game = new Phaser.Game(config);

function preload() {

  this.load.image("sky", "images/sky.png");
  this.load.spritesheet("player", "images/hero-sheet.png", {frameWidth: 32, frameHeight: 32})
  this.load.image("grassyTiles", "images/spritesheet.png");
  this.load.tilemapTiledJSON("grassyMap", "../json/map.json");
}

let cursors;

function create() {
  this.background = this.add.image(0, 0, "sky").setOrigin(0, 0)

  this.background.displayWidth = this.sys.canvas.width;
  this.background.displayHeight = this.sys.canvas.height;

  const grassyMap = this.make.tilemap({ key: "grassyMap" });
  grassyMap.addTilesetImage("spritesheet", "grassyTiles");
  for (let i = 0; i < grassyMap.layers.length; i++) {
    const layer = grassyMap
      .createLayer(i, "spritesheet", 0, 0)
    layer.setDepth(i);
    layer.scale = 1;
  }

  const offsetX = 16 / 2;
  const offsetY = 16;
  player = this.physics.add.sprite(32, 32, "player");
  player.setOrigin(0.5, 1);
  player.setPosition(
    1 * 16 + offsetX,
    1 * 16 + offsetY
  );
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", {frames: [3, 4, 5]}),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: "idleX",
    frames: this.anims.generateFrameNumbers("player", {frames: [15]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleUp",
    frames: this.anims.generateFrameNumbers("player", {frames: [9]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleDown",
    frames: this.anims.generateFrameNumbers("player", {frames: [1]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkUp",
    frames: this.anims.generateFrameNumbers("player", {frames: [8, 9, 10]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkDown",
    frames: this.anims.generateFrameNumbers("player", {frames: [0, 1, 2]}),
    frameRate: 10,
    repeat: -1
  })

  cursors = this.input.keyboard.createCursorKeys();

}

function update(){
  input();
};


var currentScene = "trongle-needs-help";

function eventRun() {
  gameState = "interact";
  currentScene = "trongle-needs-help";

}

gameWindow.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
})
