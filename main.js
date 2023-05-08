var textBox = document.getElementById("text");
var textName = document.getElementById("name");
var gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
var answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState; //text, interact, inventory

var levelData = "";
var currentLevel = "";

//}

function runLevel(levelName) {
  currentLevel = levelName;
  var level = getOBJ(levelName);
  var levels = getOBJ("levels").querySelectorAll("div"));
    levels.style.visibility = "hidden";
  
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
