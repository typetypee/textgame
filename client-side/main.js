import { loadTilemap, hihi } from "./graphics.js"
import { importFile, findIndex } from "./function-storage.js"
import { input } from "./movement.js"
import { updateInventory, lookInCanvas } from "./inventory.js"
import { gridCells, moveTowards, behindSprite } from "./grid.js"

//this file contains some global variables, and functions used for setup of the game

/*JSON NOTES
What should JSON be supplying us?
Our current textscene is called "trongle-needs-help", this will load in all the dialgogue for a scene.
I think perhaps the name of the tilemap setting (the actual graphics) should be included when we load in the text. We cannot do the other way around, where we call the textscene name with the json tilemap, because we are likely to reuse tilemaps across several text scenes. Also, textscenes are custom made, tilemaps are made by Tiled, and we are NOT gonna fiddle with that.



*/

//VARIABLE STORAGE AREA {
window.gameState = "interact"; //text, interact, inventory
export var currentTextScene = "trongle-needs-help";
export let currentTilemap;

const canvas = document.getElementById("game-window");
export const tileSize = 16;

export let allBodies;
//these two variables let you access the functions and properites of these functions
export let createThis;
export let preloadThis;

export let saveData = {};

//}

const config = {
  type: Phaser.CANVAS,
  canvas: canvas,
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { y: 0 },
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
  this.load.spritesheet("player", "images/purple.png", { frameWidth: 16, frameHeight: 32 })
  this.load.image("shadow", "images/shadow.png");
  this.load.image("roy", "images/roy.png");
}

let cursors;
export let player;

//note that we get a temporary copy of all the bodies (entities) in the world because we don't want to affect our allBodies reference (which is technically a constant for as long as the scene goes on)
export function getTempBodies(sprite) { //get all bodies, excluding the sprite that is calling all bodies
  var tempBodies = allBodies;
  var spriteIndex = findIndex(tempBodies, "label", sprite.sprite.body.label);
  if (spriteIndex !== -1) tempBodies.splice(spriteIndex, 1);
  return tempBodies;
}

//might wanna rename this function
function Player(x, y, key, depth, spriteFacingRight) {

  this.direction = "down";
  this.ogDepth = depth; //this is a constant
  this.depth = depth; // this is not constant, and ogDepth is used as reference of the layer to return to
  this.position = new Phaser.Math.Vector2(gridCells(x), gridCells(y)); //note that position does not include offset
  this.sprite = new Phaser.Physics.Matter.Sprite(createThis.matter.world, this.position.x, this.position.y, key);
  this.destinationPosition = new Phaser.Math.Vector2(this.position.x, this.position.y);
  this.speed = 2;
  this.distance;
  this.spriteFacingRight = spriteFacingRight; //i have no idea what this is for
  this.isColliding = false;
  this.whoColliding = null;
  this.shadow = createThis.add.image(this.position.x, this.position.y, "shadow");
  //this.sprite.setBody(16, 32);
  //this.bottomCoord = position.y

  this.offsetX = tileSize / 2; //puts the sprite on the center of the tile
  this.offsetY = -(this.sprite.height / 2) + tileSize - 2; //puts the sprite near the bottom of the tile

  //if(this.sprite.height === 32) this.offsetY = 0;
  //else if(this.sprite.height === 16)this.offsetY = 0;
  this.updatePlayer = function() {
    //this.sprite.body.position.x = this.position.x + this.offsetX;
    //this.sprite.body.position.y = this.position.y + this.offsetY;

    //update sprite's position and its layer position (depth)
    this.sprite.setPosition(this.position.x + this.offsetX, this.position.y + this.offsetY);
    this.sprite.setDepth(this.depth);

    //update shadow position and depth
    this.shadow.setPosition(this.position.x + this.offsetX, this.position.y + tileSize / 2);
    this.shadow.setDepth(this.depth);

    //update player distance from desired location
    this.distance = moveTowards(this, this.destinationPosition, this.speed);
  }
  //
  createThis.add.existing(this.sprite); //add this to the create database?

  this.sprite.body.label = key; //a label to reference this entity
}
let roy;



