var numSpaces = 5;
var infoBox = document.getElementById("info-box");
var playerInventory = [
  {"name": "Pen", "amount": "2"},
  {"name": "Empty bottle", "amount": "1"}
];
const inventory = document.getElementById("inventory"), boxContainer = document.getElementById("box-container");
var itemList = "";

//get the list of items available
importData("json/items.json", null, function(json){
  itemList = JSON.parse(json);
  updateInventory();
});

function addToInventory(arrayList) {
  for(var i = 0; i < arrayList.length; i++) {
  var itemInfo = itemList[arrayList[i].name];
  playerInventory.push(arrayList[i]);
  }
  updateInventory();
}

function updateInventory() {
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
}

function openCloseInventory() {
  if(inventoryOpen) inventory.style.display = "flex";
  else inventory.style.display = "none";
}

var inventoryOpen = false;

document.getElementById("inventory-btn").addEventListener("click", function(){
  inventoryOpen = true;
})
document.getElementById("exit-btn").addEventListener("click", function(e){
  e.stopPropagation();
  inventoryOpen = false;
})
