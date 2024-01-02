import {currentTilemap, createThis, preloadThis} from "./main.js"

export function loadTilemap(jsonName) {
  //jsonName: the name of the jsonKey in create (not neccesarily the name of the json file)
  //imgName: the name of the image key in create (not neccesarily the name of the image file)
  //tilsheetName: the actual name of the tilesheet, can find name in the json file
  preloadThis.load.tilemapTiledJSON("tileMap", jsonName);
  preloadThis.load.start();
  console.log(preloadThis.load.isReady("tileMap"))
  preloadThis.load.on('filecomplete-json-tileMap', function(){
    const tilefromJson = createThis.make.tilemap({ key: "tileMap" });
    //console.log(preloadThis)
    console.log(tilefromJson);
    //add in the tilesets
    let allTilesets = [];
    for(let j = 0; j < tilefromJson.tilesets.length; j++) {
      preloadThis.load.image("tilesheetImage", tilefromJson.tilesets[i].image);

      tilefromJson.addTilesetImage(tilefromJson.tilesheets[i].name, "tilesheetImage");
      allTilesets.push(tilefromJson.tilesheets[i].name);
    }
    //create the layers
    for (let i = 0; i < tilefromJson.layers.length; i++) {
      const layer = tilefromJson
        .createDynamicLayer(i, allTilesets, 0, 0)
      layer.setDepth(i);
      layer.scale
    }
    return tilefromJson;
  })
}
