import { loadTilemap } from "../graphics.js";
import { initiateInput } from "../movement.js"
import { Entity } from "../main.js"

function updateGameState() {
  if (gameState === "text") document.getElementById("text-box").style.display = "block";
  else document.getElementById("text-box").style.display = "none";
  if (gameState === "interact") {

  }
}

export class baseScene extends Phaser.Scene {
    preload() {
        this.allEntities = [];
        this.load.spritesheet("player", "images/purple.png", { frameWidth: 16, frameHeight: 32 })
    }
    setupCamera(entity) {
        this.cameras.main.setBounds(0, 0, currentTilemap.widthInPixels, currentTilemap.heightInPixels, true);
        this.cameras.main.startFollow(entity);
        this.cameras.main.setZoom(3);
    }
    loadTilemap(path, preloadThis) {
        return loadTilemap(path, preloadThis);
    }

    create() {
        gameState = "interact";
        let playerSprite = new Entity(this, 0, 0, "player", 0, true);
        playerData.sprite = playerSprite;

           //erm for some reason we set the player frames in this function
        //NOTE: we'll have to create a recyclable function to create frames for ALL entiites
        this.anims.create({
        key: "walkSide",
        frames: this.anims.generateFrameNumbers("player", { frames: [6, 7, 8] }),
        frameRate: 10,
        repeat: -1
        })
    
        this.anims.create({
        key: "idleSide",
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

    }
    update() {
        //check if player is at its desired next coordinates, distace should be under 1 if player is at the coordinates
        //we should note that, the transition from current coords to the next coord is basically instantaneous
        //NOTE: will need to adjust this for all npcs at some point

        if(playerData.sprite !== null ) {
            if (playerData.sprite.input !== null) {
            }
            else {
                initiateInput();
                console.log("input function created")
            }
            const hasArrived = playerData.sprite.distance <= 1;
         //this prevents the user from trying to move the player if the player is not yet at its destnation, we can't just cancel out of a movement...
            if (hasArrived && (currentTilemap !== null) && gameState == "interact") 
                {
                    playerData.sprite.input(this.allEntities);
                    
                }
        }
        updateGameState();
    }
}
