import {loadTilemap, hihi} from "./graphics.js"
import {importJSON, findIndex} from "./function-storage.js"
import {input} from "./movement.js"
import {updateInventory, lookInCanvas} from "./inventory.js"
import {gridCells, moveTowards, behindSprite} from "./grid.js"
//VARIABLE STORAGE AREA {
window.gameState = "interact"; //text, interact, inventory
export var currentScene = "trongle-needs-help";
export let currentTilemap;

const canvas = document.getElementById("game-window");
export const tileSize = 16;

export let allBodies;
export let createThis;
export let preloadThis;

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

export var game = new Phaser.Game(config);

function preload() {
  preloadThis = this;
  this.load.image("sky", "images/sky.png");
  this.load.spritesheet("player", "images/purple.png", {frameWidth: 16, frameHeight: 32})
  this.load.image("shadow", "images/shadow.png");
  this.load.image("roy", "images/roy.png");
}

let cursors;
export let player;

export function getTempBodies(sprite) { //get all bodies, excluding the sprite needing all bodies
  var tempBodies = allBodies;
  var spriteIndex = findIndex(tempBodies, "label", sprite.sprite.body.label);
  if(spriteIndex !== -1) tempBodies.splice(spriteIndex, 1);
  return tempBodies;
}

function Player(x, y, key, depth, spriteFacingRight) {

  this.direction = "down";
  this.depth = depth;
  this.ogDepth = depth;
  this.position = new Phaser.Math.Vector2(gridCells(x), gridCells(y));
  this.sprite = new Phaser.Physics.Matter.Sprite(createThis.matter.world, this.position.x, this.position.y, key);
  this.destinationPosition = new Phaser.Math.Vector2(this.position.x, this.position.y);
  this.speed = 2;
  this.distance;
  this.spriteFacingRight = spriteFacingRight;
  this.isColliding = false;
  this.whoColliding = null;
  this.shadow = createThis.add.image(this.position.x, this.position.y, "shadow");
  //this.sprite.setBody(16, 32);
  //this.bottomCoord = position.y
  this.offsetX = tileSize/2;
  this.offsetY = -(this.sprite.height/2) + tileSize-2;
//if(this.sprite.height === 32) this.offsetY = 0;
//else if(this.sprite.height === 16)this.offsetY = 0;
  this.updatePlayer = function() {
    //this.sprite.body.position.x = this.position.x + this.offsetX;
    //this.sprite.body.position.y = this.position.y + this.offsetY;
    //update sprite's position and depth
    this.sprite.setPosition(this.position.x + this.offsetX, this.position.y + this.offsetY);
    this.sprite.setDepth(this.depth);
    //update shadow position and depth
    this.shadow.setPosition(this.position.x + this.offsetX, this.position.y + tileSize/2);
    this.shadow.setDepth(this.depth);
    //update player distance from desired location
    this.distance = moveTowards(this, this.destinationPosition, this.speed);
  }
  createThis.add.existing(this.sprite);
  this.sprite.body.label = key;
}
let roy;



function hehe(){
  return new Promise((resolve) => {
    resolve(")::::")
  })
};

async function create() {

  gameState = "interact";
  currentScene = "trongle-needs-help";
  createThis = this;

  //var joe = await hihi();

  //console.log(joe);

  //this.background = this.add.image(0, 0, "sky").setOrigin(0, 0)

  //this.background.displayWidth = this.sys.canvas.width;
  //this.background.displayHeight = this.sys.canvas.height;

  currentTilemap = "heheheheheh"
  currentTilemap = await loadTilemap("../json/house.json",preloadThis, createThis);


  //loadTilemap(this, "untitled", "manyTiles", "[Base]BaseChip_pipo");
  //currentTilemap = this.make.tilemap({ key: "untitled" });; //the name of the jsonFile is the key

  //loadTilemap("house", ["house1", "house2", "house3", "house4"], )
  var depth = currentTilemap.layers.length-2;
  //-1 cuz index starts at 0
  //another -1 to move below the behind layer
  //originally there was a -0.5 so player could be between front and behind layer, but stair collide layer solves that
  //another -1 COULD happen so player can be on collide layer with stairs
  //will be ontop of front objects, but behind behind objects;
  player = new Player(0, 0, "player", depth, true)
  roy = new Player(7, 6, "roy", depth);
  //roy.sprite.setStatic(true);

  allBodies = this.matter.world.getAllBodies();
  allBodies.forEach(body => {
    body.inertia = Infinity;
    body.inverseInertia = 0;
  });

  this.cameras.main.setBounds(0, 0, currentTilemap.widthInPixels, currentTilemap.heightInPixels, true);
  this.cameras.main.startFollow(player.sprite);
  this.cameras.main.setZoom(3);


  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", {frames: [6, 7, 8]}),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: "idleX",
    frames: this.anims.generateFrameNumbers("player", {frames: [7]}),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleUp",
    frames: this.anims.generateFrameNumbers("player", {frames: [4]}),
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
    frames: this.anims.generateFrameNumbers("player", {frames: [3, 4, 5]}),
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
  updateInventory();

}

function update(){
  if(player !== undefined) {
    player.updatePlayer();
    roy.updatePlayer();

    const hasArrived = player.distance <= 1;
    if(hasArrived && gameState === "interact") {
        input();
    }
  }
  updateGameState();
};


canvas.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
  console.log(window.getComputedStyle(lookInCanvas).getPropertyValue("z-index"))
  if(window.getComputedStyle(lookInCanvas).getPropertyValue("z-index") == 4) lookInCanvas.style.zIndex = "-1";

})

function updateGameState() {
  if(gameState === "text") document.getElementById("text-box").style.display = "block";
    else document.getElementById("text-box").style.display = "none";
  if(gameState === "interact") {

  }
}
