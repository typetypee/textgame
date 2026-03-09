import { importFile, findIndex } from "./function-storage.js"
import { loadTilemap } from "./graphics.js"

//this function is for the item inventory

var numSpaces = 5; //i have no idea what this does
var infoBox = document.getElementById("info-box");
var playerInventory = [
  { "name": "Pen", "amount": "2" },
  { "name": "Empty bottle", "amount": "1" },
  { "name": "$0.27 coin", "amount": "1" }
];
const inventory = document.getElementById("inventory"), boxContainer = document.getElementById("box-container");
var itemList = "";

//get the list of items available, item.json is a catalog of every single item in the game + their description
importFile("../json/items.json", function(data) {
  itemList = JSON.parse(data);
  updateInventory();
});

function addToInventory(arrayList) { //array will be in the format of an array contains other arrays, those other arrays will be in the format [itemName, number]
  for (var i = 0; i < arrayList.length; i++) {
    var itemInfo = itemList[arrayList[i][0]];
    //check if item already exists in inventory, if it does, just increase the count
    let itExists = findIndex(playerInventory, "name", arrayList[i][0]);
    if (itExists !== -1) playerInventory[itExists].amount += arrayList[i][1];
    else playerInventory.push({"name": arrayList[i][0], "amount": arrayList[i][1]});
  }
  updateInventory();
}

//removes an item from the inventory, this is for things like quests and npc taking an item needed for a quest
function removeFromInventory(itemName, amount) {
  var itemIndex = findIndex(playerInventory, "name", itemName);
  if (playerInventory[itemIndex].amount == 1) playerInventory.splice(itemIndex, 1);
  else playerInventory[itemIndex].amount -= amount;
  updateInventory();
}

export function updateInventory() {
  boxContainer.textContent = "";
  //show each item in the inventory
  for (var b = 0; b < playerInventory.length; b++) {
    var box = document.createElement("div");
    box.classList.add("inventory-box");
    //WRITE NAME
    box.innerText = playerInventory[b].name;
    //ADD AMOUNT
    var amount = document.createElement("span");
    amount.innerText = " x" + playerInventory[b].amount;
    box.appendChild(amount);
    //INFO BOX
    box.addEventListener("click", function() {
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
  if (inventoryOpen) inventory.style.display = "flex";
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
    width: 640 - 60,
    height: 360 - 60,
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

function preloadL() {
  pThis = this;
}
function createL() {
  cThis = this;
  lookInCanvas.style.zIndex = "-1";
}
function updateL() {
  uThis = this;
}

let offsetX;
let offsetY;

//this function is for opening the canvas that shows the little kind screen for when the player looks inside cabinets and stuff
export async function lookInPlace(place) {
  lookInCanvas.style.zIndex = "4";
  currentTilemap = await loadTilemap("../json/" + place + ".json", pThis, cThis)
  cThis.cameras.main.setZoom(5);
  console.log(currentTilemap.widthInPixels)
  cThis.cameras.main.centerOn(currentTilemap.widthInPixels / 2, currentTilemap.heightInPixels / 2);
  cThis.cameras.main.update();

  var tile;
  cThis.input.on('pointermove', function(pointer) {
    tile = currentTilemap.getTileAtWorldXY(pointer.worldX, pointer.worldY);
    //display the hover context menu or not
    if (tile !== null) hoverVisible = true; 
    else hoverVisible = false;
    showHover(tile, pointer.worldX, pointer.worldY);
  }, cThis);
  //when you click on an item, it will add it to the inventory
  cThis.input.on("pointerup", function(pointer) {
    tile.visible = false;
    addToInventory([[tile.getTileData().type, 1]]);
  })


}

export let hoverVisible = false;

let hoverBox = document.getElementById("hover");

function showHover(item, x, y) {
  if (hoverVisible) {
    hoverBox.style.display = "block";
    var tileX = Math.floor(x / 16);
    var tileY = Math.floor(y / 16);
    let itemName = item.getTileData().type;
    let itemData = itemList[itemName];
    hoverBox.querySelector("h3").innerHTML = itemName;
    hoverBox.querySelector("p").innerHTML = itemData.description;
    hoverBox.style.left = cThis.input.x + 40 + "px";
    hoverBox.style.top = cThis.input.y - 60 + "px";
  } else {
    hoverBox.style.display = "none";
  }

}


var inventoryOpen = false;

document.getElementById("inventory-btn").addEventListener("click", function() {
  inventoryOpen = true;
  updateInventory();
})
document.getElementById("exit-btn").addEventListener("click", function(e) {
  e.stopPropagation();
  inventoryOpen = false;
  updateInventory();
})
