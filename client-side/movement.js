import { player, tileSize, currentTilemap, allBodies, createThis, getTempBodies } from "./main.js"
import { isSpaceBlocked, isNPCBlocking, outOfWorldBounds, behindSprite, frontSprite, isSpaceType } from "./grid.js"
import { findIndex } from "./function-storage.js"

//oh dear, this file is for moving the player character, and eventually will include npc movement (though maybe we should separate those two files?)

/* Notes on How the Movement System Works

The player will be our example.
Some notes:
*destinationPostition x and y are in canvas coords

At initation of the program, the player's destinationPosition x and y propeties should be the same as their current position.
destinationPosition x and y will change in input()

**input() OVERVIEW**
destinatoinPosition x and y are copied in tempotary variables nextX and nextY.
At this point, nextX and nextY are no different from the current X and Y.
If the arrows keys are pressed, nextX and nextY change. These become the hypothetical next position for the player. A collision check is done to see if there are any obstructions at this new coordinate that the player should not be able to walk on.
If there are obstructions (collision check fails), then the function just terminates and no player movement occurs.
If there are not (collision check is passed), then the function sets destinationPosition x and y to the nextX and nextY, the new position the player should move to.

We should note that input() itself isn't responsible for physically moving the player.

**moveTowards() OVERVIEW**
This function is responsible for physically moving the player.
It will calculate the distance from the current position to the destinatoin position, and move the player until they are at the destination.
Note that, unless we get into NPC movement, the distance calculation and movement are instanteious. THe new destination will rarely ever be more than a tile because, in update() in main.js, the user is not allowed to use input() until the player has finshed moving.


*/

var keys = {};

//basic key events
window.addEventListener('keydown', function(e) {
  keys[e.keyCode] = true;
  e.preventDefault();
});

window.addEventListener('keyup', function(e) {
  delete keys[e.keyCode];
});

//makes the player move, we should note the player cannot move diagonally
//this fucntion may be recyled for npcs
export function input() {
  //this is the coordinate the player intends to move to
  let nextPosX = player.destinationPosition.x;
  let nextPosY = player.destinationPosition.y;

  const xAxisMovement = 37 in keys || 39 in keys;
  const yAxisMovement = 38 in keys || 40 in keys;

  //X-AXIS MOVEMENT
  //!yAxisMovement prevents the player from moving along the y-axis if they want to move along the x-axis, this prevents diagonal movement
  if (37 in keys && !yAxisMovement) {
    player.direction = "left";
    nextPosX -= tileSize;
    if (player.spriteFacingRight) player.sprite.flipX = true;
    else player.sprite.flipX = false;
    player.sprite.anims.play("walk", true);
  }
  else if (39 in keys && !yAxisMovement) {
    player.direction = "right";
    nextPosX += tileSize;
    if (player.spriteFacingRight) player.sprite.flipX = false;
    else player.sprite.flipX = true;
    player.sprite.anims.play("walk", true);
  }
  //if the keys are not actively pressed (and so the player is moving), an idle animation is played instead
  else if (player.direction === "left" || player.direction === "right") {
    player.sprite.anims.play("idleX", true);
  }

  //Y-AXIS MOVEMENT
  if (38 in keys && !xAxisMovement) {
    player.direction = "up";
    nextPosY -= tileSize;
    player.sprite.anims.play("walkUp", true);
  } else if (player.direction == "up") {
    player.sprite.anims.play("idleUp", true);
  }

  if (40 in keys && !xAxisMovement) {
    player.direction = "down";
    nextPosY += tileSize;
    player.sprite.anims.play("walkDown", true);
  } else if (player.direction == "down") {
    player.sprite.anims.play("idleDown", true);

  }

  //check if space is freeeee OMG COLLISIION

  //console.log(player.isColliding)
  //const isColliding = allBodies.some(body=> createThis.matter.world.on("collisionstart", (event, player.sprite, body)));

  //this variable temporarily stores the player's properties in a copy
  var tempBodies = getTempBodies(player);

  //player.isColliding = tempBodies.forEach(body=>isNPCBlocking(body, nextX/tileSize, nextY/tileSize));
  //console.log(player.isColliding)

  //this functions runs if collision checks are passed, and the player will offically be moved
  function moveEntity() {
    //these lines move the players up or down in the layer
    if (tempBodies.some(bodies => behindSprite(bodies, nextPosX / tileSize, nextPosY / tileSize))) player.depth = player.ogDepth - 0.5;
    else if (tempBodies.some(bodies => frontSprite(bodies, nextPosX / tileSize, nextPosY / tileSize))) player.depth = player.ogDepth + 0.25;
    else player.depth = player.ogDepth;

    //move the player
    player.destinationPosition.x = nextPosX;
    player.destinationPosition.y = nextPosY;
  }

  //collision check, to pass, space must be unblocked, there must be no npc blocking and the entity must be within world bounds
  //this is a kind of hypotehtical "if the entity were to move these hypotethical nextX and nextY, would there be collision issues? if not, then we can continue"
  if (!isSpaceBlocked(currentTilemap, nextPosX / tileSize, nextPosY / tileSize) && !tempBodies.some(body => isNPCBlocking(body, nextPosX / tileSize, nextPosY / tileSize)) && !outOfWorldBounds(nextPosX / tileSize, nextPosY / tileSize)) {
    /**
    //collision only active if player is on stairs
    if(isSpaceType("isStairs", currentTilemap, player.position.x/tileSize, player.position.y/tileSize)) { //if on stairs, check for collision
      if(!isSpaceType("stairsCollision", currentTilemap, nextX/tileSize, nextY/tileSize)) moveEntity();
    } else moveEntity(); //else just run shared code**/
    moveEntity();
  }
  //  console.log(isSpaceBlocked(currentTilemap, nextX/tileSize, nextY/tileSize))
}
