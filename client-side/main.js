import {loadTilemap} from "./graphics.js"
import {importJSON} from "./function-storage.js"
import {input} from "./movement.js"
import {updateInventory} from "./inventory.js"
import {gridCells, moveTowards} from "./grid.js"
//VARIABLE STORAGE AREA {
export let gameState; //text, interact, inventory
var currentScene = "trongle-needs-help";
export let currentTilemap = "grassyMap";

const canvas = document.getElementById("game-window");
export const tileSize = 16;

export let allBodies;
export let createThis;
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
  this.load.image("shadow", "images/shadow.png");
  this.load.image("grassyTiles", "images/spritesheet.png");
  this.load.tilemapTiledJSON("grassyMap", "../json/map.json");
  this.load.image("roy", "images/roy.png");
}

let cursors;
export let player;
const offsetX = tileSize / 2;
const offsetY = tileSize;

function Player(x, y, key, parentThis) {
  this.direction = "down";
  this.position = new Phaser.Math.Vector2(gridCells(x), gridCells(y));
  this.sprite = new Phaser.Physics.Matter.Sprite(parentThis.matter.world, this.position.x, this.position.y, key);
  this.destinationPosition = new Phaser.Math.Vector2(this.position.x, this.position.y);
  this.speed = 2;
  this.distance;
  this.shadow = parentThis.add.image(this.position.x, this.position.y, "shadow");
  this.updatePlayer = function() {
    this.sprite.body.position.x = this.position.x + offsetX;
    this.sprite.body.position.y = this.position.y;
    this.shadow.setPosition(this.position.x + offsetX, this.position.y);
    this.distance = moveTowards(this, this.destinationPosition, this.speed);
  }
  parentThis.add.existing(this.sprite);
}
let roy;
function create() {

  gameState = "interact";
  currentScene = "trongle-needs-help";

  this.background = this.add.image(0, 0, "sky").setOrigin(0, 0)

  this.background.displayWidth = this.sys.canvas.width;
  this.background.displayHeight = this.sys.canvas.height;

  loadTilemap(this, "grassyMap", "grassyTiles", "spritesheet");
  currentTilemap = this.make.tilemap({ key: "grassyMap" });;

  player = new Player(2, 4, "player", this)
  roy = new Player(8, 5, "roy", this);
  roy.sprite.setStatic(true);

  createThis = this;
    allBodies = this.matter.world.getAllBodies();
  console.log(allBodies)
    allBodies.forEach(body => {
      console.log(body)
      if (body.hasOwnProperty('angularVelocity')) {
      body.angularVelocity = 0;
    }
  });

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
  player.updatePlayer();
  roy.updatePlayer();

  const hasArrived = player.distance <= 1;
  if(hasArrived) {
      input();
  }

  updateInventory();
  updateGameState();
};


canvas.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
})

function updateGameState() {
  if(gameState === "text") document.getElementById("text-box").style.display = "block";
    else document.getElementById("text-box").style.display = "none";
  if(gameState === "interact") {

  }
}
