import { player, currentTilemap, tileSize } from "./main.js"
import { touchingWho } from "./grid.js"

export function checkAndSwitchScene() {
    //check if player is interacting with a scene switch object
          var getInteractLayer = currentTilemap.objects[1].objects;
          let interactWho;
          for (let k = 0; k < getInteractLayer.length; k++) {
            interactWho = touchingWho(getInteractLayer[k], player.position.x / tileSize, player.position.y / tileSize);
            if (interactWho !== false) break;
          }
          if (interactWho !== false) {
            //switch the scene
            let names = interactWho.split(">"); //will be in the format of place1>place2, place2 is where the player is going to
            console.log(names)
          }

}