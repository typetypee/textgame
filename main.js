const textBox = document.getElementById("text"), textName = document.getElementById("name"), gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
const answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState; //text, interact, inventory
var levelData = "", currentLevel = "";

//}

function runLevel(levelName) {
  currentLevel = levelName;
  var level = getOBJ(levelName), levels = Array.prototype.slice.call(getOBJ("levels").getElementsByTagName("div"));
  for(var f = 0; f < levels.length; f++) {
    levels[f].style.visibility = "hidden";
  }
  
  level.style.visibility = "visible";

  var levelChildren = Array.prototype.slice.call(level.getElementsByTagName("div"));
  for(var i = 0; i < levelChildren.length; i++) {
        console.log(levelChildren);
    levelChildren[i].style.visibility = "hidden";
  }

  setBG(level.querySelector("i").innerHTML);


}
var currentScene = "room";
function eventRun() {
  gameState = "interact";
  currentScene = "room";
  runLevel("room");

}

gameWindow.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
})
