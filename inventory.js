var numBoxes = 100;
var inventory = document.getElementById("inventory");
var boxContainer = document.getElementById("box-container");
for(var b = 0; b < numBoxes; b++) {
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
