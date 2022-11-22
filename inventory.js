var numSpaces = 5;
var playerInventory = [
  {"name": "Pen", "amount": "2"},
  {"name": "Empty bottle", "amount": "1"}
];
var inventory = document.getElementById("inventory");
var boxContainer = document.getElementById("box-container");

var itemList = "";

//get the list of items available
importData("json/items.json", function(json){
  itemList = JSON.parse(json);
});

for(var b = 0; b < numSpaces; b++) {
  var box = document.createElement("div");
  box.classList.add("inventory-box");
  
  boxContainer.appendChild(box);
}

function openCloseInventory() {
  if(gameState === "inventory") inventory.style.display = "block";
  else inventory.style.display = "none";
}

document.getElementById("inventory-btn").addEventListener("click", function(){
  gameState = "inventory";
})
document.getElementById("exit-btn").addEventListener("click", function(e){
  e.stopPropagation();
  gameState = "text";
})
