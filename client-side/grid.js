export function gridCells(n) {
  return n*16;
}

export function moveTowards(person, destinationPosition, speed) {
  let distanceToTravelX = destinationPosition.x - person.position.x;
  let distanceToTravelY = destinationPosition.y - person.position.y;

  let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

  if (distance <= speed) {
    person.position.x = destinationPosition.x;
    person.position.y = destinationPosition.y;
  } else {
    let normalizedX = distanceToTravelX / distance;
    let normalizedY = distanceToTravelY / distance;

    person.position.x += normalizedX * speed;
    person.position.y += normalizedY * speed;
    //caluclute remaining distance after move
    distanceToTravelX = destinationPosition.x - person.position.x;
    distanceToTravelY = destinationPosition.y - person.position.y;
    distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);
  }
  return distance;

}

export function isSpaceBlocked(tilemap, x, y) {
  for(var i = 0; i < tilemap.layers.length; i++) {
    var tile = (tilemap.getTileAt(x, y, false, tilemap.layers[i].name))
    if(tile === null) continue;
    if(tile.properties.collision) return tile.properties.collision;
    else if(i == tilemap.layers.length-1) return false;
  }
}
