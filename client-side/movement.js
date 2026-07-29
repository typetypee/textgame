import { tileSize, allBodies, createThis } from "./main.js"
import { isSpaceBlocked, isNPCBlocking, outOfWorldBounds, behindSprite, frontSprite, isSpaceType } from "./grid.js"
import { findIndex } from "./function-storage.js"

//oh dear, this file is for moving the sprite character, and eventually will include npc movement (though maybe we should separate those two files?)

/* Notes on How the Movement System Works

The sprite will be our example.
Some notes:
*destinationPostition x and y are in canvas coords

At initation of the program, the sprite's destinationPosition x and y propeties should be the same as their current position.
destinationPosition x and y will change in input()

**input() OVERVIEW**
destinatoinPosition x and y are copied in tempotary variables nextX and nextY.
At this point, nextX and nextY are no different from the current X and Y.
If the arrows keys are pressed, nextX and nextY change. These become the hypothetical next position for the sprite. A collision check is done to see if there are any obstructions at this new coordinate that the sprite should not be able to walk on.
If there are obstructions (collision check fails), then the function just terminates and no sprite movement occurs.
If there are not (collision check is passed), then the function sets destinationPosition x and y to the nextX and nextY, the new position the sprite should move to.

We should note that input() itself isn't responsible for physically moving the sprite.

**moveTowards() OVERVIEW**
This function is responsible for physically moving the sprite.
It will calculate the distance from the current position to the destinatoin position, and move the sprite until they are at the destination.
Note that, unless we get into NPC movement, the distance calculation and movement are instanteious. THe new destination will rarely ever be more than a tile because, in update() in main.js, the user is not allowed to use input() until the sprite has finshed moving.


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

function moveEntity(sprite, allEntities, nextPosX, nextPosY) {
    //these lines move the sprites up or down in the layer
    //moves the sprite in the layer below (moving behind a character)
    let chosenSpriteIndex = allEntities.indexOf(sprite);
    let adjustedAllEntities = allEntities.toSpliced(chosenSpriteIndex, 1);
    if (adjustedAllEntities.some(bodies => behindSprite(bodies, nextPosX / tileSize, nextPosY / tileSize))) sprite.depth = sprite.ogDepth - 0.5;
    //moves the sprite in the layer above (moving in front of a character)
    else if (adjustedAllEntities.some(bodies => frontSprite(bodies, nextPosX / tileSize, nextPosY / tileSize))) sprite.depth = sprite.ogDepth + 0.5;
    else sprite.depth = sprite.ogDepth;

    //change the position of the sprite, note that this does not yet physically move the sprite, more collision checks must be done
    sprite.destinationPosition.x = nextPosX;
    sprite.destinationPosition.y = nextPosY;

  }

//makes the sprite move, we should note the sprite cannot move diagonally
//this fucntion may be recyled for npcs
export function initiateInput() {
  playerData.sprite.input = function(allEntities){
    //this is the coordinate the sprite intends to move to
    let nextPosX = this.destinationPosition.x;
    let nextPosY = this.destinationPosition.y;

    const xAxisMovement = 37 in keys || 39 in keys;
    const yAxisMovement = 38 in keys || 40 in keys;

    //X-AXIS MOVEMENT
    //!yAxisMovement prevents the sprite from moving along the y-axis if they want to move along the x-axis, this prevents diagonal movement
    if (37 in keys && !yAxisMovement) {
      this.direction = "left";
      nextPosX -= tileSize;
      if (this.spriteFacingRight) this.flipX = true;
      else this.flipX = false;
      this.anims.play("walkSide", true);
    }
    else if (39 in keys && !yAxisMovement) {
      this.direction = "right";
      nextPosX += tileSize;
      if (this.spriteFacingRight) this.flipX = false;
      else this.flipX = true;
      this.anims.play("walkSide", true);
    }
    //if the keys are not actively pressed (and so the sprite is moving), an idle animation is played instead
    else if (this.direction === "left" || this.direction === "right") {
      this.anims.play("idleSide", true);
    }

    //Y-AXIS MOVEMENT
    if (38 in keys && !xAxisMovement) {
      this.direction = "up";
      nextPosY -= tileSize;
      this.anims.play("walkUp", true);
    } else if (this.direction == "up") {
      this.anims.play("idleUp", true);
    }

    if (40 in keys && !xAxisMovement) {
      this.direction = "down";
      nextPosY += tileSize;
      this.anims.play("walkDown", true);
    } else if (this.direction == "down") {
      this.anims.play("idleDown", true);

    }

    //check if space is freeeee OMG COLLISIION

    //this functions runs if collision checks are passed, and the sprite will offically be moved

    //collision check, to pass, space must be unblocked, there must be no npc blocking and the entity must be within world bounds
    //this is a kind of hypotehtical "if the entity were to move these hypotethical nextX and nextY, would there be collision issues? if not, then we can continue"
    if (!isSpaceBlocked(currentTilemap, nextPosX / tileSize, nextPosY / tileSize) && !allEntities.some(body => isNPCBlocking(body, nextPosX / tileSize, nextPosY / tileSize)) && !outOfWorldBounds(nextPosX / tileSize, nextPosY / tileSize)) {

    /**  //collision only active if sprite is on stairs
      if(isSpaceType("isStairs", currentTilemap, this.position.x/tileSize, this.position.y/tileSize)) { //if on stairs, check for collision
        if(!isSpaceType("stairsCollision", currentTilemap, nextX/tileSize, nextY/tileSize)) moveEntity();
      } else moveEntity(); //else just run shared code**/
      moveEntity(this, allEntities, nextPosX, nextPosY);
    }
  }
}
