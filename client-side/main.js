const textBox = document.getElementById("text"), textName = document.getElementById("name"), gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
const answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState; //text, interact, inventory
var currentLevel = "";

//}

function runScene(sceneName) {
  importJSON("../json/levels.json", sceneName, function(json){
    var levelData = parseHTML(json);
    var levelContainer = getOBJ("levels");
    levelContainer.appendChild(levelData);
    currentLevel = sceneName;
    runLevel(sceneName);
  })

}

function runLevel(levelName) {
  var level = getOBJ(levelName), levels = Array.prototype.slice.call(getOBJ(currentLevel).getElementsByTagName("div"));

  //hide the parent node
  getOBJ(currentLevel).style.visibility = "hidden";

  //hide the fellow children
  for(var f = 0; f < levels.length; f++) {
    levels[f].style.visibility = "hidden";
  }

  level.style.visibility = "visible";

  //hide the level's children
  var levelChildren = Array.prototype.slice.call(level.getElementsByTagName("div"));
  for(var i = 0; i < levelChildren.length; i++) {
    levelChildren[i].style.visibility = "hidden";
  }
  setBG(level.querySelector("i").innerHTML);
  currentLevel = levelName;
}
var currentScene = "room";

function eventRun() {
  gameState = "interact";
  currentScene = "room";
  runScene("room");

}

gameWindow.addEventListener("click", function(e){
  console.log(Math.floor(e.clientX/10) + " " + Math.floor(e.clientY/10));
})
