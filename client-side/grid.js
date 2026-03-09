import { createThis, currentTilemap, tileSize } from "./main.js"

//this file contains many functions grid based collision detection and tile movement

//convers a grid coordinate into to pixel coordinates for the canvas
export function gridCells(n) {
  return n * tileSize;
}


//this function calculates and returns the distance (in canvas cooordinates) from destination coordinates (also in canvas coordinates)
//this function is also the one actually physically moving the player
export function moveTowards(person, destinationPosition, speed) {
  let distanceToTravelX = destinationPosition.x - person.position.x;
  let distanceToTravelY = destinationPosition.y - person.position.y;

  //pythagorean theoreom type of stuff
  let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);

  if (distance <= speed) { //if we are at the destination position, meaning distance from og position to destination is bascially zero...
    //...we can update the player's old position to the new one, which is the one it is at
    //why?
    //position.x and position.y will likely be some weird decimal, while destination position is a solid interger value that is divisable by tileSize, and since we are esentially at the destination, this action here is just kinda like rounding the person.position
    person.position.x = destinationPosition.x;
    person.position.y = destinationPosition.y;
  } else {

    //this will actually 
    let normalizedX = distanceToTravelX / distance;
    let normalizedY = distanceToTravelY / distance;

    person.position.x += normalizedX * speed;
    person.position.y += normalizedY * speed;
    //caluclute remaining distance after move, this will be used the next time the function is run
    //NOTE: do we even need this??? if the funtion reruns.....these variables just disappear...we'll keep these for now ig
    distanceToTravelX = destinationPosition.x - person.position.x;
    distanceToTravelY = destinationPosition.y - person.position.y;
    distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
  }
  return distance;

}

//NOTE: I think we could possibly merge isSpaceBlocked and isSpaceType, they have essentially the same code. Put this off for now.

//checks an x and y position on all the layers to see if the tile an entity is on has collision
export function isSpaceBlocked(tilemap, x, y) {
  for (var i = 0; i < tilemap.layers.length; i++) {
    var tile = (tilemap.getTileAt(x, y, false, tilemap.layers[i].name));
    //i THINK we are checking for the existance of the tiles.properties.collision
    if (tile === null) continue;
    //note that tiles.properties.collision = true
    if (tile.properties.collision) return tile.properties.collision;
    //if we made it to the last layer and there's still no layers with collision on a layer, then return false
    else if (i == tilemap.layers.length - 1) return false;
  }
}

//checks all the layers to check if a tile has a certain property
export function isSpaceType(type, tilemap, x, y) {
  for (var i = 0; i < tilemap.layers.length; i++) {
    var tile = (tilemap.getTileAt(x, y, false, tilemap.layers[i].name))
    if (tile === null) continue;
    if (tile.properties[type]) return tile.properties[type];
    else if (i == tilemap.layers.length - 1) return false;
  }
}

//convert the canvas coordinates of an entity into grid coordinates
function getCoord(coord, xOrY) {
  if (xOrY == "x") return Math.floor(coord / tileSize); //this is because x is some number with 0.5, because the sprite is placed at the center of the tile and the correct value is the number we get from rounding down
  else if (xOrY == "y") return Math.ceil(coord / tileSize) //this is because the coords are the bottom of the tile, but the sprite is shifted a bit above the tile (so the coord/tileSize is actually 4.8 or some other decimal with 4 in front)
}

//checks if the given tile x and y matches the x and y of an entity, this is for checking collisions
export function isNPCBlocking(bodies, x, y) {
  if (x == getCoord(bodies.position.x, "x")) {
    if (y == getCoord(bodies.position.y, "y")) {
      return true;
    } else return false;
  } else return false;
}

//this function gives 
export function touchingWho(bodies, x, y) {
  var bodiesX;
  var bodiesY;
  var width = 1;
  var height = 1;

  //depends on if checking position of matterjs sprite or of tiled obejct
  if (bodies.position === undefined) { //returns undefined if the body is a tiled object (a tiled object is a tile)
    //for tiled objects
    bodiesX = getCoord(bodies.x, "x");
    bodiesY = getCoord(bodies.y, "y");
    //calculate width and height of object
    width = bodies.polygon[2].x / tileSize;
    height = bodies.polygon[2].y / tileSize;

  } else { //matterjs sprite, so bodies.position is not undefined
    //for matterjs sprites, given by phaser
    bodiesX = getCoord(bodies.position.x, "x");
    bodiesY = getCoord(bodies.position.y, "y");
    //make sure to add code to calculate width and height for sprites
  }

  for (var w = 0; w < width; w++) { //check all along the width
    for (var h = 0; h < height; h++) { //height too
      //locations to check at
      let left = x == bodiesX - 1 && y == bodiesY + h;
      let right = x == bodiesX + 1 && y == bodiesY + h
      let up = y == bodiesY - 1 && x == bodiesX + w
      let down = y == bodiesY + 1 && x == bodiesX + w

      //if is a tiled object
      if (bodies.position === undefined) {
        for (let p = 0; p < bodies.properties.length; p++) {
          if (eval(bodies.properties[p].name)) return bodies.name;
          else if (p == bodies.properties.length - 1 && h == height - 1 && w == width - 1) return false;
        }
      } //if is a matterjs objecct
      else if (left || right || up || down) {
        if (bodies.position === undefined) return bodies.name;
        else return bodies.label;
      } else if (w == width - 1 && h == height - 1) return false;
    }
  }
}

//this function is primarily for shifting an entity down a layer so that when they are "behind" another entity (they are really just above them)
export function behindSprite(bodies, x, y) {
  var bodiesX = getCoord(bodies.position.x, "x");
  var bodiesY = getCoord(bodies.position.y, "y");
  if ((x == bodiesX && y == bodiesY - 1)) return true;
  else return false;
}

//similar to the above function, except just moves the entity up a layer if they are below another entity
export function frontSprite(bodies, x, y) {
  var bodiesX = getCoord(bodies.position.x, "x");
  var bodiesY = getCoord(bodies.position.y, "y");
  if ((x == bodiesX && y == bodiesY + 1)) return true;
  else return false;
}

//this function checks if a coordinate is within world bounds, this is primarily meant for keeping entites within the world bounds
export function outOfWorldBounds(x, y) {
  if (x < 0 || x > currentTilemap.widthInPixels / tileSize - 1 || y < 0 || y > currentTilemap.heightInPixels / tileSize - 1) {
    return true;
  } else return false;
}
