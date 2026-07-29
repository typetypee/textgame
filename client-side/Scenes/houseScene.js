import { baseScene } from "./baseScene.js"
import { Entity } from "../main.js"
let currentTilemap;

let allTilesets;

export class houseScene extends baseScene {
    constructor(){
        super("houseScene");
    }


    //the keyword "this" refers to the class, not the methods
    preload() {  
        super.preload();
        this.load.image("sky", "images/sky.png");
        this.load.image("shadow", "images/shadow.png");
        this.load.image("roy", "images/roy.png");
        //load in tilemap
    }
    async create() {
        super.create();
        currentTextScene = "trongle-needs-help";
        currentTilemap = await this.loadTilemap("../json/house.json", this);
        let depth = currentTilemap.layers.length - 2;
        window.currentTilemap = currentTilemap;
        //we subtract -1 cuz index starts at 0
        //we subtract another -1 to move below the behind layer
        //originally there was a -0.5 so player could be between front and behind layer, but stair collide layer solves that
        //another -1 COULD be subtracted so player can be on collide layer with stairs
        //will be ontop of front objects, but behind behind objects
    
    
        //create the npcs
        //NOTE: in the future, a json will give the entity data to create npcs, and a separate function will be needed to create all of them
        playerData.sprite.setNewPosition(0, 3);
        playerData.sprite.ogDepth = depth;
        playerData.sprite.depth = depth;
        this.setupCamera(playerData.sprite);

        let roy = new Entity(this, 7, 6, "roy", depth);

        this.allEntities = this.children.list.filter(child => child instanceof Entity);
        window.globalAllEntities = this.allEntities; //make a global reference
    
        //cursors = this.input.keyboard.createCursorKeys(); //no idea what this does
        //updateInventory();
    }
    update() {
        super.update();
        for(let i = 0; i < this.allEntities.length; i++) {
            this.allEntities[i].update();
        }
        console.log(playerData.sprite.depth)
    }
}