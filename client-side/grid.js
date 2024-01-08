import {createThis, currentTilemap, tileSize} from "./main.js"
export function gridCells(n) {
  return n*tileSize;
}

export function moveTowards(person, destinationPosition, speed) {
  let distanceToTravelX = destinationPosition.x - person.position.x;
  let distanceToTravelY = destinationPosition.y - person.position.y;

  let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

  if (distance <= speed) {
    person.position.x = destinationPosition.x;
    person.position.y = destinationPosition.y;
  } else {
    let normalizedX = distanceToTravelX / distance;
    let normalizedY = distanceToTravelY / distance;

    person.position.x += normalizedX * speed;
    person.position.y += normalizedY * speed;
    //caluclute remaining distance after move
    distanceToTravelX = destinationPosition.x - person.position.x;
    distanceToTravelY = destinationPosition.y - person.position.y;
    distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);
  }
  return distance;

}

export function isSpaceBlocked(tilemap, x, y) {
  for(var i = 0; i < tilemap.layers.length; i++) {
    var tile = (tilemap.getTileAt(x, y, false, tilemap.layers[i].name))
    if(tile === null) continue;
    if(tile.properties.collision) return tile.properties.collision;
    else if(i == tilemap.layers.length-1) return false;
  }
}

export function isSpaceType(type, tilemap, x, y){
  for(var i = 0; i < tilemap.layers.length; i++) {
    var tile = (tilemap.getTileAt(x, y, false, tilemap.layers[i].name))
    if(tile === null) continue;
    if(tile.properties[type]) return tile.properties[type];
    else if(i == tilemap.layers.length-1) return false;
  }
}
function getCoord(coord, xOrY){
  if(xOrY == "x") return Math.floor(coord/tileSize); //because x is some number with 0.5 because the sprite is placed at the center of the tile and the correct value is the number we get from rounding down
  else if (xOrY == "y") return Math.ceil(coord/tileSize) //because the coords are the bottom of the tile, but the sprite is shifted a bit above the tile (so the coord/tileSize is actually 4.8 or some other decimal with 4 in front)
}
export function isNPCBlocking(bodies, x, y) {
  if(x == getCoord(bodies.position.x, "x")) {
    if(y == getCoord(bodies.position.y, "y")) {
      return true;
    } else return false;
  } else return false;
}

export function touchingWho(bodies, x, y) {
  var bodiesX;
  var bodiesY;
  var width = 1;
  var height = 1;

  //depends on if checking position of matterjs sprite or of tiled obejct
  if(bodies.position === undefined) { //tiled object
    bodiesX = getCoord(bodies.x, "x");
    bodiesY = getCoord(bodies.y, "y");
    //calculate width and height of object
    width = bodies.polygon[2].x/tileSize;
    height = bodies.polygon[2].y/tileSize;

  } else { //matterjs sprite
    bodiesX = getCoord(bodies.position.x, "x");
    bodiesY = getCoord(bodies.position.y, "y");
    //make sure to add code to calculate width and height for sprites
  }
  for(var w = 0; w < width; w++) { //check all along the width
    for(var h = 0; h < height; h++) { //height too
      //locations to check at
      let left = x == bodiesX-1 && y == bodiesY+h;
      let right = x == bodiesX+1 && y==bodiesY+h
      let up = y==bodiesY-1 && x == bodiesX+w
      let down = y==bodiesY+1 && x== bodiesX+w

      if(bodies.position === undefined) {
        for(let p = 0; p < bodies.properties.length; p++) {
          if(eval(bodies.properties[p].name)) return bodies.name;
          else if(p==bodies.properties.length-1 && h == height-1 && w == width-1) return false;
        }
      }
      else if(left||right||up||down){
          if(bodies.position === undefined) return bodies.name;
          else return bodies.label;
      } else if(w == width-1 && h == height-1) return false;
    }
  }
}

export function behindSprite(bodies, x, y){
  var bodiesX = getCoord(bodies.position.x, "x");
  var bodiesY = getCoord(bodies.position.y, "y");
  if((x== bodiesX && y== bodiesY-1)) return true;
  else return false;
}

export function frontSprite(bodies, x, y){
  var bodiesX = getCoord(bodies.position.x, "x");
  var bodiesY = getCoord(bodies.position.y, "y");
  if((x== bodiesX && y== bodiesY+1)) return true;
  else return false;
}

export function outOfWorldBounds(x, y) {
  if(x < 0 || x > currentTilemap.widthInPixels/tileSize-1 || y < 0 || y > currentTilemap.heightInPixels/tileSize-1) {
    return true;
  } else return false;
}
