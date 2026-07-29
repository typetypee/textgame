import { loadTilemap } from "./graphics.js"
import { importFile, findIndex } from "./function-storage.js"
import { updateInventory, lookInCanvas } from "./inventory.js"
import { gridToPixels, moveTowards, behindSprite } from "./grid.js"
import * as Scenes from "./Scenes/index.js"
//this file contains some global variables, and functions used for setup of the game

/*JSON NOTES
What should JSON be supplying us?
Our current textscene is called "trongle-needs-help", this will load in all the dialgogue for a scene.
I think perhaps the name of the tilemap setting (the actual graphics) should be included when we load in the text. We cannot do the other way around, where we call the textscene name with the json tilemap, because we are likely to reuse tilemaps across several text scenes. Also, textscenes are custom made, tilemaps are made by Tiled, and we are NOT gonna fiddle with that.



*/

//VARIABLE STORAGE AREA {
window.gameState = "interact"; //text, interact, inventory
window.currentTextScene = "trongle-needs-help";
window.currentTilemap = null;

const sceneArray = Object.values(Scenes); 

const canvas = document.getElementById("game-window");
export const tileSize = 16;

export let allBodies;
//these two variables let you access the functions and properites of these functions
export let createThis;
export let preloadThis;

export let saveData = {};

//}
//phaser configuration stuff
const config = {
  type: Phaser.CANVAS,
  canvas: canvas,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: sceneArray,
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

let cursors;


//might wanna rename this function
export class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, gridX, gridY, key, depth, spriteFacingRight) {
    //add the entity to the scene
    super(scene, 0, 0, key);
    scene.add.existing(this);

    this.name = key;
    this.direction = "down";
    this.ogDepth = depth; //this is a constant
    this.depth = depth; // this is not constant, and ogDepth is used as reference of the layer to return to
    this.grid = new Phaser.Math.Vector2(gridX, gridY);
    this.position = new Phaser.Math.Vector2(gridToPixels(this.grid.x), gridToPixels(this.grid.y)); //note that position does not include offset (wtf is the point of this tbh...)
    this.destinationPosition = new Phaser.Math.Vector2(this.position.x, this.position.y);

    this.speed = 2;
    this.distance = 0;
    this.spriteFacingRight = spriteFacingRight; //i have no idea what this is for
    this.isColliding = false;
    this.whoColliding = null;
    //this.shadow = this.add.image(this.position.x, this.position.y, "shadow");
    //this.sprite.setBody(16, 32);
    //this.bottomCoord = position.y

    this.offsetX = tileSize / 2; //puts the sprite on the center of the tile
    this.offsetY = -(this.height / 2) + tileSize - 2; //puts the sprite near the bottom of the tile
  }
  update() {
      //update sprite's position and its layer position (depth)
      this.setPosition(this.position.x + this.offsetX, this.position.y + this.offsetY);
      this.setDepth(this.depth);

      /**update shadow position and depth
      this.shadow.setPosition(this.position.x + this.offsetX, this.position.y + tileSize / 2);
      this.shadow.setDepth(this.depth);**/

      //update player distance from desired location
      this.distance = moveTowards(this, this.destinationPosition, this.speed);
    //
  }
  setNewPosition(x, y) {
    console.log(x, y);
    this.grid.x = x;
    this.grid.y = y;
    this.position.x = gridToPixels(x);
    this.position.y = gridToPixels(y);
    this.destinationPosition.x = this.position.x;
    this.destinationPosition.y = this.position.y;
      
  }
}

//after everything has been created, update our creations periodically
function update() {
  console.log(":D")
  if (player !== undefined) {
    player.updatePlayer();
    roy.updatePlayer();

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
