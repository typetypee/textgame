import { baseScene } from "./baseScene.js"

export class outsideScene extends baseScene {
    constructor(){
        super("outsideScene");
    }
    preload() {

    }

    async create() {
        currentTilemap = await this.loadTilemap("../json/map.json", this);
        console.log("hahah!")
    }
}

window.outsideScene = outsideScene;