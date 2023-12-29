const textBox = document.getElementById("text"), textName = document.getElementById("name")

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
      default: "matter",
      matter: {
        debug: true,
        gravity: {y: 0}
      }
    },
    plugins: {
      scene: [
        {
          plugin: "phaser-matter-collision-plugin",
          key: "matterCollision",
          mapping: "matterCollision"
        }
      ]
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
  function Wow(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = this.physics.add.sprite(this.x, this.y, "player");
  }

  player = new Phaser.Physics.Matter.Sprite(this.matter.world, 32, 32);
  this.add.existing(player);

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
    frames: this.anims.generateFrameNumbers("player", {frames: [7]}),
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
    frames: this.anims.generateFrameNumbers("player", {frames: [6, 7, 8]}),
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

canvas.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
})
