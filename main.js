var textBox = document.getElementById("text");
var textName = document.getElementById("name");
var gameWindow = document.getElementById("game-window");

textBox.innerHTML = "AHH";
var answerBoxes = Array.prototype.slice.call(document.getElementsByClassName("answer"));

//VARIABLE STORAGE AREA {
var gameState; //text, interact, inventory
var jsonData = "";
var currentBranch = ":D";
var textSystem = {
  currentLine: 0, //current line in text
  isQuestion: false, //determines whether the current line is a choice
  option: 0, //the choice selected
}

var levelData = "";
var currentLevel = "";

//}

function retrieveBranch(branchName) {
  textSystem.currentLine = 0;
  textSystem.option = 0;

  importData("json/speech.json", function(json){
   jsonData = JSON.parse(json);
   currentBranch = jsonData[branchName];
  })
}

retrieveBranch("hooman");


function runLevel(levelName) {
  currentLevel = levelName;
  var levels = Array.prototype.slice.call(getOBJ("levels").getElementsByTagName("div"));
  for(var i = 0; i < levels.length; i++) {
    levels[i].style.visibility = "hidden";
  }
  getOBJ(levelName).style.visibility = "visible";

  var levelChildren = Array.prototype.slice.call(getOBJ(levelName).getElementsByTagName("div"));
  for(var i = 0; i < levelChildren.length; i++) {
        console.log(levelChildren);
    levelChildren[i].style.visibility = "hidden";
  }

  setBG(getOBJ(levelName).querySelector("i").innerHTML);


}
function eventRun() {
  gameState = "interact";
  runLevel("room");

}
