import {importJSON, findIndex} from "./function-storage.js"
import {loadTilemap} from "./graphics.js"

var numSpaces = 5;
var infoBox = document.getElementById("info-box");
var playerInventory = [
  {"name": "Pen", "amount": "2"},
  {"name": "Empty bottle", "amount": "1"},
  {"name": "$0.27 coin", "amount": "1"}
];
const inventory = document.getElementById("inventory"), boxContainer = document.getElementById("box-container");
var itemList = "";

//get the list of items available
importJSON("../json/items.json", null, function(json){
  itemList = json;
  updateInventory();
});

function addToInventory(arrayList) {
  for(var i = 0; i < arrayList.length; i++) {
  var itemInfo = itemList[arrayList[i].name];
  //check if item already exists in inventory
  let itExists = findIndex(playerInventory, "name", arrayList[i].name);
  if(itExists !== -1) playerInventory[itExists].amount += arrayList[i].amount;
  else playerInventory.push(arrayList[i]);
  }
  updateInventory();
}

function removeFromInventory(itemName, amount) {
  var itemIndex = findIndex(playerInventory, "name", itemName);
  if(playerInventory[itemIndex].amount == 1) playerInventory.splice(itemIndex, 1);
  else playerInventory[itemIndex].amount -= amount;
  updateInventory();
}

export function updateInventory() {
  boxContainer.textContent = "";
  for(var b = 0; b < playerInventory.length; b++) {
    var box = document.createElement("div");
    box.classList.add("inventory-box");
  //WRITE NAME
    box.innerText = playerInventory[b].name;
  //ADD AMOUNT
    var amount = document.createElement("span");
    amount.innerText = " x" + playerInventory[b].amount;
    box.appendChild(amount);
//INFO BOX
    box.addEventListener("click", function(){
      var itemName = this.firstChild.nodeValue; //get only the text in box and not the child span (amount) element with it
      console.log(itemName);
    //reset everything first
      infoBox.querySelector("h1").innerText = "";
      infoBox.querySelector("img").src = "";
      infoBox.querySelector("p").innerText = "";
    //set it to the specifc stuff
      infoBox.querySelector("h1").innerText = itemName;
      infoBox.querySelector("img").src = itemList[itemName].img;
      infoBox.querySelector("p").innerText = itemList[itemName].description;
    })
    boxContainer.appendChild(box);
  }
  if(inventoryOpen) inventory.style.display = "flex";
  else inventory.style.display = "none";
}

export var lookInCanvas = document.getElementById("look-in");

const configLook = {
    type: Phaser.CANVAS,
    canvas: lookInCanvas,
    scene: {
      preload: preloadL,
      create: createL,
      update: updateL
    },
    scale: {
      mode: Phaser.Scale.NONE,
      width: 640-60,
      height: 360-60,
      zoom: 1
    },
    render: {
      pixelArt: true
    }
}

var lookIn = new Phaser.Game(configLook);
let pThis;
let cThis;
let uThis;
let currentTilemap;

function preloadL(){
  pThis = this;
}
function createL(){
  cThis = this;
  lookInCanvas.style.zIndex = "-1";
}
function updateL(){
  uThis = this;
}

let offsetX;
let offsetY;

export async function lookInPlace(place) {
  lookInCanvas.style.zIndex = "4";
  currentTilemap = await loadTilemap("../json/" + place + ".json", pThis, cThis)
  cThis.cameras.main.setZoom(5);
  console.log(currentTilemap.widthInPixels)
  cThis.cameras.main.centerOn(currentTilemap.widthInPixels/2, currentTilemap.heightInPixels/2);
  cThis.cameras.main.update();

  var tile;
  cThis.input.on('pointermove', function (pointer) {
    tile = currentTilemap.getTileAtWorldXY(pointer.worldX, pointer.worldY);
    if(tile !== null) hoverVisible = true;
    else hoverVisible = false;
    showHover(tile, pointer.worldX, pointer.worldY);
  }, cThis);
  cThis.input.on("pointerup", function(pointer) {
    tile.visible = false;
    addToInventory([{"name": tile.getTileData().type, "amount": 1}]);
  })


}

export let hoverVisible = false;

let hoverBox = document.getElementById("hover");

function showHover(item, x , y) {
  if(hoverVisible) {
    hoverBox.style.display = "block";
    var tileX = Math.floor(x / 16);
    var tileY = Math.floor(y / 16);
    let itemName = item.getTileData().type;
    let itemData = itemList[itemName];
    hoverBox.querySelector("h3").innerHTML = itemName;
    hoverBox.querySelector("p").innerHTML = itemData.description;
    hoverBox.style.left = cThis.input.x+40+ "px";
    hoverBox.style.top = cThis.input.y-60+ "px";
  } else {
    hoverBox.style.display = "none";
  }

}


var inventoryOpen = false;

document.getElementById("inventory-btn").addEventListener("click", function(){
  inventoryOpen = true;
  updateInventory();
})
document.getElementById("exit-btn").addEventListener("click", function(e){
  e.stopPropagation();
  inventoryOpen = false;
  updateInventory();
})