function hehe() {
  return new Promise((resolve) => {
    resolve(")::::")
  })
};

//function actual creates everything we loaded in
async function create() {

  gameState = "interact";
  currentTextScene = "trongle-needs-help";
  createThis = this; //ermmm wtf is this for?

  currentTilemap = ""
  currentTilemap = await loadTilemap("../json/house.json", preloadThis, createThis);


 
  //loadTilemap("house", ["house1", "house2", "house3", "house4"], )
  let depth = currentTilemap.layers.length - 2;
  //we subtract -1 cuz index starts at 0
  //we subtract another -1 to move below the behind layer
  //originally there was a -0.5 so player could be between front and behind layer, but stair collide layer solves that
  //another -1 COULD be subtracted so player can be on collide layer with stairs
  //will be ontop of front objects, but behind behind objects


  //create the npcs
  //NOTE: in the future, a json will give the entity data to create npcs, and a separate function will be needed to create all of them
  player = new Player(0, 0, "player", depth, true)
  roy = new Player(7, 6, "roy", depth);
  //roy.sprite.setStatic(true);

  allBodies = this.matter.world.getAllBodies(); //store all the matterjs entites in a variable
  //remove the matterjs physics from the entities
  allBodies.forEach(body => {
    body.inertia = Infinity;
    body.inverseInertia = 0;
  });

  //set up camera
  this.cameras.main.setBounds(0, 0, currentTilemap.widthInPixels, currentTilemap.heightInPixels, true);
  this.cameras.main.startFollow(player.sprite);
  this.cameras.main.setZoom(3);


  //erm for some reason we set the player frames in this function
  //NOTE: we'll have to create a recyclable function to create frames for ALL entiites
  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("player", { frames: [6, 7, 8] }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: "idleX",
    frames: this.anims.generateFrameNumbers("player", { frames: [7] }),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleUp",
    frames: this.anims.generateFrameNumbers("player", { frames: [4] }),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "idleDown",
    frames: this.anims.generateFrameNumbers("player", { frames: [1] }),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkUp",
    frames: this.anims.generateFrameNumbers("player", { frames: [3, 4, 5] }),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: "walkDown",
    frames: this.anims.generateFrameNumbers("player", { frames: [0, 1, 2] }),
    frameRate: 10,
    repeat: -1
  })

  cursors = this.input.keyboard.createCursorKeys(); //no idea what this does
  updateInventory();

}

//after everything has been created, update our creations periodically
function update() {
  if (player !== undefined) {
    player.updatePlayer();
    roy.updatePlayer();

    //check if player is at its desired next coordinates, distace should be under 1 if player is at the coordinates
    //we should note that, the transition from current coords to the next coord is basically instantaneous
    //NOTE: will need to adjust this for all npcs at some point
    const hasArrived = player.distance <= 1;
    //this prevents the user from trying to move the player if the player is not yet at its destnation, we can't just cancel out of a movement...
    if (hasArrived && gameState === "interact") {
      input();
    }
  }
  updateGameState();
};


canvas.addEventListener("click", function(e) {
  //these are just for checking for errors
  console.log(Math.floor(e.clientX / 10) + " " + Math.floor(e.clientY / 10));
  console.log(window.getComputedStyle(lookInCanvas).getPropertyValue("z-index"))
  //idk what this is for...
  if (window.getComputedStyle(lookInCanvas).getPropertyValue("z-index") == 4) lookInCanvas.style.zIndex = "-1";

})

function updateGameState() {
  if (gameState === "text") document.getElementById("text-box").style.display = "block";
  else document.getElementById("text-box").style.display = "none";
  if (gameState === "interact") {

  }
}
