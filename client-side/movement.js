import {player, tileSize, currentTilemap, allBodies, createThis} from "./main.js"
import {isSpaceBlocked, isNPCBlocking, outOfWorldBounds} from "./grid.js"
import {findIndex} from "./function-storage.js"

var keys = {};

window.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
  e.preventDefault();
});

window.addEventListener('keyup', function(e) {
  delete keys[e.keyCode];
});

export function input() {
  let nextX = player.destinationPosition.x;
  let nextY = player.destinationPosition.y;

  const xAxisMovement = 37 in keys || 39 in keys;
  const yAxisMovement = 38 in keys || 40 in keys;

  if(37 in keys && !yAxisMovement) {
   player.direction = "left";
   nextX -= tileSize;
   if(player.spriteFacingRight) player.sprite.flipX = true;
   else player.sprite.flipX = false;
   player.sprite.anims.play("walk", true);

  }
  else if(39 in keys && !yAxisMovement) {
    player.direction = "right";
    nextX += tileSize;
    if(player.spriteFacingRight) player.sprite.flipX = false;
    else player.sprite.flipX = true;
    player.sprite.anims.play("walk", true);
  }
  else if(player.direction === "left" || player.direction === "right") {
   player.sprite.anims.play("idleX", true);
  }
  if(38 in keys && !xAxisMovement) {
    player.direction = "up";
     nextY -= tileSize;
    player.sprite.anims.play("walkUp", true);
  } else if(player.direction == "up") {
    player.sprite.anims.play("idleUp", true);
  }

  if(40 in keys && !xAxisMovement) {
    player.direction = "down";
    nextY += tileSize;
    player.sprite.anims.play("walkDown", true);
  } else if(player.direction == "down"){
   player.sprite.anims.play("idleDown", true);

  }

  //check if space is freeeee OMG COLLISIION

  //console.log(player.isColliding)
  //const isColliding = allBodies.some(body=> createThis.matter.world.on("collisionstart", (event, player.sprite, body)));
  var tempBodies = allBodies;
  var spriteIndex = findIndex(tempBodies, "label", player.sprite.body.label);
  if(spriteIndex !== -1)tempBodies.splice(spriteIndex, 1);

  //player.isColliding = tempBodies.forEach(body=>isNPCBlocking(body, nextX/tileSize, nextY/tileSize));
  //console.log(player.isColliding)

  if(!isSpaceBlocked(currentTilemap, nextX/tileSize, nextY/tileSize) && !tempBodies.some(body=>isNPCBlocking(body, nextX/tileSize, nextY/tileSize)) && !outOfWorldBounds(nextX/tileSize, nextY/tileSize)) {
    player.destinationPosition.x = nextX;
    player.destinationPosition.y = nextY;
  }
//  console.log(isSpaceBlocked(currentTilemap, nextX/tileSize, nextY/tileSize))
}
