import {currentTilemap} from "./main.js"
import {importJSON} from "./function-storage.js"

export function loadTilemap(jsonName, pThis, cThis) {
  //jsonName: the name of the jsonKey in create (not neccesarily the name of the json file)
  //imgName: the name of the image key in create (not neccesarily the name of the image file)
  //tilsheetName: the actual name of the tilesheet, can find name in the json file

  pThis.load.tilemapTiledJSON("tileMap", jsonName);
  pThis.load.start();

  return new Promise(function(resolve){

      pThis.load.once(Phaser.Loader.Events.COMPLETE, function(){
        importJSON(jsonName, null, function(json){
          (async () => {
            const tilefromJson = cThis.make.tilemap({ key: "tileMap" });
            //json is the same as tilefromJson, but it is needed to get the tileset image source since tilefromJson does not provide this
            //add in the tilesets
            let allTilesets = [];

            for(let j = 0; j < json.tilesets.length; j++) {

              pThis.load.image(tilefromJson.tilesets[j].name, json.tilesets[j].image);
              pThis.load.start();
              await new Promise(function(resolve) {
                pThis.load.once(Phaser.Loader.Events.COMPLETE, function(){
                  var tileset = tilefromJson.addTilesetImage(tilefromJson.tilesets[j].name, tilefromJson.tilesets[j].name);
                  allTilesets.push(tileset);
                  resolve();
                })
              })
            }

            //create the layers
            for (let i = 0; i < tilefromJson.layers.length; i++) {
              const layer = tilefromJson
                .createLayer(i, allTilesets, 0, 0)
              layer.setDepth(i);
              layer.scale
            }

            resolve(tilefromJson)
        })();
      })
    })
  })
}

export function hihi() {
  return new Promise((resolve) => {
    resolve("D::::")
  })
}
