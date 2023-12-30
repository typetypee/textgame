import {currentTilemap} from "./main.js"

export function loadTilemap(parentThis, jsonName, imgName, tilesheetName) {
  const tilefromJson = parentThis.make.tilemap({ key: jsonName });
  tilefromJson.addTilesetImage(tilesheetName, imgName);
  for (let i = 0; i < tilefromJson.layers.length; i++) {
    const layer = tilefromJson
      .createLayer(i, tilesheetName, 0, 0)
    layer.setDepth(i);
    layer.scale
  }
}
