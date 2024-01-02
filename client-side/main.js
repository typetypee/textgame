import {loadTilemap} from "./graphics.js"
import {importJSON} from "./function-storage.js"
import {input} from "./movement.js"
import {updateInventory} from "./inventory.js"
import {gridCells, moveTowards} from "./grid.js"
//VARIABLE STORAGE AREA {
window.gameState = "interact"; //text, interact, inventory
var currentScene = "trongle-needs-help";
export let currentTilemap;

const canvas = document.getElementById("game-window");
export const tileSize = 16;

export let allBodies;
export let createThis;
export let preloadThis;

let gameScale = 2;
//}

const config = {
    type: Phaser.CANVAS,
    canvas: canvas,
    physics: {
      default: "matter",
      matter: {
        debug: false,
        gravity: {y: 0},
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
      zoom: 1
    },
    render: {
      pixelArt: true
    }
}

var game = new Phaser.Game(config);

function preload() {
  preloadThis = this;
  this.load.image("sky", "images/sky.png");
  this.load.spritesheet("player", "images/chibi-layered.png", {frameWidth: 16, frameHeight: 16})
  this.load.image("shadow", "images/shadow.png");
  this.load.image("roy", "images/roy.png");

  currentTilemap = loadTilemap("../json/map.json");
}

let cursors;
export let player;

function Player(x, y, key, parentThis, spriteFacingRight) {

  this.direction = "down";
  this.position = new Phaser.Math.Vector2(gridCells(x), gridCells(y));
  this.sprite = new Phaser.Physics.Matter.Sprite(parentThis.matter.world, this.position.x, this.position.y, key);
  this.destinationPosition = new Phaser.Math.Vector2(this.position.x, this.position.y);
  this.speed = 2;
  this.distance;
  this.spriteFacingRight = spriteFacingRight;
  this.isColliding = false;
  this.whoColliding = null;
  this.shadow = parentThis.add.image(this.position.x, this.position.y, "shadow");
  //this.sprite.setBody(16, 32);
  //this.bottomCoord = position.y
  this.offsetX = tileSize/2;
  this.offsetY = -(this.sprite.height/2) + tileSize-2;
//if(this.sprite.height === 32) this.offsetY = 0;
//else if(this.sprite.height === 16)this.offsetY = 0;
  this.updatePlayer = function() {
    //this.sprite.body.position.x = this.position.x + this.offsetX;
    //this.sprite.body.position.y = this.position.y + this.offsetY;
    this.sprite.setPosition(this.position.x + this.offsetX, this.position.y + this.offsetY);
    this.shadow.setPosition(this.position.x + this.offsetX, this.position.y + tileSize/2);
    this.distance = moveTowards(this, this.destinationPosition, this.speed);
  }
  parentThis.add.existing(this.sprite);
  this.sprite.body.label = key;
}
let roy;
function create() {

  gameState = "interact";
  currentScene = "trongle-needs-help";
  createThis = this;

  this.background = this.add.image(0, 0, "sky").setOrigin(0, 0)

  this.background.displayWidth = this.sys.canvas.width;
  this.background.displayHeight = this.sys.canvas.height;


  //loadTilemap(this, "untitled", "manyTiles", "[Base]BaseChip_pipo");
  //currentTilemap = this.make.tilemap({ key: "untitled" });; //the name of the jsonFile is the key

  //loadTilemap("house", ["house1", "house2", "house3", "house4"], )

  player = new Player(0, 0, "player", this, false)
  roy = new Player(7, 5, "roy", this);
  //roy.sprite.setStatic(true);

  allBodies = this.matter.world.getAllBodies();
  allBodies.forEach(body => {
    body.inertia = Infinity;
    body.inverseInertia = 0;
  });
  console.log(currentTilemap)
    this.cameras.main.setBounds(0, 0, currentTilemap.heightInPixels, currentTilemap.widthInPixels, true);
    this.cameras.main.startFollow(player.sprite);
    this.cameras.main.setZoom(3);


  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", {frames: [4, 1, 7]}),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: "idleX",
    frames: this.anims.generateFrameNumbers("player", {frames: [1]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleUp",
    frames: this.anims.generateFrameNumbers("player", {frames: [2]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleDown",
    frames: this.anims.generateFrameNumbers("player", {frames: [0]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkUp",
    frames: this.anims.generateFrameNumbers("player", {frames: [5, 2, 8]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkDown",
    frames: this.anims.generateFrameNumbers("player", {frames: [3, 0, 6]}),
    frameRate: 10,
    repeat: -1
  })

  cursors = this.input.keyboard.createCursorKeys();

}

function update(){
  if(gameState === "interact") {
    player.updatePlayer();
    roy.updatePlayer();

    const hasArrived = player.distance <= 1;
    if(hasArrived) {
        input();
    }
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

export {currentScene}
